/**
 * VerifIA Risk Engine readiness surface — canonical route entry for /readiness.
 * Sealed assessments expose:
 *   • Download VerifIA Audit Passport™ (.json)
 *   • Export FRIA Compliance Summary (.pdf/print)
 * via the dashboard results panel.
 */
export { default } from '../readiness/ReadinessDashboard.jsx';
