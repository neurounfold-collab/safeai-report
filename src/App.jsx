import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppShell from './layouts/AppShell.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import {
  getActiveLanguage,
  normalizeLanguage,
  setActiveLanguage,
  SUPPORTED_LANGUAGES,
} from './i18n/index.js';
import { applyRouteSeo, LANGUAGE_CHANGE_EVENT } from './utils/seoMetadata.js';

const HomeView = lazy(() => import('./features/pages/HomeView.jsx'));
const AcademyView = lazy(() => import('./features/pages/AcademyView.jsx'));
const ExamPlayer = lazy(() => import('./features/exam/components/ExamPlayer.jsx'));
const PartnerOverview = lazy(() => import('./features/dashboard/components/PartnerOverview.jsx'));
const VerifyView = lazy(() => import('./features/pages/VerifyView.jsx'));
const AcademicCentersView = lazy(() => import('./features/pages/AcademicCentersView.jsx'));
const ContactView = lazy(() => import('./features/pages/ContactView.jsx'));
const CorporateLegalView = lazy(() => import('./features/pages/CorporateLegalView.jsx'));
const TermsView = lazy(() => import('./features/pages/TermsView.jsx'));
const PrivacyView = lazy(() => import('./features/pages/PrivacyView.jsx'));
const AdminDashboardView = lazy(() => import('./features/pages/AdminDashboardView.jsx'));
const ReadinessView = lazy(() => import('./features/pages/ReadinessView.jsx'));

function VerificationRedirect() {
  const [searchParams] = useSearchParams();
  const suffix = searchParams.toString();
  return <Navigate to={suffix ? `/verify?${suffix}` : '/verify'} replace />;
}

function PublicShellRoute({ children }) {
  return <AppShell>{children}</AppShell>;
}

function EnterpriseShellRoute({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

/** Non-blocking skeleton while route chunks hydrate — reserves main viewport height to avoid CLS/white flash. */
function RouteLoadingFallback() {
  return (
    <div
      className="route-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="route-loading__pulse" aria-hidden="true" />
      <p className="route-loading__label">Loading…</p>
      <style>{`
        .route-loading {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: calc(100vh - 4.25rem);
          min-height: calc(100dvh - 4.25rem);
          padding: 2rem 1rem;
          gap: 1rem;
          background-color: #0b0f19;
          color: #94a3b8;
          font-family: system-ui, sans-serif;
        }
        .route-loading__pulse {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: 2px solid rgba(201, 162, 39, 0.25);
          border-top-color: #c9a227;
          animation: route-loading-spin 0.85s linear infinite;
        }
        .route-loading__label {
          margin: 0;
          font-size: 0.8125rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        @keyframes route-loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Route-aware document head: localized title / Open Graph / Twitter / hreflang / JSON-LD.
 * Honours `?lang=` so GEO crawlers receive the matching EN / FR / ES / AR preview.
 */
function AppHelmet() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (!langParam) return;

    const normalized = normalizeLanguage(langParam);
    if (!SUPPORTED_LANGUAGES.includes(normalized)) return;
    if (getActiveLanguage() === normalized) return;

    setActiveLanguage(normalized);
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT));
  }, [searchParams]);

  useEffect(() => {
    const syncHead = () => applyRouteSeo(pathname, getActiveLanguage());
    syncHead();
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncHead);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncHead);
  }, [pathname, searchParams]);

  return null;
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route
          path="/"
          element={
            <PublicShellRoute>
              <HomeView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/access"
          element={
            <PublicShellRoute>
              <HomeView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/academy"
          element={
            <PublicShellRoute>
              <AcademyView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/academy/exam"
          element={
            <PublicShellRoute>
              <ExamPlayer />
            </PublicShellRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute redirectTo="/admin">
              <EnterpriseShellRoute>
                <PartnerOverview />
              </EnterpriseShellRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <PublicShellRoute>
              <VerifyView />
            </PublicShellRoute>
          }
        />
        <Route path="/verification" element={<VerificationRedirect />} />
        <Route
          path="/academic-centers"
          element={
            <PublicShellRoute>
              <AcademicCentersView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/centers"
          element={
            <PublicShellRoute>
              <AcademicCentersView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/industrial"
          element={
            <PublicShellRoute>
              <AcademicCentersView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicShellRoute>
              <ContactView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PublicShellRoute>
              <CorporateLegalView section="help" />
            </PublicShellRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicShellRoute>
              <TermsView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicShellRoute>
              <PrivacyView />
            </PublicShellRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute redirectTo="/admin">
              <PublicShellRoute>
                <AdminDashboardView />
              </PublicShellRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/readiness"
          element={
            <PublicShellRoute>
              <ReadinessView />
            </PublicShellRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppHelmet />
      <AppRoutes />
    </BrowserRouter>
  );
}
