// Central API client. Adjust API_BASE if your backend runs elsewhere.
const API_BASE = (window.__API_BASE__ || 'http://localhost:5000') + '/api';

function getToken() { return localStorage.getItem('token'); }
function setToken(t) { localStorage.setItem('token', t); }
function clearToken() { localStorage.removeItem('token'); localStorage.removeItem('user'); }
function getUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
}
function setUser(u) { localStorage.setItem('user', JSON.stringify(u)); }

async function request(path, { method = 'GET', body, isForm = false, auth = true } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`;

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    const msg = (data && data.message) || `Request failed (${res.status})`;
    if (res.status === 401) {
      clearToken();
    }
    throw new Error(msg);
  }
  return data;
}

const API = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),

  // Users / profiles
  getProfile: (username) => request(`/users/${encodeURIComponent(username)}`),
  updateProfile: (formData) => request('/users/me', { method: 'PUT', body: formData, isForm: true }),
  follow: (username) => request(`/users/${encodeURIComponent(username)}/follow`, { method: 'POST' }),
  unfollow: (username) => request(`/users/${encodeURIComponent(username)}/follow`, { method: 'DELETE' }),
  suggested: () => request('/users/suggested'),
  explore: (q = '') => request('/users/explore' + (q ? `?q=${encodeURIComponent(q)}` : '')),
  userPosts: (username, page = 1) => request(`/users/${encodeURIComponent(username)}/posts?page=${page}&limit=12`),

  // Posts
  feed: (page = 1) => request(`/posts?page=${page}&limit=10`),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (formData) => request('/posts', { method: 'POST', body: formData, isForm: true }),
  updatePost: (id, formData) => request(`/posts/${id}`, { method: 'PUT', body: formData, isForm: true }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),

  // Comments
  listComments: (postId) => request(`/posts/${postId}/comments`),
  addComment: (postId, text) => request(`/posts/${postId}/comments`, { method: 'POST', body: { text } }),
  deleteComment: (id) => request(`/comments/${id}`, { method: 'DELETE' }),

  // Likes & Saves
  like: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
  unlike: (id) => request(`/posts/${id}/like`, { method: 'DELETE' }),
  savePost: (id) => request(`/posts/${id}/save`, { method: 'POST' }),
  unsavePost: (id) => request(`/posts/${id}/save`, { method: 'DELETE' }),
  savedPosts: () => request('/saved'),

  // Notifications
  notifications: () => request('/notifications'),
  unreadNotifications: () => request('/notifications/unread-count'),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),

  // Search
  search: (q) => request('/search?q=' + encodeURIComponent(q)),
};

window.API = API;
window.AUTH = { getToken, setToken, clearToken, getUser, setUser };
