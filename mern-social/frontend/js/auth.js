// Register & login form logic
window.__authJsLoaded = true;
window.__authLoginAttached = false;
window.__authRegisterAttached = false;
const { $, toast, redirectIfLoggedIn } = UI;

function showError(form, msg) {
  form.querySelector('.form-success.global')?.remove();
  let el = form.querySelector('.form-error.global');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-error global';
    form.prepend(el);
  }
  el.textContent = msg;
}

function showSuccess(form, msg) {
  form.querySelector('.form-error.global')?.remove();
  let el = form.querySelector('.form-success.global');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-success global';
    form.prepend(el);
  }
  el.textContent = msg;
}

function friendlyAuthError(message, mode) {
  if (message === 'Invalid credentials') {
    return 'Invalid login. Use your registered email address, not username, and the exact password you created.';
  }
  if (message === 'Username or email already in use') {
    return 'That username or email is already registered. Choose another one or sign in with the existing email.';
  }
  if (mode === 'register' && message === 'Valid email required') {
    return 'Enter a valid email address, for example name@example.com.';
  }
  return message || 'Something went wrong. Please try again.';
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

      if (username.length < 3 || username.length > 30) return showError(registerForm, 'Username must be 3-30 characters long.');
      if (!/^[a-zA-Z0-9_.]+$/.test(username)) return showError(registerForm, 'Username can only use letters, numbers, underscore, and dot.');
      if (!/^\S+@\S+\.\S+$/.test(email)) return showError(registerForm, 'Enter a valid email address, for example name@example.com.');
      if (password.length < 6) return showError(registerForm, 'Password must be at least 6 characters long.');

      const btn = registerForm.querySelector('button[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Creating...';
      try {
        const { token, user } = await API.register({ username, email, password });
        AUTH.setToken(token); AUTH.setUser(user);
        showSuccess(registerForm, 'Account created successfully. Redirecting to your dashboard...');
        toast('Welcome to Pulse!', 'success');
        setTimeout(() => location.assign('dashboard.html'), 700);
      } catch (err) {
        showError(registerForm, friendlyAuthError(err.message, 'register'));
      } finally {
        if (!AUTH.getToken()) {
          btn.disabled = false; btn.textContent = 'Create account';
        }
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
      if (!email) return showError(loginForm, 'Enter the email address you used when creating your account.');
      if (!/^\S+@\S+\.\S+$/.test(email)) return showError(loginForm, 'Enter a valid email address. Login uses email, not username.');
      if (!password) return showError(loginForm, 'Enter your account password.');

      const btn = loginForm.querySelector('button[type=submit]');
      btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Signing in...';
      try {
        const { token, user } = await API.login({ email, password });
        AUTH.setToken(token); AUTH.setUser(user);
        showSuccess(loginForm, 'Signed in successfully. Redirecting to your dashboard...');
        toast('Welcome back', 'success');
        setTimeout(() => location.assign('dashboard.html'), 700);
      } catch (err) {
        showError(loginForm, friendlyAuthError(err.message, 'login'));
      } finally {
        if (!AUTH.getToken()) {
          btn.disabled = false; btn.textContent = 'Sign in';
        }
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachAuthHandlers);
} else {
  attachAuthHandlers();
}

