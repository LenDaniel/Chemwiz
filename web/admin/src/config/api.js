const API_BASE_URL = ''; // One application: all API requests use this web address.

async function fetchBackend(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  try {
    return await fetch(url, options);
  } catch (error) {
    console.error("ChemWiz Admin backend request failed:", { url, error });
    throw Object.assign(new Error("Could not connect to ChemWiz. Check your connection and try again."), { code: 'NETWORK_ERROR', status: 0 });
  }
}

async function apiRequest(path, options = {}) {
  const { token, body, headers, ...fetchOptions } = options;

  const res = await fetchBackend(path, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Invalid server response" };
  }

  if (!res.ok) {
    throw Object.assign(new Error(data.message || `Request failed with status ${res.status}`), { status: res.status, code: data.code || 'API_ERROR' });
  }

  if (!res.headers.get('content-type')?.includes('application/json')) {
    throw Object.assign(new Error('The server returned a page instead of API data. Confirm this is the unified ChemWiz address and current deployment.'), { status: res.status, code: 'INVALID_API_RESPONSE' });
  }

  return data;
}

export function loginAdmin(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function checkAdmin(token) {
  return apiRequest("/api/admin/test", {
    method: "GET",
    token,
  });
}

export function getAdminStats(token) {
  return apiRequest("/api/admin/stats", {
    method: "GET",
    token,
  });
}

export function getAdminUsers(token, params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const qs = query.toString();

  return apiRequest(`/api/admin/users${qs ? `?${qs}` : ""}`, {
    method: "GET",
    token,
  });
}

export function updateUserSubscription(token, userId, payload) {
  return apiRequest(`/api/admin/users/${userId}/subscription`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function updateUserStatus(token, userId, payload) {
  return apiRequest(`/api/admin/users/${userId}/status`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function getAdminLogs(token) {
  return apiRequest("/api/admin/logs", {
    method: "GET",
    token,
  });
}

export function updateUserRole(token, userId, payload) {
  return apiRequest(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export { API_BASE_URL };
