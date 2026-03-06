import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button, Stack, Alert, Chip, Divider, alpha, Table, TableBody, TableCell, TableRow,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BusinessIcon from '@mui/icons-material/Business';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useData } from '../../context/DataContext';

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function SalesOrderTab({ project, updateProject }) {
  const { getClientName, getCompanyName, clients, companies } = useData();
  const so = project.sales_order;
  const wo = project.work_order;
  const [poNumber, setPoNumber] = useState(so?.customer_po_number || '');
  const [poFile, setPoFile] = useState(null);
  const isConfirmed = ['order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(project.status);

  const company = companies.find(c => c.id === project.company_id);
  const client = clients.find(c => c.id === project.client_id);
  const soRef = `SO-${project.project_code || project.id}-${new Date().getFullYear()}`;

  const handleConfirm = () => {
    if (!poNumber) return;
    const workOrderNum = `WO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    updateProject(project.id, {
      status: 'order_confirmed',
      sales_order: {
        customer_po_number: poNumber,
        accepted_date: new Date().toISOString().split('T')[0],
      },
      work_order: {
        work_order_number: workOrderNum,
        release_date: new Date().toISOString().split('T')[0],
      },
      documents: [
        ...(project.documents || []),
        {
          id: Date.now(),
          document_type: 'work_order',
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
      {/* Sales Order Header */}
      <Card elevation={0} sx={{ ...cardSx, mb: 2.5, borderTop: '3px solid #16A34A' }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <BusinessIcon sx={{ fontSize: 14, color: '#16A34A' }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#64748B' }}>Seller</Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{company?.company_name || 'N/A'}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mt: 0.25 }}>{company?.address || ''}</Typography>
              {company?.gst_number && (
                <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mt: 0.25 }}>GST: {company.gst_number}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <PersonOutlineIcon sx={{ fontSize: 14, color: '#7C3AED' }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#64748B' }}>Buyer</Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{client?.client_name || project.client}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mt: 0.25 }}>{client?.address || ''}</Typography>
              {client?.poc_email && (
                <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mt: 0.25 }}>{client.poc_email}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#94A3B8', mb: 0.5 }}>Sales Order Ref</Typography>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#16A34A', fontFamily: 'monospace' }}>{soRef}</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#64748B', mt: 0.5 }}>{project.name}</Typography>
                {project.project_code && (
                  <Chip label={project.project_code} size="small" sx={{ mt: 0.5, bgcolor: '#F0FDF4', color: '#16A34A', fontWeight: 700, fontSize: '0.6rem', height: 18, fontFamily: 'monospace' }} />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isConfirmed && (
        <Alert severity="success" icon={<CheckCircleOutlineIcon />}
          sx={{ mb: 3, borderRadius: 2.5, border: '1px solid #BBF7D0', bgcolor: '#F0FDF4',
            '& .MuiAlert-icon': { color: '#16A34A' } }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#14532D' }}>
            Order confirmed — Work Order generated successfully
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#166534' }}>
            Production can now begin. Status: {project.status.replace(/_/g, ' ')}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* Left: Customer PO */}
        <Grid item xs={12} md={isConfirmed ? 6 : 12}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                <DescriptionIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Customer Purchase Order</Typography>
                {isConfirmed && <Chip label="Received" size="small" sx={{ bgcolor: '#F0FDF4', color: '#16A34A', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />}
              </Stack>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField label="Customer PO Number" fullWidth size="small" required
                    value={poNumber} onChange={(e) => setPoNumber(e.target.value)}
                    disabled={isConfirmed} placeholder="e.g., APX-PO-2026-0312" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" component="label" startIcon={<UploadFileIcon sx={{ fontSize: 16 }} />}
                    disabled={isConfirmed} fullWidth
                    sx={{ height: 40, borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
                    {poFile ? poFile.name : 'Upload PO Document'}
                    <input type="file" hidden onChange={(e) => setPoFile(e.target.files[0])} />
                  </Button>
                </Grid>
              </Grid>

              {isConfirmed && so && (
                <Box sx={{ mt: 2, bgcolor: '#F8FAFC', borderRadius: 2, p: 1.5, border: '1px solid #E2E8F0' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem', width: 120 }}>PO Number</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#0F172A' }}>{so.customer_po_number}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Accepted Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{so.accepted_date}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Work Order Summary (only when confirmed) */}
        {isConfirmed && wo && (
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ ...cardSx, borderTop: '3px solid #714CF7' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                  <EngineeringIcon sx={{ fontSize: 16, color: '#714CF7' }} />
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Work Order</Typography>
                  <Chip label="Active" size="small" sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
                </Stack>

                <Box sx={{ bgcolor: alpha('#714CF7', 0.04), borderRadius: 2.5, p: 2, border: '1px solid #D4C4FC', textAlign: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: '#64748B', mb: 0.5 }}>
                    Work Order Number
                  </Typography>
                  <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#714CF7', fontFamily: 'monospace' }}>
                    {wo.work_order_number}
                  </Typography>
                </Box>

                <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 1.5, border: '1px solid #E2E8F0' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem', width: 120 }}>Release Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{wo.release_date}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Project</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{project.name}</TableCell>
                      </TableRow>
                      <TableRow sx={{ '& td': { border: 0, py: 0.5, px: 1 } }}>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.75rem' }}>Client</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#1E293B' }}>{project.client}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Confirm Action */}
      {!isConfirmed && (
        <Card elevation={0} sx={{ ...cardSx, mt: 2.5 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end" alignItems="center">
              <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', mr: 1 }}>
                This will generate a Work Order and update project status
              </Typography>
              <Button variant="contained" color="success" startIcon={<AssignmentTurnedInIcon sx={{ fontSize: 16 }} />}
                onClick={handleConfirm} disabled={!poNumber}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                Confirm Order &amp; Generate Work Order
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
