const CATS = [
  { key: 'whiskey', label: 'Whiskey', icon: 'fa-wine-bottle' },
  { key: 'wine', label: 'Wine', icon: 'fa-wine-glass' },
  { key: 'beer', label: 'Beer', icon: 'fa-beer-mug-empty' },
  { key: 'cigar', label: 'Cigars', icon: 'fa-smoking' },
  { key: 'pipe_tobacco', label: 'Pipe Tobacco', icon: 'fa-leaf' },
  { key: 'pipe', label: 'Pipes', icon: 'fa-smoking' },
  { key: 'hat', label: 'Hats', icon: 'fa-hat-cowboy' },
  { key: 'other', label: 'Other', icon: 'fa-box' }
];

function catIcon(k) { return (CATS.find(c => c.key === k) || { icon: 'fa-box' }).icon; }
function catLabel(k) { return (CATS.find(c => c.key === k) || { label: k }).label; }
function fmtDate(ts) { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function fmtPrice(v) { const n = parseFloat(v); return isNaN(n) || n === 0 ? '' : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }

Router.register('home', async () => {
  const s = await DB.getStats();
  const recent = s.items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  const h = new Date().getHours();
  const timeGreet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const userName = Auth.isLoggedIn() ? Auth.getDisplayName() : DB._guest ? 'Guest' : '';
  const greet = userName ? timeGreet + ', ' + userName : timeGreet;

  const pills = CATS.filter(c => c.key !== 'other').map(c => {
    const n = s.categories[c.key] || 0;
    return `<button class="chip" onclick="Router.current=null;Router.navigate('collection')">
      <i class="fa-solid ${c.icon}"></i>${c.label}<span class="chip-count">${n}</span>
    </button>`;
  }).join('');

  const rows = recent.length ? recent.map(i => {
    const p = fmtPrice(i.price);
    const d = fmtDate(i.createdAt);
    return `<div class="item-row" data-id="${i.id}">
      <div class="item-icon item-icon--${i.category}"><i class="fa-solid ${catIcon(i.category)}"></i></div>
      <div class="item-body"><div class="item-name">${i.name}</div><div class="item-meta">${catLabel(i.category)}${i.brand ? ' &middot; ' + i.brand : ''}</div></div>
      <div class="item-right">${p ? '<div class="item-price">' + p + '</div>' : ''}<div class="item-date">${d}</div></div>
    </div>`;
  }).join('') : `<div class="empty"><div class="empty-ring"><i class="fa-solid fa-box-open"></i></div><h3>Start Your Collection</h3><p>Tap the + button to add your first item</p></div>`;

  return `<div class="view">
    <div class="greeting"><div class="greeting-sub">${greet}</div><div class="greeting-main">Your Collection</div></div>
    <div class="stats-row">
      <div class="stat-tile stat-tile--orange slide-up stagger-1"><div class="stat-icon stat-icon--orange"><i class="fa-solid fa-layer-group"></i></div><div class="stat-value">${s.total}</div><div class="stat-label">Total items</div></div>
      <div class="stat-tile stat-tile--green slide-up stagger-2"><div class="stat-icon stat-icon--green"><i class="fa-solid fa-dollar-sign"></i></div><div class="stat-value">$${s.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div><div class="stat-label">Est. value</div></div>
      <div class="stat-tile stat-tile--blue slide-up stagger-3"><div class="stat-icon stat-icon--blue"><i class="fa-solid fa-box-open"></i></div><div class="stat-value">${(s.statuses['opened'] || 0) + (s.statuses['consumed'] || 0)}</div><div class="stat-label">Opened</div></div>
      <div class="stat-tile stat-tile--purple slide-up stagger-4"><div class="stat-icon stat-icon--purple"><i class="fa-regular fa-heart"></i></div><div class="stat-value">${s.statuses['wishlist'] || 0}</div><div class="stat-label">Wishlist</div></div>
    </div>
    <div class="chip-scroll">${pills}</div>
    <div class="actions-row">
      <button class="action-tile" onclick="Router.current=null;Router.navigate('add')"><div class="action-icon action-icon--add"><i class="fa-solid fa-plus"></i></div><span class="action-label">Add Item</span></button>
      <button class="action-tile" onclick="Router.current=null;Router.navigate('search')"><div class="action-icon action-icon--scan"><i class="fa-solid fa-barcode"></i></div><span class="action-label">Scan</span></button>
      <button class="action-tile" onclick="Router.current=null;Router.navigate('collection')"><div class="action-icon action-icon--list"><i class="fa-solid fa-list"></i></div><span class="action-label">View All</span></button>
    </div>
    <div class="section-head"><span class="section-title">Recent Activity</span><span class="section-link" onclick="Router.current=null;Router.navigate('collection')">See all &rarr;</span></div>
    <div class="card">${rows}</div>
  </div>`;
});
