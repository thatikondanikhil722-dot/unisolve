import { mockStore } from './mockStore';

export function getApiBase() {
  const custom = localStorage.getItem('uni_custom_server_url');
  if (custom && custom.trim()) {
    let clean = custom.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/api')) clean += '/api';
    return clean;
  }

  // Detect Capacitor native platform or mobile webview
  const isCapacitor = Boolean(
    window.Capacitor?.isNativePlatform?.() || 
    window.location.protocol === 'capacitor:' || 
    window.location.protocol === 'file:' ||
    (window.location.hostname === 'localhost' && window.location.port === '')
  );

  if (isCapacitor) {
    // Default to the computer's local Wi-Fi IP address
    return 'http://192.168.1.35:5000/api';
  }

  return '/api';
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('uni_auth_user') || 'null');
  } catch {
    return null;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('uni_auth_token');
  const apiBase = getApiBase();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  // Try network request with 3.5s timeout for fast offline fallback
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);
  config.signal = controller.signal;

  try {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;
    const res = await fetch(fullUrl, config);
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('uni_auth_token');
        localStorage.removeItem('uni_auth_user');
        window.dispatchEvent(new Event('auth-logout'));
      }
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    // Fallback to offline embedded store on network failure
    console.warn(`[UniSolve API] Network unavailable (${err.message}). Using local embedded mode for [${endpoint}]`);
    return handleOfflineFallback(endpoint, options);
  }
}

function handleOfflineFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
  const user = getCurrentUser();

  // 1. Auth login
  if (endpoint === '/auth/login' && method === 'POST') {
    const res = mockStore.login(body.username, body.password, body.expectedRole);
    return res;
  }

  // 2. Auth me
  if (endpoint === '/auth/me') {
    if (!user) throw new Error('Not authenticated');
    return { user };
  }

  // 3. Auth profile
  if (endpoint === '/auth/profile') {
    if (!user) throw new Error('Not authenticated');
    const updated = { ...user, ...body };
    localStorage.setItem('uni_auth_user', JSON.stringify(updated));
    return { message: 'Profile updated', user: updated };
  }

  // 4. Stats
  if (endpoint === '/stats') {
    if (!user) throw new Error('Not authenticated');
    return mockStore.getStats(user);
  }

  // 5. Issues list (e.g. /issues?status=Pending)
  if (endpoint.startsWith('/issues') && method === 'GET') {
    const urlParts = endpoint.split('?');
    if (urlParts.length === 1 && endpoint === '/issues') {
      return mockStore.getIssueList(user, new URLSearchParams());
    } else if (urlParts.length === 2) {
      return mockStore.getIssueList(user, new URLSearchParams(urlParts[1]));
    }
  }

  // 6. Issue details (e.g. /issues/ISS-2026-001)
  const detailMatch = endpoint.match(/^\/issues\/(ISS-[^/?]+)$/);
  if (detailMatch && method === 'GET') {
    return mockStore.getIssueDetails(detailMatch[1]);
  }

  // 7. Create issue
  if (endpoint === '/issues' && method === 'POST') {
    if (!user) throw new Error('Not authenticated');
    return mockStore.createIssue(user, body);
  }

  // 8. Update status (e.g. /issues/ISS-2026-001/status)
  const statusMatch = endpoint.match(/^\/issues\/(ISS-[^/]+)\/status$/);
  if (statusMatch && method === 'PATCH') {
    if (!user) throw new Error('Not authenticated');
    return mockStore.updateIssueStatus(statusMatch[1], user, body);
  }

  // 9. Reply (e.g. /issues/ISS-2026-001/replies)
  const replyMatch = endpoint.match(/^\/issues\/(ISS-[^/]+)\/replies$/);
  if (replyMatch && method === 'POST') {
    if (!user) throw new Error('Not authenticated');
    return mockStore.addReply(replyMatch[1], user, body.message);
  }

  // 10. Feedback (e.g. /issues/ISS-2026-001/feedback)
  const fbMatch = endpoint.match(/^\/issues\/(ISS-[^/]+)\/feedback$/);
  if (fbMatch && method === 'POST') {
    if (!user) throw new Error('Not authenticated');
    return mockStore.submitFeedback(fbMatch[1], user, body);
  }

  // 11. Notifications
  if (endpoint === '/notifications' && method === 'GET') {
    if (!user) return { notifications: [], unreadCount: 0 };
    return mockStore.getNotifications(user);
  }

  if (endpoint.startsWith('/notifications/') && endpoint.endsWith('/read') && method === 'PATCH') {
    const notifId = endpoint.split('/')[2];
    return mockStore.markNotifRead(notifId);
  }

  if (endpoint === '/notifications/read-all' && method === 'POST') {
    if (!user) return { success: true };
    return mockStore.markAllNotifsRead(user);
  }

  // Fallback default
  return { success: true };
}

export const api = {
  get: (url) => apiRequest(url, { method: 'GET' }),
  post: (url, body) => apiRequest(url, { method: 'POST', body }),
  put: (url, body) => apiRequest(url, { method: 'PUT', body }),
  patch: (url, body) => apiRequest(url, { method: 'PATCH', body }),
  delete: (url) => apiRequest(url, { method: 'DELETE' })
};
