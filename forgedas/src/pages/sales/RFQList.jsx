import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Box, Typography, Stack, Card, CardContent, Button, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, alpha, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const RFQ_STATUS = {
  open: { label: 'Open', color: '#3B82F6', bg: '#F5F3FF' },
  quoted: { label: 'Quoted', color: '#D97706', bg: '#FFFBEB' },
  won: { label: 'Won', color: '#059669', bg: '#ECFDF5' },
  lost: { label: 'Lost', color: '#EF4444', bg: '#FEF2F2' },
  cancelled: { label: 'Cancelled', color: '#64748B', bg: '#F8FAFC' },
};

export default function RFQList() {
  const { rfqs, clients, addRFQ, updateRFQ, getClientName } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ client_id: '', subject: '', description: '', due_date: '' });

  const filtered = rfqs.filter(r =>
    r.rfq_number.toLowerCase().includes(search.toLowerCase()) ||
    r.subject.toLowerCase().includes(search.toLowerCase()) ||
    getClientName(r.client_id).toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    addRFQ({
      rfq_number: `RFQ-${Date.now().toString().slice(-6)}`,
      ...form,
      status: 'open',
      created_at: new Date().toISOString().split('T')[0],
    });
    setOpenDialog(false);
    setForm({ client_id: '', subject: '', description: '', due_date: '' });
  };

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <RequestQuoteIcon sx={{ fontSize: 20, color: '#64748B' }} />
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Request for Quotations</Typography>
          <Chip label={`${rfqs.length} total`} size="small"
            sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
        </Stack>
        <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => setOpenDialog(true)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
          New RFQ
        </Button>
      </Stack>

      {/* Stats */}
      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Open', count: rfqs.filter(r => r.status === 'open').length, color: '#3B82F6' },
          { label: 'Quoted', count: rfqs.filter(r => r.status === 'quoted').length, color: '#D97706' },
          { label: 'Won', count: rfqs.filter(r => r.status === 'won').length, color: '#059669' },
          { label: 'Total', count: rfqs.length, color: '#64748B' },
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

      {/* Search */}
      <TextField size="small" placeholder="Search RFQs..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      {/* Table */}
      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['RFQ #', 'Client', 'Subject', 'Status', 'Date', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(rfq => {
                const ss = RFQ_STATUS[rfq.status] || { label: rfq.status, color: '#999', bg: '#eee' };
                return (
                  <TableRow key={rfq.id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                    onClick={() => rfq.project_id && navigate(`/projects/${rfq.project_id}`)}>
                    <TableCell sx={{ py: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(ss.color, 0.08), color: ss.color }}>
                          <RequestQuoteIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{rfq.rfq_number}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(rfq.client_id)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{rfq.subject}</Typography></TableCell>
                    <TableCell>
                      <Chip label={ss.label} size="small"
                        sx={{ bgcolor: ss.bg, color: ss.color, fontWeight: 600, fontSize: '0.65rem', height: 22, border: `1px solid ${alpha(ss.color, 0.15)}` }} />
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{rfq.created_at}</Typography></TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No RFQs found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2, borderBottom: '1px solid #E2E8F0' }}>New RFQ</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Client</InputLabel>
              <Select value={form.client_id} label="Client"
                onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}>
                {clients.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField size="small" label="Subject" fullWidth value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
            <TextField size="small" label="Description" multiline rows={3} fullWidth value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <TextField size="small" label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
              value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.client_id || !form.subject}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Create RFQ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
