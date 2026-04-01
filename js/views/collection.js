Router.register('collection', async () => {
  const items = await DB.getAllItems();
  const sorted = items.sort((a, b) => b.createdAt - a.createdAt);
  const allCats = [{ key: 'all', label: 'All', icon: 'fa-layer-group' }, ...CATS.filter(c => c.key !== 'other')];

  const pills = allCats.map((c, i) =>
    `<button class="chip ${i === 0 ? 'active' : ''}" data-filter="${c.key}"><i class="fa-solid ${c.icon}"></i>${c.label}</button>`
  ).join('');

  const renderItems = (list) => {
    if (!list.length) return `<div class="empty"><div class="empty-ring"><i class="fa-solid fa-box-open"></i></div><h3>Nothing Here Yet</h3><p>Items you add will show up here</p></div>`;
    return list.map(i => {
      const p = fmtPrice(i.price);
      const d = fmtDate(i.createdAt);
      const lead = i.photoUrl
        ? `<img src="${i.photoUrl}" alt="${i.name}" class="item-thumb">`
        : `<div class="item-icon item-icon--${i.category}"><i class="fa-solid ${catIcon(i.category)}"></i></div>`;
      return `<div class="item-row" data-id="${i.id}">
        ${lead}
        <div class="item-body"><div class="item-name">${i.name}</div><div class="item-meta">${i.brand || catLabel(i.category)}${i.rating ? ' &middot; ' + '\u2605'.repeat(i.rating) : ''}</div></div>
        <div class="item-right"><span class="badge badge--${i.status || 'own'}">${i.status || 'own'}</span><div class="item-date">${d}</div></div>
      </div>`;
    }).join('');
  };

  setTimeout(() => {
    document.querySelectorAll('#coll-filters .chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#coll-filters .chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const k = btn.dataset.filter;
        document.getElementById('coll-list').innerHTML = renderItems(k === 'all' ? sorted : sorted.filter(i => i.category === k));
      });
    });
  }, 0);

  return `<div class="view">
    <div class="greeting"><div class="greeting-main">Collection</div><div class="greeting-sub">${items.length} total items</div></div>
    <div class="chip-scroll" id="coll-filters">${pills}</div>
    <div class="card" id="coll-list">${renderItems(sorted)}</div>
  </div>`;
});
