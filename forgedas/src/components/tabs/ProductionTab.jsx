import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button, Stack, Alert, Chip, alpha, Divider, LinearProgress, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FactoryIcon from '@mui/icons-material/Factory';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { useData } from '../../context/DataContext';

const DEPT_COLOR = {
  Quality: '#7C3AED',
  Machining: '#714CF7',
  Fabrication: '#D97706',
  'Heat Treat': '#DC2626',
  Finishing: '#059669',
};

const OPERATIONS = [
  { id: 1, name: 'Raw Material Inspection', dept: 'Quality', machine: 'CMM Station' },
  { id: 2, name: 'CNC Turning - Rough', dept: 'Machining', machine: 'CNC Lathe #1' },
  { id: 3, name: 'CNC Turning - Finish', dept: 'Machining', machine: 'CNC Lathe #2' },
  { id: 4, name: 'CNC Milling', dept: 'Machining', machine: 'VMC 5-Axis' },
  { id: 5, name: 'Welding', dept: 'Fabrication', machine: 'TIG Welder' },
  { id: 6, name: 'Heat Treatment', dept: 'Heat Treat', machine: 'Furnace A' },
  { id: 7, name: 'Final Machining', dept: 'Machining', machine: 'CNC Lathe #3' },
  { id: 8, name: 'Surface Treatment', dept: 'Finishing', machine: 'Coating Line' },
  { id: 9, name: 'Final Inspection', dept: 'Quality', machine: 'CMM Station' },
];

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function ProductionTab({ project, updateProject }) {
  const { getCompanyName } = useData();
  const [ops, setOps] = useState(
    OPERATIONS.map(op => ({
      ...op,
      completed: false,
      operator: '',
      notes: '',
      date: '',
    }))
  );

  const isInProduction = ['in_production', 'inspected', 'shipped', 'closed'].includes(project.status);

  const handleStart = () => {
    updateProject(project.id, { status: 'in_production' });
  };

  const toggleOp = (idx) => {
    const updated = [...ops];
    updated[idx] = { ...updated[idx], completed: !updated[idx].completed, date: new Date().toISOString().split('T')[0] };
    setOps(updated);
  };

  const completedCount = ops.filter(o => o.completed).length;
  const progressPct = Math.round((completedCount / ops.length) * 100);

  if (!isInProduction) {
    return (
      <Card elevation={0} sx={{ ...cardSx, textAlign: 'center', py: 6 }}>
        <FactoryIcon sx={{ fontSize: 56, color: '#CBD5E1', mb: 2 }} />
        <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', mb: 1 }}>Production has not started yet</Typography>
        <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mb: 3, maxWidth: 360, mx: 'auto' }}>
          Confirm the sales order and generate a work order before starting production.
        </Typography>
        <Button variant="contained" startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />} onClick={handleStart}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
          Start Production
        </Button>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header with progress */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EngineeringIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Production Traveller</Typography>
                </Stack>
                <Button variant="outlined" size="small" startIcon={<PictureAsPdfIcon sx={{ fontSize: 14 }} />}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.72rem' }}>
                  Download PDF
                </Button>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Work Order</Typography>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#714CF7', fontFamily: 'monospace' }}>
                    {project.work_order?.work_order_number || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Company</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{getCompanyName(project.company_id)}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Project</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.project_name}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Client</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.client}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ ...cardSx, borderTop: `3px solid ${progressPct === 100 ? '#059669' : '#714CF7'}` }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>Progress</Typography>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: progressPct === 100 ? '#059669' : '#714CF7', lineHeight: 1 }}>
                {progressPct}%
              </Typography>
              <LinearProgress variant="determinate" value={progressPct}
                sx={{ mt: 1.5, height: 6, borderRadius: 3, bgcolor: '#E2E8F0',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: progressPct === 100 ? '#059669' : '#714CF7' } }} />
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mt: 1 }}>
                {completedCount} of {ops.length} operations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Operations Table */}
      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFBFC' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0', width: 50 }}>Done</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0', width: 40 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0' }}>Operation</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0' }}>Machine</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0' }}>Operator</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0' }}>Notes</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#E2E8F0' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ops.map((op, idx) => {
                const deptColor = DEPT_COLOR[op.dept] || '#64748B';
                return (
                  <TableRow key={op.id} sx={{
                    bgcolor: op.completed ? alpha('#059669', 0.03) : 'inherit',
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: op.completed ? alpha('#059669', 0.06) : '#FAFBFC' },
                  }}>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <Checkbox checked={op.completed} onChange={() => toggleOp(idx)} size="small"
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#059669' } }} />
                    </TableCell>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#94A3B8' }}>{op.id}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: op.completed ? 500 : 600, color: op.completed ? '#64748B' : '#1E293B',
                        textDecoration: op.completed ? 'line-through' : 'none' }}>
                        {op.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <Chip label={op.dept} size="small"
                        sx={{ bgcolor: alpha(deptColor, 0.08), color: deptColor, fontWeight: 600, fontSize: '0.62rem', height: 20, border: `1px solid ${alpha(deptColor, 0.15)}` }} />
                    </TableCell>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PrecisionManufacturingIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{op.machine}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <TextField size="small" variant="standard" placeholder="Initials"
                        value={op.operator}
                        onChange={(e) => { const u = [...ops]; u[idx] = { ...u[idx], operator: e.target.value }; setOps(u); }}
                        sx={{ width: 80, '& .MuiInput-underline:before': { borderColor: '#E2E8F0' } }}
                        InputProps={{ sx: { fontSize: '0.78rem' } }} />
                    </TableCell>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <TextField size="small" variant="standard" placeholder="Notes"
                        value={op.notes}
                        onChange={(e) => { const u = [...ops]; u[idx] = { ...u[idx], notes: e.target.value }; setOps(u); }}
                        sx={{ width: 120, '& .MuiInput-underline:before': { borderColor: '#E2E8F0' } }}
                        InputProps={{ sx: { fontSize: '0.78rem' } }} />
                    </TableCell>
                    <TableCell sx={{ py: 1, borderColor: '#E2E8F0' }}>
                      <Typography sx={{ fontSize: '0.72rem', color: op.date ? '#1E293B' : '#CBD5E1', fontWeight: op.date ? 600 : 400 }}>
                        {op.date || '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
