const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function sortByPriority(items) {
  return [...items].sort((a, b) =>
    (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
  );
}

Router.register('wishlist', async () => {
  const all = await DB.getAllItems();
  const wishItems = all.filter(i => i.status === 'wishlist');
  const sorted = sortByPriority(wishItems);

  const allCats = [{ key: 'all', label: 'All', icon: 'fa-layer-group' }, ...CATS.filter(c => c.key !== 'other')];
  const pills = allCats.map((c, i) =>
    `<button class="chip ${i === 0 ? 'active' : ''}" data-filter="${c.key}"><i class="fa-solid ${c.icon}"></i>${c.label}</button>`
  ).join('');

  const renderItems = (list) => {
    if (!list.length) return `<div class="empty"><div class="empty-ring"><i class="fa-regular fa-heart"></i></div><h3>Wishlist Empty</h3><p>Add items with Wishlist status to see them here</p></div>`;
    return list.map(i => {
      const lead = (i.photoThumbUrl || i.photoUrl)
        ? `<img src="${i.photoThumbUrl || i.photoUrl}" alt="${i.name}" class="item-thumb">`
        : `<div class="item-icon item-icon--${i.category}"><i class="fa-solid ${catIcon(i.category)}"></i></div>`;
      const priorityHtml = i.priority
        ? `<span class="badge badge--priority-${i.priority}">${i.priority.charAt(0).toUpperCase() + i.priority.slice(1)}</span>`
        : '';
      const priceHtml = i.expectedPrice
        ? `<span class="expected-price">~$${parseFloat(i.expectedPrice).toFixed(2)}</span>`
        : '';
      const metaHtml = (priorityHtml || priceHtml)
        ? `<div class="wishlist-row-meta">${priorityHtml}${priceHtml}</div>`
        : '';
      const safeName = (i.name || '').replace(/"/g, '&quot;');
      return `<div class="wishlist-row" data-id="${i.id}">
        ${lead}
        <div class="item-body">
          <div class="item-name">${i.name}</div>
          <div class="item-meta">${i.brand || catLabel(i.category)}</div>
          ${metaHtml}
        </div>
        <button class="btn btn--primary btn--sm btn-got-it" data-id="${i.id}" data-name="${safeName}"><i class="fa-solid fa-check"></i> Got It</button>
      </div>`;
    }).join('');
  };

  setTimeout(() => {
    document.querySelectorAll('#wish-filters .chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#wish-filters .chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const k = btn.dataset.filter;
        document.getElementById('wish-list').innerHTML = renderItems(
          k === 'all' ? sorted : sorted.filter(i => i.category === k)
        );
      });
    });
  }, 0);

  const shareBtn = wishItems.length
    ? `<button class="btn btn--outline btn--sm" id="btn-share-wishlist"><i class="fa-solid fa-share-nodes"></i> Share</button>`
    : '';

  return `<div class="view">
    <div class="wish-header">
      <div class="greeting" style="margin-bottom:0">
        <div class="greeting-main">Wishlist</div>
        <div class="greeting-sub">${wishItems.length} item${wishItems.length !== 1 ? 's' : ''}</div>
      </div>
      ${shareBtn}
    </div>
    <div class="chip-scroll" id="wish-filters">${pills}</div>
    <div class="card" id="wish-list">${renderItems(sorted)}</div>

    <div id="got-it-modal" class="delete-confirm" style="display:none">
      <div class="delete-confirm-inner">
        <i class="fa-solid fa-bag-shopping" style="font-size:1.5rem;color:var(--green);margin-bottom:12px"></i>
        <h3 id="got-it-title" style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:6px">Got it!</h3>
        <p style="font-size:.84rem;color:var(--text-muted);margin-bottom:16px">What did you pay for it?</p>
        <div class="field" style="text-align:left">
          <label class="field-label">Purchase Price</label>
          <input type="number" class="field-input" id="got-it-price" placeholder="0.00" step="0.01" min="0">
        </div>
        <div style="display:flex;gap:10px;margin-top:4px">
          <button class="btn btn--outline" style="flex:1" id="got-it-cancel">Cancel</button>
          <button class="btn btn--primary" style="flex:1" id="got-it-confirm"><i class="fa-solid fa-check"></i> Mark as Owned</button>
        </div>
      </div>
    </div>
  </div>`;
});

document.addEventListener('click', async (e) => {
  if (e.target.closest('#btn-share-wishlist')) {
    const all = await DB.getAllItems();
    const items = sortByPriority(all.filter(i => i.status === 'wishlist'));
    const lines = items.map((i, idx) => {
      const price = i.expectedPrice ? ` (~$${parseFloat(i.expectedPrice).toFixed(2)})` : '';
      const priority = i.priority ? ` [${i.priority}]` : '';
      return `${idx + 1}. ${i.name}${i.brand ? ' \u2014 ' + i.brand : ''}${price}${priority}`;
    });
    const text = `My Wishlist\n${'─'.repeat(20)}\n${lines.join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      App.toast('Wishlist copied to clipboard');
    } catch {
      App.toast('Could not copy — try a different browser');
    }
    return;
  }

  const gotBtn = e.target.closest('.btn-got-it');
  if (gotBtn) {
    const title = document.getElementById('got-it-title');
    if (title) title.textContent = `Got ${gotBtn.dataset.name}!`;
    const inp = document.getElementById('got-it-price');
    if (inp) inp.value = '';
    const confirm = document.getElementById('got-it-confirm');
    if (confirm) confirm.dataset.id = gotBtn.dataset.id;
    const modal = document.getElementById('got-it-modal');
    if (modal) modal.style.display = 'flex';
    return;
  }

  if (e.target.closest('#got-it-cancel')) {
    const modal = document.getElementById('got-it-modal');
    if (modal) modal.style.display = 'none';
    return;
  }

  if (e.target.closest('#got-it-confirm')) {
    const btn = e.target.closest('#got-it-confirm');
    const id = btn.dataset.id;
    const price = document.getElementById('got-it-price')?.value;
    const item = await DB.getItem(id);
    if (item) {
      item.status = 'own';
      if (price) item.price = price;
      const saved = await DB.addItem(item);
      Sync.pushItem(saved);
      App.toast(`${item.name} added to collection`);
    }
    document.getElementById('got-it-modal').style.display = 'none';
    Router.current = null;
    Router.navigate('wishlist');
    return;
  }

  const wishRow = e.target.closest('.wishlist-row[data-id]');
  if (wishRow && Router.current === 'wishlist') {
    const id = wishRow.dataset.id;
    Router.current = null;
    Router.itemId = id;
    const container = document.getElementById('view-container');
    container.innerHTML = '';
    const html = await Router.views['item'](id);
    if (typeof html === 'string') container.innerHTML = html;
    Router.current = 'item';
    App.syncActiveStates('wishlist');
  }
});
