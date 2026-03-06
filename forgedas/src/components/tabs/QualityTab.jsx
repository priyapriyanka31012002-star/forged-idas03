import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Button, Stack, Alert, alpha, Chip, LinearProgress,
  FormControlLabel, Checkbox, Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VerifiedIcon from '@mui/icons-material/Verified';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const INSPECTIONS = [
  { key: 'dimensional', label: 'Dimensional Verification', desc: 'Verify all critical dimensions per drawing', icon: '📐' },
  { key: 'visual', label: 'Visual Inspection', desc: 'Surface finish, weld quality, marking', icon: '👁️' },
  { key: 'hardness', label: 'Hardness Testing', desc: 'Brinell / Rockwell hardness per spec', icon: '🔨' },
  { key: 'ndt', label: 'NDT (Non-Destructive Testing)', desc: 'UT, MT, PT, RT as applicable', icon: '🔬' },
  { key: 'pressure', label: 'Pressure / Hydrotest', desc: 'Hydrostatic or pneumatic test per code', icon: '💧' },
  { key: 'mtr', label: 'MTR (Material Test Report)', desc: 'Verify material certificates and traceability', icon: '📋' },
];

const cardSx = {
  border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function QualityTab({ project, updateProject }) {
  const [checks, setChecks] = useState(project.quality || {});
  const [uploads, setUploads] = useState({});
  const isInspected = ['inspected', 'shipped', 'closed'].includes(project.status);

  const checkedCount = INSPECTIONS.filter(i => checks[i.key]).length;
  const allChecked = checkedCount === INSPECTIONS.length;
  const progressPct = Math.round((checkedCount / INSPECTIONS.length) * 100);

  const handleCheck = (key) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = () => {
    updateProject(project.id, {
      status: 'inspected',
      quality: checks,
      documents: [
        ...(project.documents || []),
        {
          id: Date.now(),
          document_type: 'coc',
          version: 1,
          status: 'final',
          generated_by: 'Current User',
          generated_at: new Date().toISOString().split('T')[0],
        },
      ],
    });
  };

  return (
    <Box>
      {isInspected && (
        <Alert severity="success" icon={<VerifiedIcon />}
          sx={{ mb: 3, borderRadius: 2.5, border: '1px solid #BBF7D0', bgcolor: '#F0FDF4',
            '& .MuiAlert-icon': { color: '#059669' } }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#14532D' }}>
            Quality inspection completed — Certificate of Compliance generated
          </Typography>
        </Alert>
      )}

      {/* Progress header */}
      <Card elevation={0} sx={{ ...cardSx, mb: 2.5 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <VerifiedIcon sx={{ fontSize: 16, color: '#64748B' }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Inspection Checklist</Typography>
              <Chip label={`${checkedCount}/${INSPECTIONS.length}`} size="small"
                sx={{ bgcolor: allChecked ? '#F0FDF4' : '#F5F3FF', color: allChecked ? '#059669' : '#714CF7', fontWeight: 600, fontSize: '0.62rem', height: 20 }} />
            </Stack>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: allChecked ? '#059669' : '#64748B' }}>
              {progressPct}% complete
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={progressPct}
            sx={{ height: 5, borderRadius: 3, bgcolor: '#E2E8F0',
              '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: allChecked ? '#059669' : '#714CF7' } }} />
        </CardContent>
      </Card>

      {/* Inspection Cards */}
      <Grid container spacing={2}>
        {INSPECTIONS.map((item) => {
          const checked = !!checks[item.key];
          return (
            <Grid item xs={12} sm={6} key={item.key}>
              <Card elevation={0} sx={{
                ...cardSx,
                bgcolor: checked ? alpha('#059669', 0.02) : '#fff',
                borderColor: checked ? '#BBF7D0' : '#E2E8F0',
                transition: 'all 0.2s',
              }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={checked} onChange={() => handleCheck(item.key)}
                        disabled={isInspected}
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#059669' } }} />
                    }
                    label={
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Typography sx={{ fontSize: '0.82rem' }}>{item.icon}</Typography>
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: checked ? '#059669' : '#1E293B' }}>
                            {item.label}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B', ml: 3.25 }}>{item.desc}</Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', mx: 0 }}
                  />
                  {!isInspected && (
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1, ml: 4 }}>
                      <Button size="small" startIcon={<UploadFileIcon sx={{ fontSize: 14 }} />}
                        component="label" variant="text"
                        sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>
                        Upload Report
                        <input type="file" hidden onChange={(e) => setUploads({ ...uploads, [item.key]: e.target.files[0] })} />
                      </Button>
                      {uploads[item.key] && (
                        <Chip label={uploads[item.key].name} size="small"
                          sx={{ bgcolor: '#F0FDF4', color: '#059669', fontSize: '0.62rem', fontWeight: 600, height: 20 }} />
                      )}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Actions */}
      {!isInspected && (
        <Card elevation={0} sx={{ ...cardSx, mt: 2.5 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="center">
              {!allChecked && (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <WarningAmberIcon sx={{ fontSize: 14, color: '#D97706' }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#D97706' }}>
                    Complete all inspections to generate CoC
                  </Typography>
                </Stack>
              )}
              {allChecked && <Box />}
              <Stack direction="row" spacing={1.5}>
                <Button variant="outlined" startIcon={<SaveIcon sx={{ fontSize: 14 }} />}
                  onClick={() => updateProject(project.id, { quality: checks })}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
                  Save Progress
                </Button>
                <Button variant="contained" color="success" startIcon={<PictureAsPdfIcon sx={{ fontSize: 14 }} />}
                  onClick={handleComplete} disabled={!allChecked}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>
                  Complete Inspection &amp; Generate CoC
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
