import { useCallback, useState } from 'react';
import AdminLogin from '../admin/AdminLogin.jsx';
import { checkAdminSession } from '../admin/utils/adminConfig.js';
import AdminDashboard from '../admin/components/AdminDashboard.jsx';

/**
 * Sovereign Administrative Command Center — gated institutional control surface.
 */
export default function AdminDashboardView({ language: languageProp }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAdminSession());

  const handleAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={handleAuthenticated} />;
  }

  return <AdminDashboard language={languageProp} />;
}
