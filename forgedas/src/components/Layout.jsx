import React, { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Box, Drawer, Typography, List, ListItemButton, ListItemIcon,
  ListItemText, IconButton, Avatar, Menu, MenuItem, Divider, Stack,
  useMediaQuery, useTheme, Collapse, Tooltip, Badge, InputBase, alpha, Button, Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BusinessIcon from '@mui/icons-material/Business';

const DRAWER_EXPANDED = 260;
const DRAWER_COLLAPSED = 68;

const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

const NAV_SECTIONS = [
  {
    items: [
      { label: 'Dashboard', path: '/', icon: <DashboardIcon fontSize="small" /> },
      { label: 'Projects', path: '/projects', icon: <FolderIcon fontSize="small" /> },
    ],
  },
  {
    title: 'Sales',
    icon: <ShoppingCartIcon fontSize="small" />,
    items: [
      { label: 'RFQ', path: '/sales/rfq', icon: <RequestQuoteIcon fontSize="small" /> },
      { label: 'Quotations', path: '/sales/quotations', icon: <ReceiptIcon fontSize="small" /> },
      { label: 'Client PO', path: '/sales/client-po', icon: <AssignmentIcon fontSize="small" /> },
    ],
  },
  {
    title: 'Procurement',
    icon: <StorefrontIcon fontSize="small" />,
    items: [
      { label: 'Vendors', path: '/procurement/vendors', icon: <StorefrontIcon fontSize="small" /> },
      { label: 'Vendor PO', path: '/procurement/vendor-po', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
    ],
  },
  {
    title: 'Inventory',
    icon: <InventoryIcon fontSize="small" />,
    items: [
      { label: 'Materials', path: '/inventory/materials', icon: <CategoryIcon fontSize="small" /> },
      { label: 'Stock', path: '/inventory/stock', icon: <WarehouseIcon fontSize="small" /> },
    ],
  },
  {
    items: [
      { label: 'Production', path: '/production', icon: <PrecisionManufacturingIcon fontSize="small" /> },
      { label: 'Quality', path: '/quality', icon: <VerifiedIcon fontSize="small" /> },
      { label: 'Logistics', path: '/logistics', icon: <LocalShippingIcon fontSize="small" /> },
    ],
  },
  {
    items: [
      { label: 'Documents', path: '/documents', icon: <DescriptionIcon fontSize="small" /> },
      { label: 'Analytics', path: '/analytics', icon: <BarChartIcon fontSize="small" /> },
    ],
  },
  {
    title: 'Admin',
    icon: <AdminPanelSettingsIcon fontSize="small" />,
    items: [
      { label: 'Users', path: '/admin/users', icon: <PeopleIcon fontSize="small" /> },
      { label: 'Security', path: '/admin/security', icon: <SecurityIcon fontSize="small" /> },
      { label: 'Settings', path: '/admin/settings', icon: <SettingsIcon fontSize="small" /> },
    ],
  },
];

function NavGroup({ section, collapsed, location, navigate }) {
  const [open, setOpen] = useState(true);
  const hasTitle = !!section.title;
  const isGroupActive = section.items.some(it =>
    it.path === '/' ? location.pathname === '/' : location.pathname.startsWith(it.path)
  );

  if (collapsed) {
    return section.items.map((item) => {
      const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
      return (
        <Tooltip key={item.path} title={item.label} placement="right" arrow>
          <ListItemButton
            onClick={() => navigate(item.path)}
            sx={{
              minHeight: 42, justifyContent: 'center', borderRadius: 2, mx: 0.75, mb: 0.25,
              bgcolor: isActive ? 'rgba(113,76,247,0.12)' : 'transparent',
              color: isActive ? '#714CF7' : '#64748B',
              '&:hover': { bgcolor: isActive ? 'rgba(113,76,247,0.15)' : 'rgba(0,0,0,0.04)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: isActive ? '#714CF7' : '#94A3B8' }}>
              {item.icon}
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      );
    });
  }

  if (!hasTitle) {
    return section.items.map((item) => {
      const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
      return (
        <ListItemButton
          key={item.path}
          onClick={() => navigate(item.path)}
          sx={{
            minHeight: 38, borderRadius: 2, mx: 1, mb: 0.3, py: 0.5,
            bgcolor: isActive ? 'rgba(113,76,247,0.1)' : 'transparent',
            color: isActive ? '#714CF7' : '#475569',
            position: 'relative',
            '&:hover': { bgcolor: isActive ? 'rgba(113,76,247,0.12)' : 'rgba(0,0,0,0.03)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: isActive ? '#714CF7' : '#94A3B8' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label}
            primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 500 }} />
          {isActive && <Box sx={{ width: 4, height: 20, borderRadius: 2, bgcolor: '#714CF7', position: 'absolute', right: 0 }} />}
        </ListItemButton>
      );
    });
  }

  return (
    <>
      <ListItemButton
        onClick={() => setOpen(!open)}
        sx={{
          minHeight: 34, borderRadius: 2, mx: 1, mb: 0.25, py: 0.4,
          color: isGroupActive ? '#714CF7' : '#64748B',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
        }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: isGroupActive ? '#714CF7' : '#94A3B8' }}>
          {section.icon}
        </ListItemIcon>
        <ListItemText primary={section.title}
          primaryTypographyProps={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isGroupActive ? '#714CF7' : '#94A3B8' }} />
        {open ? <ExpandLess sx={{ fontSize: 16, color: '#94A3B8' }} /> : <ExpandMore sx={{ fontSize: 16, color: '#94A3B8' }} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List disablePadding>
          {section.items.map((item) => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 34, borderRadius: 2, mx: 1, mb: 0.15, py: 0.3, pl: 5.5,
                  bgcolor: isActive ? 'rgba(113,76,247,0.1)' : 'transparent',
                  color: isActive ? '#714CF7' : '#475569',
                  position: 'relative',
                  '&:hover': { bgcolor: isActive ? 'rgba(113,76,247,0.12)' : 'rgba(0,0,0,0.03)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 28, color: isActive ? '#714CF7' : '#B0BEC5' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: isActive ? 600 : 400 }} />
                {isActive && <Box sx={{ width: 4, height: 18, borderRadius: 2, bgcolor: '#714CF7', position: 'absolute', right: 0 }} />}
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { companies } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [companyAnchor, setCompanyAnchor] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [createAnchor, setCreateAnchor] = useState(null);

  // Always use fixed sidebar width
  const drawerWidth = 260;

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const companyLabel = selectedCompany === 'all'
    ? 'All Companies'
    : companies.find(c => c.id === selectedCompany)?.short_code || 'All';

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', borderRight: '1px solid #E8ECF1' }}>
      {/* Logo Header */}
      <Box sx={{ px: collapsed ? 1 : 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight: 60, borderBottom: '1px solid #F0F2F6' }}>
        {!collapsed && (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #714CF7 0%, #5B35E0 100%)',
              boxShadow: '0 4px 12px rgba(113,76,247,0.3)',
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem', letterSpacing: 0.5 }}>FD</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E293B', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Forge i-DAS
              </Typography>
              <Typography sx={{ fontSize: '0.58rem', color: '#94A3B8', lineHeight: 1, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Manufacturing ERP
              </Typography>
            </Box>
          </Stack>
        )}
        {collapsed && (
          <Box sx={{
            width: 36, height: 36, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #714CF7 0%, #5B35E0 100%)', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(113,76,247,0.3)',
          }} onClick={() => navigate('/')}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>FD</Typography>
          </Box>
        )}
        {!isMobile && !collapsed && (
          <IconButton size="small" onClick={() => setCollapsed(true)} sx={{ color: '#94A3B8', '&:hover': { color: '#64748B', bgcolor: '#F5F3FF' } }}>
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1.5 }}>
        <List disablePadding>
          {NAV_SECTIONS.map((section, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <Divider sx={{ mx: 2, my: 0.75, borderColor: '#F0F2F6' }} />}
              <NavGroup section={section} collapsed={collapsed} location={location} navigate={handleNavClick} />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* User Footer */}
      <Box sx={{ borderTop: '1px solid #F0F2F6', p: collapsed ? 1 : 1.5 }}>
        {collapsed ? (
          <Tooltip title={user?.name} placement="right">
            <Avatar sx={{ width: 34, height: 34, fontSize: '0.72rem', fontWeight: 700, bgcolor: '#F5F3FF', color: '#714CF7', mx: 'auto', cursor: 'pointer',
              border: '2px solid #E9E2FD' }}
              onClick={(e) => setAnchorEl(e.currentTarget)}>
              {user?.name?.charAt(0)}
            </Avatar>
          </Tooltip>
        ) : (
          <Stack direction="row" spacing={1.25} alignItems="center"
            sx={{ px: 1, py: 0.75, cursor: 'pointer', borderRadius: 2, '&:hover': { bgcolor: '#F7F8FB' } }}
            onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, fontSize: '0.72rem', fontWeight: 700, bgcolor: '#F5F3FF', color: '#714CF7',
              border: '2px solid #E9E2FD' }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </Typography>
              <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', textTransform: 'capitalize' }}>
                {user?.role}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
          </Stack>
        )}
      </Box>
    </Box>
  );

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {isMobile ? (
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_EXPANDED, border: 'none' } }}>
            {drawerContent}
          </Drawer>
        ) : (
          <Box sx={{ width: drawerWidth, flexShrink: 0, transition: 'width 0.25s ease' }}>
            <Box sx={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: drawerWidth, transition: 'width 0.25s ease', zIndex: 1200 }}>
              {drawerContent}
            </Box>
          </Box>
        )}

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top Header Bar */}
          <Box sx={{
            height: 60, display: 'flex', alignItems: 'center', px: 4, gap: 1.5,
            bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #E8ECF1', position: 'sticky', top: 0, zIndex: 1100,
            maxWidth: 1440, mx: 'auto', width: '100%'
          }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#64748B' }}>
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {!isMobile && collapsed && (
              <IconButton onClick={() => setCollapsed(false)} sx={{ color: '#64748B' }}>
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}

            {/* Search Bar */}
            <Box sx={{
              display: 'flex', alignItems: 'center', bgcolor: '#F4F6FA', borderRadius: 2.5, px: 1.5, py: 0.6,
              border: '1px solid transparent', maxWidth: 380, flex: 1,
              '&:focus-within': { borderColor: '#714CF7', bgcolor: '#fff', boxShadow: '0 0 0 3px rgba(113,76,247,0.08)' },
            }}>
              <SearchIcon sx={{ fontSize: 18, color: '#94A3B8', mr: 1 }} />
              <InputBase placeholder="Search projects, orders, clients..." sx={{ fontSize: '0.8rem', flex: 1 }} />
              <Typography sx={{ fontSize: '0.58rem', color: '#B0BACE', bgcolor: '#E8ECF1', px: 0.75, py: 0.2, borderRadius: 1, fontWeight: 600, ml: 1 }}>
                Ctrl+K
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Company Switcher */}
            <Button
              size="small"
              onClick={(e) => setCompanyAnchor(e.currentTarget)}
              startIcon={<BusinessIcon sx={{ fontSize: 16 }} />}
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem',
                color: '#475569', border: '1px solid #E2E8F0', px: 1.5, py: 0.5,
                bgcolor: '#FAFBFC', minWidth: 'auto',
                '&:hover': { borderColor: '#714CF7', color: '#714CF7', bgcolor: '#F5F3FF' },
              }}
            >
              {companyLabel}
            </Button>
            <Menu anchorEl={companyAnchor} open={!!companyAnchor} onClose={() => setCompanyAnchor(null)}
              PaperProps={{ sx: { borderRadius: 2.5, minWidth: 220, border: '1px solid #E8ECF1', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', mt: 0.5 } }}>
              <MenuItem onClick={() => { setSelectedCompany('all'); setCompanyAnchor(null); }}
                selected={selectedCompany === 'all'} sx={{ fontSize: '0.8rem', py: 1 }}>
                <BusinessIcon sx={{ mr: 1.5, fontSize: 16, color: '#64748B' }} /> All Companies
              </MenuItem>
              <Divider />
              {companies.map(c => (
                <MenuItem key={c.id} onClick={() => { setSelectedCompany(c.id); setCompanyAnchor(null); }}
                  selected={selectedCompany === c.id} sx={{ fontSize: '0.8rem', py: 1 }}>
                  <Avatar sx={{ width: 22, height: 22, mr: 1.5, fontSize: '0.55rem', fontWeight: 700, bgcolor: '#F5F3FF', color: '#714CF7' }}>
                    {c.short_code?.charAt(0)}
                  </Avatar>
                  {c.company_name}
                </MenuItem>
              ))}
            </Menu>

            {/* Quick Create */}
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => setCreateAnchor(e.currentTarget)}
              sx={{
                borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem',
                px: 1.5, py: 0.5, minWidth: 'auto',
              }}
            >
              Create
            </Button>
            <Menu anchorEl={createAnchor} open={!!createAnchor} onClose={() => setCreateAnchor(null)}
              PaperProps={{ sx: { borderRadius: 2.5, minWidth: 200, border: '1px solid #E8ECF1', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', mt: 0.5 } }}>
              {[
                { label: 'New Project', path: '/projects', icon: <FolderIcon sx={{ fontSize: 16 }} /> },
                { label: 'New RFQ', path: '/sales/rfq', icon: <RequestQuoteIcon sx={{ fontSize: 16 }} /> },
                { label: 'New Quotation', path: '/sales/quotations', icon: <ReceiptIcon sx={{ fontSize: 16 }} /> },
                { label: 'New Vendor PO', path: '/procurement/vendor-po', icon: <ShoppingCartIcon sx={{ fontSize: 16 }} /> },
              ].map(item => (
                <MenuItem key={item.label} onClick={() => { navigate(item.path); setCreateAnchor(null); }}
                  sx={{ fontSize: '0.8rem', py: 1 }}>
                  <Box sx={{ mr: 1.5, color: '#714CF7', display: 'flex' }}>{item.icon}</Box>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Notifications */}
            <IconButton sx={{ color: '#64748B', '&:hover': { bgcolor: '#F5F3FF', color: '#714CF7' } }}>
              <Badge badgeContent={3} sx={{
                '& .MuiBadge-badge': { fontSize: '0.58rem', minWidth: 16, height: 16,
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)' },
              }}>
                <NotificationsNoneIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>

            {/* User Avatar */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 32, height: 32, fontSize: '0.72rem', fontWeight: 700, bgcolor: '#F5F3FF', color: '#714CF7',
                border: '2px solid #E9E2FD' }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { borderRadius: 2.5, minWidth: 220, border: '1px solid #E8ECF1', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', mt: 0.5 } }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>{user?.name}</Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{user?.email}</Typography>
                <Chip label={user?.role?.toUpperCase()} size="small" sx={{ mt: 0.5, bgcolor: '#F5F3FF', color: '#714CF7', fontWeight: 700, fontSize: '0.55rem', height: 18 }} />
              </Box>
              <Divider sx={{ borderColor: '#F0F2F6' }} />
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin/settings'); }} sx={{ fontSize: '0.8rem', py: 1 }}>
                <SettingsIcon sx={{ mr: 1.5, fontSize: 16, color: '#64748B' }} /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#EF4444', fontSize: '0.8rem', py: 1 }}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 16 }} /> Sign out
              </MenuItem>
            </Menu>
          </Box>

          {/* Main Content */}
          <Box sx={{
            flex: 1,
            px: 4,
            py: 4,
            overflow: 'auto',
            maxWidth: 1440,
            mx: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}>
            {/* 12-column grid context for all pages */}
            <Box sx={{ width: '100%' }}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
}
