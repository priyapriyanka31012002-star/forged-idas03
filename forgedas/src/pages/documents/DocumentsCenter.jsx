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
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const DOC_TYPE_CONFIG = {
  estimate: { label: 'Estimate', color: '#3B82F6' },
  quotation: { label: 'Quotation', color: '#D97706' },
  purchase_order: { label: 'Purchase Order', color: '#7C3AED' },
  work_order: { label: 'Work Order', color: '#714CF7' },
  inspection: { label: 'Inspection Report', color: '#059669' },
  coc: { label: 'Certificate of Conformance', color: '#059669' },
  packing_list: { label: 'Packing List', color: '#0891B2' },
  mtr: { label: 'Material Test Report', color: '#64748B' },
};

export default function DocumentsCenter() {
  const { projects } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Collect all documents from all projects
  const allDocs = [];
  projects.forEach(project => {
    if (project.documents) {
      project.documents.forEach(doc => {
        allDocs.push({ ...doc, project_id: project.id, project_name: project.project_name });
      });
    }
    // Also add auto-generated docs based on project status
    if (project.estimate?.final_price > 0) {
      allDocs.push({
        id: `est-${project.id}`, type: 'estimate', name: `Estimate - ${project.project_name}`,
        version: project.revision, status: 'approved', project_id: project.id, project_name: project.project_name,
      });
    }
    if (project.quotation?.validity_date) {
      allDocs.push({
        id: `quo-${project.id}`, type: 'quotation', name: `Quotation - ${project.project_name}`,
        version: project.revision, status: 'sent', project_id: project.id, project_name: project.project_name,
      });
    }
    if (project.quality?.coc_generated) {
      allDocs.push({
        id: `coc-${project.id}`, type: 'coc', name: `CoC - ${project.project_name}`,
        version: '1', status: 'generated', project_id: project.id, project_name: project.project_name,
      });
    }
  });

  const filtered = allDocs.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.project_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.type?.toLowerCase().includes(search.toLowerCase())
  );

  const cardSx = { border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <DescriptionIcon sx={{ fontSize: 20, color: '#64748B' }} />
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Document Center</Typography>
        <Chip label={`${allDocs.length} documents`} size="small"
          sx={{ bgcolor: '#F8FAFC', color: '#64748B', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
        {[
          { label: 'Estimates', count: allDocs.filter(d => d.type === 'estimate').length, color: '#3B82F6' },
          { label: 'Quotations', count: allDocs.filter(d => d.type === 'quotation').length, color: '#D97706' },
          { label: 'Certificates', count: allDocs.filter(d => d.type === 'coc').length, color: '#059669' },
          { label: 'Total Docs', count: allDocs.length, color: '#64748B' },
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

      <TextField size="small" placeholder="Search documents..." fullWidth value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} /></InputAdornment> }} />

      <Card elevation={0} sx={cardSx}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Document', 'Type', 'Project', 'Version', 'Status', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.72rem', py: 1.25, bgcolor: '#FAFBFC', borderColor: '#E2E8F0' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((doc, idx) => {
                const tc = DOC_TYPE_CONFIG[doc.type] || { label: doc.type, color: '#64748B' };
                return (
                  <TableRow key={doc.id || idx} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FAFBFC' } }}
                    onClick={() => navigate(`/projects/${doc.project_id}`)}>
                    <TableCell sx={{ py: 1.25 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(tc.color, 0.08), color: tc.color }}>
                          <PictureAsPdfIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>{doc.name || 'Untitled'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={tc.label} size="small"
                        sx={{ bgcolor: alpha(tc.color, 0.08), color: tc.color, fontWeight: 600, fontSize: '0.65rem', height: 22 }} />
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{doc.project_name}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>v{doc.version || '1'}</Typography></TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'capitalize' }}>{doc.status || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#CBD5E1' }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>No documents found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
