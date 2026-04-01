const SYNC_BASE_KEYS = ['id', 'category', 'name', 'brand', 'price', 'status', 'location', 'rating', 'notes', 'createdAt', 'updatedAt'];

const Sync = {
  extractMeta(item) {
    const meta = {};
    for (const key of Object.keys(item)) {
      if (!SYNC_BASE_KEYS.includes(key)) meta[key] = item[key];
    }
    return meta;
  },

  async pushItem(item) {
    if (!Auth.isLoggedIn() || !Auth.client) return;
    const row = {
      id: item.id,
      user_id: Auth.user.id,
      category: item.category,
      name: item.name,
      brand: item.brand || null,
      price: parseFloat(item.price) || null,
      status: item.status || 'own',
      location: item.location || null,
      rating: item.rating || 0,
      notes: item.notes || null,
      metadata: this.extractMeta(item)
    };
    const { error } = await Auth.client.from('items').upsert(row, { onConflict: 'id' });
    if (error) console.error('Push failed:', error.message);
  },

  async deleteItem(id) {
    if (!Auth.isLoggedIn() || !Auth.client) return;
    const { error } = await Auth.client.from('items').delete().eq('id', id);
    if (error) console.error('Delete failed:', error.message);
  },

  async pullFromCloud() {
    if (!Auth.isLoggedIn() || !Auth.client) return;
    const { data, error } = await Auth.client
      .from('items')
      .select('*')
      .eq('user_id', Auth.user.id);

    if (error) {
      console.error('Pull failed:', error.message);
      return;
    }

    if (!data || !data.length) return;

    const localItems = await DB.getAllItems();
    const localMap = {};
    localItems.forEach(i => localMap[i.id] = i);

    let merged = 0;
    for (const cloud of data) {
      const local = localMap[cloud.id];
      const cloudTime = new Date(cloud.updated_at).getTime();
      const localTime = local?.updatedAt || 0;

      if (!local || cloudTime > localTime) {
        const item = {
          id: cloud.id,
          category: cloud.category,
          name: cloud.name,
          brand: cloud.brand || '',
          price: cloud.price || '',
          status: cloud.status || 'own',
          location: cloud.location || '',
          rating: cloud.rating || 0,
          notes: cloud.notes || '',
          createdAt: new Date(cloud.created_at).getTime(),
          updatedAt: cloudTime,
          ...(cloud.metadata || {})
        };
        await DB.addItem(item);
        merged++;
      }
    }

    if (merged > 0) {
      App.toast(merged + ' item' + (merged > 1 ? 's' : '') + ' synced from cloud');
      if (Router.current === 'home') {
        Router.current = null;
        Router.navigate('home');
      }
    }
  },

  async pushAllToCloud() {
    if (!Auth.isLoggedIn() || !Auth.client) return;
    const items = await DB.getAllItems();
    let count = 0;
    for (const item of items) {
      await this.pushItem(item);
      count++;
    }
    return count;
  }
};
