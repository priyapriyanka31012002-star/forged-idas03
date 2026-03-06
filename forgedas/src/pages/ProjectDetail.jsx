import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Box, Typography, Chip, Tabs, Tab, Stack, IconButton, Button, alpha, Avatar, LinearProgress,
  Card, CardContent, Divider, Tooltip, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HistoryIcon from '@mui/icons-material/History';
import BusinessIcon from '@mui/icons-material/Business';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BadgeIcon from '@mui/icons-material/Badge';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FactoryIcon from '@mui/icons-material/Factory';
import FolderIcon from '@mui/icons-material/Folder';
import OverviewTab from '../components/tabs/OverviewTab';
import EstimationTab from '../components/tabs/EstimationTab';
import QuotationTab from '../components/tabs/QuotationTab';
import SalesOrderTab from '../components/tabs/SalesOrderTab';
import VendorPOTab from '../components/tabs/VendorPOTab';
import ProductionTab from '../components/tabs/ProductionTab';
import QualityTab from '../components/tabs/QualityTab';
import LogisticsTab from '../components/tabs/LogisticsTab';
import DocumentsTab from '../components/tabs/DocumentsTab';
import TimelineTab from '../components/tabs/TimelineTab';

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

const TAB_LABELS = [
  'Overview', 'Estimation', 'Quotation', 'Client PO', 'Vendor PO',
  'Production', 'Quality', 'Logistics', 'Documents', 'Timeline',
];

const STATUS_ORDER = ['draft', 'estimated', 'quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'];

