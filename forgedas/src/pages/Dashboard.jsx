import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Card, CardContent, Typography, Box, Stack, Chip, Avatar, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, alpha, Button, TextField, InputAdornment, TablePagination, Tooltip, Divider,
  MenuItem, Select, FormControl,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const STATUS_CONFIG = {
  draft:           { label: 'Draft',         color: '#64748B', bg: '#F8FAFC' },
  estimated:       { label: 'Estimated',     color: '#3B82F6', bg: '#F5F3FF' },
  quoted:          { label: 'Quoted',        color: '#D97706', bg: '#FFFBEB' },
  order_confirmed: { label: 'Confirmed',     color: '#7C3AED', bg: '#F5F3FF' },
  in_production:   { label: 'In Production', color: '#714CF7', bg: '#F5F3FF' },
  inspected:       { label: 'Inspected',     color: '#059669', bg: '#ECFDF5' },
  shipped:         { label: 'Shipped',       color: '#0891B2', bg: '#ECFEFF' },
  closed:          { label: 'Closed',        color: '#475569', bg: '#F8FAFC' },
};

const WORKFLOW_STAGES = [
  { key: 'draft', label: 'RFQ/Draft', icon: <DescriptionIcon sx={{ fontSize: 15 }} /> },
  { key: 'estimated', label: 'Estimation', icon: <EngineeringIcon sx={{ fontSize: 15 }} /> },
  { key: 'quoted', label: 'Quotation', icon: <AttachMoneyIcon sx={{ fontSize: 15 }} /> },
  { key: 'order_confirmed', label: 'Order', icon: <CheckCircleOutlineIcon sx={{ fontSize: 15 }} /> },
  { key: 'in_production', label: 'Production', icon: <PrecisionManufacturingIcon sx={{ fontSize: 15 }} /> },
  { key: 'inspected', label: 'Quality', icon: <VerifiedIcon sx={{ fontSize: 15 }} /> },
  { key: 'shipped', label: 'Shipped', icon: <LocalShippingIcon sx={{ fontSize: 15 }} /> },
];

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  transition: 'all 0.25s', '&:hover': { boxShadow: '0 4px 14px rgba(0,0,0,0.05)' },
};

