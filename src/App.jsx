import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SAFEAI_MASTER_CONFIG } from './config/constants.js';
import AppShell from './layouts/AppShell.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

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

function PublicShellRoute({ children }) {
  return <AppShell>{children}</AppShell>;
}

function EnterpriseShellRoute({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

const BRAND_TITLE = SAFEAI_MASTER_CONFIG?.branding?.name ?? 'safeAI.report';
const BRAND_META_DESCRIPTION = `${BRAND_TITLE} — Official Article 4 AI Literacy Certification`;

/** Non-blocking skeleton while route chunks hydrate on slow networks. */
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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 40vh;
          gap: 1rem;
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

/** Global document head — authoritative safeAI.report tab branding. */
function AppHelmet() {
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', BRAND_META_DESCRIPTION);
    }
  }, []);

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
            <EnterpriseShellRoute>
              <PartnerOverview />
            </EnterpriseShellRoute>
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
            <PublicShellRoute>
              <AdminDashboardView />
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
