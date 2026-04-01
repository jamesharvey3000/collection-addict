const App = {
  async init() {
    await DB.open();
    Auth.init();

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        Router.current = null;
        Router.navigate(tab.dataset.view);
      });
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        Router.current = null;
        Router.navigate(item.dataset.view);
        this.closeMobileMenu();
      });
    });

    const menuToggle = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    if (menuToggle) menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    if (overlay) overlay.addEventListener('click', () => this.closeMobileMenu());

    const logoutBtn = document.getElementById('sidebar-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await Auth.signOut();
        App.toast('Signed out');
        document.body.classList.add('auth-page');
        Router.current = null;
        Router.navigate('auth');
      });
    }

    const origNavigate = Router.navigate.bind(Router);
    Router.navigate = async (v) => {
      if (v === 'auth') {
        document.body.classList.add('auth-page');
      } else {
        document.body.classList.remove('auth-page');
      }
      await origNavigate(v);
      this.syncActiveStates(v);
    };

    const session = await Auth.getSession();

    if (session) {
      document.body.classList.remove('auth-page');
      Router.init();
      Sync.pullFromCloud();
    } else {
      Router.current = null;
      await Router.navigate('auth');
    }

    document.body.style.opacity = '1';

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  syncActiveStates(view) {
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === view);
    });
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.view === view);
    });
  },

  toggleMobileMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
  },

  closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  },

  toast(message) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
