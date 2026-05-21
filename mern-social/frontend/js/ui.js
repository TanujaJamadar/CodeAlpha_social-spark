// UI helpers shared by every page: navbar, theme, toasts, query params, formatting.

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm';
  if (s < 86400) return Math.floor(s/3600) + 'h';
  if (s < 604800) return Math.floor(s/86400) + 'd';
  return new Date(iso).toLocaleDateString();
}
function getQuery(name) { return new URLSearchParams(location.search).get(name); }

// Toast notifications
function toast(message, type = 'info') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 2700);
  setTimeout(() => el.remove(), 3100);
}

// Theme: persistent dark/light
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
  const btn = $('#themeToggle');
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}
function initTheme() { applyTheme(localStorage.getItem('theme') || 'light'); }

// Render the global navbar into <header id="nav">
function renderNav(activePath = location.pathname) {
  const host = $('#nav');
  if (!host) return;
  const user = AUTH.getUser();
  const logged = !!AUTH.getToken();

  const linksLoggedIn = `
    <a href="dashboard.html" data-path="dashboard.html">Feed</a>
    <a href="explore.html" data-path="explore.html">Explore</a>
    <a href="create-post.html" data-path="create-post.html">Create</a>
    <a href="profile.html?u=${encodeURIComponent(user?.username || '')}" data-path="profile.html">Profile</a>
    <button id="logoutBtn" class="btn btn-outline btn-sm">Logout</button>
  `;
  const linksLoggedOut = `
    <a href="login.html" data-path="login.html">Login</a>
    <a href="register.html" class="btn btn-primary btn-sm">Get started</a>
  `;

  host.innerHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a href="${logged ? 'dashboard.html' : 'index.html'}" class="brand">Pulse</a>
        <button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>
        <div class="nav-links" id="navLinks">
          ${logged ? linksLoggedIn : linksLoggedOut}
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">🌙</button>
        </div>
      </div>
    </nav>
  `;

  $$('.nav-links a').forEach(a => {
    if (a.dataset.path && activePath.endsWith(a.dataset.path)) a.classList.add('active');
  });

  $('#navToggle')?.addEventListener('click', () => $('#navLinks').classList.toggle('open'));
  $('#themeToggle')?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  $('#logoutBtn')?.addEventListener('click', () => {
    AUTH.clearToken();
    toast('Logged out', 'success');
    setTimeout(() => location.href = 'login.html', 400);
  });

  initTheme();
}

// Guard a page that requires auth
function requireAuth() {
  if (!AUTH.getToken()) { location.href = 'login.html'; return false; }
  return true;
}
// Redirect away from auth pages if already signed in
function redirectIfLoggedIn() {
  if (AUTH.getToken()) location.href = 'dashboard.html';
}

function avatarHtml(user, size = '') {
  const cls = 'avatar' + (size ? ' ' + size : '');
  if (user?.avatar) return `<div class="${cls}"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.username)}"></div>`;
  const letter = (user?.username || user?.name || '?')[0].toUpperCase();
  return `<div class="${cls}">${escapeHtml(letter)}</div>`;
}

window.UI = { $, $$, escapeHtml, timeAgo, getQuery, toast, renderNav, requireAuth, redirectIfLoggedIn, avatarHtml, applyTheme, initTheme };
