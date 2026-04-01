const Photos = {
  bucket: 'item-photos',

  async upload(file, itemId) {
    if (!Auth.isLoggedIn() || !Auth.client) return null;

    const ext = file.name.split('.').pop().toLowerCase() || 'jpg';
    const path = `${Auth.user.id}/${itemId}/${Date.now()}.${ext}`;

    const { error } = await Auth.client.storage
      .from(this.bucket)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      console.error('Photo upload failed:', error.message);
      return null;
    }

    const { data } = Auth.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async remove(url) {
    if (!Auth.isLoggedIn() || !Auth.client || !url) return;

    const marker = `/object/public/${this.bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;

    const path = decodeURIComponent(url.slice(idx + marker.length));
    const { error } = await Auth.client.storage.from(this.bucket).remove([path]);
    if (error) console.error('Photo delete failed:', error.message);
  }
};
