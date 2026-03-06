import React, { useState } from 'react';
import {
  Box, Typography, Stack, Card, CardContent, Button, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, alpha, IconButton, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useData } from '../../context/DataContext';

const VPO_STATUS = {
  draft: { label: 'Draft', color: '#64748B', bg: '#F8FAFC' },
  sent: { label: 'Sent', color: '#3B82F6', bg: '#F5F3FF' },
  acknowledged: { label: 'Acknowledged', color: '#D97706', bg: '#FFFBEB' },
  received: { label: 'Received', color: '#059669', bg: '#ECFDF5' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2' },
};

export default function VendorPOTab({ project }) {
  const { vendors, vendorPOs, addVendorPO, updateVendorPO, getVendorName } = useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPO, setEditingPO] = useState(null);

  // Filter vendor POs for this project
  const projectVPOs = vendorPOs.filter(vpo => vpo.project_id === project.id);

  // Auto-populate materials from estimation
  const estimateMaterials = [];
  if (project.estimate?.material) {
    const m = project.estimate.material;
    estimateMaterials.push({
      description: `${m.type || 'Material'} - ${m.grade || 'N/A'}`,
      quantity: m.quantity || 1,
      unit: m.unit || 'pcs',
      unit_price: m.unit_price || 0,
    });
  }
  if (project.estimate?.modules) {
    Object.entries(project.estimate.modules).forEach(([key, mod]) => {
      if (mod && typeof mod === 'object') {
        estimateMaterials.push({
          description: `${key.replace(/_/g, ' ')} processing`,
          quantity: 1,
          unit: 'lot',
          unit_price: mod.cost || 0,
        });
      }
    });
  }

  const [form, setForm] = useState({
    vendor_id: '', items: [], notes: '', delivery_date: '',
  });

  const handleOpen = (po) => {
    if (po) {
      setEditingPO(po);
      setForm({
        vendor_id: po.vendor_id,
        items: po.items || [],
        notes: po.notes || '',
        delivery_date: po.delivery_date || '',
      });
    } else {
      setEditingPO(null);
      setForm({
        vendor_id: '',
        items: estimateMaterials.length > 0 ? estimateMaterials : [{ description: '', quantity: 1, unit: 'pcs', unit_price: 0 }],
        notes: '',
        delivery_date: '',
      });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    const totalAmount = form.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    if (editingPO) {
      updateVendorPO(editingPO.id, {
        ...form,
        total_amount: totalAmount,
      });
    } else {
      addVendorPO({
        po_number: `VPO-${Date.now().toString().slice(-6)}`,
        project_id: project.id,
        ...form,
        total_amount: totalAmount,
        status: 'draft',
        created_at: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(false);
  };

  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { description: '', quantity: 1, unit: 'pcs', unit_price: 0 }],
    }));
  };

  const removeItem = (idx) => {
    setForm(f => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx, field, value) => {
    setForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  };

  const sendPO = (po) => {
    updateVendorPO(po.id, { status: 'sent' });
  };

  const cardSx = {
    border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  const totalCommitted = projectVPOs.reduce((s, po) => s + (po.total_amount || 0), 0);

  return (
    <Box>
      {/* Header row with stats */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ShoppingCartIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
            Vendor Purchase Orders
          </Typography>
          <Chip label={`${projectVPOs.length} PO${projectVPOs.length !== 1 ? 's' : ''}`} size="small"
            sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {projectVPOs.length > 0 && (
            <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
              Total committed: <Box component="span" sx={{ fontWeight: 700, color: '#1E293B' }}>${totalCommitted.toLocaleString()}</Box>
            </Typography>
          )}
          <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => handleOpen(null)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
            New Vendor PO
          </Button>
        </Stack>
      </Stack>

      {/* Auto-populate hint */}
      {estimateMaterials.length > 0 && projectVPOs.length === 0 && (
        <Card elevation={0} sx={{ ...cardSx, mb: 3, bgcolor: '#FFFBEB', borderColor: '#FDE68A' }}>
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ShoppingCartIcon sx={{ color: '#D97706', fontSize: 20 }} />
              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400E' }}>
                  Materials available from estimation
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#A16207' }}>
                  Click "New Vendor PO" to auto-populate items from the project estimate.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* PO List */}
      {projectVPOs.length > 0 ? (
        <Card elevation={0} sx={cardSx}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['PO Number', 'Vendor', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {projectVPOs.map(po => {
                  const vs = VPO_STATUS[po.status] || { label: po.status, color: '#999', bg: '#eee' };
                  return (
                    <TableRow key={po.id} hover sx={{ '&:hover': { bgcolor: '#FAFBFC' } }}>
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{po.po_number}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getVendorName(po.vendor_id)}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{(po.items || []).length} items</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>
                          ${(po.total_amount || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.25 }}>
                        <Chip label={vs.label} size="small"
                          sx={{ bgcolor: vs.bg, color: vs.color, fontWeight: 600, fontSize: '0.65rem', height: 22, border: `1px solid ${alpha(vs.color, 0.15)}` }} />
                      </TableCell>
                      <TableCell sx={{ py: 1.25 }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{po.created_at}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.25 }}>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => handleOpen(po)} sx={{ color: '#64748B' }}>
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          {po.status === 'draft' && (
                            <IconButton size="small" onClick={() => sendPO(po)} sx={{ color: '#714CF7' }}>
                              <SendIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Card elevation={0} sx={{ ...cardSx, textAlign: 'center', py: 6 }}>
          <DescriptionIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
          <Typography sx={{ fontSize: '0.88rem', color: '#64748B', mb: 1 }}>No vendor purchase orders yet</Typography>
          <Typography sx={{ fontSize: '0.76rem', color: '#94A3B8' }}>
            Create a vendor PO to procure materials for this project
          </Typography>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2, borderBottom: '1px solid #E2E8F0' }}>
          {editingPO ? `Edit ${editingPO.po_number}` : 'New Vendor Purchase Order'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Select Vendor</InputLabel>
              <Select value={form.vendor_id} label="Select Vendor"
                onChange={e => setForm(f => ({ ...f, vendor_id: e.target.value }))}>
                {vendors.map(v => (
                  <MenuItem key={v.id} value={v.id}>{v.name} — {v.specialization}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField size="small" label="Delivery Date" type="date" fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.delivery_date}
              onChange={e => setForm(f => ({ ...f, delivery_date: e.target.value }))} />

            <Divider />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>Line Items</Typography>
            {form.items.map((item, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <TextField size="small" label="Description" sx={{ flex: 3 }}
                  value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
                <TextField size="small" label="Qty" type="number" sx={{ flex: 1 }}
                  value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} />
                <TextField size="small" label="Unit" sx={{ flex: 1 }}
                  value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} />
                <TextField size="small" label="Price" type="number" sx={{ flex: 1 }}
                  value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', Number(e.target.value))} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
                  ${(item.quantity * item.unit_price).toLocaleString()}
                </Typography>
                {form.items.length > 1 && (
                  <Button size="small" color="error" onClick={() => removeItem(idx)} sx={{ minWidth: 32 }}>×</Button>
                )}
              </Stack>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={addItem} sx={{ alignSelf: 'flex-start' }}>
              Add Item
            </Button>

            <Divider />
            <Stack direction="row" justifyContent="flex-end">
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700 }}>
                Total: ${form.items.reduce((s, i) => s + i.quantity * i.unit_price, 0).toLocaleString()}
              </Typography>
            </Stack>

            <TextField size="small" label="Notes" multiline rows={2} fullWidth
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.vendor_id}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
            {editingPO ? 'Update' : 'Create'} Purchase Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
