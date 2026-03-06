import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Clients from './pages/Clients';
import Vendors from './pages/Vendors';
import Settings from './pages/Settings';

// Sales Module
import RFQList from './pages/sales/RFQList';
import QuotationsList from './pages/sales/QuotationsList';
import ClientPOList from './pages/sales/ClientPOList';

// Procurement Module
import VendorPOList from './pages/procurement/VendorPOList';

// Production Module
import WorkOrders from './pages/production/WorkOrders';

// Quality Module
import InspectionList from './pages/quality/InspectionList';

// Logistics Module
import ShipmentList from './pages/logistics/ShipmentList';

// Documents Module
import DocumentsCenter from './pages/documents/DocumentsCenter';

// Analytics Module
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}


function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />

        {/* Sales Module */}
        <Route path="sales/rfq" element={<RFQList />} />
        <Route path="sales/quotations" element={<QuotationsList />} />
        <Route path="sales/client-po" element={<ClientPOList />} />

        {/* Procurement Module */}
        <Route path="procurement/vendors" element={<Vendors />} />
        <Route path="procurement/vendor-po" element={<VendorPOList />} />

        {/* Clients & Vendors (legacy routes) */}
        <Route path="clients" element={<Clients />} />
        <Route path="vendors" element={<Vendors />} />

        {/* Production Module */}
        <Route path="production" element={<WorkOrders />} />

        {/* Quality Module */}
        <Route path="quality" element={<InspectionList />} />

        {/* Logistics Module */}
        <Route path="logistics" element={<ShipmentList />} />

        {/* Documents Module */}
        <Route path="documents" element={<DocumentsCenter />} />

        {/* Analytics Module */}
        <Route path="analytics" element={<AnalyticsDashboard />} />

        {/* Admin Module */}
        <Route path="settings" element={<Settings />} />
        <Route path="admin/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
