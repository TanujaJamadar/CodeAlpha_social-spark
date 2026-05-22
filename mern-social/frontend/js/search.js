// Combined user + post search
document.addEventListener('DOMContentLoaded', () => {
  UI.renderNav();
  const input = document.getElementById('search-input');
  const usersBox = document.getElementById('search-users');
  const postsBox = document.getElementById('search-posts');
  POSTS.attachPostActions(postsBox);

  function renderEmpty() {
    usersBox.innerHTML = `<div class="empty"><p>Type to search people and posts.</p></div>`;
    postsBox.innerHTML = '';
  }
  renderEmpty();

  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    const q = input.value.trim();
    if (!q) return renderEmpty();
    t = setTimeout(async () => {
      usersBox.innerHTML = `<div class="loading-center"><span class="loader"></span></div>`;
      postsBox.innerHTML = `<div class="loading-center"><span class="loader"></span></div>`;
      try {
        const { users, posts } = await API.search(q);
        usersBox.innerHTML = users.length
          ? users.map(u => `
              <a class="user-row card" style="margin-bottom:10px" href="profile.html?u=${encodeURIComponent(u.username)}">
                ${UI.avatarHtml(u)}
                <div class="meta">
                  <div class="name">${UI.escapeHtml(u.name || u.username)}</div>
                  <div class="handle">@${UI.escapeHtml(u.username)}</div>
                </div>
              </a>`).join('')
          : `<div class="empty"><p>No users match.</p></div>`;
        const me = AUTH.getUser();
        postsBox.innerHTML = posts.length
          ? posts.map(p => POSTS.postCardHtml(p, me?._id)).join('')
          : `<div class="empty"><p>No posts match.</p></div>`;
      } catch (err) {
        usersBox.innerHTML = `<p style="color:var(--danger)">${UI.escapeHtml(err.message)}</p>`;
        postsBox.innerHTML = '';
      }
    }, 250);
  });
});
