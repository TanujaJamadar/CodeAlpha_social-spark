// Dashboard feed page: composer, infinite scroll feed, suggested users sidebar.

let page = 1, loading = false, hasMore = true;

async function loadSuggested() {
  const host = document.getElementById('suggested');
  try {
    const { users } = await API.suggested();
    if (!users.length) { host.innerHTML = '<p style="color:var(--text-muted)">No suggestions right now.</p>'; return; }
    host.innerHTML = users.map(u => `
      <div class="user-row">
        ${UI.avatarHtml(u)}
        <div class="meta">
          <div class="name"><a href="profile.html?u=${encodeURIComponent(u.username)}">${UI.escapeHtml(u.name || u.username)}</a></div>
          <div class="handle">@${UI.escapeHtml(u.username)}</div>
        </div>
        <button class="btn btn-sm btn-primary" data-follow="${UI.escapeHtml(u.username)}">Follow</button>
      </div>
    `).join('');
    host.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-follow]');
      if (!b) return;
      const username = b.dataset.follow;
      b.disabled = true;
      try {
        await API.follow(username);
        b.textContent = 'Following';
        b.classList.remove('btn-primary'); b.classList.add('btn-outline');
        UI.toast(`Following @${username}`, 'success');
      } catch (err) { UI.toast(err.message, 'error'); b.disabled = false; }
    }, { once: true });
  } catch (err) {
    host.innerHTML = `<p style="color:var(--danger)">${UI.escapeHtml(err.message)}</p>`;
  }
}

async function loadMore() {
  if (loading || !hasMore) return;
  loading = true;
  const list = document.getElementById('feed');
  const sentinel = document.getElementById('feed-sentinel');
  // Show skeletons on first page
  if (page === 1) list.innerHTML = POSTS.skeletonPost() + POSTS.skeletonPost();

  try {
    const me = AUTH.getUser();
    const { posts, hasMore: more } = await API.feed(page);
    if (page === 1) list.innerHTML = '';
    if (!posts.length && page === 1) {
      list.innerHTML = `<div class="empty"><h3>Your feed is quiet</h3><p>Follow people on Explore or create your first post.</p></div>`;
    }
    posts.forEach(p => list.insertAdjacentHTML('beforeend', POSTS.postCardHtml(p, me?._id)));
    hasMore = more;
    page += 1;
    if (!hasMore) sentinel.textContent = '';
  } catch (err) {
    UI.toast(err.message, 'error');
  } finally {
    loading = false;
  }
}

function initComposer() {
  const form = document.getElementById('composer');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const text = (fd.get('text') || '').toString().trim();
    const file = fd.get('image');
    if (!text && (!file || !file.size)) return UI.toast('Write something or add an image', 'error');

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Posting...';
    try {
      const out = new FormData();
      out.set('text', text);
      if (file && file.size) out.set('image', file);
      const { post } = await API.createPost(out);
      // Optimistic prepend
      const me = AUTH.getUser();
      document.getElementById('feed').insertAdjacentHTML('afterbegin', POSTS.postCardHtml(post, me?._id));
      form.reset();
      UI.toast('Posted!', 'success');
    } catch (err) { UI.toast(err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Post'; }
  });
}

function initInfiniteScroll() {
  const sentinel = document.getElementById('feed-sentinel');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) loadMore(); });
  }, { rootMargin: '300px' });
  io.observe(sentinel);
}

document.addEventListener('DOMContentLoaded', async () => {
  UI.renderNav();
  if (!UI.requireAuth()) return;
  // Refresh user from server for fresh avatar/counts
  try { const { user } = await API.me(); AUTH.setUser(user); UI.renderNav(); } catch {}
  initComposer();
  POSTS.attachPostActions(document.getElementById('feed'));
  loadMore();
  initInfiniteScroll();
  loadSuggested();
});
