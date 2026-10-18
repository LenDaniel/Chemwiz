const API_BASE_URL = ''; // One application: all API requests use this web address.

async function fetchBackend(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const { timeoutMs = 20000, ...requestOptions } = options;
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (requestOptions.signal?.aborted) abort();
  else requestOptions.signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => { timedOut = true; abort(); }, timeoutMs);
  options = { ...requestOptions, signal: controller.signal };
  try {
    const response = await fetch(url, options);
    // Keep the abort deadline active until the response body has arrived too.
    await response.clone().arrayBuffer();
    return response;
  } catch (error) {
    throw new Error(
      timedOut ? 'ChemWiz took too long to respond. Check your connection and try again.' :
        'Could not connect to ChemWiz. Check your connection and try again.'
    );
  } finally {
    clearTimeout(timer);
    requestOptions.signal?.removeEventListener('abort', abort);
  }
}

async function apiRequest(path, options = {}) {
  const res = await fetchBackend(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data;
  try { data = await res.json(); }
  catch {
    if (res.ok) throw new Error('ChemWiz returned an unreadable response. Reload the page and try again.');
    data = {};
  }

  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function registerUser(payload) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function requestPasswordReset(payload) {
  return apiRequest('/api/auth/forgot-password', { method:'POST', body:JSON.stringify(payload) });
}
export function resetPassword(payload) {
  return apiRequest('/api/auth/reset-password', { method:'POST', body:JSON.stringify(payload) });
}
export function upgradePassword(payload) {
  return apiRequest('/api/auth/upgrade-password', { method:'POST', body:JSON.stringify(payload) });
}

export function getCurrentUser(token) {
  return apiRequest("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getLearningState(token) {
  return apiRequest('/api/progress/me', { headers: { Authorization: `Bearer ${token}` } });
}

export function validateLearningImport(token, state) {
  return apiRequest('/api/progress/validate', {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ state }),
  });
}

export function putLearningState(token, revision, state, { keepalive = false } = {}) {
  const body = JSON.stringify({ revision, state });
  return apiRequest('/api/progress/me', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body,
    keepalive: keepalive && new Blob([body]).size < 60000,
  });
}

export function askTutor(token, payload) {
  return apiRequest("/api/tutor/message", {
    timeoutMs: 150000, // Includes input/output moderation and the existing Luna generation budget.
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function transcribeTutorNote(token, blob) {
  const type = blob.type.split(';')[0];
  const response = await fetchBackend("/api/tutor/transcribe", {
    timeoutMs: 90000,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': type },
    body: blob,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Wiz could not transcribe the voice note.');
  return data.text;
}

export async function createLiveVoiceSession(token, sdp, context) {
  const response = await fetchBackend("/api/tutor/live/session", {
    timeoutMs: 90000,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/sdp',
      'X-Wiz-Context': JSON.stringify(context),
    },
    body: sdp,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Wiz could not start a live voice session.');
  }
  return response.text();
}

export { API_BASE_URL };

// Privacy, guardian and school requests share the same authenticated transport.
export function getPublicPrivacy() { return apiRequest('/api/privacy/public', {}); }
export function getMyPrivacy(token) { return apiRequest('/api/privacy/me', {headers: {Authorization: `Bearer ${token}`}}); }
export function completeOnboarding(token, body) { return apiRequest('/api/privacy/onboarding', {headers: {Authorization: `Bearer ${token}`}, method: 'POST', body: JSON.stringify(body)}); }
export function updatePrivacyChoices(token, body) { return apiRequest('/api/privacy/preferences', {headers: {Authorization: `Bearer ${token}`}, method: 'PATCH', body: JSON.stringify(body)}); }
export function submitPrivacyRequest(token, body) { return apiRequest('/api/privacy/requests', {headers: {Authorization: `Bearer ${token}`}, method: 'POST', body: JSON.stringify(body)}); }
export function exportPrivacyData(token) { return apiRequest('/api/privacy/export', {headers: {Authorization: `Bearer ${token}`}}); }
export function updateSchoolSharing(token, schoolId, share) { return apiRequest(`/api/privacy/schools/${schoolId}/sharing`, {headers: {Authorization: `Bearer ${token}`}, method: 'PATCH', body: JSON.stringify({share})}); }
export function getPrivacySettings(token) { return apiRequest('/api/privacy/admin/settings', {headers: {Authorization: `Bearer ${token}`}}); }
export function savePrivacySettings(token, body) { return apiRequest('/api/privacy/admin/settings', {headers: {Authorization: `Bearer ${token}`}, method: 'PUT', body: JSON.stringify(body)}); }
export function getPrivacyQueue(token) { return apiRequest('/api/privacy/admin/queue', {headers: {Authorization: `Bearer ${token}`}}); }
export function createGuardianAuthorisation(token, body) { return apiRequest('/api/privacy/admin/guardians', {headers: {Authorization: `Bearer ${token}`}, method: 'POST', body: JSON.stringify(body)}); }
export function revokeGuardianAuthorisation(token, id) { return apiRequest(`/api/privacy/admin/guardians/${id}`, {headers: {Authorization: `Bearer ${token}`}, method: 'DELETE'}); }
export function reviewPrivacyRequest(token, id, body) { return apiRequest(`/api/privacy/admin/requests/${id}`, {headers: {Authorization: `Bearer ${token}`}, method: 'PATCH', body: JSON.stringify(body)}); }
export function getSchools(token) { return apiRequest('/api/schools', {headers: {Authorization: `Bearer ${token}`}}); }
export function createSchool(token, body) { return apiRequest('/api/schools', {headers: {Authorization: `Bearer ${token}`}, method: 'POST', body: JSON.stringify(body)}); }
export function updateSchool(token, schoolId, body) { return apiRequest(`/api/schools/${schoolId}`, {headers: {Authorization: `Bearer ${token}`}, method: 'PUT', body: JSON.stringify(body)}); }
export function updateSchoolMembership(token, schoolId, body) { return apiRequest(`/api/schools/${schoolId}/membership`, {headers: {Authorization: `Bearer ${token}`}, method: 'PUT', body: JSON.stringify(body)}); }
export function getSchoolRoster(token, schoolId) { return apiRequest(`/api/schools/${schoolId}/roster`, {headers: {Authorization: `Bearer ${token}`}}); }