export default function Dashboard() {
  const { projects, clients, vendors, vendorPOs, rfqs, companies, getClientName, getCompanyName } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('updated_at');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [companyFilter, setCompanyFilter] = useState('all');

  const kpis = useMemo(() => {
    const fp = companyFilter === 'all' ? projects : projects.filter(p => p.company_id === Number(companyFilter));
    const activeProjects = fp.filter(p => !['closed', 'shipped'].includes(p.status)).length;
    const pipelineValue = fp.reduce((s, p) => s + (p.estimate?.final_price || 0), 0);
    const inProduction = fp.filter(p => p.status === 'in_production').length;
    const openRFQs = rfqs.filter(r => r.status === 'open').length;
    const pendingQuotations = fp.filter(p => p.status === 'quoted').length;
    const confirmedOrders = fp.filter(p => ['order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(p.status)).length;
    const materialsWaiting = vendorPOs.filter(v => ['draft', 'sent'].includes(v.status)).length;
    const totalCost = fp.reduce((s, p) => s + (p.estimate?.total_cost || 0), 0);
    const estimatedProfit = pipelineValue - totalCost;
    return { activeProjects, pipelineValue, inProduction, openRFQs, pendingQuotations, confirmedOrders, materialsWaiting, estimatedProfit };
  }, [projects, rfqs, vendorPOs, companyFilter]);

  const statusCounts = useMemo(() => {
    const fp = companyFilter === 'all' ? projects : projects.filter(p => p.company_id === Number(companyFilter));
    const counts = {};
    WORKFLOW_STAGES.forEach(s => { counts[s.key] = 0; });
    fp.forEach(p => { if (counts[p.status] !== undefined) counts[p.status]++; });
    return counts;
  }, [projects, companyFilter]);

  const statusDistribution = useMemo(() => {
    const fp = companyFilter === 'all' ? projects : projects.filter(p => p.company_id === Number(companyFilter));
    const dist = {};
    fp.forEach(p => { if (STATUS_CONFIG[p.status]) dist[p.status] = (dist[p.status] || 0) + 1; });
    return Object.entries(dist).map(([key, count]) => ({
      key, label: STATUS_CONFIG[key].label, count, color: STATUS_CONFIG[key].color, pct: Math.round((count / (fp.length || 1)) * 100),
    }));
  }, [projects, companyFilter]);

  const revenueByCompany = useMemo(() => {
    return companies.map(c => {
      const cp = projects.filter(p => p.company_id === c.id);
      const total = cp.reduce((s, p) => s + (p.estimate?.final_price || 0), 0);
      return { name: c.short_code, fullName: c.company_name, total, projects: cp.length };
    });
  }, [projects, companies]);

  const recentActivity = useMemo(() => {
    const events = [];
    projects.forEach(p => {
      events.push({ text: `Project "${p.project_name}" created`, time: p.created_at, color: '#64748B' });
      if (p.estimate?.approved_at) events.push({ text: `Estimate approved for "${p.project_name}"`, time: p.estimate.approved_at, color: '#3B82F6' });
      if (p.quotation?.validity_date) events.push({ text: `Quotation sent for "${p.project_name}"`, time: p.updated_at, color: '#D97706' });
      if (p.sales_order?.accepted_date) events.push({ text: `Order confirmed — "${p.project_name}"`, time: p.sales_order.accepted_date, color: '#7C3AED' });
    });
    events.sort((a, b) => (b.time || '').localeCompare(a.time || ''));
    return events.slice(0, 8);
  }, [projects]);

  const sortedProjects = useMemo(() => {
    let fp = companyFilter === 'all' ? [...projects] : projects.filter(p => p.company_id === Number(companyFilter));
    if (search) {
      const s = search.toLowerCase();
      fp = fp.filter(p =>
        p.project_name.toLowerCase().includes(s) ||
        (p.project_code || '').toLowerCase().includes(s) ||
        getClientName(p.client_id).toLowerCase().includes(s) ||
        getCompanyName(p.company_id).toLowerCase().includes(s) ||
        (p.manager || '').toLowerCase().includes(s)
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    fp.sort((a, b) => {
      if (sortField === 'project_name') return dir * a.project_name.localeCompare(b.project_name);
      if (sortField === 'status') return dir * (a.status || '').localeCompare(b.status || '');
      if (sortField === 'value') return dir * ((a.estimate?.final_price || 0) - (b.estimate?.final_price || 0));
      if (sortField === 'updated_at') return dir * (a.updated_at || '').localeCompare(b.updated_at || '');
      if (sortField === 'company') return dir * getCompanyName(a.company_id).localeCompare(getCompanyName(b.company_id));
      return 0;
    });
    return fp;
  }, [projects, search, sortField, sortDir, companyFilter, getClientName, getCompanyName]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortHeader = ({ field, children }) => (
    <TableCell onClick={() => toggleSort(field)}
      sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, cursor: 'pointer', userSelect: 'none', borderColor: '#EEF2F6',
        '&:hover': { color: '#334155' } }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <span>{children}</span>
        {sortField === field ? (sortDir === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: 13 }} /> : <ArrowDownwardIcon sx={{ fontSize: 13 }} />) : <SortIcon sx={{ fontSize: 13, opacity: 0.3 }} />}
      </Stack>
    </TableCell>
  );

  const primaryKPIs = [
    { label: 'Active Projects', value: kpis.activeProjects, icon: <AssignmentIcon sx={{ fontSize: 18 }} />, color: '#714CF7', trend: '+2 this month' },
    { label: 'Pipeline Value', value: `$${(kpis.pipelineValue / 1000).toFixed(0)}K`, icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, color: '#059669', trend: 'Total estimated' },
    { label: 'In Production', value: kpis.inProduction, icon: <PrecisionManufacturingIcon sx={{ fontSize: 18 }} />, color: '#D97706', trend: 'Active WOs' },
    { label: 'Open RFQs', value: kpis.openRFQs, icon: <RequestQuoteIcon sx={{ fontSize: 18 }} />, color: '#DC2626', trend: 'Awaiting response' },
  ];

  const secondaryKPIs = [
    { label: 'Pending Quotes', value: kpis.pendingQuotations, icon: <ReceiptLongIcon sx={{ fontSize: 15 }} />, color: '#D97706' },
    { label: 'Confirmed Orders', value: kpis.confirmedOrders, icon: <ShoppingCartIcon sx={{ fontSize: 15 }} />, color: '#7C3AED' },
    { label: 'Materials Waiting', value: kpis.materialsWaiting, icon: <InventoryIcon sx={{ fontSize: 15 }} />, color: '#DC2626' },
    { label: 'Total Clients', value: clients.length, icon: <PeopleIcon sx={{ fontSize: 15 }} />, color: '#714CF7' },
    { label: 'Total Vendors', value: vendors.length, icon: <StorefrontIcon sx={{ fontSize: 15 }} />, color: '#7C3AED' },
    { label: 'Est. Profit', value: `$${(kpis.estimatedProfit / 1000).toFixed(0)}K`, icon: <MonetizationOnIcon sx={{ fontSize: 15 }} />, color: '#059669' },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Page Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            Welcome back, {user?.name} — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} displayEmpty
              sx={{ borderRadius: 2, fontSize: '0.78rem', '& .MuiSelect-select': { py: 0.75 } }}>
              <MenuItem value="all">All Companies</MenuItem>
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.company_name}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" size="small" startIcon={<FolderIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/projects')}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
            All Projects
          </Button>
        </Stack>
      </Stack>

      {/* Primary KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {primaryKPIs.map((kpi) => (
          <Grid item xs={6} md={3} key={kpi.label}>
            <Card elevation={0} sx={{ ...cardSx, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: kpi.color, opacity: 0.7 }} />
              <CardContent sx={{ p: 2, pt: 2.5, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', mb: 0.5 }}>
                      {kpi.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                      {kpi.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', mt: 0.5 }}>{kpi.trend}</Typography>
                  </Box>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(kpi.color, 0.08), color: kpi.color }}>
                    {kpi.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Secondary Stats */}
      <Card elevation={0} sx={{ ...cardSx, mb: 2.5 }}>
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          <Stack direction="row" spacing={0} divider={<Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} />}
            sx={{ overflowX: 'auto' }}>
            {secondaryKPIs.map(sk => (
              <Stack key={sk.label} direction="row" alignItems="center" spacing={1} sx={{ minWidth: 'fit-content', py: 0.5 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(sk.color, 0.08), color: sk.color }}>
                  {sk.icon}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.58rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
                    {sk.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                    {sk.value}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Manufacturing Lifecycle */}
      <Card elevation={0} sx={{ ...cardSx, mb: 2.5 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', mb: 2 }}>Manufacturing Lifecycle</Typography>
          <Stack direction="row" spacing={0} sx={{ overflowX: 'auto' }}>
            {WORKFLOW_STAGES.map((stage, idx) => {
              const count = statusCounts[stage.key] || 0;
              const sc = STATUS_CONFIG[stage.key];
              return (
                <Box key={stage.key} sx={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 100 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '50%', mx: 'auto', mb: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: count > 0 ? alpha(sc.color, 0.1) : '#F8FAFC',
                    color: count > 0 ? sc.color : '#CBD5E1',
                    border: `2px solid ${count > 0 ? sc.color : '#E2E8F0'}`,
                  }}>
                    {stage.icon}
                  </Box>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: count > 0 ? '#0F172A' : '#94A3B8' }}>
                    {stage.label}
                  </Typography>
                  <Chip label={count} size="small"
                    sx={{ mt: 0.5, height: 18, fontSize: '0.6rem', fontWeight: 700,
                      bgcolor: count > 0 ? alpha(sc.color, 0.08) : '#F1F5F9',
                      color: count > 0 ? sc.color : '#94A3B8' }} />
                  {idx < WORKFLOW_STAGES.length - 1 && (
                    <Box sx={{ position: 'absolute', top: 22, right: -8, width: 16, height: 2,
                      bgcolor: count > 0 ? alpha(sc.color, 0.3) : '#E2E8F0' }} />
                  )}
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', mb: 2 }}>Status Distribution</Typography>
              <Stack spacing={1.25}>
                {statusDistribution.map(item => (
                  <Box key={item.key}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <FiberManualRecordIcon sx={{ fontSize: 8, color: item.color }} />
                        <Typography sx={{ fontSize: '0.72rem', color: '#475569' }}>{item.label}</Typography>
                      </Stack>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>{item.count} ({item.pct}%)</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={item.pct}
                      sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9',
                        '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: item.color } }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Company */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', mb: 2 }}>Revenue by Company</Typography>
              <Stack spacing={1.5}>
                {revenueByCompany.map((comp, idx) => {
                  const colors = ['#714CF7', '#059669', '#D97706'];
                  const color = colors[idx % colors.length];
                  const maxRev = Math.max(...revenueByCompany.map(c => c.total), 1);
                  return (
                    <Box key={comp.name}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(color, 0.1), color, fontSize: '0.55rem', fontWeight: 800 }}>
                            {comp.name}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#1E293B' }}>{comp.fullName}</Typography>
                            <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8' }}>{comp.projects} projects</Typography>
                          </Box>
                        </Stack>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color }}>${(comp.total / 1000).toFixed(0)}K</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={(comp.total / maxRev) * 100}
                        sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9',
                          '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: color } }} />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ ...cardSx, height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>Recent Activity</Typography>
                <AccessTimeIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
              </Stack>
              <Stack spacing={0}>
                {recentActivity.slice(0, 6).map((activity, idx) => (
                  <Stack key={idx} direction="row" spacing={1.5} sx={{ position: 'relative', pb: 1.75, '&:last-child': { pb: 0 } }}>
                    {idx < Math.min(recentActivity.length - 1, 5) && (
                      <Box sx={{ position: 'absolute', left: 5, top: 14, bottom: 0, width: 1.5, bgcolor: '#EEF2F6' }} />
                    )}
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: alpha(activity.color, 0.15),
                      border: `2px solid ${activity.color}`, flexShrink: 0, mt: 0.25, position: 'relative', zIndex: 1 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>
                        {activity.text}
                      </Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>{activity.time}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card elevation={0} sx={{ ...cardSx, mb: 2.5 }}>
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto' }}>
            {[
              { label: 'New Project', path: '/projects', icon: <FolderIcon sx={{ fontSize: 14 }} />, color: '#714CF7' },
              { label: 'RFQ Inbox', path: '/sales/rfq', icon: <RequestQuoteIcon sx={{ fontSize: 14 }} />, color: '#D97706' },
              { label: 'Quotations', path: '/sales/quotations', icon: <ReceiptLongIcon sx={{ fontSize: 14 }} />, color: '#059669' },
              { label: 'Vendor POs', path: '/procurement/vendor-po', icon: <ShoppingCartIcon sx={{ fontSize: 14 }} />, color: '#7C3AED' },
              { label: 'Production', path: '/production', icon: <FactoryIcon sx={{ fontSize: 14 }} />, color: '#714CF7' },
              { label: 'Analytics', path: '/analytics', icon: <TrendingUpIcon sx={{ fontSize: 14 }} />, color: '#0891B2' },
            ].map(action => (
              <Button key={action.label} size="small" variant="text"
                startIcon={<Avatar sx={{ width: 22, height: 22, bgcolor: alpha(action.color, 0.08), color: action.color }}>{action.icon}</Avatar>}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 12, color: '#CBD5E1' }} />}
                onClick={() => navigate(action.path)}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', color: '#475569',
                  border: '1px solid #E2E8F0', px: 1.5, whiteSpace: 'nowrap',
                  '&:hover': { borderColor: action.color, bgcolor: alpha(action.color, 0.03), color: action.color } }}>
                {action.label}
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Pipeline Table */}
      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AssignmentIcon sx={{ fontSize: 16, color: '#64748B' }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Project Pipeline</Typography>
              <Chip label={`${sortedProjects.length} projects`} size="small"
                sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.6rem', height: 20 }} />
            </Stack>
            <TextField size="small" placeholder="Search projects, clients, managers..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#94A3B8' }} /></InputAdornment> }}
              sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.78rem' } }} />
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAFBFC' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6', width: 110 }}>Project ID</TableCell>
                  <SortHeader field="project_name">Project</SortHeader>
                  <SortHeader field="company">Company</SortHeader>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>Manager</TableCell>
                  <SortHeader field="status">Status</SortHeader>
                  <SortHeader field="value">Value</SortHeader>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>Progress</TableCell>
                  <SortHeader field="updated_at">Updated</SortHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => {
                  const sc = STATUS_CONFIG[project.status] || { label: project.status, color: '#999', bg: '#eee' };
                  const statusIdx = Object.keys(STATUS_CONFIG).indexOf(project.status);
                  const progress = Math.round(((statusIdx + 1) / Object.keys(STATUS_CONFIG).length) * 100);
                  return (
                    <TableRow key={project.id} hover onClick={() => navigate(`/projects/${project.id}`)}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#714CF7', fontFamily: 'monospace' }}>
                          {project.project_code || `PRJ-${project.id}`}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>{project.project_name}</Typography>
                        {project.category && <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>{project.category}</Typography>}
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Chip label={getCompanyName(project.company_id)?.split(' ').slice(0, 2).join(' ')} size="small"
                          sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.6rem', height: 20 }} />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(project.client_id)}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Avatar sx={{ width: 20, height: 20, fontSize: '0.55rem', bgcolor: alpha('#714CF7', 0.08), color: '#714CF7' }}>
                            {(project.manager || '?').charAt(0)}
                          </Avatar>
                          <Typography sx={{ fontSize: '0.72rem', color: '#475569' }}>{project.manager || 'Unassigned'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Chip label={sc.label} size="small"
                          sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.6rem', height: 20, border: `1px solid ${alpha(sc.color, 0.15)}` }} />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                          {project.estimate?.final_price > 0 ? `$${project.estimate.final_price.toLocaleString()}` : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6', minWidth: 100 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress variant="determinate" value={progress}
                            sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: '#EEF2F6',
                              '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: sc.color } }} />
                          <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#94A3B8', minWidth: 28 }}>{progress}%</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                        <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{project.updated_at}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div" count={sortedProjects.length} page={page} rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[5, 8, 15, 25]}
            sx={{ borderTop: '1px solid #EEF2F6', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.72rem' } }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
