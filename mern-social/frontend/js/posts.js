// Reusable post rendering + composer + feed/pagination + single-post + comments.

function postCardHtml(post, currentUserId) {
  const a = post.author || {};
  const isOwn = currentUserId && String(a._id) === String(currentUserId);
  return `
    <article class="post" data-post-id="${post._id}">
      <div class="post-head">
        ${UI.avatarHtml(a)}
        <div class="post-meta">
          <div class="name">
            <a href="profile.html?u=${encodeURIComponent(a.username || '')}">${UI.escapeHtml(a.name || a.username || 'User')}</a>
          </div>
          <div class="meta">@${UI.escapeHtml(a.username || '')} · ${UI.timeAgo(post.createdAt)}</div>
        </div>
      </div>
      ${post.text ? `<div class="post-text">${UI.escapeHtml(post.text)}</div>` : ''}
      ${post.image ? `<img class="post-image" src="${UI.escapeHtml(post.image)}" alt="">` : ''}
      <div class="post-actions">
        <a class="btn btn-ghost btn-sm" href="post.html?id=${post._id}">💬 ${post.commentsCount || 0} Comments</a>
        ${isOwn ? `<button class="btn btn-ghost btn-sm" data-action="delete-post">🗑 Delete</button>` : ''}
      </div>
    </article>
  `;
}

function skeletonPost() {
  return `
    <div class="skeleton-post">
      <div class="skeleton-post-head">
        <div class="skeleton skeleton-avatar"></div>
        <div style="flex:1">
          <div class="skeleton skeleton-line" style="width: 35%"></div>
          <div class="skeleton skeleton-line" style="width: 20%"></div>
        </div>
      </div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line" style="width: 80%"></div>
      <div class="skeleton skeleton-line" style="width: 60%"></div>
    </div>
  `;
}

function attachPostActions(container) {
  container.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="delete-post"]');
    if (!btn) return;
    const card = btn.closest('.post');
    const id = card.dataset.postId;
    if (!confirm('Delete this post?')) return;
    try {
      await API.deletePost(id);
      card.style.transition = 'opacity .2s'; card.style.opacity = '0';
      setTimeout(() => card.remove(), 200);
      UI.toast('Post deleted', 'success');
    } catch (err) { UI.toast(err.message, 'error'); }
  });
}

window.POSTS = { postCardHtml, skeletonPost, attachPostActions };
