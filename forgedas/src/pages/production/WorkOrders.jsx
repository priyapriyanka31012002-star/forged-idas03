import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Box, Typography, Stack, Card, CardContent, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, alpha, IconButton, LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

export default function WorkOrders() {
  const { projects, getClientName } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Projects with work orders (confirmed+)
  const workOrderProjects = projects.filter(p =>
    ['order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(p.status)
  );

  const filtered = workOrderProjects.filter(p =>
    p.project_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sales_order?.work_order || '').toLowerCase().includes(search.toLowerCase())
  );

  const getProductionProgress = (project) => {
    if (!project.production?.operations) return 0;
    const ops = project.production.operations;
    const done = ops.filter(o => o.completed).length;
    return Math.round((done / ops.length) * 100);
  };

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <PrecisionManufacturingIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Production Work Orders</Typography>
        <Chip label={`${workOrderProjects.length} orders`} size="small"
          sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Pending Start', count: workOrderProjects.filter(p => p.status === 'order_confirmed').length, color: '#D97706' },
          { label: 'In Production', count: workOrderProjects.filter(p => p.status === 'in_production').length, color: '#714CF7' },
          { label: 'Completed', count: workOrderProjects.filter(p => ['inspected', 'shipped', 'closed'].includes(p.status)).length, color: '#059669' },
          { label: 'Total Orders', count: workOrderProjects.length, color: '#64748B' },
        ].map(s => (
          <Card key={s.label} elevation={0} sx={{ ...cardSx, flex: 1, overflow: 'hidden' }}>
            <Box sx={{ height: 3, bgcolor: s.color }} />
            <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.count}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <TextField size="small" placeholder="Search work orders..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Work Order', 'Project', 'Client', 'Progress', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(project => {
                const progress = getProductionProgress(project);
                const isActive = project.status === 'in_production';
                return (
                  <TableRow key={project.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                    onClick={() => navigate(`/projects/${project.id}`)}>
                    <TableCell sx={{ py: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(isActive ? '#714CF7' : '#059669', 0.08), color: isActive ? '#714CF7' : '#059669' }}>
                          <PrecisionManufacturingIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>
                          {project.sales_order?.work_order || `WO-${project.id}`}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{project.project_name}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(project.client_id)}</Typography></TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LinearProgress variant="determinate" value={progress}
                          sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#EEF2F6',
                            '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: progress === 100 ? '#059669' : '#714CF7' } }} />
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B', minWidth: 32 }}>{progress}%</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={project.status.replace(/_/g, ' ')} size="small"
                        sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, textTransform: 'capitalize',
                          bgcolor: isActive ? '#F5F3FF' : '#ECFDF5', color: isActive ? '#714CF7' : '#059669' }} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No work orders found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
