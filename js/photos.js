const Photos = {
  bucket: 'item-photos',

  resize(file, maxWidth, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      img.src = objectUrl;
    });
  },

  async upload(file, itemId) {
    if (!Auth.isLoggedIn() || !Auth.client) return null;

    const base = `${Auth.user.id}/${itemId}`;
    const opts = { upsert: true, contentType: 'image/jpeg' };

    const [fullBlob, thumbBlob] = await Promise.all([
      this.resize(file, 800),
      this.resize(file, 200)
    ]);

    const [fullRes, thumbRes] = await Promise.all([
      Auth.client.storage.from(this.bucket).upload(`${base}/full.jpg`, fullBlob, opts),
      Auth.client.storage.from(this.bucket).upload(`${base}/thumb.jpg`, thumbBlob, opts)
    ]);

    if (fullRes.error) {
      console.error('Photo upload failed:', fullRes.error.message);
      return null;
    }

    const { data: fullData } = Auth.client.storage.from(this.bucket).getPublicUrl(`${base}/full.jpg`);
    const { data: thumbData } = Auth.client.storage.from(this.bucket).getPublicUrl(`${base}/thumb.jpg`);

    return {
      photoUrl: fullData.publicUrl,
      photoThumbUrl: thumbData.publicUrl
    };
  },

  async remove(itemId) {
    if (!Auth.isLoggedIn() || !Auth.client || !itemId) return;

    const base = `${Auth.user.id}/${itemId}`;
    const { error } = await Auth.client.storage.from(this.bucket).remove([
      `${base}/full.jpg`,
      `${base}/thumb.jpg`
    ]);
    if (error) console.error('Photo delete failed:', error.message);
  }
};
