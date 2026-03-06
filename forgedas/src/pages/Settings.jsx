import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Stack, Avatar, Chip, Divider, alpha,
  Table, TableBody, TableRow, TableCell,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';

const ROLE_COLORS = {
  admin: '#714CF7', engineer: '#16A34A', sales: '#D97706',
  production: '#714CF7', quality: '#7C3AED', logistics: '#DC2626',
};

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const SYSTEM_INFO = [
  { label: 'Application', value: 'FORGEDAS v2.0 — Multi-Company' },
  { label: 'Architecture', value: 'React SPA + REST API' },
  { label: 'Database', value: 'PostgreSQL (multi-tenant)' },
  { label: 'Authentication', value: 'JWT + Role-based Access' },
  { label: 'Deployment', value: 'Multi-company, Multi-site' },
];

export default function Settings() {
  const { user } = useAuth();
  const { companies } = useData();
  const roleColor = ROLE_COLORS[user?.role] || '#666';

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <SettingsIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Settings</Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {/* Profile */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ ...cardSx, overflow: 'hidden' }}>
            <Box sx={{ height: 4, bgcolor: roleColor }} />
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                <BadgeIcon sx={{ fontSize: 17, color: '#64748B' }} />
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Profile
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: alpha(roleColor, 0.04) }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(roleColor, 0.12), color: roleColor, fontSize: '1.4rem', fontWeight: 700 }}>
                  {user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{user?.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>{user?.email}</Typography>
                  <Chip label={user?.role?.toUpperCase()} size="small"
                    sx={{ bgcolor: alpha(roleColor, 0.1), color: roleColor, fontWeight: 700, fontSize: '0.62rem', height: 20, letterSpacing: '0.04em' }} />
                </Box>
              </Stack>

              <Stack spacing={1.5}>
                <TextField label="Name" fullWidth size="small" value={user?.name || ''} disabled
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                <TextField label="Email" fullWidth size="small" value={user?.email || ''} disabled
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                <TextField label="Role" fullWidth size="small" value={user?.role || ''} disabled
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* System Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ ...cardSx, overflow: 'hidden' }}>
            <Box sx={{ height: 4, bgcolor: '#64748B' }} />
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                <InfoOutlinedIcon sx={{ fontSize: 17, color: '#64748B' }} />
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  System Information
                </Typography>
              </Stack>

              <Table size="small">
                <TableBody>
                  {SYSTEM_INFO.map((row) => (
                    <TableRow key={row.label} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ py: 1.2, pl: 0, borderColor: '#F1F5F9', fontWeight: 600, fontSize: '0.78rem', color: '#475569', width: 140 }}>
                        {row.label}
                      </TableCell>
                      <TableCell sx={{ py: 1.2, borderColor: '#F1F5F9', fontSize: '0.78rem', color: '#0F172A' }}>
                        {row.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2, borderColor: '#F1F5F9' }} />

              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FAFBFC' }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', mb: 0.5 }}>
                  ForgeIDAS — Multi-Company Manufacturing ERP
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Multi-company, multi-site manufacturing lifecycle management with full project tracking from estimation through production to shipment.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Registered Companies */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ ...cardSx, overflow: 'hidden' }}>
            <Box sx={{ height: 4, bgcolor: '#714CF7' }} />
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                <BusinessIcon sx={{ fontSize: 17, color: '#714CF7' }} />
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Registered Companies
                </Typography>
                <Chip label={`${companies.length} active`} size="small" sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
              </Stack>
              <Grid container spacing={2}>
                {companies.map(c => (
                  <Grid item xs={12} sm={6} md={4} key={c.id}>
                    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #E2E8F0', bgcolor: '#FAFBFC' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#714CF7', 0.08), color: '#714CF7', fontSize: '0.72rem', fontWeight: 700 }}>
                          {c.short_code}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{c.company_name}</Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>{c.registration_number}</Typography>
                        </Box>
                      </Stack>
                      <Stack spacing={0.5} sx={{ ml: 5.5 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PublicIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                          <Typography sx={{ fontSize: '0.72rem', color: '#64748B' }}>{c.country} • {c.currency}</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>{c.address}</Typography>
                        {c.gst_number && <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>GST: {c.gst_number}</Typography>}
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
