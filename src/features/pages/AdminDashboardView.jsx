import React, { useCallback, useState } from 'react';
import AdminLogin, {
  clearAdminSession,
  isAdminSessionValid,
  useAdminSessionGuard,
} from '../admin/AdminLogin.jsx';
import AdminDashboard from '../admin/components/AdminDashboard.jsx';

/**
 * Sovereign Administrative Command Center — gated institutional control surface.
 */
export default function AdminDashboardView({ language: languageProp }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminSessionValid());

  const handleAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleSessionExpired = useCallback(() => {
    clearAdminSession();
    setIsAuthenticated(false);
  }, []);

  useAdminSessionGuard(isAuthenticated, handleSessionExpired);

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={handleAuthenticated} />;
  }

  return <AdminDashboard language={languageProp} />;
}
