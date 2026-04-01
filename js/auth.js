const Auth = {
  client: null,
  user: null,

  init() {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
      console.warn('Supabase not configured — running in offline mode');
      return;
    }
    this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.client.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null;
      if (event === 'SIGNED_IN') Sync.pullFromCloud();
    });
  },

  async getSession() {
    if (!this.client) return null;
    const { data } = await this.client.auth.getSession();
    this.user = data.session?.user || null;
    return data.session;
  },

  async signUp(email, password) {
    if (!this.client) return { error: { message: 'Supabase not configured' } };
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (!error && data.user) this.user = data.user;
    return { data, error };
  },

  async signIn(email, password) {
    if (!this.client) return { error: { message: 'Supabase not configured' } };
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (!error && data.user) this.user = data.user;
    return { data, error };
  },

  async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
    this.user = null;
  },

  isLoggedIn() {
    return !!this.user;
  },

  getEmail() {
    return this.user?.email || null;
  },

  getFirstName() {
    return this.user?.user_metadata?.first_name || '';
  },

  getLastName() {
    return this.user?.user_metadata?.last_name || '';
  },

  getDisplayName() {
    const first = this.getFirstName();
    if (first) return first.charAt(0).toUpperCase() + first.slice(1);
    const email = this.getEmail();
    if (email) {
      const prefix = email.split('@')[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return 'Guest';
  },

  async updateProfile(firstName, lastName) {
    if (!this.client || !this.user) return { error: { message: 'Not signed in' } };
    const { data, error } = await this.client.auth.updateUser({
      data: { first_name: firstName, last_name: lastName }
    });
    if (!error && data.user) this.user = data.user;
    return { data, error };
  }
};
