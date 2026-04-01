const Router = {
  views: {},
  current: null,

  register(name, renderFn) {
    this.views[name] = renderFn;
  },

  async navigate(view) {
    if (this.current === view) return;
    this.current = view;
    window.location.hash = view;

    const container = document.getElementById('view-container');
    container.innerHTML = '';

    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === view);
    });

    if (this.views[view]) {
      const el = await this.views[view]();
      if (typeof el === 'string') {
        container.innerHTML = el;
      } else if (el instanceof HTMLElement) {
        container.appendChild(el);
      }
      container.querySelector('.view')?.classList.add('view');
    }
  },

  init() {
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigate(hash);

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '') || 'home';
      this.navigate(h);
    });
  }
};
