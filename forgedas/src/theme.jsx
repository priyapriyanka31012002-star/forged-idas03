import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#714CF7',
      light: '#8B6FF8',
      dark: '#5B35E0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#475569',
      light: '#64748B',
      dark: '#334155',
    },
    background: {
      default: '#F1F4F9',
      paper: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#D1FAE5',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    error: {
      main: '#EF4444',
      light: '#FEE2E2',
    },
    info: {
      main: '#06B6D4',
      light: '#CFFAFE',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: '#E8ECF1',
    action: {
      hover: 'rgba(113, 76, 247, 0.04)',
      selected: 'rgba(113, 76, 247, 0.08)',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.875rem' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em', fontSize: '1.5rem' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600, fontSize: '0.938rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4, color: '#64748B' },
    overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 1px 4px rgba(0,0,0,0.06)',
    '0 4px 12px rgba(0,0,0,0.05)',
    '0 8px 24px rgba(0,0,0,0.06)',
    '0 16px 40px rgba(0,0,0,0.08)',
    ...Array(19).fill('0 20px 48px rgba(0,0,0,0.08)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(135deg, #F1F4F9 0%, #E8ECF4 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          fontSize: '0.8125rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
          '&:active': { transform: 'scale(0.98)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #714CF7 0%, #5B35E0 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #8B6FF8 0%, #714CF7 100%)', boxShadow: '0 4px 14px rgba(113,76,247,0.35)' },
        },
        outlined: {
          borderColor: '#D6DAE3',
          color: '#475569',
          '&:hover': { borderColor: '#714CF7', color: '#714CF7', bgcolor: 'rgba(113,76,247,0.04)' },
        },
        sizeSmall: { fontSize: '0.75rem', padding: '6px 14px', borderRadius: 8 },
        sizeLarge: { fontSize: '0.875rem', padding: '10px 24px' },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #E8ECF1',
          backgroundImage: 'none',
          transition: 'all 0.25s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
          borderRadius: 8,
        },
        sizeSmall: { height: 24, fontSize: '0.6875rem' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            fontSize: '0.8125rem',
            transition: 'all 0.2s ease',
            backgroundColor: '#FAFBFC',
            '& fieldset': { borderColor: '#E2E8F0', transition: 'border-color 0.2s' },
            '&:hover fieldset': { borderColor: '#B0BACE' },
            '&.Mui-focused fieldset': { borderColor: '#714CF7', borderWidth: '1.5px' },
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(113,76,247,0.08)', backgroundColor: '#fff' },
          },
          '& .MuiInputLabel-root': { fontSize: '0.8125rem' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#714CF7' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#F0F2F6',
          fontSize: '0.8125rem',
        },
        head: {
          fontWeight: 600,
          color: '#64748B',
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          backgroundColor: '#F7F8FB',
          borderBottom: '1px solid #E8ECF1',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 18, border: '1px solid #E8ECF1' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8125rem',
          minHeight: 44,
          '&.Mui-selected': { fontWeight: 600 },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 2.5, borderRadius: 2, backgroundColor: '#714CF7' },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid #E8ECF1',
          borderRadius: '14px !important',
          '&:before': { display: 'none' },
          boxShadow: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontSize: '0.8125rem' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#F0F2F6' },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.72rem' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 6,
          backgroundColor: '#EEF0F5',
        },
        bar: { borderRadius: 6 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
