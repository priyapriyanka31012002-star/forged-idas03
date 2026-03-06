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
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export default function ClientPOList() {
  const { projects, getClientName } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Projects with confirmed orders
  const confirmedProjects = projects.filter(p =>
    ['order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(p.status)
  );

  const filtered = confirmedProjects.filter(p =>
    p.project_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sales_order?.customer_po || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.client_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <AssignmentTurnedInIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Client Purchase Orders</Typography>
        <Chip label={`${confirmedProjects.length} orders`} size="small"
          sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Active Orders', count: confirmedProjects.filter(p => !['closed'].includes(p.status)).length, color: '#714CF7' },
          { label: 'In Production', count: confirmedProjects.filter(p => p.status === 'in_production').length, color: '#D97706' },
          { label: 'Completed', count: confirmedProjects.filter(p => ['shipped', 'closed'].includes(p.status)).length, color: '#059669' },
          { label: 'Total Value', count: `$${Math.round(confirmedProjects.reduce((s, p) => s + (p.estimate?.final_price || 0), 0) / 1000)}K`, color: '#7C3AED' },
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

      <TextField size="small" placeholder="Search by project, PO number, or client..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Project', 'Client', 'Customer PO', 'Work Order', 'Value', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(project => (
                <TableRow key={project.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                  onClick={() => navigate(`/projects/${project.id}`)}>
                  <TableCell sx={{ py: 1.25 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: alpha('#7C3AED', 0.08), color: '#7C3AED' }}>
                        <AssignmentTurnedInIcon sx={{ fontSize: 14 }} />
                      </Avatar>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.project_name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(project.client_id)}</Typography></TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B' }}>
                      {project.sales_order?.customer_po || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: '#64748B' }}>
                      {project.sales_order?.work_order || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                      ${(project.estimate?.final_price || 0).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={project.status.replace(/_/g, ' ')} size="small"
                      sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, textTransform: 'capitalize',
                        bgcolor: project.status === 'in_production' ? '#F5F3FF' : '#ECFDF5',
                        color: project.status === 'in_production' ? '#714CF7' : '#059669' }} />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No client POs found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
