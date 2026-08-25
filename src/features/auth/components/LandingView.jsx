/**
 * Backward-compatible entry alias — resolves to the canonical HomeView module.
 * Legacy imports of LandingView share the same component instance graph as the `/` home route.
 * Examinee / registrar intake lives at `/access` (`AuthPortal`).
 */
export { default } from '../../pages/HomeView.jsx';
