// Reusable post rendering + like/save/delete actions.

function postCardHtml(post, currentUserId) {
  const a = post.author || {};
  const isOwn = currentUserId && String(a._id) === String(currentUserId);
  const liked = !!post.likedByMe;
  const saved = !!post.savedByMe;
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
      ${post.image ? `<img class="post-image" src="${UI.escapeHtml(post.image)}" alt="" loading="lazy">` : ''}
      <div class="post-actions">
        <button class="like-btn ${liked ? 'liked' : ''}" data-action="like" aria-pressed="${liked}">
          <span class="heart">${liked ? '❤️' : '🤍'}</span>
          <span class="count" data-like-count>${post.likesCount || 0}</span>
        </button>
        <a class="action-btn" href="post.html?id=${post._id}">💬 <span>${post.commentsCount || 0}</span></a>
        <button class="action-btn save-btn ${saved ? 'saved' : ''}" data-action="save" aria-pressed="${saved}">
          ${saved ? '🔖 Saved' : '🔖 Save'}
        </button>
        ${isOwn ? `<button class="action-btn" data-action="delete-post">🗑</button>` : ''}
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
    const card = e.target.closest('.post');
    if (!card) return;
    const id = card.dataset.postId;

    const likeBtn = e.target.closest('[data-action="like"]');
    if (likeBtn) {
      if (!AUTH.getToken()) return UI.toast('Sign in to like', 'error');
      const liked = likeBtn.classList.contains('liked');
      likeBtn.classList.toggle('liked');
      likeBtn.querySelector('.heart').textContent = liked ? '🤍' : '❤️';
      likeBtn.classList.add('pop');
      setTimeout(() => likeBtn.classList.remove('pop'), 350);
      try {
        const res = liked ? await API.unlike(id) : await API.like(id);
        likeBtn.querySelector('[data-like-count]').textContent = res.likesCount;
      } catch (err) {
        likeBtn.classList.toggle('liked');
        likeBtn.querySelector('.heart').textContent = liked ? '❤️' : '🤍';
        UI.toast(err.message, 'error');
      }
      return;
    }

    const saveBtn = e.target.closest('[data-action="save"]');
    if (saveBtn) {
      if (!AUTH.getToken()) return UI.toast('Sign in to save', 'error');
      const saved = saveBtn.classList.contains('saved');
      saveBtn.classList.toggle('saved');
      saveBtn.textContent = saved ? '🔖 Save' : '🔖 Saved';
      try {
        if (saved) await API.unsavePost(id); else await API.savePost(id);
        UI.toast(saved ? 'Removed from saved' : 'Saved!', 'success');
      } catch (err) {
        saveBtn.classList.toggle('saved');
        saveBtn.textContent = saved ? '🔖 Saved' : '🔖 Save';
        UI.toast(err.message, 'error');
      }
      return;
    }

    const delBtn = e.target.closest('[data-action="delete-post"]');
    if (delBtn) {
      if (!confirm('Delete this post?')) return;
      try {
        await API.deletePost(id);
        card.style.transition = 'opacity .2s'; card.style.opacity = '0';
        setTimeout(() => card.remove(), 200);
        UI.toast('Post deleted', 'success');
      } catch (err) { UI.toast(err.message, 'error'); }
    }
  });
}

window.POSTS = { postCardHtml, skeletonPost, attachPostActions };
