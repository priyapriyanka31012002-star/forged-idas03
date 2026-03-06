import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button, Stack, Divider, Alert, alpha, Chip, Avatar,
  Table, TableBody, TableCell, TableRow,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BusinessIcon from '@mui/icons-material/Business';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function QuotationTab({ project, updateProject }) {
  const { getClientName, getCompanyName, clients, companies } = useData();
  const estimate = project.estimate || {};
  const quotation = project.quotation || {};
  const client = clients.find(c => c.id === project.client_id);
  const company = companies?.find(c => c.id === project.company_id);
  const [form, setForm] = useState({
    validity_date: quotation.validity_date || '',
    delivery_time: quotation.delivery_time || '',
    payment_terms: quotation.payment_terms || '',
    notes: quotation.notes || '',
  });

  const isQuoted = ['quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(project.status);

  const handleSave = () => {
    updateProject(project.id, { quotation: form });
  };

  const handleGenerateQuotation = () => {
    updateProject(project.id, {
      quotation: form,
      status: project.status === 'estimated' ? 'quoted' : project.status,
      documents: [
        ...(project.documents || []),
        {
          id: Date.now(),
          document_type: 'quotation',
          version: (project.documents?.filter(d => d.document_type === 'quotation').length || 0) + 1,
          status: 'final',
          generated_by: 'Current User',
          generated_at: new Date().toISOString().split('T')[0],
        },
      ],
    });
  };

  const totalCost = estimate.total_cost || 0;
  const finalPrice = estimate.final_price || 0;
  const marginPct = estimate.margin_percent || 0;
  const marginAmt = finalPrice - totalCost;

  return (
    <Box>
      {isQuoted && (
        <Alert severity="info" icon={<CheckCircleOutlineIcon />}
          sx={{ mb: 3, borderRadius: 2.5, border: '1px solid #D4C4FC', bgcolor: '#F5F3FF',
            '& .MuiAlert-icon': { color: '#714CF7' } }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>
            Quotation has been generated and sent
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>
            Current status: {project.status.replace(/_/g, ' ')}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* Quotation Header — From / To */}
        <Grid item xs={12}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <BusinessIcon sx={{ fontSize: 14, color: '#714CF7' }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#714CF7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>From</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{company?.company_name || 'Forge Industries'}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mt: 0.5 }}>{company?.address || ''}</Typography>
                  {company?.gst_number && (
                    <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', mt: 0.5 }}>GST: {company.gst_number}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <PersonOutlineIcon sx={{ fontSize: 14, color: '#059669' }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>To</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{client?.client_name || 'Client'}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#64748B', mt: 0.5 }}>{client?.address || ''}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#475569', mt: 0.5 }}>Attn: {client?.poc_name || 'N/A'}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>{client?.poc_email || ''}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quotation Ref</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#714CF7', fontFamily: 'monospace' }}>
                    QTN-{project.project_code || `PRJ-${project.id}`}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.project_name}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.updated_at || new Date().toISOString().split('T')[0]}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Left: Quotation Details */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Quotation Details</Typography>
                {isQuoted && <Chip label="Sent" size="small" sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />}
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Validity Date" type="date" fullWidth size="small"
                    InputLabelProps={{ shrink: true }} disabled={isQuoted}
                    value={form.validity_date} onChange={(e) => setForm({ ...form, validity_date: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Delivery Time" fullWidth size="small" disabled={isQuoted}
                    value={form.delivery_time} onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
                    placeholder="e.g., 6-8 weeks" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Payment Terms" fullWidth size="small" disabled={isQuoted}
                    value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
                    placeholder="e.g., Net 30" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Notes / Special Conditions" fullWidth size="small" multiline rows={3} disabled={isQuoted}
                    value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Add any special terms, conditions, or notes..." />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Pricing Summary */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                <ReceiptLongIcon sx={{ fontSize: 16, color: '#059669' }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Pricing Summary</Typography>
              </Stack>

              <Stack spacing={1.25}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Material Cost</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>
                    ${(estimate.material_cost || 0).toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Processing Cost</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>
                    ${(estimate.processing_cost || 0).toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Overhead</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>
                    ${(estimate.overhead || 0).toLocaleString()}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 0.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>Total Cost</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                    ${totalCost.toLocaleString()}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center"
                  sx={{ bgcolor: alpha('#059669', 0.04), mx: -1, px: 1, py: 0.75, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Margin ({marginPct}%)</Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                    +${marginAmt.toLocaleString()}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 0.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center"
                  sx={{ bgcolor: alpha('#714CF7', 0.04), mx: -1, px: 1, py: 1.25, borderRadius: 2, border: '1px solid #D4C4FC' }}>
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#714CF7' }}>Quoted Price</Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#714CF7' }}>
                    ${finalPrice.toLocaleString()}
                  </Typography>
                </Stack>

                {estimate.approved_at && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', textAlign: 'right', mt: 0.5 }}>
                    Estimate approved on {estimate.approved_at}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions Footer */}
      {!isQuoted && (
        <Card elevation={0} sx={{ ...cardSx, mt: 2.5 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" startIcon={<SaveIcon sx={{ fontSize: 16 }} />} onClick={handleSave}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                Save Draft
              </Button>
              <Button variant="contained" startIcon={<PictureAsPdfIcon sx={{ fontSize: 16 }} />}
                onClick={handleGenerateQuotation} disabled={!form.validity_date || !form.delivery_time}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                Generate Quotation PDF
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {isQuoted && (
        <Card elevation={0} sx={{ ...cardSx, mt: 2.5 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                Download Quotation PDF
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
