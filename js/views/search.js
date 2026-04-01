Router.register('search', async () => {
  return `<div class="view">
    <div class="greeting"><div class="greeting-main">Search</div></div>
    <div class="field"><div class="search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input type="text" class="field-input" id="search-input" placeholder="Search by name, brand, or notes..."></div></div>
    <div id="search-results"><div class="empty"><div class="empty-ring"><i class="fa-solid fa-magnifying-glass"></i></div><h3>Find Anything</h3><p>Search across every category in your collection</p></div></div>
  </div>`;
});

document.addEventListener('input', async (e) => {
  if (e.target.id !== 'search-input') return;
  const q = e.target.value.toLowerCase().trim();
  const r = document.getElementById('search-results');
  if (!r) return;

  if (!q) {
    r.innerHTML = '<div class="empty"><div class="empty-ring"><i class="fa-solid fa-magnifying-glass"></i></div><h3>Find Anything</h3><p>Search by name, brand, or notes</p></div>';
    return;
  }

  const items = await DB.getAllItems();
  const m = items.filter(i =>
    (i.name || '').toLowerCase().includes(q) ||
    (i.brand || '').toLowerCase().includes(q) ||
    (i.category || '').toLowerCase().includes(q) ||
    (i.notes || '').toLowerCase().includes(q)
  );

  if (!m.length) {
    r.innerHTML = `<div class="empty"><div class="empty-ring"><i class="fa-regular fa-face-meh"></i></div><h3>No Results</h3><p>Nothing matches "${e.target.value}"</p></div>`;
    return;
  }

  r.innerHTML = '<div class="card">' + m.map(i => `<div class="item-row" data-id="${i.id}">
    <div class="item-icon item-icon--${i.category}"><i class="fa-solid ${catIcon(i.category)}"></i></div>
    <div class="item-body"><div class="item-name">${i.name}</div><div class="item-meta">${catLabel(i.category)}${i.brand ? ' &middot; ' + i.brand : ''}</div></div>
    <div class="item-right"><span class="badge badge--${i.status || 'own'}">${i.status || 'own'}</span></div>
  </div>`).join('') + '</div>';
});
