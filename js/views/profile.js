Router.register('profile', async () => {
  const s = await DB.getStats();
  const loggedIn = Auth.isLoggedIn();
  const isGuest = DB._guest;
  const displayName = loggedIn ? Auth.getDisplayName() : 'Guest';
  const userSub = loggedIn ? Auth.getEmail() : isGuest ? 'Sandbox mode — nothing is saved' : '';
  const firstName = loggedIn ? Auth.getFirstName() : '';
  const lastName = loggedIn ? Auth.getLastName() : '';

  const topCats = Object.entries(s.categories).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const colors = ['orange', 'green', 'blue', 'purple'];

  const catHtml = topCats.length ? topCats.map(([cat, count], i) => {
    const pct = Math.round((count / s.total) * 100);
    return `<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:.82rem;font-weight:600;text-transform:capitalize;color:var(--text)">${cat.replace('_', ' ')}</span>
        <span style="font-size:.72rem;color:var(--text-muted)">${count} items &middot; ${pct}%</span>
      </div>
      <div class="pbar"><div class="pbar-fill pbar-fill--${colors[i % 4]}" style="width:${pct}%"></div></div>
    </div>`;
  }).join('') : '<p style="color:var(--text-muted);font-size:.84rem">Add items to see your breakdown</p>';

  const nameSection = loggedIn ? `
    <div class="section-head"><span class="section-title">Profile</span></div>
    <div class="card card-padded" style="margin-bottom:8px">
      <form id="profile-name-form">
        <div class="field-row">
          <div class="field">
            <label class="field-label">First Name</label>
            <input type="text" class="field-input" id="profile-first" value="${firstName}" placeholder="First name">
          </div>
          <div class="field">
            <label class="field-label">Last Name</label>
            <input type="text" class="field-input" id="profile-last" value="${lastName}" placeholder="Last name">
          </div>
        </div>
        <button type="submit" class="btn btn--primary btn--block" id="btn-save-name">
          <i class="fa-solid fa-check"></i> Save Name
        </button>
      </form>
    </div>
  ` : '';

  const authSection = loggedIn ? `
    <div class="section-head"><span class="section-title">Cloud Sync</span></div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:8px">
      <button class="btn btn--outline btn--block" id="btn-sync-push">
        <i class="fa-solid fa-cloud-arrow-up"></i> Push to Cloud
      </button>
      <button class="btn btn--outline btn--block" id="btn-sync-pull">
        <i class="fa-solid fa-cloud-arrow-down"></i> Pull from Cloud
      </button>
      <button class="btn btn--outline btn--block" id="btn-signout" style="color:var(--red);border-color:var(--red-dim)">
        <i class="fa-solid fa-right-from-bracket"></i> Sign Out
      </button>
    </div>
  ` : isGuest ? `
    <div class="section-head"><span class="section-title">Account</span></div>
    <div class="card card-padded" style="margin-bottom:12px;border-color:var(--orange-dim)">
      <div style="display:flex;align-items:flex-start;gap:12px">
        <i class="fa-solid fa-triangle-exclamation" style="color:var(--orange);font-size:1.1rem;margin-top:2px"></i>
        <div>
          <div style="font-weight:600;font-size:.88rem;margin-bottom:4px">You're in sandbox mode</div>
          <p style="font-size:.8rem;color:var(--text-muted);line-height:1.5;margin-bottom:12px">Everything you add will disappear when you close or refresh the page. Create an account to save your collection.</p>
          <button class="btn btn--primary btn--block" onclick="Router.current=null;Router.navigate('auth')">
            <i class="fa-solid fa-user-plus"></i> Create Account
          </button>
        </div>
      </div>
    </div>
  ` : `
    <div class="section-head"><span class="section-title">Account</span></div>
    <button class="btn btn--primary btn--block" onclick="Router.current=null;Router.navigate('auth')" style="margin-bottom:8px">
      <i class="fa-solid fa-right-to-bracket"></i> Sign In / Create Account
    </button>
    <p style="font-size:.78rem;color:var(--text-muted);text-align:center;margin-bottom:8px">Sign in to sync your collection across devices</p>
  `;

  return `<div class="view">
    <div class="profile-header">
      <div class="avatar"><i class="fa-solid fa-user"></i></div>
      <div>
        <div class="profile-name">${displayName}</div>
        <div class="profile-sub">${userSub}</div>
      </div>
    </div>

    <div class="stats-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="stat-tile stat-tile--orange"><div class="stat-value">${s.total}</div><div class="stat-label">Items</div></div>
      <div class="stat-tile stat-tile--green"><div class="stat-value">${Object.keys(s.categories).length}</div><div class="stat-label">Categories</div></div>
      <div class="stat-tile stat-tile--blue"><div class="stat-value">$${s.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div><div class="stat-label">Value</div></div>
    </div>

    ${nameSection}

    <div class="section-head"><span class="section-title">Breakdown</span></div>
    <div class="card card-padded" style="margin-bottom:8px">${catHtml}</div>

    ${authSection}

    ${!isGuest ? `<div class="section-head"><span class="section-title">Data</span></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <button class="btn btn--outline btn--block" id="btn-export"><i class="fa-solid fa-download"></i> Export Collection</button>
      <label class="btn btn--outline btn--block" style="cursor:pointer"><i class="fa-solid fa-upload"></i> Import Collection<input type="file" id="btn-import" accept=".json" style="display:none"></label>
    </div>` : ''}

    <div class="section-head"><span class="section-title">About</span></div>
    <div class="card card-padded"><p style="font-size:.84rem;color:var(--text-muted);line-height:1.6"><strong style="color:var(--text)">Collection Addict</strong> v0.1.0<br>Track whiskey, cigars, pipes, hats, and beyond.</p></div>
  </div>`;
});

document.addEventListener('submit', async (e) => {
  if (e.target.id === 'profile-name-form') {
    e.preventDefault();
    const first = document.getElementById('profile-first').value.trim();
    const last = document.getElementById('profile-last').value.trim();
    const btn = document.getElementById('btn-save-name');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    const { error } = await Auth.updateProfile(first, last);

    if (error) {
      App.toast('Failed to save: ' + error.message);
    } else {
      App.toast('Name updated');
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Save Name';

    Router.current = null;
    Router.navigate('profile');
  }
});

document.addEventListener('click', async (e) => {
  if (e.target.closest('#btn-export')) {
    const items = await DB.getAllItems();
    const data = JSON.stringify({ version: 1, exported: new Date().toISOString(), items }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collection-addict-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    App.toast('Collection exported');
  }

  if (e.target.closest('#btn-signout')) {
    await Auth.signOut();
    App.toast('Signed out');
    document.body.classList.add('auth-page');
    Router.current = null;
    Router.navigate('auth');
  }

  if (e.target.closest('#btn-sync-push')) {
    const btn = document.getElementById('btn-sync-push');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pushing...';
    const count = await Sync.pushAllToCloud();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Push to Cloud';
    App.toast(count + ' items pushed to cloud');
  }

  if (e.target.closest('#btn-sync-pull')) {
    const btn = document.getElementById('btn-sync-pull');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pulling...';
    await Sync.pullFromCloud();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Pull from Cloud';
    Router.current = null;
    Router.navigate('profile');
  }
});

document.addEventListener('change', async (e) => {
  if (e.target.id !== 'btn-import') return;
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    let count = 0;
    for (const item of (data.items || [])) {
      const saved = await DB.addItem(item);
      Sync.pushItem(saved);
      count++;
    }
    App.toast('Imported ' + count + ' items');
    Router.current = null;
    Router.navigate('profile');
  } catch (err) {
    App.toast('Import failed');
  }
});
