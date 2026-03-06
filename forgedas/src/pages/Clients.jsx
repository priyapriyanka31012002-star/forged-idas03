import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  Box, Typography, Button, Card, CardContent, Grid, Stack, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, InputAdornment, Chip, alpha, Avatar,
  MenuItem, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import FactoryIcon from '@mui/icons-material/Factory';
import FolderIcon from '@mui/icons-material/Folder';
import PaymentIcon from '@mui/icons-material/Payment';

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function Clients() {
  const { clients, projects, companies, addClient, getCompanyName } = useData();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ client_name: '', address: '', poc_name: '', poc_email: '', poc_phone: '', company_id: '', industry: '', payment_terms: '' });

  const filtered = clients.filter(c =>
    c.client_name.toLowerCase().includes(search.toLowerCase()) ||
    c.poc_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry || '').toLowerCase().includes(search.toLowerCase())
  );

  const getProjectCount = (clientId) => projects.filter(p => p.client_id === clientId).length;

  const handleCreate = () => {
    if (!form.client_name) return;
    addClient({ ...form, company_id: form.company_id ? Number(form.company_id) : undefined });
    setForm({ client_name: '', address: '', poc_name: '', poc_email: '', poc_phone: '', company_id: '', industry: '', payment_terms: '' });
    setOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PeopleIcon sx={{ fontSize: 20, color: '#64748B' }} />
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Clients</Typography>
          <Chip label={`${clients.length} total`} size="small"
            sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
        </Stack>
        <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
          Add Client
        </Button>
      </Stack>

      <TextField
        size="small" placeholder="Search clients..."
        sx={{ mb: 2.5, minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        value={search} onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94A3B8' }} /></InputAdornment> }}
      />

      <Grid container spacing={2}>
        {filtered.map((client) => (
          <Grid item xs={12} sm={6} lg={4} key={client.id}>
            <Card elevation={0} sx={{
              ...cardSx, height: '100%', transition: 'all 0.25s',
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' },
            }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: alpha('#714CF7', 0.08), color: '#714CF7', fontSize: '0.82rem', fontWeight: 700 }}>
                    {client.client_name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{client.client_name}</Typography>
                    <Stack direction="row" spacing={0.75} sx={{ mt: 0.25 }}>
                      {client.industry && (
                        <Chip label={client.industry} size="small"
                          sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontSize: '0.55rem', fontWeight: 600, height: 16 }} />
                      )}
                      <Chip label={`${getProjectCount(client.id)} projects`} size="small"
                        sx={{ bgcolor: '#F8FAFC', color: '#64748B', fontSize: '0.55rem', fontWeight: 600, height: 16 }} />
                    </Stack>
                  </Box>
                </Stack>

                <Stack spacing={0.75}>
                  {client.company_id && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 600 }}>{getCompanyName(client.company_id)}</Typography>
                    </Stack>
                  )}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonOutlineIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{client.poc_name}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: '#714CF7' }}>{client.poc_email}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{client.poc_phone}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{client.address}</Typography>
                  </Stack>
                </Stack>

                {(client.payment_terms || client.credit_limit) && (
                  <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                    <Stack direction="row" justifyContent="space-between">
                      {client.payment_terms && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <PaymentIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                          <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{client.payment_terms}</Typography>
                        </Stack>
                      )}
                      {client.credit_limit && (
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: '#059669' }}>
                          Limit: ${Number(client.credit_limit).toLocaleString()}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2, borderBottom: '1px solid #E2E8F0' }}>Add New Client</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Client Name" fullWidth size="small" required
              value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            <TextField select label="Company" fullWidth size="small"
              value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })}>
              <MenuItem value="">— None —</MenuItem>
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.company_name}</MenuItem>)}
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Industry" fullWidth size="small"
                  value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  placeholder="e.g., Oil & Gas" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Payment Terms" fullWidth size="small"
                  value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}
                  placeholder="e.g., Net 30" />
              </Grid>
            </Grid>
            <TextField label="Address" fullWidth size="small"
              value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Point of Contact Name" fullWidth size="small"
                  value={form.poc_name} onChange={(e) => setForm({ ...form, poc_name: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Contact Email" fullWidth size="small" type="email"
                  value={form.poc_email} onChange={(e) => setForm({ ...form, poc_email: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Contact Phone" fullWidth size="small"
                  value={form.poc_phone} onChange={(e) => setForm({ ...form, poc_phone: e.target.value })} />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpen(false)} color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Add Client</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
