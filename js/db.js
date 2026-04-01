const DB_NAME = 'collectionaddict';
const DB_VERSION = 1;

const DB = {
  _db: null,
  _guest: false,
  _mem: {},

  setGuestMode(on) {
    this._guest = on;
    if (on) this._mem = {};
  },

  async open() {
    if (this._guest) return null;
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('items')) {
          const store = db.createObjectStore('items', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
        if (!db.objectStoreNames.contains('lists')) {
          db.createObjectStore('lists', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async addItem(item) {
    item.id = item.id || crypto.randomUUID();
    item.createdAt = item.createdAt || Date.now();
    item.updatedAt = Date.now();

    if (this._guest) {
      this._mem[item.id] = item;
      return item;
    }

    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('items', 'readwrite');
      tx.objectStore('items').put(item);
      tx.oncomplete = () => resolve(item);
      tx.onerror = () => reject(tx.error);
    });
  },

  async getItem(id) {
    if (this._guest) return this._mem[id] || null;

    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('items', 'readonly');
      const req = tx.objectStore('items').get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async getAllItems() {
    if (this._guest) return Object.values(this._mem);

    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('items', 'readonly');
      const req = tx.objectStore('items').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async getItemsByCategory(category) {
    if (this._guest) return Object.values(this._mem).filter(i => i.category === category);

    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('items', 'readonly');
      const idx = tx.objectStore('items').index('category');
      const req = idx.getAll(category);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async deleteItem(id) {
    if (this._guest) {
      delete this._mem[id];
      return;
    }

    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('items', 'readwrite');
      tx.objectStore('items').delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getStats() {
    const items = await this.getAllItems();
    const totalValue = items.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);
    const categories = {};
    const statuses = {};
    items.forEach(i => {
      categories[i.category] = (categories[i.category] || 0) + 1;
      statuses[i.status] = (statuses[i.status] || 0) + 1;
    });
    return { total: items.length, totalValue, categories, statuses, items };
  },

  async setSetting(key, value) {
    if (this._guest) return;

    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      tx.objectStore('settings').put({ key, value });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getSetting(key) {
    if (this._guest) return null;

    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get(key);
      req.onsuccess = () => resolve(req.result?.value ?? null);
      req.onerror = () => reject(req.error);
    });
  }
};
