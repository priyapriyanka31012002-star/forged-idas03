import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip, Stack, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, IconButton, InputAdornment, alpha, Divider, Avatar, Tooltip,
  Select, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: '#64748B', bg: '#F8FAFC' },
  estimated: { label: 'Estimated', color: '#3B82F6', bg: '#F5F3FF' },
  quoted: { label: 'Quoted', color: '#D97706', bg: '#FFFBEB' },
  order_confirmed: { label: 'Confirmed', color: '#7C3AED', bg: '#F5F3FF' },
  in_production: { label: 'In Production', color: '#714CF7', bg: '#F0F9FF' },
  inspected: { label: 'Inspected', color: '#059669', bg: '#ECFDF5' },
  shipped: { label: 'Shipped', color: '#059669', bg: '#F0FDF4' },
  closed: { label: 'Closed', color: '#475569', bg: '#F8FAFC' },
};

const STATUS_ORDER = ['draft', 'estimated', 'quoted', 'order_confirmed', 'in_production', 'inspected', 'shipped', 'closed'];

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function Projects() {
  const { projects, clients, companies, addProject, getClientName, getCompanyName } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortField, setSortField] = useState('updated_at');
  const [sortDir, setSortDir] = useState('desc');
  const [form, setForm] = useState({ project_name: '', client_id: '', company_id: '', prepared_by: '', revision: 'R1', category: '', description: '' });

  const filtered = useMemo(() => {
    let fp = projects.filter(p => {
      const matchSearch = p.project_name.toLowerCase().includes(search.toLowerCase()) ||
        getClientName(p.client_id).toLowerCase().includes(search.toLowerCase()) ||
        (p.project_code || '').toLowerCase().includes(search.toLowerCase()) ||
        getCompanyName(p.company_id).toLowerCase().includes(search.toLowerCase()) ||
        (p.manager || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchCompany = companyFilter === 'all' || p.company_id === Number(companyFilter);
      return matchSearch && matchStatus && matchCompany;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    fp.sort((a, b) => {
      if (sortField === 'project_name') return dir * a.project_name.localeCompare(b.project_name);
      if (sortField === 'status') return dir * (a.status || '').localeCompare(b.status || '');
      if (sortField === 'value') return dir * ((a.estimate?.final_price || 0) - (b.estimate?.final_price || 0));
      if (sortField === 'updated_at') return dir * (a.updated_at || '').localeCompare(b.updated_at || '');
      return 0;
    });
    return fp;
  }, [projects, search, filterStatus, companyFilter, sortField, sortDir, getClientName, getCompanyName]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortHeader = ({ field, children, ...props }) => (
    <TableCell onClick={() => toggleSort(field)} {...props}
      sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, cursor: 'pointer', userSelect: 'none', borderColor: '#EEF2F6',
        '&:hover': { color: '#334155' }, ...props.sx }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <span>{children}</span>
        {sortField === field ? (sortDir === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: 13 }} /> : <ArrowDownwardIcon sx={{ fontSize: 13 }} />) : <SortIcon sx={{ fontSize: 13, opacity: 0.3 }} />}
      </Stack>
    </TableCell>
  );

  const handleCreate = () => {
    if (!form.project_name || !form.client_id || !form.company_id) return;
    addProject({ ...form, client_id: Number(form.client_id), company_id: Number(form.company_id) });
    setForm({ project_name: '', client_id: '', company_id: '', prepared_by: '', revision: 'R1', category: '', description: '' });
    setOpen(false);
  };

  // Status counts
  const statusCounts = projects.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {});

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FolderIcon sx={{ fontSize: 20, color: '#64748B' }} />
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Projects</Typography>
          <Chip label={`${projects.length} total`} size="small"
            sx={{ bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
        </Stack>
        <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
          New Project
        </Button>
      </Stack>

      {/* Filters Row */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Search projects, clients, managers..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94A3B8' }} /></InputAdornment> }}
          sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.78rem' } }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} displayEmpty
            sx={{ borderRadius: 2, fontSize: '0.78rem' }}>
            <MenuItem value="all">All Companies</MenuItem>
            {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.company_name}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {/* Status filter chips */}
      <Stack direction="row" spacing={0.75} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
        <Chip label={`All (${projects.length})`} size="small" onClick={() => setFilterStatus('all')}
          sx={{ fontWeight: 600, fontSize: '0.68rem', height: 24,
            bgcolor: filterStatus === 'all' ? '#714CF7' : '#F8FAFC',
            color: filterStatus === 'all' ? '#fff' : '#64748B',
            border: `1px solid ${filterStatus === 'all' ? '#714CF7' : '#E2E8F0'}`,
            cursor: 'pointer', '&:hover': { bgcolor: filterStatus === 'all' ? '#5B35E0' : '#F1F5F9' },
          }} />
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = statusCounts[key] || 0;
          if (count === 0) return null;
          return (
            <Chip key={key} label={`${cfg.label} (${count})`} size="small" onClick={() => setFilterStatus(key)}
              sx={{ fontWeight: 600, fontSize: '0.68rem', height: 24,
                bgcolor: filterStatus === key ? cfg.color : cfg.bg,
                color: filterStatus === key ? '#fff' : cfg.color,
                border: `1px solid ${filterStatus === key ? cfg.color : alpha(cfg.color, 0.15)}`,
                cursor: 'pointer', '&:hover': { bgcolor: filterStatus === key ? cfg.color : alpha(cfg.color, 0.12) },
              }} />
          );
        })}
      </Stack>

      {/* Projects Table */}
      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#FAFBFC' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6', width: 100 }}>Project ID</TableCell>
                <SortHeader field="project_name">Project</SortHeader>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>Manager</TableCell>
                <SortHeader field="status">Status</SortHeader>
                <SortHeader field="value">Value</SortHeader>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#64748B', py: 1.25, borderColor: '#EEF2F6' }}>Progress</TableCell>
                <SortHeader field="updated_at">Updated</SortHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((project) => {
                const sc = STATUS_CONFIG[project.status] || { label: project.status, color: '#999', bg: '#eee' };
                const statusIdx = STATUS_ORDER.indexOf(project.status);
                const progress = Math.round(((statusIdx + 1) / STATUS_ORDER.length) * 100);
                return (
                  <TableRow key={project.id} hover onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#714CF7', fontFamily: 'monospace' }}>
                        {project.project_code || `PRJ-${project.id}`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>{project.project_name}</Typography>
                      {project.category && <Typography sx={{ fontSize: '0.6rem', color: '#94A3B8' }}>{project.category}</Typography>}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Chip label={getCompanyName(project.company_id)?.split(' ').slice(0, 2).join(' ') || '—'} size="small"
                        sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.6rem', height: 20 }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{getClientName(project.client_id)}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.55rem', bgcolor: alpha('#714CF7', 0.08), color: '#714CF7' }}>
                          {(project.manager || '?').charAt(0)}
                        </Avatar>
                        <Typography sx={{ fontSize: '0.72rem', color: '#475569' }}>{project.manager || 'Unassigned'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Chip label={sc.label} size="small"
                        sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.6rem', height: 20, border: `1px solid ${alpha(sc.color, 0.15)}` }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                        {project.estimate?.final_price > 0 ? `$${project.estimate.final_price.toLocaleString()}` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6', minWidth: 100 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LinearProgress variant="determinate" value={progress}
                          sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: '#EEF2F6',
                            '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: sc.color } }} />
                        <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#94A3B8', minWidth: 28 }}>{progress}%</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, borderColor: '#EEF2F6' }}>
                      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{project.updated_at}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {filtered.length === 0 && (
        <Card elevation={0} sx={{ ...cardSx, textAlign: 'center', py: 6, mt: 2 }}>
          <FolderIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 1 }} />
          <Typography sx={{ fontSize: '0.88rem', color: '#64748B' }}>
            {search || filterStatus !== 'all' ? 'No matching projects found' : 'No projects yet'}
          </Typography>
        </Card>
      )}

      {/* New Project Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '0.95rem', py: 2, borderBottom: '1px solid #E2E8F0' }}>Create New Project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Project Name" fullWidth size="small" required
              value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} />
            <TextField select label="Company" fullWidth size="small" required
              value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })}>
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.company_name}</MenuItem>)}
            </TextField>
            <TextField select label="Client" fullWidth size="small" required
              value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
              {clients.map(c => <MenuItem key={c.id} value={c.id}>{c.client_name}</MenuItem>)}
            </TextField>
            <TextField select label="Category" fullWidth size="small"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <MenuItem value="Forged Components">Forged Components</MenuItem>
              <MenuItem value="Precision Machining">Precision Machining</MenuItem>
              <MenuItem value="Pipeline Fittings">Pipeline Fittings</MenuItem>
              <MenuItem value="Valve Components">Valve Components</MenuItem>
              <MenuItem value="Structural Fabrication">Structural Fabrication</MenuItem>
              <MenuItem value="General Manufacturing">General Manufacturing</MenuItem>
            </TextField>
            <TextField label="Description" fullWidth size="small" multiline rows={2}
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief project description..." />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Prepared By" fullWidth size="small"
                  value={form.prepared_by} onChange={(e) => setForm({ ...form, prepared_by: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Revision" fullWidth size="small"
                  value={form.revision} onChange={(e) => setForm({ ...form, revision: e.target.value })} />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpen(false)} color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
