export const verifyAdminCredentials = (username, password) => {
  const expectedUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin_a4i_master';
  const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD || 'OIARF#2026!Secured@WaqfLedger$Master';
  return username.trim() === expectedUser && password === expectedPass;
};

export const checkAdminSession = () => {
  return sessionStorage.getItem('safeai_admin_active_session') === 'true';
};
