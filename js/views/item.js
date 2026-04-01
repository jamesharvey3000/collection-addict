Router.register('item', async (id) => {
  const item = await DB.getItem(id);
  if (!item) {
    return `<div class="view"><div class="empty"><div class="empty-ring"><i class="fa-regular fa-face-frown"></i></div><h3>Item Not Found</h3><p>This item may have been deleted</p></div></div>`;
  }

  const cat = CATS.find(c => c.key === item.category) || { label: item.category, icon: 'fa-box' };
  const stars = item.rating ? Array.from({ length: 5 }, (_, i) => `<i class="fa-solid fa-star ${i < item.rating ? 'lit' : ''}"></i>`).join('') : '';
  const price = parseFloat(item.price);
  const priceStr = !isNaN(price) && price > 0 ? '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
  const added = new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const updated = new Date(item.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const statusColors = {
    own: 'orange', owned: 'orange', opened: 'green', consumed: 'green',
    wishlist: 'purple', sold: 'red', traded: 'blue', gifted: 'blue'
  };

  const baseRows = [
    { label: 'Category', value: cat.label, icon: cat.icon },
    item.brand ? { label: 'Brand / Maker', value: item.brand, icon: 'fa-tag' } : null,
    priceStr ? { label: 'Price Paid', value: priceStr, icon: 'fa-dollar-sign' } : null,
    { label: 'Status', value: item.status, icon: 'fa-circle-check', badge: true },
    item.location ? { label: 'Location', value: item.location, icon: 'fa-location-dot' } : null,
    { label: 'Added', value: added, icon: 'fa-calendar-plus' },
    item.updatedAt !== item.createdAt ? { label: 'Updated', value: updated, icon: 'fa-clock-rotate-left' } : null,
  ].filter(Boolean);

  const baseHtml = baseRows.map(r => `
    <div class="detail-row">
      <div class="detail-row-icon"><i class="fa-solid ${r.icon}"></i></div>
      <div class="detail-row-body">
        <div class="detail-row-label">${r.label}</div>
        ${r.badge
          ? `<span class="badge badge--${item.status}">${r.value}</span>`
          : `<div class="detail-row-value">${r.value}</div>`
        }
      </div>
    </div>
  `).join('');

  const catDetailHtml = renderDetailCatFields(item.category, item);

  const editCatFields = renderCatFields(item.category, item);

  const photoHtml = item.photoUrl
    ? `<img src="${item.photoUrl}" alt="${item.name}" class="detail-photo">`
    : '';

  const editCurrentPhotoHtml = item.photoUrl
    ? `<div class="photo-preview" id="edit-current-photo"><img src="${item.photoUrl}" alt=""><button type="button" class="photo-remove" id="edit-photo-clear"><i class="fa-solid fa-xmark"></i></button></div>`
    : '';

  return `<div class="view">
    <div class="detail-top-bar">
      <button class="btn--icon" onclick="Router.current=null;Router.navigate('collection')"><i class="fa-solid fa-arrow-left"></i></button>
      <div class="detail-top-actions">
        <button class="btn--icon" id="btn-edit-item" data-id="${item.id}"><i class="fa-solid fa-pen"></i></button>
        <button class="btn--icon btn--icon-danger" id="btn-delete-item" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>

    ${photoHtml}

    <div class="detail-header">
      <div class="detail-icon item-icon--${item.category} scale-in"><i class="fa-solid ${cat.icon}"></i></div>
      <h1 class="detail-name">${item.name}</h1>
      <div class="detail-sub">${cat.label}${item.brand ? ' &middot; ' + item.brand : ''}</div>
      ${stars ? `<div class="detail-stars">${stars}</div>` : ''}
    </div>

    <div class="card" style="margin-bottom:16px">
      ${baseHtml}
      ${catDetailHtml}
    </div>

    ${item.notes ? `
      <div class="section-head"><span class="section-title">Notes</span></div>
      <div class="card card-padded"><p class="detail-notes">${item.notes.replace(/\n/g, '<br>')}</p></div>
    ` : ''}

    <div id="edit-section" style="display:none">
      <div class="section-head"><span class="section-title">Edit Item</span></div>
      <div class="card card-padded form-card">
        <form id="edit-form" data-id="${item.id}" data-category="${item.category}">
          <div class="field"><label class="field-label">Name</label><input type="text" class="field-input" id="edit-name" value="${item.name}" required></div>
          <div class="field"><label class="field-label">Brand / Maker</label><input type="text" class="field-input" id="edit-brand" value="${item.brand || ''}"></div>
          <div class="field-row">
            <div class="field"><label class="field-label">Price Paid</label><input type="number" class="field-input" id="edit-price" value="${item.price || ''}" step="0.01" min="0"></div>
            <div class="field"><label class="field-label">Status</label><select class="field-input" id="edit-status">
              ${['own','opened','wishlist','sold','traded','gifted','consumed'].map(s => `<option value="${s}" ${item.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select></div>
          </div>
          <div class="field"><label class="field-label">Location</label><input type="text" class="field-input" id="edit-location" value="${item.location || ''}"></div>

          ${editCatFields ? `<div class="cat-fields-divider"><span>Details</span></div>${editCatFields}` : ''}

          <div class="field"><label class="field-label">Rating</label>
            <div class="stars" id="edit-star-rating">
              ${Array.from({ length: 5 }, (_, i) => `<i class="fa-solid fa-star ${i < item.rating ? 'lit' : ''}" data-edit-star="${i + 1}"></i>`).join('')}
            </div>
            <input type="hidden" id="edit-rating" value="${item.rating || 0}">
          </div>
          <div class="field"><label class="field-label">Photo</label>
            ${editCurrentPhotoHtml}
            <label class="photo-upload" id="edit-photo-label"${item.photoUrl ? ' style="display:none;margin-top:10px"' : ''}><input type="file" id="edit-photo" accept="image/*" style="display:none"><i class="fa-solid fa-camera"></i><span>${item.photoUrl ? 'Replace photo' : 'Add a photo'}</span></label>
            <div class="photo-preview" id="edit-new-photo-preview" style="display:none;margin-top:10px"><img id="edit-new-photo-img" src="" alt=""><button type="button" class="photo-remove" id="edit-new-photo-remove"><i class="fa-solid fa-xmark"></i></button></div>
            <input type="hidden" id="edit-photo-action" value="">
          </div>
          <div class="field"><label class="field-label">Notes</label><textarea class="field-input" id="edit-notes" rows="3">${item.notes || ''}</textarea></div>
          <div style="display:flex;gap:10px">
            <button type="button" class="btn btn--outline" style="flex:1" onclick="document.getElementById('edit-section').style.display='none'">Cancel</button>
            <button type="submit" class="btn btn--primary" style="flex:1"><i class="fa-solid fa-check"></i> Save</button>
          </div>
        </form>
      </div>
    </div>

    <div id="delete-confirm" class="delete-confirm" style="display:none">
      <div class="delete-confirm-inner">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:1.5rem;color:var(--red);margin-bottom:12px"></i>
        <h3 style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:6px">Delete this item?</h3>
        <p style="font-size:.84rem;color:var(--text-muted);margin-bottom:20px">This will permanently remove <strong style="color:var(--text)">${item.name}</strong> from your collection.</p>
        <div style="display:flex;gap:10px">
          <button class="btn btn--outline" style="flex:1" onclick="document.getElementById('delete-confirm').style.display='none'">Cancel</button>
          <button class="btn btn--danger" style="flex:1" id="btn-confirm-delete" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i> Delete</button>
        </div>
      </div>
    </div>
  </div>`;
});

document.addEventListener('change', (e) => {
  if (e.target.id !== 'edit-photo') return;
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('edit-photo-label').style.display = 'none';
    const preview = document.getElementById('edit-new-photo-preview');
    preview.querySelector('img').src = ev.target.result;
    preview.style.display = 'block';
    document.getElementById('edit-photo-action').value = 'replace';
  };
  reader.readAsDataURL(file);
});

document.addEventListener('click', async (e) => {
  if (e.target.closest('#edit-photo-clear')) {
    document.getElementById('edit-current-photo').style.display = 'none';
    document.getElementById('edit-photo-label').style.display = 'flex';
    document.getElementById('edit-photo-action').value = 'remove';
    return;
  }

  if (e.target.closest('#edit-new-photo-remove')) {
    document.getElementById('edit-new-photo-preview').style.display = 'none';
    document.getElementById('edit-photo-label').style.display = 'flex';
    document.getElementById('edit-photo-action').value = '';
    const inp = document.getElementById('edit-photo');
    if (inp) inp.value = '';
    return;
  }

  const row = e.target.closest('.item-row[data-id]');
  if (row) {
    const id = row.dataset.id;
    Router.current = null;
    Router.itemId = id;
    const container = document.getElementById('view-container');
    container.innerHTML = '';
    const html = await Router.views['item'](id);
    if (typeof html === 'string') container.innerHTML = html;
    Router.current = 'item';
    App.syncActiveStates('collection');
    return;
  }

  if (e.target.closest('#btn-edit-item')) {
    document.getElementById('edit-section').style.display = 'block';
    document.getElementById('edit-section').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (e.target.closest('#btn-delete-item')) {
    document.getElementById('delete-confirm').style.display = 'flex';
    return;
  }

  if (e.target.closest('#btn-confirm-delete')) {
    const id = e.target.closest('#btn-confirm-delete').dataset.id;
    await DB.deleteItem(id);
    Sync.deleteItem(id);
    App.toast('Item deleted');
    Router.current = null;
    Router.navigate('collection');
    return;
  }

  const editStar = e.target.closest('[data-edit-star]');
  if (editStar) {
    const val = parseInt(editStar.dataset.editStar);
    document.getElementById('edit-rating').value = val;
    document.querySelectorAll('#edit-star-rating i').forEach(s => {
      s.classList.toggle('lit', parseInt(s.dataset.editStar) <= val);
    });
  }
});

document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'edit-form') return;
  e.preventDefault();

  const id = e.target.dataset.id;
  const existing = await DB.getItem(id);
  if (!existing) return;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

  existing.name = document.getElementById('edit-name').value.trim();
  existing.brand = document.getElementById('edit-brand').value.trim();
  existing.price = document.getElementById('edit-price').value;
  existing.status = document.getElementById('edit-status').value;
  existing.location = document.getElementById('edit-location').value.trim();
  existing.rating = parseInt(document.getElementById('edit-rating').value) || 0;
  existing.notes = document.getElementById('edit-notes').value.trim();

  const catData = collectCatFields();
  Object.assign(existing, catData);

  const photoAction = document.getElementById('edit-photo-action')?.value;
  if (photoAction === 'remove') {
    await Photos.remove(existing.photoUrl);
    existing.photoUrl = null;
  } else if (photoAction === 'replace') {
    const file = document.getElementById('edit-photo')?.files[0];
    if (file) {
      await Photos.remove(existing.photoUrl);
      const url = await Photos.upload(file, existing.id);
      if (url) existing.photoUrl = url;
    }
  }

  const saved = await DB.addItem(existing);
  Sync.pushItem(saved);
  App.toast(saved.name + ' updated');

  Router.current = null;
  Router.itemId = id;
  const container = document.getElementById('view-container');
  container.innerHTML = '';
  const html = await Router.views['item'](id);
  if (typeof html === 'string') container.innerHTML = html;
  Router.current = 'item';
});
