Router.register('add', async () => {
  const opts = CATS.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
  return `<div class="view">
    <div class="greeting"><div class="greeting-main">Add Item</div></div>
    <div class="card card-padded form-card">
    <form id="add-form">
      <div class="field"><label class="field-label">Category</label><select class="field-input" id="add-category" required><option value="" disabled selected>Select a category...</option>${opts}</select></div>
      <div class="field"><label class="field-label">Name</label><input type="text" class="field-input" id="add-name" placeholder="e.g. Blanton's Single Barrel" required></div>
      <div class="field"><label class="field-label">Brand / Maker</label><input type="text" class="field-input" id="add-brand" placeholder="e.g. Buffalo Trace"></div>
      <div class="field-row">
        <div class="field"><label class="field-label">Price Paid</label><input type="number" class="field-input" id="add-price" placeholder="0.00" step="0.01" min="0"></div>
        <div class="field"><label class="field-label">Status</label><select class="field-input" id="add-status"><option value="own">Own</option><option value="opened">Opened</option><option value="wishlist">Wishlist</option><option value="sold">Sold</option><option value="traded">Traded</option><option value="gifted">Gifted</option><option value="consumed">Consumed</option></select></div>
      </div>
      <div class="field"><label class="field-label">Storage Location</label><input type="text" class="field-input" id="add-location" placeholder="e.g. Shelf 2, Humidor A"></div>

      <div id="cat-fields-section"></div>

      <div class="field"><label class="field-label">Rating</label><div class="stars" id="star-rating"><i class="fa-solid fa-star" data-star="1"></i><i class="fa-solid fa-star" data-star="2"></i><i class="fa-solid fa-star" data-star="3"></i><i class="fa-solid fa-star" data-star="4"></i><i class="fa-solid fa-star" data-star="5"></i></div><input type="hidden" id="add-rating" value="0"></div>
      <div class="field"><label class="field-label">Photo</label><label class="photo-upload" id="add-photo-label"><input type="file" id="add-photo" accept="image/*" style="display:none"><i class="fa-solid fa-camera"></i><span>Add a photo</span></label><div class="photo-preview" id="add-photo-preview" style="display:none"><img id="add-photo-img" src="" alt=""><button type="button" class="photo-remove" id="add-photo-remove"><i class="fa-solid fa-xmark"></i></button></div></div>
      <div class="field"><label class="field-label">Notes</label><textarea class="field-input" id="add-notes" rows="3" placeholder="Tasting notes, condition details..."></textarea></div>
      <button type="submit" class="btn btn--primary btn--block"><i class="fa-solid fa-plus"></i> Add to Collection</button>
    </form>
    </div>
  </div>`;
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'add-category') {
    const section = document.getElementById('cat-fields-section');
    if (section) {
      const html = renderCatFields(e.target.value, null);
      section.innerHTML = html ? `<div class="cat-fields-divider"><span>Details</span></div>${html}` : '';
    }
  }
  if (e.target.id === 'add-photo') {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('add-photo-label').style.display = 'none';
      const preview = document.getElementById('add-photo-preview');
      preview.querySelector('img').src = ev.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const cat = document.getElementById('add-category');
    if (cat) cat.dispatchEvent(new Event('change'));
  }, 300);
});

document.addEventListener('click', (e) => {
  if (e.target.closest('#add-photo-remove')) {
    document.getElementById('add-photo-preview').style.display = 'none';
    document.getElementById('add-photo-label').style.display = 'flex';
    document.getElementById('add-photo').value = '';
    return;
  }
  const star = e.target.closest('[data-star]');
  if (!star) return;
  const val = parseInt(star.dataset.star);
  document.getElementById('add-rating').value = val;
  document.querySelectorAll('#star-rating i').forEach(s => {
    s.classList.toggle('lit', parseInt(s.dataset.star) <= val);
  });
});

document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'add-form') return;
  e.preventDefault();

  const item = {
    category: document.getElementById('add-category').value,
    name: document.getElementById('add-name').value.trim(),
    brand: document.getElementById('add-brand').value.trim(),
    price: document.getElementById('add-price').value,
    status: document.getElementById('add-status').value,
    location: document.getElementById('add-location').value.trim(),
    rating: parseInt(document.getElementById('add-rating').value) || 0,
    notes: document.getElementById('add-notes').value.trim(),
    ...collectCatFields()
  };

  if (!item.name || !item.category) return;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adding...';

  const saved = await DB.addItem(item);

  const photoFile = document.getElementById('add-photo')?.files[0];
  if (photoFile) {
    const photos = await Photos.upload(photoFile, saved.id);
    if (photos) {
      saved.photoUrl = photos.photoUrl;
      saved.photoThumbUrl = photos.photoThumbUrl;
      await DB.addItem(saved);
    }
  }
  Sync.pushItem(saved);

  btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
  btn.style.background = 'var(--green)';

  setTimeout(() => {
    App.toast(item.name + ' added');
    Router.current = null;
    Router.navigate('home');
  }, 400);
});
