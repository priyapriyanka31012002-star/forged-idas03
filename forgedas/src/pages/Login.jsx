import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, Stack, Divider, Chip,
  InputAdornment, IconButton,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const quickLogin = (email, password) => {
    const result = login(email, password);
    if (result.success) navigate('/');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      p: 2,
    }}>
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, opacity: 0.4,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.04) 0%, transparent 50%)',
      }} />

      <Card sx={{
        maxWidth: 420, width: '100%', position: 'relative', zIndex: 1,
        border: '1px solid #E2E8F0', borderRadius: 3,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { boxShadow: '0 12px 40px rgba(37,99,235,0.1)', transform: 'translateY(-2px)' },
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack alignItems="center" spacing={0.5} sx={{ mb: 4 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #714CF7 0%, #5B35E0 100%)', mb: 1,
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: 1 }}>FD</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="text.primary" letterSpacing={'-0.01em'}>
              Forge i-DAS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign In
            </Typography>
          </Stack>

          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth placeholder="Email address" type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth placeholder="Password" type={showPassword ? 'text' : 'password'} required
              value={password} onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth variant="contained" size="large" type="submit"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
              sx={{
                py: 1.4, borderRadius: 2, fontSize: '0.875rem', fontWeight: 600,
                background: 'linear-gradient(135deg, #714CF7 0%, #5B35E0 100%)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5B35E0 0%, #1E40AF 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
                },
                '&:active': { transform: 'scale(0.98)' },
              }}
            >
              Sign In
            </Button>
          </Box>

          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 2.5 }}>
            Contact administrator for account access
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="caption" sx={{ position: 'fixed', bottom: 16, left: 0, right: 0, textAlign: 'center', color: '#94A3B8' }}>
        Developed by Cholan Dynamics Private Limited
      </Typography>
    </Box>
  );
}
