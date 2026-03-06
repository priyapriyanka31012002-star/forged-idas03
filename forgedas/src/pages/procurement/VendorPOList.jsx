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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const VPO_STATUS = {
  draft: { label: 'Draft', color: '#64748B', bg: '#F8FAFC' },
  sent: { label: 'Sent', color: '#3B82F6', bg: '#F5F3FF' },
  acknowledged: { label: 'Acknowledged', color: '#D97706', bg: '#FFFBEB' },
  received: { label: 'Received', color: '#059669', bg: '#ECFDF5' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2' },
};

export default function VendorPOList() {
  const { vendorPOs, getVendorName, projects } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const getProjectName = (pid) => projects.find(p => p.id === pid)?.project_name || 'Unknown';

  const filtered = vendorPOs.filter(vpo =>
    vpo.po_number.toLowerCase().includes(search.toLowerCase()) ||
    getVendorName(vpo.vendor_id).toLowerCase().includes(search.toLowerCase()) ||
    getProjectName(vpo.project_id).toLowerCase().includes(search.toLowerCase())
  );

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };
  const totalValue = vendorPOs.reduce((s, v) => s + (v.total_amount || 0), 0);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <ShoppingCartIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Vendor Purchase Orders</Typography>
        <Chip label={`${vendorPOs.length} POs`} size="small"
          sx={{ bgcolor: '#ECFEFF', color: '#0891B2', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Draft', count: vendorPOs.filter(v => v.status === 'draft').length, color: '#64748B' },
          { label: 'Sent', count: vendorPOs.filter(v => v.status === 'sent').length, color: '#3B82F6' },
          { label: 'Received', count: vendorPOs.filter(v => v.status === 'received').length, color: '#059669' },
          { label: 'Total Value', count: `$${Math.round(totalValue / 1000)}K`, color: '#7C3AED' },
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

      <TextField size="small" placeholder="Search vendor POs..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['PO #', 'Vendor', 'Project', 'Items', 'Amount', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(vpo => {
                const ss = VPO_STATUS[vpo.status] || { label: vpo.status, color: '#999', bg: '#eee' };
                return (
                  <TableRow key={vpo.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                    onClick={() => navigate(`/projects/${vpo.project_id}`)}>
                    <TableCell sx={{ py: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha('#0891B2', 0.08), color: '#0891B2' }}>
                          <ShoppingCartIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{vpo.po_number}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getVendorName(vpo.vendor_id)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getProjectName(vpo.project_id)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{(vpo.items || []).length}</Typography></TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}>${(vpo.total_amount || 0).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={ss.label} size="small"
                        sx={{ bgcolor: ss.bg, color: ss.color, fontWeight: 600, fontSize: '0.65rem', height: 22, border: `1px solid ${alpha(ss.color, 0.15)}` }} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No vendor POs found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
