// Profile page (view own / others) + edit profile + explore + single post.
// One file routes itself by detecting which container exists.

async function renderProfilePage() {
  if (!document.getElementById('profile-root')) return;
  if (!UI.requireAuth()) return;
  UI.renderNav();

  const me = AUTH.getUser();
  const username = UI.getQuery('u') || me?.username;
  if (!username) return location.href = 'dashboard.html';

  const root = document.getElementById('profile-root');
  root.innerHTML = `<div class="loading-center"><span class="loader"></span> Loading profile…</div>`;

  try {
    const { user, isFollowing, isSelf } = await API.getProfile(username);
    root.innerHTML = `
      <div class="profile-header">
        ${UI.avatarHtml(user, 'lg')}
        <div class="profile-info">
          <h1>${UI.escapeHtml(user.name || user.username)}</h1>
          <div class="handle">@${UI.escapeHtml(user.username)}</div>
          ${user.bio ? `<p class="profile-bio">${UI.escapeHtml(user.bio)}</p>` : ''}
          <div class="profile-stats">
            <div class="stat"><b>${user.followersCount}</b>Followers</div>
            <div class="stat"><b>${user.followingCount}</b>Following</div>
          </div>
          <div style="margin-top:16px">
            ${isSelf
              ? `<a class="btn btn-outline" href="edit-profile.html">Edit profile</a>`
              : `<button class="btn ${isFollowing ? 'btn-outline' : 'btn-primary'}" id="followBtn">${isFollowing ? 'Unfollow' : 'Follow'}</button>`
            }
          </div>
        </div>
      </div>
      <h3 style="margin:24px 0 8px">Posts</h3>
      <div class="posts-grid" id="user-posts"></div>
    `;

    const followBtn = document.getElementById('followBtn');
    if (followBtn) {
      followBtn.addEventListener('click', async () => {
        followBtn.disabled = true;
        try {
          const wasFollowing = followBtn.textContent.trim() === 'Unfollow';
          if (wasFollowing) await API.unfollow(user.username); else await API.follow(user.username);
          followBtn.textContent = wasFollowing ? 'Follow' : 'Unfollow';
          followBtn.classList.toggle('btn-primary');
          followBtn.classList.toggle('btn-outline');
          UI.toast(wasFollowing ? 'Unfollowed' : 'Following', 'success');
        } catch (err) { UI.toast(err.message, 'error'); }
        finally { followBtn.disabled = false; }
      });
    }

    const posts = document.getElementById('user-posts');
    posts.innerHTML = POSTS.skeletonPost() + POSTS.skeletonPost();
    try {
      const { posts: items } = await API.userPosts(user.username);
      posts.innerHTML = items.length
        ? items.map(p => POSTS.postCardHtml(p, me?._id)).join('')
        : `<div class="empty"><h3>No posts yet</h3></div>`;
      POSTS.attachPostActions(posts);
    } catch (err) { posts.innerHTML = `<p style="color:var(--danger)">${UI.escapeHtml(err.message)}</p>`; }
  } catch (err) {
    root.innerHTML = `<div class="empty"><h3>${UI.escapeHtml(err.message)}</h3></div>`;
  }
}

async function renderEditProfile() {
  if (!document.getElementById('edit-profile-form')) return;
  if (!UI.requireAuth()) return;
  UI.renderNav();

  // Refresh user
  let user = AUTH.getUser();
  try { const r = await API.me(); user = r.user; AUTH.setUser(user); } catch {}

  const form = document.getElementById('edit-profile-form');
  form.elements.name.value = user.name || '';
  form.elements.bio.value = user.bio || '';
  document.getElementById('current-avatar').innerHTML = UI.avatarHtml(user, 'lg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const bio = (fd.get('bio') || '').toString();
    if (bio.length > 250) return UI.toast('Bio max 250 characters', 'error');

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Saving...';
    try {
      const out = new FormData();
      out.set('name', (fd.get('name') || '').toString().slice(0, 60));
      out.set('bio', bio.slice(0, 250));
      const avatar = fd.get('avatar');
      if (avatar && avatar.size) out.set('avatar', avatar);
      const { user: updated } = await API.updateProfile(out);
      AUTH.setUser(updated);
      UI.toast('Profile updated', 'success');
      setTimeout(() => location.href = `profile.html?u=${encodeURIComponent(updated.username)}`, 500);
    } catch (err) { UI.toast(err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save changes'; }
  });
}

async function renderExplore() {
  if (!document.getElementById('explore-root')) return;
  UI.renderNav();

  const root = document.getElementById('explore-root');
  const search = document.getElementById('explore-search');

  async function load(q = '') {
    root.innerHTML = `<div class="loading-center"><span class="loader"></span> Loading users…</div>`;
    try {
      const { users } = await API.explore(q);
      if (!users.length) { root.innerHTML = `<div class="empty"><h3>No users found</h3></div>`; return; }
      root.innerHTML = users.map(u => `
        <div class="user-card">
          ${UI.avatarHtml(u, 'lg')}
          <h4><a href="profile.html?u=${encodeURIComponent(u.username)}">${UI.escapeHtml(u.name || u.username)}</a></h4>
          <p>@${UI.escapeHtml(u.username)}</p>
          ${u.bio ? `<p style="font-size:.85rem">${UI.escapeHtml(u.bio)}</p>` : ''}
          ${AUTH.getToken() ? `<button class="btn ${u.isFollowing ? 'btn-outline' : 'btn-primary'} btn-block" data-follow="${UI.escapeHtml(u.username)}">${u.isFollowing ? 'Following' : 'Follow'}</button>` : ''}
        </div>
      `).join('');
    } catch (err) { root.innerHTML = `<p style="color:var(--danger)">${UI.escapeHtml(err.message)}</p>`; }
  }

  root.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-follow]');
    if (!b) return;
    const username = b.dataset.follow;
    const following = b.textContent.trim() === 'Following';
    b.disabled = true;
    try {
      if (following) { await API.unfollow(username); b.textContent = 'Follow'; b.classList.replace('btn-outline','btn-primary'); }
      else { await API.follow(username); b.textContent = 'Following'; b.classList.replace('btn-primary','btn-outline'); }
    } catch (err) { UI.toast(err.message, 'error'); }
    finally { b.disabled = false; }
  });

  let t;
  search?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => load(search.value.trim()), 250); });
  load();
}

