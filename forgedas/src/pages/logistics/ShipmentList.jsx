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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function ShipmentList() {
  const { projects, getClientName } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Projects at logistics stage
  const logisticsProjects = projects.filter(p =>
    ['inspected', 'shipped', 'closed'].includes(p.status)
  );

  const filtered = logisticsProjects.filter(p =>
    p.project_name.toLowerCase().includes(search.toLowerCase())
  );

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <LocalShippingIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Logistics & Shipments</Typography>
        <Chip label={`${logisticsProjects.length} shipments`} size="small"
          sx={{ bgcolor: '#ECFEFF', color: '#0891B2', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Ready to Ship', count: logisticsProjects.filter(p => p.status === 'inspected').length, color: '#D97706' },
          { label: 'Shipped', count: logisticsProjects.filter(p => p.status === 'shipped').length, color: '#0891B2' },
          { label: 'Delivered', count: logisticsProjects.filter(p => p.status === 'closed').length, color: '#059669' },
          { label: 'Total', count: logisticsProjects.length, color: '#64748B' },
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

      <TextField size="small" placeholder="Search shipments..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Project', 'Client', 'Method', 'Dispatch Date', 'Packing', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(project => {
                const logistics = project.logistics || {};
                return (
                  <TableRow key={project.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                    onClick={() => navigate(`/projects/${project.id}`)}>
                    <TableCell sx={{ py: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha('#0891B2', 0.08), color: '#0891B2' }}>
                          {project.status === 'shipped' ? <LocalShippingIcon sx={{ fontSize: 14 }} /> : <InventoryIcon sx={{ fontSize: 14 }} />}
                        </Avatar>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{project.project_name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(project.client_id)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{logistics.shipment_method || '—'}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{logistics.dispatch_date || '—'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={logistics.packing_list ? 'Created' : 'Pending'} size="small"
                        sx={{ bgcolor: logistics.packing_list ? '#ECFDF5' : '#F8FAFC',
                          color: logistics.packing_list ? '#059669' : '#94A3B8',
                          fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={project.status === 'inspected' ? 'Ready' : project.status === 'shipped' ? 'Shipped' : 'Delivered'} size="small"
                        sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22,
                          bgcolor: project.status === 'shipped' ? '#ECFEFF' : project.status === 'inspected' ? '#FFFBEB' : '#ECFDF5',
                          color: project.status === 'shipped' ? '#0891B2' : project.status === 'inspected' ? '#D97706' : '#059669' }} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No shipments found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
