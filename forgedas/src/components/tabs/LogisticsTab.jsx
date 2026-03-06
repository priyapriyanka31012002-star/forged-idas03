import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button, Stack, MenuItem, Alert, alpha, Chip, Divider,
  Table, TableBody, TableCell, TableRow,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useData } from '../../context/DataContext';

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function LogisticsTab({ project, updateProject }) {
  const { getCompanyName, getClientName, clients, companies } = useData();
  const logistics = project.logistics || {};
  const company = companies.find(c => c.id === project.company_id);
  const client = clients.find(c => c.id === project.client_id);
  const [form, setForm] = useState({
    shipment_method: logistics.shipment_method || '',
    packaging: logistics.packaging || '',
    dispatch_date: logistics.dispatch_date || '',
  });

  const isShipped = ['shipped', 'closed'].includes(project.status);

  const handleShip = () => {
    updateProject(project.id, {
      status: 'shipped',
      logistics: form,
      documents: [
        ...(project.documents || []),
        {
          id: Date.now(),
          document_type: 'packing_list',
          version: 1,
          status: 'final',
          generated_by: 'Current User',
          generated_at: new Date().toISOString().split('T')[0],
        },
      ],
    });
  };

  return (
    <Box>
      {isShipped && (
        <Alert severity="success" icon={<CheckCircleOutlineIcon />}
          sx={{ mb: 3, borderRadius: 2.5, border: '1px solid #BBF7D0', bgcolor: '#F0FDF4',
            '& .MuiAlert-icon': { color: '#059669' } }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#14532D' }}>
            Shipment dispatched on {form.dispatch_date}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#166534' }}>
            Packing list has been generated and attached to documents.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* Left: Shipping Form */}
        <Grid item xs={12} md={isShipped ? 6 : 12}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                <LocalShippingIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Shipping Details</Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField select label="Shipment Method" fullWidth size="small" disabled={isShipped}
                    value={form.shipment_method} onChange={(e) => setForm({ ...form, shipment_method: e.target.value })}>
                    <MenuItem value="LTL Freight">LTL Freight</MenuItem>
                    <MenuItem value="FTL Freight">FTL Freight</MenuItem>
                    <MenuItem value="Air Freight">Air Freight</MenuItem>
                    <MenuItem value="Sea Freight">Sea Freight</MenuItem>
                    <MenuItem value="Courier">Courier (FedEx/DHL/UPS)</MenuItem>
                    <MenuItem value="Customer Pickup">Customer Pickup</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Packaging Details" fullWidth size="small" multiline disabled={isShipped}
                    value={form.packaging} onChange={(e) => setForm({ ...form, packaging: e.target.value })}
                    placeholder="e.g., Wooden crate, VCI wrap" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Dispatch Date" type="date" fullWidth size="small" disabled={isShipped}
                    InputLabelProps={{ shrink: true }}
                    value={form.dispatch_date} onChange={(e) => setForm({ ...form, dispatch_date: e.target.value })} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Shipment Summary (when shipped) */}
        {isShipped && (
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ ...cardSx, borderTop: '3px solid #059669' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <InventoryIcon sx={{ fontSize: 16, color: '#059669' }} />
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Shipment Summary</Typography>
                  <Chip label="Dispatched" size="small" sx={{ bgcolor: '#F0FDF4', color: '#059669', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
                </Stack>
                <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 1.5, border: '1px solid #E2E8F0' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem', width: 120 }}>Method</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{form.shipment_method}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Packaging</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{form.packaging || '—'}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Dispatched</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{form.dispatch_date}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{project.project_name}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{company?.company_name || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Ship To</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{client?.client_name || project.client} — {client?.address || ''}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Actions */}
      {!isShipped && (
        <Card elevation={0} sx={{ ...cardSx, mt: 2.5 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" startIcon={<SaveIcon sx={{ fontSize: 14 }} />}
                onClick={() => updateProject(project.id, { logistics: form })}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
                Save
              </Button>
              <Button variant="contained" startIcon={<PictureAsPdfIcon sx={{ fontSize: 14 }} />}
                onClick={handleShip} disabled={!form.shipment_method || !form.dispatch_date}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
                Generate Packing List &amp; Dispatch
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
