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
    throw Object.assign(new Error(data.message || `Request failed with status ${res.status}`), { status: res.status, code: data.code || 'API_ERROR', data });
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
export function requestPasswordReset(payload) {
  return apiRequest('/api/auth/forgot-password', { method:'POST', body:payload });
}
export function resetPassword(payload) {
  return apiRequest('/api/auth/reset-password', { method:'POST', body:payload });
}
export function upgradePassword(payload) {
  return apiRequest('/api/auth/upgrade-password', { method:'POST', body:payload });
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

export function trashUserAccount(token, userId, payload) { return apiRequest(`/api/admin/users/${userId}/trash`, {method:'POST',token,body:payload}); }
export function getRecycleBin(token, params = {}) { const qs = new URLSearchParams(params).toString(); return apiRequest(`/api/admin/recycle-bin?${qs}`, {method:'GET',token}); }
export function restoreRecycleEntry(token, entryId, payload) { return apiRequest(`/api/admin/recycle-bin/${entryId}/restore`, {method:'POST',token,body:payload}); }
export function purgeRecycleEntry(token, entryId, payload) { return apiRequest(`/api/admin/recycle-bin/${entryId}`, {method:'DELETE',token,body:payload}); }
export function getContentInventory(token, params = {}) { const qs = new URLSearchParams(params).toString(); return apiRequest(`/api/admin/content-inventory?${qs}`, {method:'GET',token}); }
export function getContentDrafts(token, params = {}) { const qs = new URLSearchParams(params).toString(); return apiRequest(`/api/admin/content?${qs}`, {method:'GET',token}); }
export function createContentDraft(token, payload) { return apiRequest('/api/admin/content', {method:'POST',token,body:payload}); }
export function updateContentDraft(token, id, payload) { return apiRequest(`/api/admin/content/${id}`, {method:'PUT',token,body:payload}); }
export function trashContentDraft(token, id, payload) { return apiRequest(`/api/admin/content/${id}`, {method:'DELETE',token,body:payload}); }
export function importContentDraft(token, payload) { return apiRequest('/api/admin/content/import', {method:'POST',token,body:payload}); }
export function getContentHistory(token, id, params = {}) { const qs = new URLSearchParams(params).toString(); return apiRequest(`/api/admin/content/${id}/history?${qs}`, {method:'GET',token}); }
export function publishContentDraft(token, id, payload) { return apiRequest(`/api/admin/content/${id}/publish`, {method:'POST',token,body:payload}); }
export function unpublishContentDraft(token, id, payload) { return apiRequest(`/api/admin/content/${id}/unpublish`, {method:'POST',token,body:payload}); }
export function rollbackContentDraft(token, id, payload) { return apiRequest(`/api/admin/content/${id}/rollback`, {method:'POST',token,body:payload}); }

export function getMediaLibrary(token, params = {}) { const qs = new URLSearchParams(params).toString(); return apiRequest(`/api/admin/media?${qs}`, {method:'GET',cache:'no-store',token}); }
export function updateMedia(token, id, payload) { return apiRequest(`/api/admin/media/${id}`, {method:'PUT',token,body:payload}); }
export function trashMedia(token, id, payload) { return apiRequest(`/api/admin/media/${id}`, {method:'DELETE',token,body:payload}); }
export async function uploadMedia(token, file, filename = file.name || 'illustration.png') {
  const response = await fetchBackend('/api/admin/media', { method:'POST', headers:{Authorization:`Bearer ${token}`,'Content-Type':file.type,'X-ChemWiz-Filename':encodeURIComponent(filename.slice(0,200))}, body:file });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.message || 'Image upload failed.'), {status:response.status,code:data.code});
  if (!data.media) throw new Error('ChemWiz returned an unreadable upload response. Refresh the media library before retrying.');
  return data;
}
export async function getAdminMediaFile(token, id) {
  const response = await fetchBackend(`/api/admin/media/${id}/file`, {method:'GET',cache:'no-store',headers:{Authorization:`Bearer ${token}`}});
  if (!response.ok) { const data = await response.json().catch(() => ({})); throw Object.assign(new Error(data.message || 'Image unavailable.'), {status:response.status,code:data.code}); }
  if (!['image/png','image/jpeg'].includes(response.headers.get('content-type'))) throw new Error('Unexpected image response.');
  return response.blob();
}
