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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: '#64748B', bg: '#F8FAFC' },
  estimated: { label: 'Pending', color: '#3B82F6', bg: '#F5F3FF' },
  quoted: { label: 'Sent', color: '#D97706', bg: '#FFFBEB' },
  order_confirmed: { label: 'Accepted', color: '#059669', bg: '#ECFDF5' },
};

export default function QuotationsList() {
  const { projects, getClientName } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Projects that have estimates (i.e., can be quoted)
  const quotableProjects = projects.filter(p =>
    ['estimated', 'quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'].includes(p.status)
  );

  const filtered = quotableProjects.filter(p =>
    p.project_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.client_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <AttachMoneyIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Quotations</Typography>
        <Chip label={`${quotableProjects.length} projects`} size="small"
          sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Pending', count: filtered.filter(p => p.status === 'estimated').length, color: '#3B82F6' },
          { label: 'Sent', count: filtered.filter(p => p.status === 'quoted').length, color: '#D97706' },
          { label: 'Accepted', count: filtered.filter(p => ['order_confirmed', 'in_production', 'inspected', 'shipped'].includes(p.status)).length, color: '#059669' },
          { label: 'Total Value', count: `$${Math.round(filtered.reduce((s, p) => s + (p.estimate?.final_price || 0), 0) / 1000)}K`, color: '#7C3AED' },
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

      <TextField size="small" placeholder="Search quotations..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Project', 'Client', 'Amount', 'Status', 'Updated', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(project => {
                const ss = STATUS_CONFIG[project.status] || { label: project.status.replace(/_/g, ' '), color: '#059669', bg: '#ECFDF5' };
                return (
                  <TableRow key={project.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                    onClick={() => navigate(`/projects/${project.id}`)}>
                    <TableCell sx={{ py: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha('#D97706', 0.08), color: '#D97706' }}>
                          <AttachMoneyIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.project_name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(project.client_id)}</Typography></TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: project.estimate?.final_price > 0 ? '#1E293B' : '#CBD5E1' }}>
                        {project.estimate?.final_price > 0 ? `$${project.estimate.final_price.toLocaleString()}` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={ss.label} size="small"
                        sx={{ bgcolor: ss.bg, color: ss.color, fontWeight: 600, fontSize: '0.65rem', height: 22, border: `1px solid ${alpha(ss.color, 0.15)}` }} />
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{project.updated_at}</Typography></TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No quotations found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