const WORKFLOW_STAGES = [
  { key: 'draft', label: 'Project Info', tabIdx: 0, icon: <DescriptionIcon sx={{ fontSize: 16 }} /> },
  { key: 'estimated', label: 'Estimation', tabIdx: 1, icon: <EngineeringIcon sx={{ fontSize: 16 }} /> },
  { key: 'quoted', label: 'Quotation', tabIdx: 2, icon: <AttachMoneyIcon sx={{ fontSize: 16 }} /> },
  { key: 'order_confirmed', label: 'Client PO', tabIdx: 3, icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
  { key: 'vendor_po', label: 'Vendor PO', tabIdx: 4, icon: <ShoppingCartIcon sx={{ fontSize: 16 }} /> },
  { key: 'in_production', label: 'Production', tabIdx: 5, icon: <PrecisionManufacturingIcon sx={{ fontSize: 16 }} /> },
  { key: 'inspected', label: 'Quality', tabIdx: 6, icon: <VerifiedIcon sx={{ fontSize: 16 }} /> },
  { key: 'shipped', label: 'Logistics', tabIdx: 7, icon: <LocalShippingIcon sx={{ fontSize: 16 }} /> },
  { key: 'documents', label: 'Documents', tabIdx: 8, icon: <FolderIcon sx={{ fontSize: 16 }} /> },
];

function getWorkflowStageIndex(status) {
  const map = {
    draft: 0, estimated: 1, quoted: 2, order_confirmed: 3,
    in_production: 5, inspected: 6, shipped: 7, closed: 8,
  };
  return map[status] ?? 0;
}

function getTabEnabled(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return {
    0: true,
    1: true,
    2: idx >= 1,
    3: idx >= 2,
    4: idx >= 3,
    5: idx >= 3,
    6: idx >= 4,
    7: idx >= 5,
    8: true,
    9: true,
  };
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, getClientName, getCompanyName, updateProject } = useData();
  const [tabIndex, setTabIndex] = useState(0);

  const project = projects.find(p => p.id === Number(id));
  if (!project) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#64748B', mb: 2 }}>Project not found</Typography>
        <Button variant="outlined" onClick={() => navigate('/projects')}>Back to Projects</Button>
      </Box>
    );
  }

  const tabEnabled = getTabEnabled(project.status);
  const sc = STATUS_CONFIG[project.status] || { label: project.status, color: '#999', bg: '#eee' };
  const currentIdx = STATUS_ORDER.indexOf(project.status);
  const progress = Math.round(((currentIdx + 1) / STATUS_ORDER.length) * 100);
  const clientName = getClientName(project.client_id);
  const companyName = getCompanyName(project.company_id);
  const activeStageIdx = getWorkflowStageIndex(project.status);

  const tabComponents = [
    <OverviewTab project={project} />,
    <EstimationTab project={project} updateProject={updateProject} />,
    <QuotationTab project={project} updateProject={updateProject} />,
    <SalesOrderTab project={project} updateProject={updateProject} />,
    <VendorPOTab project={project} />,
    <ProductionTab project={project} updateProject={updateProject} />,
    <QualityTab project={project} updateProject={updateProject} />,
    <LogisticsTab project={project} updateProject={updateProject} />,
    <DocumentsTab project={project} />,
    <TimelineTab project={project} />,
  ];

  return (
    <Grid container spacing={3} sx={{ maxWidth: 1440, mx: 'auto', width: '100%' }}>
      {/* Breadcrumb back */}
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate('/projects')} size="small"
            sx={{ color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 1.5, width: 32, height: 32,
              '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' } }}>
            <ArrowBackIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            Projects <Box component="span" sx={{ mx: 0.5 }}>/</Box>
            <Box component="span" sx={{ color: '#475569', fontWeight: 600 }}>{project.project_name}</Box>
          </Typography>
        </Stack>
      </Grid>

      {/* Project Header Card */}
      <Grid item xs={12}>
        <Card elevation={1} sx={{ border: '1px solid #E2E8F0', borderRadius: 2.5, mb: 0, overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, bgcolor: '#fff' }}>
          {/* Colored top bar */}
          <Box sx={{ height: 4, bgcolor: sc.color, opacity: 0.85 }} />
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              {/* Left: Name + Status + ID */}
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Avatar sx={{ width: 52, height: 52, bgcolor: alpha(sc.color, 0.08), color: sc.color,
                  fontSize: '1.1rem', fontWeight: 800, border: `2px solid ${alpha(sc.color, 0.2)}` }}>
                  {project.project_name.charAt(0)}
                </Avatar>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
                      {project.project_name}
                    </Typography>
                    <Chip label={sc.label} size="small"
                      sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: '0.7rem', height: 26,
                        border: `1px solid ${alpha(sc.color, 0.2)}` }} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2.5}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      Project ID: <Box component="span" sx={{ fontWeight: 700, color: '#64748B', fontFamily: 'monospace' }}>{project.project_code || `PRJ-${project.id}`}</Box>
                    </Typography>
                    {project.quotation && (
                      <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        Quotation: <Box component="span" sx={{ fontWeight: 700, color: '#714CF7', fontFamily: 'monospace' }}>QTN-{project.project_code || project.id}</Box>
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      {companyName || 'No company'} • {clientName || 'No client'}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Right: Value + Progress */}
              <Stack alignItems="flex-end" spacing={1.5}>
                {project.estimate?.final_price > 0 && (
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8' }}>
                      Estimated Value
                    </Typography>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>
                      ${project.estimate.final_price.toLocaleString()}
                    </Typography>
                  </Box>
                )}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 180 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress variant="determinate" value={progress}
                      sx={{ height: 7, borderRadius: 3, bgcolor: '#EEF2F6',
                        '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: sc.color } }} />
                  </Box>
                  <Chip label={`${progress}%`} size="small"
                    sx={{ bgcolor: alpha(sc.color, 0.08), color: sc.color, fontWeight: 700, fontSize: '0.68rem', height: 24, minWidth: 44 }} />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Horizontal Workflow Tracker */}
      <Grid item xs={12}>
        <Card elevation={1} sx={{ border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: 0, mb: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, bgcolor: '#fff' }}>
          <CardContent sx={{ py: 2, px: 3, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={0} sx={{ overflowX: 'auto' }}>
              {WORKFLOW_STAGES.map((stage, idx) => {
                const done = activeStageIdx > idx;
                const active = activeStageIdx === idx;
                const stageColor = done ? '#059669' : active ? '#714CF7' : '#CBD5E1';
                return (
                  <React.Fragment key={stage.key}>
                    <Tooltip title={`${stage.label}${done ? ' — Completed' : active ? ' — Current' : ' — Pending'}`} arrow>
                      <Stack
                        direction="row" alignItems="center" spacing={0.75}
                        onClick={() => tabEnabled[stage.tabIdx] && setTabIndex(stage.tabIdx)}
                        sx={{
                          cursor: tabEnabled[stage.tabIdx] ? 'pointer' : 'default',
                          px: 1.5, py: 1, borderRadius: 2,
                          bgcolor: active ? alpha('#714CF7', 0.06) : 'transparent',
                          border: active ? '1px solid' : '1px solid transparent',
                          borderColor: active ? alpha('#714CF7', 0.2) : 'transparent',
                          transition: 'all 0.2s',
                          opacity: tabEnabled[stage.tabIdx] ? 1 : 0.35,
                          '&:hover': tabEnabled[stage.tabIdx] ? { bgcolor: alpha('#714CF7', 0.04) } : {},
                          minWidth: 'fit-content',
                        }}
                      >
                        <Box sx={{
                          width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: done ? '#059669' : active ? alpha('#714CF7', 0.1) : '#F1F5F9',
                          color: done ? '#fff' : active ? '#714CF7' : '#94A3B8',
                          border: `1.5px solid ${stageColor}`,
                          flexShrink: 0,
                        }}>
                          {done ? <CheckCircleOutlineIcon sx={{ fontSize: 15 }} /> : stage.icon}
                        </Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: active ? 700 : 500,
                          color: done ? '#059669' : active ? '#714CF7' : '#94A3B8', whiteSpace: 'nowrap' }}>
                          {stage.label}
                        </Typography>
                      </Stack>
                    </Tooltip>
                    {idx < WORKFLOW_STAGES.length - 1 && (
                      <Box sx={{ width: 24, height: 2, bgcolor: done ? '#059669' : '#E2E8F0', flexShrink: 0, mx: 0.5 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Tabs */}
      <Grid item xs={12}>
        <Box sx={{ borderBottom: '1px solid #E2E8F0', mb: 3, bgcolor: '#FAFBFC', borderRadius: '10px 10px 0 0', px: 0.5 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => tabEnabled[v] && setTabIndex(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 44,
              '& .MuiTab-root': {
                textTransform: 'none', fontWeight: 500, fontSize: '0.8rem', minHeight: 44,
                color: '#64748B', px: 2, borderRadius: '8px 8px 0 0', transition: 'all 0.2s',
                '&.Mui-selected': { fontWeight: 700, color: '#714CF7', bgcolor: '#fff' },
                '&.Mui-disabled': { opacity: 0.25, cursor: 'not-allowed' },
                '&:hover:not(.Mui-disabled):not(.Mui-selected)': { bgcolor: alpha('#714CF7', 0.04), color: '#334155' },
              },
              '& .MuiTabs-indicator': { height: 2.5, borderRadius: '2px 2px 0 0', bgcolor: '#714CF7' },
            }}
          >
            {TAB_LABELS.map((label, i) => (
              <Tab key={label} label={label} disabled={!tabEnabled[i]} />
            ))}
          </Tabs>
        </Box>
      </Grid>

      {/* Tab Content: always 2-column grid for workspace tabs */}
      <Grid item xs={12}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={8.4}>
            {tabComponents[tabIndex]}
          </Grid>
          {/* Right summary panel placeholder for future use (e.g., cost summary, status) */}
          <Grid item xs={12} md={3.6}>
            {/* Each tab can render its own summary panel here if needed */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
