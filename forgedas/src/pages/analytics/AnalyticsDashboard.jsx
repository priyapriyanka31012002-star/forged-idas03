import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Box, Typography, Stack, Card, CardContent, Grid, Avatar, alpha, Chip,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';

const STATUS_CONFIG = {
  draft:           { label: 'Draft',         color: '#64748B' },
  estimated:       { label: 'Estimated',     color: '#3B82F6' },
  quoted:          { label: 'Quoted',        color: '#D97706' },
  order_confirmed: { label: 'Confirmed',     color: '#7C3AED' },
  in_production:   { label: 'In Production', color: '#714CF7' },
  inspected:       { label: 'Inspected',     color: '#059669' },
  shipped:         { label: 'Shipped',       color: '#0891B2' },
  closed:          { label: 'Closed',        color: '#475569' },
};

export default function AnalyticsDashboard() {
  const { projects, clients, vendors, vendorPOs, rfqs } = useData();

  const totalRevenue = projects.reduce((s, p) => s + (p.estimate?.final_price || 0), 0);
  const avgProjectValue = projects.length > 0 ? totalRevenue / projects.length : 0;
  const procurementCost = vendorPOs.reduce((s, v) => s + (v.total_amount || 0), 0);
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - procurementCost) / totalRevenue * 100).toFixed(1) : 0;

  const statusCounts = {};
  projects.forEach(p => { statusCounts[p.status] = (statusCounts[p.status] || 0) + 1; });

  // Category breakdown
  const categoryCounts = {};
  projects.forEach(p => {
    const cat = p.category || 'other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  const metrics = [
    { label: 'Total Revenue', value: `$${Math.round(totalRevenue / 1000)}K`, icon: <AttachMoneyIcon sx={{ fontSize: 20 }} />, color: '#059669' },
    { label: 'Avg Project Value', value: `$${Math.round(avgProjectValue / 1000)}K`, icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, color: '#3B82F6' },
    { label: 'Procurement Cost', value: `$${Math.round(procurementCost / 1000)}K`, icon: <PrecisionManufacturingIcon sx={{ fontSize: 20 }} />, color: '#D97706' },
    { label: 'Gross Margin', value: `${profitMargin}%`, icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, color: '#7C3AED' },
    { label: 'Total Projects', value: projects.length, icon: <AssignmentIcon sx={{ fontSize: 20 }} />, color: '#714CF7' },
    { label: 'Total Clients', value: clients.length, icon: <PeopleIcon sx={{ fontSize: 20 }} />, color: '#0891B2' },
    { label: 'Total Vendors', value: vendors.length, icon: <PeopleIcon sx={{ fontSize: 20 }} />, color: '#64748B' },
    { label: 'Open RFQs', value: rfqs.filter(r => r.status === 'open').length, icon: <RequestQuoteIcon sx={{ fontSize: 20 }} />, color: '#EF4444' },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <TrendingUpIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Analytics</Typography>
        <Chip label={`${projects.length} projects`} size="small"
          sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {metrics.map(m => (
          <Grid item xs={6} sm={3} key={m.label}>
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', mt: 0.5 }}>{m.value}</Typography>
                  </Box>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(m.color, 0.08), color: m.color }}>{m.icon}</Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', mb: 2.5 }}>
                Project Status Distribution
              </Typography>
              <Stack spacing={1.5}>
                {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => {
                  const sc = STATUS_CONFIG[status] || { label: status, color: '#999' };
                  const pct = Math.round((count / projects.length) * 100);
                  return (
                    <Stack key={status} direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: sc.color }} />
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', flex: 1 }}>{sc.label}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>{count}</Typography>
                      <Box sx={{ width: 80, height: 6, borderRadius: 3, bgcolor: '#EEF2F6', overflow: 'hidden' }}>
                        <Box sx={{ width: `${pct}%`, height: '100%', borderRadius: 3, bgcolor: sc.color }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', minWidth: 32 }}>{pct}%</Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', mb: 2.5 }}>
                Project Categories
              </Typography>
              <Stack spacing={1.5}>
                {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                  const pct = Math.round((count / projects.length) * 100);
                  return (
                    <Stack key={cat} direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: alpha('#3B82F6', 0.08), color: '#3B82F6', fontSize: '0.65rem', fontWeight: 700 }}>
                        {cat.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', flex: 1, textTransform: 'capitalize' }}>
                        {cat.replace(/_/g, ' ')}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>{count}</Typography>
                      <Box sx={{ width: 80, height: 6, borderRadius: 3, bgcolor: '#EEF2F6', overflow: 'hidden' }}>
                        <Box sx={{ width: `${pct}%`, height: '100%', borderRadius: 3, bgcolor: '#3B82F6' }} />
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RFQ Funnel */}
        <Grid item xs={12}>
          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', mb: 2.5 }}>
                Sales Funnel
              </Typography>
              <Stack direction="row" spacing={2}>
                {[
                  { label: 'RFQs Received', count: rfqs.length, color: '#3B82F6' },
                  { label: 'Quotations Sent', count: projects.filter(p => ['quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(p.status)).length, color: '#D97706' },
                  { label: 'Orders Won', count: projects.filter(p => ['order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(p.status)).length, color: '#7C3AED' },
                  { label: 'Produced', count: projects.filter(p => ['in_production', 'inspected', 'shipped', 'closed'].includes(p.status)).length, color: '#714CF7' },
                  { label: 'Shipped', count: projects.filter(p => ['shipped', 'closed'].includes(p.status)).length, color: '#059669' },
                ].map((stage, idx) => (
                  <Card key={stage.label} elevation={0} sx={{ flex: 1, bgcolor: alpha(stage.color, 0.04), border: `1px solid ${alpha(stage.color, 0.12)}`, borderRadius: 2 }}>
                    <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                      <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: stage.color }}>{stage.count}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>{stage.label}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
