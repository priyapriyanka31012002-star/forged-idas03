import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Box, Typography, Button, Card, CardContent, Grid, Stack, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, InputAdornment, alpha, Avatar, Chip, MenuItem, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function Vendors() {
  const { vendors, addVendor } = useData();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ vendor_name: '', address: '', contact_person: '', contact_email: '', contact_phone: '', specialization: '', rating: '', lead_time_days: '', payment_terms: '' });

  const filtered = vendors.filter(v =>
    v.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
    v.contact_person.toLowerCase().includes(search.toLowerCase()) ||
    (v.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.vendor_name) return;
    addVendor({ ...form, rating: form.rating ? Number(form.rating) : undefined, lead_time_days: form.lead_time_days ? Number(form.lead_time_days) : undefined });
    setForm({ vendor_name: '', address: '', contact_person: '', contact_email: '', contact_phone: '', specialization: '', rating: '', lead_time_days: '', payment_terms: '' });
    setOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <StorefrontIcon sx={{ fontSize: 20, color: '#64748B' }} />
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Vendors</Typography>
          <Chip label={`${vendors.length} total`} size="small"
            sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
        </Stack>
        <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
          Add Vendor
        </Button>
      </Stack>

      <TextField
        size="small" placeholder="Search vendors..."
        sx={{ mb: 2.5, minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        value={search} onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94A3B8' }} /></InputAdornment> }}
      />

      <Grid container spacing={2}>
        {filtered.map((vendor) => (
          <Grid item xs={12} sm={6} lg={4} key={vendor.id}>
            <Card elevation={0} sx={{
              ...cardSx, height: '100%', transition: 'all 0.25s',
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' },
            }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: alpha('#7C3AED', 0.08), color: '#7C3AED', fontSize: '0.82rem', fontWeight: 700 }}>
                    {vendor.vendor_name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{vendor.vendor_name}</Typography>
                    {vendor.rating != null && (
                      <Stack direction="row" alignItems="center" spacing={0.25} sx={{ mt: 0.25 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <StarIcon key={s} sx={{ fontSize: 12, color: s <= vendor.rating ? '#D97706' : '#E2E8F0' }} />
                        ))}
                        <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8', ml: 0.5 }}>{vendor.rating}/5</Typography>
                      </Stack>
                    )}
                  </Box>
                </Stack>

                {vendor.specialization && (
                  <Chip label={vendor.specialization} size="small"
                    sx={{ mb: 1.5, bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
                )}

                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{vendor.contact_person}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: '#714CF7' }}>{vendor.contact_email}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{vendor.contact_phone}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{vendor.address}</Typography>
                  </Stack>
                </Stack>

                {(vendor.lead_time_days || vendor.payment_terms) && (
                  <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                    <Stack direction="row" justifyContent="space-between">
                      {vendor.lead_time_days && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <AccessTimeIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                          <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{vendor.lead_time_days} days lead</Typography>
                        </Stack>
                      )}
                      {vendor.payment_terms && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <PaymentIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                          <Typography sx={{ fontSize: '0.68rem', color: '#64748B' }}>{vendor.payment_terms}</Typography>
                        </Stack>
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
        <DialogTitle sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2, borderBottom: '1px solid #E2E8F0' }}>Add New Vendor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Vendor Name" fullWidth size="small" required
              value={form.vendor_name} onChange={(e) => setForm({ ...form, vendor_name: e.target.value })} />
            <TextField label="Specialization" fullWidth size="small" placeholder="e.g. CNC Machining, Raw Material Supply"
              value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            <TextField label="Address" fullWidth size="small"
              value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Divider sx={{ my: 0.5 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Contact Person" fullWidth size="small"
                  value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Contact Email" fullWidth size="small" type="email"
                  value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Contact Phone" fullWidth size="small"
                  value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
              </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField label="Rating (1-5)" fullWidth size="small" type="number"
                  inputProps={{ min: 1, max: 5, step: 0.1 }}
                  value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Lead Time (days)" fullWidth size="small" type="number"
                  inputProps={{ min: 1 }}
                  value={form.lead_time_days} onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Payment Terms" fullWidth size="small" select
                  value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })}>
                  <MenuItem value="Net 30">Net 30</MenuItem>
                  <MenuItem value="Net 45">Net 45</MenuItem>
                  <MenuItem value="Net 60">Net 60</MenuItem>
                  <MenuItem value="Advance">Advance</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpen(false)} color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Add Vendor</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
