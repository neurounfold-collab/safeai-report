import { Navigate, useLocation } from 'react-router-dom';
import { checkAdminSession } from '../features/admin/utils/adminConfig.js';

/**
 * Route guard for sensitive surfaces (/admin, /dashboard).
 * Requires an active admin session flag in sessionStorage; otherwise redirects
 * to the configured login surface with the attempted location in state.from.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.redirectTo='/academy'] — login / recovery destination
 */
export default function ProtectedRoute({ children, redirectTo = '/academy' }) {
  const location = useLocation();
  const hasValidSession = checkAdminSession();

  if (!hasValidSession) {
    // Login surface lives at redirectTo (e.g. /admin). Allow it through so
    // AdminLogin can render; other gated paths redirect with return state.
    if (location.pathname === redirectTo) {
      return children;
    }

    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
