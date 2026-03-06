import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Box, Typography, Stack, Card, CardContent, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, alpha, IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function InspectionList() {
  const { projects, getClientName } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Projects that have reached or passed production
  const inspectableProjects = projects.filter(p =>
    ['in_production', 'inspected', 'shipped', 'closed'].includes(p.status)
  );

  const filtered = inspectableProjects.filter(p =>
    p.project_name.toLowerCase().includes(search.toLowerCase())
  );

  const getInspectionCount = (project) => {
    if (!project.quality?.inspections) return { done: 0, total: 0 };
    const inspections = project.quality.inspections;
    const done = inspections.filter(i => i.status === 'pass' || i.status === 'fail').length;
    return { done, total: inspections.length };
  };

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <VerifiedIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Quality Inspections</Typography>
        <Chip label={`${inspectableProjects.length} projects`} size="small"
          sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Pending QC', count: inspectableProjects.filter(p => p.status === 'in_production').length, color: '#D97706' },
          { label: 'Inspected', count: inspectableProjects.filter(p => p.status === 'inspected').length, color: '#059669' },
          { label: 'Shipped', count: inspectableProjects.filter(p => ['shipped', 'closed'].includes(p.status)).length, color: '#0891B2' },
          { label: 'Total', count: inspectableProjects.length, color: '#64748B' },
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

      <TextField size="small" placeholder="Search inspections..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Project', 'Client', 'Inspections', 'CoC', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(project => {
                const { done, total } = getInspectionCount(project);
                const hasCoC = project.quality?.coc_generated;
                return (
                  <TableRow key={project.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                    onClick={() => navigate(`/projects/${project.id}`)}>
                    <TableCell sx={{ py: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha('#059669', 0.08), color: '#059669' }}>
                          <VerifiedIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.project_name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(project.client_id)}</Typography></TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>
                        {total > 0 ? `${done}/${total} complete` : 'Not started'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={hasCoC ? 'Generated' : 'Pending'} size="small"
                        sx={{ bgcolor: hasCoC ? '#ECFDF5' : '#F8FAFC', color: hasCoC ? '#059669' : '#94A3B8',
                          fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={project.status.replace(/_/g, ' ')} size="small"
                        sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, textTransform: 'capitalize',
                          bgcolor: project.status === 'inspected' ? '#ECFDF5' : '#F5F3FF',
                          color: project.status === 'inspected' ? '#059669' : '#714CF7' }} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No inspections found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
