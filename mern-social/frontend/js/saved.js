document.addEventListener('DOMContentLoaded', async () => {
  UI.renderNav();
  if (!UI.requireAuth()) return;
  const list = document.getElementById('saved-list');
  list.innerHTML = POSTS.skeletonPost() + POSTS.skeletonPost();
  POSTS.attachPostActions(list);
  try {
    const { posts } = await API.savedPosts();
    const me = AUTH.getUser();
    posts.forEach(p => { p.savedByMe = true; });
    list.innerHTML = posts.length
      ? posts.map(p => POSTS.postCardHtml(p, me?._id)).join('')
      : `<div class="empty"><h3>No saved posts</h3><p>Tap the bookmark icon on any post to save it here.</p></div>`;
  } catch (err) {
    list.innerHTML = `<p style="color:var(--danger)">${UI.escapeHtml(err.message)}</p>`;
  }
});
