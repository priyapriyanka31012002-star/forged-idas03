import React from 'react';
import {
  Box, Typography, Stack, Grid, Card, CardContent, Chip, Avatar, alpha,
  Table, TableBody, TableCell, TableRow,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PercentIcon from '@mui/icons-material/Percent';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useData } from '../../context/DataContext';

const STATUS_ORDER = ['draft', 'estimated', 'quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'];

const STATUS_CONFIG = {
  draft:           { label: 'Draft',         color: '#64748B' },
  estimated:       { label: 'Estimated',     color: '#3B82F6' },
  quoted:          { label: 'Quoted',        color: '#D97706' },
  order_confirmed: { label: 'Order Confirmed', color: '#7C3AED' },
  in_production:   { label: 'In Production', color: '#714CF7' },
  inspected:       { label: 'Inspected',     color: '#059669' },
  shipped:         { label: 'Shipped',       color: '#0891B2' },
  closed:          { label: 'Closed',        color: '#475569' },
};

export default function OverviewTab({ project }) {
  const { getCompanyName, getClientName, companies, clients } = useData();
  const currentIdx = STATUS_ORDER.indexOf(project.status);
  const sc = STATUS_CONFIG[project.status] || { label: project.status, color: '#999' };
  const company = companies?.find(c => c.id === project.company_id);
  const client = clients?.find(c => c.id === project.client_id);

  const cardSx = {
    border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.25s', '&:hover': { boxShadow: '0 4px 14px rgba(0,0,0,0.05)' },
    height: '100%',
  };

  const materialCost = project.estimate?.material_cost || 0;
  const processingCost = project.estimate?.processing_cost || 0;
  const overhead = project.estimate?.overhead || 0;
  const subtotal = project.estimate?.subtotal || 0;
  const finalPrice = project.estimate?.final_price || 0;
  const marginPct = project.estimate?.margin_pct || 0;
  const marginAmt = project.estimate?.margin_amount || 0;
  const profitColor = marginPct >= 20 ? '#059669' : marginPct >= 10 ? '#D97706' : '#EF4444';

  const summaryCards = [
    { label: 'Status', value: sc.label, icon: <FiberManualRecordIcon sx={{ fontSize: 14 }} />, color: sc.color, isBadge: true },
    { label: 'Total Cost', value: subtotal > 0 ? `$${subtotal.toLocaleString()}` : '—', icon: <ReceiptLongIcon sx={{ fontSize: 16 }} />, color: '#3B82F6' },
    { label: 'Quoted Value', value: finalPrice > 0 ? `$${finalPrice.toLocaleString()}` : '—', icon: <MonetizationOnIcon sx={{ fontSize: 16 }} />, color: '#059669' },
    { label: 'Profit Margin', value: marginPct > 0 ? `${marginPct}%` : '—', icon: <PercentIcon sx={{ fontSize: 16 }} />, color: profitColor },
  ];

  const InfoRow = ({ icon, label, value, mono }) => (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1, borderBottom: '1px solid #F1F5F9', '&:last-child': { borderBottom: 0 } }}>
      <Box sx={{ color: '#94A3B8', display: 'flex', minWidth: 20 }}>{icon}</Box>
      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', minWidth: 90, flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', fontFamily: mono ? 'monospace' : 'inherit' }}>{value || '—'}</Typography>
    </Stack>
  );

  return (
    <Box>
      {/* Summary KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryCards.map((card) => (
          <Grid item xs={6} md={3} key={card.label}>
            <Card elevation={0} sx={{ ...cardSx, position: 'relative', overflow: 'hidden', height: 'auto' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: card.color, opacity: 0.6 }} />
              <CardContent sx={{ p: 2, pt: 2.5, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', mb: 0.75 }}>
                      {card.label}
                    </Typography>
                    {card.isBadge ? (
                      <Chip label={card.value} size="small"
                        sx={{ bgcolor: alpha(card.color, 0.08), color: card.color, fontWeight: 700, fontSize: '0.75rem', height: 26, border: `1px solid ${alpha(card.color, 0.2)}` }} />
                    ) : (
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                        {card.value}
                      </Typography>
                    )}
                  </Box>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(card.color, 0.08), color: card.color }}>
                    {card.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Three Equal Cards: Client, Seller, Project Details */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Card 1: Client Details */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ ...cardSx, borderTop: '3px solid #059669' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#059669', 0.08), color: '#059669' }}>
                  <PersonIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Client Details</Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>Customer information</Typography>
                </Box>
              </Stack>
              <Stack spacing={0}>
                <InfoRow icon={<PersonIcon sx={{ fontSize: 15 }} />} label="Client Name" value={client?.client_name || getClientName(project.client_id) || 'Not assigned'} />
                <InfoRow icon={<PersonIcon sx={{ fontSize: 15 }} />} label="Contact" value={client?.poc_name || 'N/A'} />
                <InfoRow icon={<PhoneIcon sx={{ fontSize: 15 }} />} label="Phone" value={client?.poc_phone || 'N/A'} />
                <InfoRow icon={<EmailIcon sx={{ fontSize: 15 }} />} label="Email" value={client?.poc_email || 'N/A'} />
                <InfoRow icon={<LocationOnIcon sx={{ fontSize: 15 }} />} label="Billing Address" value={client?.address || 'N/A'} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Seller Details */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ ...cardSx, borderTop: '3px solid #714CF7' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#714CF7', 0.08), color: '#714CF7' }}>
                  <BusinessIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Seller Details</Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>Your company details</Typography>
                </Box>
              </Stack>
              <Stack spacing={0}>
                <InfoRow icon={<BusinessIcon sx={{ fontSize: 15 }} />} label="Company" value={company?.company_name || getCompanyName(project.company_id) || 'Not assigned'} />
                <InfoRow icon={<BadgeIcon sx={{ fontSize: 15 }} />} label="Prepared By" value={project.prepared_by || 'N/A'} />
                <InfoRow icon={<PhoneIcon sx={{ fontSize: 15 }} />} label="Phone" value={company?.phone || 'N/A'} />
                <InfoRow icon={<EmailIcon sx={{ fontSize: 15 }} />} label="Email" value={company?.email || 'N/A'} />
                <InfoRow icon={<LocationOnIcon sx={{ fontSize: 15 }} />} label="Address" value={company?.address || 'N/A'} />
                {company?.gst_number && (
                  <InfoRow icon={<DescriptionIcon sx={{ fontSize: 15 }} />} label="GST/Tax ID" value={company.gst_number} mono />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Project Details */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ ...cardSx, borderTop: '3px solid #D97706' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#D97706', 0.08), color: '#D97706' }}>
                  <EngineeringIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Project Details</Typography>
                  <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>Scope & specifications</Typography>
                </Box>
              </Stack>
              <Stack spacing={0}>
                <InfoRow icon={<DescriptionIcon sx={{ fontSize: 15 }} />} label="Project Name" value={project.project_name} />
                <InfoRow icon={<DescriptionIcon sx={{ fontSize: 15 }} />} label="Project Code" value={project.project_code || `PRJ-${project.id}`} mono />
                <InfoRow icon={<BadgeIcon sx={{ fontSize: 15 }} />} label="Manager" value={project.manager || 'Unassigned'} />
                <InfoRow icon={<CategoryIcon sx={{ fontSize: 15 }} />} label="Category" value={project.category?.replace(/_/g, ' ') || 'General'} />
                <InfoRow icon={<TrendingUpIcon sx={{ fontSize: 15 }} />} label="Priority" value={project.priority || 'Normal'} />
                <InfoRow icon={<DescriptionIcon sx={{ fontSize: 15 }} />} label="Revision" value={`Rev ${project.revision || '1'}`} />
                <InfoRow icon={<CalendarTodayIcon sx={{ fontSize: 15 }} />} label="Created" value={project.created_at || 'N/A'} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row: Material Spec + Financial Summary + Activity */}
      <Grid container spacing={2.5}>
        {/* Material Specification */}
        {project.estimate?.material && (
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ScienceIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Material Specification</Typography>
                  </Stack>
                </Box>
                <Table size="small">
                  <TableBody>
                    {Object.entries(project.estimate.material).filter(([_, v]) => v !== '' && v != null).map(([key, value]) => (
                      <TableRow key={key} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell sx={{ py: 1.25, borderColor: '#F1F5F9', width: 120 }}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'capitalize' }}>
                            {key.replace(/_/g, ' ')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.25, borderColor: '#F1F5F9' }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>
                            {typeof value === 'number' ? value.toLocaleString() : String(value)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Financial Summary */}
        <Grid item xs={12} md={project.estimate?.material ? 4 : 6}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <AttachMoneyIcon sx={{ fontSize: 16, color: '#059669' }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Financial Summary</Typography>
              </Stack>
              {finalPrice > 0 ? (
                <Stack spacing={1.25}>
                  {[
                    { label: 'Material Cost', value: materialCost },
                    { label: 'Processing Cost', value: processingCost },
                    { label: 'Overhead', value: overhead },
                  ].map(row => (
                    <Stack key={row.label} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>{row.label}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>
                        ${row.value.toLocaleString()}
                      </Typography>
                    </Stack>
                  ))}
                  <Divider sx={{ my: 0.5 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Subtotal</Typography>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}>
                      ${subtotal.toLocaleString()}
                    </Typography>
                  </Stack>
                  {marginPct > 0 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center"
                      sx={{ bgcolor: alpha(profitColor, 0.04), mx: -1, px: 1, py: 0.75, borderRadius: 1.5 }}>
                      <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>Margin ({marginPct}%)</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: profitColor }}>
                        +${marginAmt.toLocaleString()}
                      </Typography>
                    </Stack>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center"
                    sx={{ bgcolor: alpha('#059669', 0.04), mx: -1, px: 1, py: 1, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#059669' }}>Final Price</Typography>
                    <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                      ${finalPrice.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 2, textAlign: 'center', border: '1px dashed #E2E8F0' }}>
                  <AttachMoneyIcon sx={{ fontSize: 28, color: '#CBD5E1', mb: 1 }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    No estimate available yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={project.estimate?.material ? 4 : 6}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Recent Activity</Typography>
              </Stack>
              <Stack spacing={0}>
                {[
                  currentIdx >= 6 && { text: 'Shipment dispatched', color: '#0891B2' },
                  currentIdx >= 5 && { text: 'Quality inspection passed', color: '#059669' },
                  currentIdx >= 4 && { text: 'Production started', color: '#714CF7' },
                  currentIdx >= 3 && { text: 'Client PO confirmed', color: '#7C3AED' },
                  currentIdx >= 2 && { text: 'Quotation sent', color: '#D97706' },
                  currentIdx >= 1 && { text: 'Estimation completed', color: '#3B82F6' },
                  { text: 'Project created', color: '#64748B' },
                ].filter(Boolean).slice(0, 6).map((activity, idx, arr) => (
                  <Stack key={idx} direction="row" spacing={1.5} sx={{ position: 'relative', pb: 1.5, '&:last-child': { pb: 0 } }}>
                    {idx < arr.length - 1 && (
                      <Box sx={{ position: 'absolute', left: 5, top: 14, bottom: 0, width: 1.5, bgcolor: '#EEF2F6' }} />
                    )}
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: alpha(activity.color, 0.15),
                      border: `2px solid ${activity.color}`, flexShrink: 0, mt: 0.25, position: 'relative', zIndex: 1 }} />
                    <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: '#334155' }}>{activity.text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Description if available */}
      {project.description && (
        <Card elevation={0} sx={{ ...cardSx, mt: 2.5, height: 'auto' }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1 }}>
              Project Description
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.7, bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2, border: '1px solid #EEF2F6' }}>
              {project.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
