// Register & login form logic
window.__authJsLoaded = true;
window.__authLoginAttached = false;
window.__authRegisterAttached = false;
const { $, toast, redirectIfLoggedIn } = UI;

function showError(form, msg) {
  let el = form.querySelector('.form-error.global');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-error global';
    form.prepend(el);
  }
  el.textContent = msg;
}

function attachAuthHandlers() {
  UI.renderNav();
  redirectIfLoggedIn();

  const registerForm = $('#registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(registerForm);
      const username = (fd.get('username') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const password = (fd.get('password') || '').toString();

      if (username.length < 3) return showError(registerForm, 'Username must be at least 3 characters');
      if (!/^[a-zA-Z0-9_.]+$/.test(username)) return showError(registerForm, 'Only letters, numbers, _ and . allowed');
      if (!/^\S+@\S+\.\S+$/.test(email)) return showError(registerForm, 'Enter a valid email');
      if (password.length < 6) return showError(registerForm, 'Password must be at least 6 characters');

      const btn = registerForm.querySelector('button[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Creating...';
      try {
        const { token, user } = await API.register({ username, email, password });
        AUTH.setToken(token); AUTH.setUser(user);
        toast('Welcome to Pulse!', 'success');
        setTimeout(() => location.href = 'dashboard.html', 400);
      } catch (err) {
        showError(registerForm, err.message);
      } finally {
        btn.disabled = false; btn.textContent = 'Create account';
      }
    });
  }

  const loginForm = $('#loginForm');
  if (loginForm && !window.__authLoginAttached) {
    window.__authLoginAttached = true;
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = (fd.get('email') || '').toString().trim();
      const password = (fd.get('password') || '').toString();
      if (!email || !password) return showError(loginForm, 'Email and password required');

      const btn = loginForm.querySelector('button[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Signing in...';
      try {
        const { token, user } = await API.login({ email, password });
        AUTH.setToken(token); AUTH.setUser(user);
        toast('Welcome back', 'success');
        setTimeout(() => location.href = 'dashboard.html', 400);
      } catch (err) {
        showError(loginForm, err.message || 'Login failed');
      } finally {
        btn.disabled = false; btn.textContent = 'Sign in';
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachAuthHandlers);
} else {
  attachAuthHandlers();
}

