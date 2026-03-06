import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem, Stack, Button,
  Accordion, AccordionSummary, AccordionDetails, Divider, Chip, Alert, alpha, Avatar,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import ScienceIcon from '@mui/icons-material/Science';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const MODULE_CONFIGS = {
  turning: {
    label: 'CNC Turning',
    icon: '🔩',
    color: '#714CF7',
    inputs: [
      { key: 'diameter', label: 'Diameter (in)', type: 'number' },
      { key: 'length', label: 'Length (in)', type: 'number' },
      { key: 'material', label: 'Material Grade', type: 'text' },
      { key: 'rpm', label: 'RPM', type: 'number' },
      { key: 'feed_rate', label: 'Feed Rate (in/rev)', type: 'number' },
    ],
    calculated: [
      { key: 'machine_time', label: 'Machine Time (hrs)' },
      { key: 'labor_cost', label: 'Labor Cost ($)' },
      { key: 'tool_cost', label: 'Tool Cost ($)' },
    ],
  },
  milling: {
    label: 'CNC Milling',
    icon: '⚙️',
    color: '#7C3AED',
    inputs: [
      { key: 'width', label: 'Width (in)', type: 'number' },
      { key: 'depth', label: 'Depth (in)', type: 'number' },
      { key: 'slots', label: 'Number of Slots', type: 'number' },
      { key: 'material', label: 'Material Grade', type: 'text' },
    ],
    calculated: [
      { key: 'machine_time', label: 'Machine Time (hrs)' },
      { key: 'labor_cost', label: 'Labor Cost ($)' },
      { key: 'tool_cost', label: 'Tool Cost ($)' },
    ],
  },
  welding: {
    label: 'Welding',
    icon: '🔥',
    color: '#D97706',
    inputs: [
      { key: 'weld_type', label: 'Weld Type', type: 'select', options: ['TIG', 'MIG', 'SMAW', 'FCAW', 'SAW'] },
      { key: 'joint_length', label: 'Joint Length (in)', type: 'number' },
      { key: 'passes', label: 'Number of Passes', type: 'number' },
    ],
    calculated: [
      { key: 'filler_cost', label: 'Filler Cost ($)' },
      { key: 'gas_cost', label: 'Gas Cost ($)' },
      { key: 'labor_cost', label: 'Labor Cost ($)' },
    ],
  },
  heat_treatment: {
    label: 'Heat Treatment',
    icon: '🌡️',
    color: '#059669',
    inputs: [
      { key: 'process', label: 'Process', type: 'select', options: ['Stress Relief', 'Normalize', 'Normalize + Temper', 'Quench + Temper', 'Anneal', 'Solution Anneal'] },
      { key: 'temp', label: 'Temperature (°C)', type: 'number' },
      { key: 'hold_time', label: 'Hold Time (hrs)', type: 'number' },
      { key: 'cooling', label: 'Cooling Method', type: 'select', options: ['Furnace', 'Air', 'Water', 'Oil'] },
    ],
    calculated: [
      { key: 'energy_cost', label: 'Energy Cost ($)' },
      { key: 'labor_cost', label: 'Labor Cost ($)' },
    ],
  },
};

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function EstimationTab({ project, updateProject }) {
  const estimate = project.estimate || {};
  const isApproved = !!estimate.approved_at;
  const isReadOnly = isApproved;

  const [items, setItems] = useState(estimate.items || []);
  const [marginPercent, setMarginPercent] = useState(estimate.margin_percent || 20);
  const [materialCost, setMaterialCost] = useState(estimate.material_cost || 0);
  const [materialInfo, setMaterialInfo] = useState(estimate.material_info || {
    type: '', grade: '', heat_number: '', supplied_by: 'vendor', quantity: 1,
  });

  const totalProcessCost = items.reduce((s, i) => s + (i.total_cost || 0), 0);
  const overhead = (totalProcessCost + materialCost) * 0.08;
  const totalCost = totalProcessCost + materialCost + overhead;
  const finalPrice = totalCost * (1 + marginPercent / 100);

  const addModule = (type) => {
    const config = MODULE_CONFIGS[type];
    const inputJson = {};
    config.inputs.forEach(f => { inputJson[f.key] = f.type === 'number' ? 0 : ''; });
    const calcJson = {};
    config.calculated.forEach(f => { calcJson[f.key] = 0; });
    setItems([...items, {
      id: Date.now(),
      module_type: type,
      input_json: inputJson,
      calculated_json: calcJson,
      total_cost: 0,
    }]);
  };

  const updateItemInput = (idx, key, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], input_json: { ...updated[idx].input_json, [key]: value } };
    const inp = updated[idx].input_json;
    const calc = { ...updated[idx].calculated_json };
    const type = updated[idx].module_type;
    if (type === 'turning') {
      calc.machine_time = ((Number(inp.diameter) * Number(inp.length)) / (Number(inp.rpm) * Number(inp.feed_rate) || 1) / 60).toFixed(1);
      calc.labor_cost = (Number(calc.machine_time) * 100).toFixed(0);
      calc.tool_cost = (Number(calc.machine_time) * 28).toFixed(0);
    } else if (type === 'milling') {
      calc.machine_time = ((Number(inp.width) * Number(inp.depth) * Number(inp.slots)) / 40).toFixed(1);
      calc.labor_cost = (Number(calc.machine_time) * 100).toFixed(0);
      calc.tool_cost = (Number(calc.machine_time) * 30).toFixed(0);
    } else if (type === 'welding') {
      calc.filler_cost = (Number(inp.joint_length) * Number(inp.passes) * 1.2).toFixed(0);
      calc.gas_cost = (inp.weld_type === 'TIG' || inp.weld_type === 'MIG') ? (Number(inp.joint_length) * 0.8).toFixed(0) : '0';
      calc.labor_cost = (Number(inp.joint_length) * Number(inp.passes) * 3.5).toFixed(0);
    } else if (type === 'heat_treatment') {
      calc.energy_cost = (Number(inp.temp) * Number(inp.hold_time) * 0.12).toFixed(0);
      calc.labor_cost = (Number(inp.hold_time) * 40).toFixed(0);
    }
    const totalModCost = Object.values(calc).reduce((s, v) => s + Number(v), 0);
    updated[idx] = { ...updated[idx], calculated_json: calc, total_cost: totalModCost };
    setItems(updated);
  };

  const removeModule = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    updateProject(project.id, {
      estimate: {
        ...estimate,
        items,
        material_cost: materialCost,
        material_info: materialInfo,
        margin_percent: marginPercent,
        total_cost: totalCost,
        final_price: finalPrice,
      },
    });
  };

  const handleApprove = () => {
    updateProject(project.id, {
      status: 'estimated',
      estimate: {
        ...estimate,
        items,
        material_cost: materialCost,
        material_info: materialInfo,
        margin_percent: marginPercent,
        total_cost: totalCost,
        final_price: finalPrice,
        approved_at: new Date().toISOString().split('T')[0],
      },
    });
  };

  return (
    <Box>
      {isApproved && (
        <Alert severity="success" icon={<CheckCircleIcon />}
          sx={{ mb: 3, borderRadius: 2.5, border: '1px solid #BBF7D0', bgcolor: '#F0FDF4',
            '& .MuiAlert-icon': { color: '#16A34A' } }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>
            Estimate approved on {estimate.approved_at}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>This section is read-only.</Typography>
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* LEFT COLUMN: Material + Process Modules */}
        <Grid item xs={12} md={8}>
          <Stack spacing={2.5}>
            {/* Material Specification Card */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <ScienceIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Material Specification</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Material Type" fullWidth size="small" disabled={isReadOnly}
                      value={materialInfo.type} onChange={(e) => setMaterialInfo({ ...materialInfo, type: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Grade" fullWidth size="small" disabled={isReadOnly}
                      value={materialInfo.grade} onChange={(e) => setMaterialInfo({ ...materialInfo, grade: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Heat Number" fullWidth size="small" disabled={isReadOnly}
                      value={materialInfo.heat_number} onChange={(e) => setMaterialInfo({ ...materialInfo, heat_number: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField select label="Supplied By" fullWidth size="small" disabled={isReadOnly}
                      value={materialInfo.supplied_by} onChange={(e) => setMaterialInfo({ ...materialInfo, supplied_by: e.target.value })}>
                      <MenuItem value="client">Client</MenuItem>
                      <MenuItem value="vendor">Vendor</MenuItem>
                      <MenuItem value="manufacturer">Manufacturer</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Quantity" type="number" fullWidth size="small" disabled={isReadOnly}
                      value={materialInfo.quantity} onChange={(e) => setMaterialInfo({ ...materialInfo, quantity: Number(e.target.value) })} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Material Cost ($)" type="number" fullWidth size="small" disabled={isReadOnly}
                      value={materialCost} onChange={(e) => setMaterialCost(Number(e.target.value))}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha('#059669', 0.03) } }} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Process Modules - Collapsible Cards */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BuildIcon sx={{ fontSize: 18, color: '#D97706' }} />
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Process Modules</Typography>
                    <Chip label={`${items.length} added`} size="small"
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: '#F1F5F9', color: '#64748B' }} />
                  </Stack>
                  {!isReadOnly && (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {Object.entries(MODULE_CONFIGS).map(([key, cfg]) => (
                        <Button key={key} size="small" variant="outlined" onClick={() => addModule(key)}
                          sx={{ fontSize: '0.68rem', borderRadius: 2, textTransform: 'none', fontWeight: 600,
                            borderColor: alpha(cfg.color, 0.3), color: cfg.color,
                            '&:hover': { borderColor: cfg.color, bgcolor: alpha(cfg.color, 0.04) } }}>
                          {cfg.icon} {cfg.label}
                        </Button>
                      ))}
                    </Stack>
                  )}
                </Stack>

                {items.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px dashed #E2E8F0' }}>
                    <BuildIcon sx={{ fontSize: 32, color: '#CBD5E1', mb: 1 }} />
                    <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 500 }}>
                      No process modules added yet
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
                      Click a module button above to add CNC Turning, Milling, Welding, or Heat Treatment
                    </Typography>
                  </Box>
                )}

                {items.map((item, idx) => {
                  const cfg = MODULE_CONFIGS[item.module_type];
                  if (!cfg) return null;
                  return (
                    <Accordion key={item.id} defaultExpanded
                      sx={{ mb: 1.5, border: `1px solid ${alpha(cfg.color, 0.15)}`, borderRadius: '12px !important',
                        boxShadow: 'none', '&:before': { display: 'none' }, overflow: 'hidden',
                        '&.Mui-expanded': { margin: '0 0 12px 0' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}
                        sx={{ bgcolor: alpha(cfg.color, 0.03), minHeight: '44px !important',
                          '& .MuiAccordionSummary-content': { my: '8px !important' } }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(cfg.color, 0.1), fontSize: '0.8rem' }}>
                              {cfg.icon}
                            </Avatar>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>{cfg.label}</Typography>
                            <Chip label={`$${(item.total_cost || 0).toLocaleString()}`} size="small"
                              sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: alpha(cfg.color, 0.08), color: cfg.color }} />
                          </Stack>
                          {!isReadOnly && (
                            <Button size="small" color="error" startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />}
                              onClick={(e) => { e.stopPropagation(); removeModule(idx); }}
                              sx={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'none' }}>
                              Remove
                            </Button>
                          )}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 2.5, pt: 2 }}>
                        <Grid container spacing={3}>
                          {/* Inputs */}
                          <Grid item xs={12} md={6}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: cfg.color, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Parameters
                            </Typography>
                            <Grid container spacing={1.5}>
                              {cfg.inputs.map((field) => (
                                <Grid item xs={6} key={field.key}>
                                  {field.type === 'select' ? (
                                    <TextField select label={field.label} fullWidth size="small" disabled={isReadOnly}
                                      value={item.input_json[field.key] || ''}
                                      onChange={(e) => updateItemInput(idx, field.key, e.target.value)}>
                                      {field.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                                    </TextField>
                                  ) : (
                                    <TextField label={field.label} type={field.type} fullWidth size="small" disabled={isReadOnly}
                                      value={item.input_json[field.key] || ''}
                                      onChange={(e) => updateItemInput(idx, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)} />
                                  )}
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                          {/* Calculated */}
                          <Grid item xs={12} md={6}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              <CalculateIcon sx={{ fontSize: 13, verticalAlign: 'middle', mr: 0.5 }} /> Auto-Calculated
                            </Typography>
                            <Grid container spacing={1.5}>
                              {cfg.calculated.map((field) => (
                                <Grid item xs={6} key={field.key}>
                                  <TextField label={field.label} fullWidth size="small" disabled
                                    value={item.calculated_json[field.key] || 0}
                                    sx={{ '& .MuiInputBase-input.Mui-disabled': { bgcolor: '#F8FAFC', WebkitTextFillColor: '#334155', fontWeight: 600 } }} />
                                </Grid>
                              ))}
                              <Grid item xs={6}>
                                <TextField label="Module Total ($)" fullWidth size="small" disabled
                                  value={(item.total_cost || 0).toLocaleString()}
                                  sx={{ '& .MuiInputBase-input.Mui-disabled': { bgcolor: alpha(cfg.color, 0.05), WebkitTextFillColor: cfg.color, fontWeight: 800 },
                                    '& .MuiOutlinedInput-root': { borderColor: alpha(cfg.color, 0.2) } }} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: Fixed Cost Summary Panel */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            <Stack spacing={2.5}>
              {/* Project Info Mini Card */}
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <ReceiptLongIcon sx={{ fontSize: 16, color: '#64748B' }} />
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>Project Info</Typography>
                  </Stack>
                  <Stack spacing={0.75}>
                    {[
                      { label: 'Project', value: project.project_name },
                      { label: 'Revision', value: `Rev ${project.revision}` },
                      { label: 'Prepared By', value: project.prepared_by },
                      { label: 'Status', value: project.status.replace(/_/g, ' '), capitalize: true },
                    ].map(row => (
                      <Stack key={row.label} direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{row.label}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E293B', textTransform: row.capitalize ? 'capitalize' : 'none' }}>
                          {row.value}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card elevation={0} sx={{ ...cardSx, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: '#714CF7' }} />
                <CardContent sx={{ p: 2.5, pt: 3, '&:last-child': { pb: 2.5 } }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <CalculateIcon sx={{ fontSize: 16, color: '#714CF7' }} />
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Cost Summary</Typography>
                  </Stack>

                  {/* Cost rows */}
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center"
                      sx={{ p: 1.25, bgcolor: alpha('#3B82F6', 0.03), borderRadius: 2, border: `1px solid ${alpha('#3B82F6', 0.1)}` }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Raw Material
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
                          ${materialCost.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center"
                      sx={{ p: 1.25, bgcolor: alpha('#7C3AED', 0.03), borderRadius: 2, border: `1px solid ${alpha('#7C3AED', 0.1)}` }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Process Cost
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
                          ${totalProcessCost.toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip label={`${items.length} modules`} size="small"
                        sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: '#F1F5F9', color: '#64748B' }} />
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center"
                      sx={{ p: 1.25, bgcolor: alpha('#D97706', 0.03), borderRadius: 2, border: `1px solid ${alpha('#D97706', 0.1)}` }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Overhead (8%)
                        </Typography>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
                          ${Number(overhead.toFixed(0)).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Subtotal */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Total Cost</Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
                      ${totalCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Typography>
                  </Stack>

                  {/* Margin */}
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <TextField label="Margin %" type="number" size="small" disabled={isReadOnly}
                      value={marginPercent} onChange={(e) => setMarginPercent(Number(e.target.value))}
                      sx={{ width: 90, '& .MuiInputBase-input': { fontSize: '0.82rem', fontWeight: 700 } }} />
                    <Box sx={{ flex: 1, bgcolor: alpha('#059669', 0.04), p: 1, borderRadius: 1.5, border: '1px solid #BBF7D0', textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Margin</Typography>
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>
                        +${(finalPrice - totalCost).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Final Price - Large Highlighted */}
                  <Box sx={{ bgcolor: alpha('#714CF7', 0.04), p: 2, borderRadius: 2.5, border: '1px solid #D4C4FC', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
                      Final Selling Price
                    </Typography>
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#714CF7', lineHeight: 1.2 }}>
                      ${finalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  {!isReadOnly && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Button variant="outlined" fullWidth startIcon={<SaveIcon sx={{ fontSize: 16 }} />} onClick={handleSave}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                        Save Draft
                      </Button>
                      <Button variant="contained" fullWidth color="success" startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                        onClick={handleApprove} disabled={items.length === 0}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                        Approve Estimate
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
