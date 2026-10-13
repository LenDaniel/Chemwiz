const API_BASE_URL = ''; // One application: all API requests use this web address.

async function fetchBackend(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  try {
    return await fetch(url, options);
  } catch (error) {
    console.error("ChemWiz backend request failed:", { url, error });
    throw new Error(
      "Could not connect to ChemWiz. Check your connection and try again."
    );
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

  const data = await res.json().catch(() => ({}));

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
