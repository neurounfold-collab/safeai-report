export const ADMIN_SESSION_KEY = 'safeai_admin_active_session';

export const verifyAdminCredentials = (username, password) => {
  const expectedUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin_a4i_master';
  const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD || 'OIARF#2026!Secured@WaqfLedger$Master';
  return username.trim() === expectedUser && password === expectedPass;
};

/**
 * Institutional registrar gate for `/access`.
 * Accepts either the admin username as the email field, or any institutional
 * email paired with the admin workspace passcode.
 */
export const verifyRegistrarAccess = (email, passcode) => {
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedPass = typeof passcode === 'string' ? passcode : '';
  if (!trimmedEmail || !trimmedPass) return false;
  if (verifyAdminCredentials(trimmedEmail, trimmedPass)) return true;
  const expectedUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin_a4i_master';
  return verifyAdminCredentials(expectedUser, trimmedPass);
};

export const establishAdminSession = () => {
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
};

export const checkAdminSession = () => {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};
