// Notifications center
function notifLine(n) {
  const s = n.sender || {};
  const handle = `<a href="profile.html?u=${encodeURIComponent(s.username || '')}"><b>@${UI.escapeHtml(s.username || 'user')}</b></a>`;
  let body = '';
  let href = `profile.html?u=${encodeURIComponent(s.username || '')}`;
  if (n.type === 'follow') body = `${handle} started following you`;
  else if (n.type === 'like') { body = `${handle} liked your post`; href = n.post ? `post.html?id=${n.post._id}` : href; }
  else if (n.type === 'comment') { body = `${handle} commented: ${UI.escapeHtml((n.text || '').slice(0,80))}`; href = n.post ? `post.html?id=${n.post._id}` : href; }
  return `
    <a class="notif-row ${n.read ? '' : 'unread'}" href="${href}">
      ${UI.avatarHtml(s)}
      <div class="notif-body">
        <div>${body}</div>
        <div class="meta">${UI.timeAgo(n.createdAt)}</div>
      </div>
      ${n.read ? '' : '<span class="dot"></span>'}
    </a>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  UI.renderNav();
  if (!UI.requireAuth()) return;
  const list = document.getElementById('notif-list');
  list.innerHTML = `<div class="loading-center"><span class="loader"></span> Loading…</div>`;
  try {
    const { notifications } = await API.notifications();
    if (!notifications.length) {
      list.innerHTML = `<div class="empty"><h3>No notifications yet</h3><p>When people interact with you, you'll see it here.</p></div>`;
    } else {
      list.innerHTML = `<div class="notif-stack">${notifications.map(notifLine).join('')}</div>`;
    }
    try { await API.markAllNotificationsRead(); UI.refreshNotifBadge(); } catch {}
  } catch (err) {
    list.innerHTML = `<p style="color:var(--danger)">${UI.escapeHtml(err.message)}</p>`;
  }

  document.getElementById('mark-all')?.addEventListener('click', async () => {
    try {
      await API.markAllNotificationsRead();
      document.querySelectorAll('.notif-row.unread').forEach(r => { r.classList.remove('unread'); r.querySelector('.dot')?.remove(); });
      UI.refreshNotifBadge();
      UI.toast('All marked read', 'success');
    } catch (err) { UI.toast(err.message, 'error'); }
  });
});
