export function isAdminAuthError(error) {
  return error?.status === 401 || (error?.status === 403 && error?.code !== 'CORS_ORIGIN_BLOCKED');
}

export function adminLoginMessage(error) {
  if (error?.code === 'CORS_ORIGIN_BLOCKED') return 'This site address is blocked by the server origin settings. Confirm the deployed version and APP_URL in the Admin login guide.';
  return error?.message || 'Admin sign-in could not be completed.';
}