async function renderSinglePost() {
  if (!document.getElementById('post-detail')) return;
  UI.renderNav();
  const id = UI.getQuery('id');
  const root = document.getElementById('post-detail');
  if (!id) return root.innerHTML = '<div class="empty">Missing post id</div>';
  root.innerHTML = POSTS.skeletonPost();

  try {
    const { post } = await API.getPost(id);
    const me = AUTH.getUser();
    root.innerHTML = `
      ${POSTS.postCardHtml(post, me?._id)}
      <div class="card" style="margin-top:16px">
        <h3 style="margin:0 0 12px">Comments</h3>
        ${AUTH.getToken() ? `
          <form id="comment-form" style="display:flex; gap:8px; margin-bottom:14px;">
            <input name="text" placeholder="Add a comment..." maxlength="500" required style="flex:1">
            <button class="btn btn-primary" type="submit">Post</button>
          </form>` : '<p style="color:var(--text-muted)">Sign in to comment.</p>'}
        <div id="comments"></div>
      </div>
    `;
    POSTS.attachPostActions(root);

    const cBox = document.getElementById('comments');
    async function loadComments() {
      cBox.innerHTML = `<div class="loading-center"><span class="loader"></span></div>`;
      try {
        const { comments } = await API.listComments(id);
        if (!comments.length) { cBox.innerHTML = `<p style="color:var(--text-muted)">No comments yet.</p>`; return; }
        cBox.innerHTML = comments.map(c => `
          <div class="comment" data-comment-id="${c._id}">
            ${UI.avatarHtml(c.author, 'sm')}
            <div class="comment-body">
              <div class="meta">@${UI.escapeHtml(c.author?.username || 'user')} · ${UI.timeAgo(c.createdAt)}</div>
              <div>${UI.escapeHtml(c.text)}</div>
            </div>
            ${me && (String(c.author?._id) === String(me._id) || String(post.author?._id) === String(me._id))
              ? `<button class="btn btn-ghost btn-sm" data-del-comment>🗑</button>` : ''}
          </div>
        `).join('');
      } catch (err) { cBox.innerHTML = `<p style="color:var(--danger)">${UI.escapeHtml(err.message)}</p>`; }
    }
    await loadComments();

    cBox.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-del-comment]');
      if (!b) return;
      const row = b.closest('.comment');
      if (!confirm('Delete this comment?')) return;
      try { await API.deleteComment(row.dataset.commentId); row.remove(); UI.toast('Comment deleted', 'success'); }
      catch (err) { UI.toast(err.message, 'error'); }
    });

    const form = document.getElementById('comment-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = form.elements.text.value.trim();
      if (!text) return;
      const btn = form.querySelector('button');
      btn.disabled = true;
      try {
        const { comment } = await API.addComment(id, text);
        form.reset();
        // Prepend optimistically
        const row = document.createElement('div');
        row.innerHTML = `
          <div class="comment" data-comment-id="${comment._id}">
            ${UI.avatarHtml(comment.author, 'sm')}
            <div class="comment-body">
              <div class="meta">@${UI.escapeHtml(comment.author?.username)} · just now</div>
              <div>${UI.escapeHtml(comment.text)}</div>
            </div>
            <button class="btn btn-ghost btn-sm" data-del-comment>🗑</button>
          </div>`;
        if (cBox.querySelector('.comment')) cBox.prepend(row.firstElementChild);
        else cBox.innerHTML = ''; cBox.prepend(row.firstElementChild || row);
      } catch (err) { UI.toast(err.message, 'error'); }
      finally { btn.disabled = false; }
    });
  } catch (err) {
    root.innerHTML = `<div class="empty"><h3>${UI.escapeHtml(err.message)}</h3></div>`;
  }
}

async function renderCreatePost() {
  if (!document.getElementById('create-post-form')) return;
  if (!UI.requireAuth()) return;
  UI.renderNav();

  const form = document.getElementById('create-post-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const text = (fd.get('text') || '').toString().trim();
    const file = fd.get('image');
    if (!text && (!file || !file.size)) return UI.toast('Add some text or an image', 'error');

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.innerHTML = '<span class="loader"></span> Publishing...';
    try {
      const out = new FormData();
      out.set('text', text);
      if (file && file.size) out.set('image', file);
      const { post } = await API.createPost(out);
      UI.toast('Posted!', 'success');
      setTimeout(() => location.href = `post.html?id=${post._id}`, 400);
    } catch (err) { UI.toast(err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Publish'; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProfilePage();
  renderEditProfile();
  renderExplore();
  renderSinglePost();
  renderCreatePost();
});
