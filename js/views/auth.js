Router.register('auth', async () => {
  document.body.classList.add('auth-page');

  return `<div class="view auth-view">
    <div class="auth-hero">
      <img src="img/logo.png" alt="Collection Addict" class="auth-logo">
      <p class="auth-tagline">Track your whiskey, cigars, pipes, hats & more</p>
    </div>

    <div class="auth-card">
      <div class="auth-tabs">
        <button class="auth-tab active" id="tab-signin" onclick="switchAuthTab('signin')">Sign In</button>
        <button class="auth-tab" id="tab-signup" onclick="switchAuthTab('signup')">Create Account</button>
      </div>

      <div id="auth-error" class="auth-error"></div>

      <form id="signin-form" class="auth-form">
        <div class="field">
          <label class="field-label">Email</label>
          <div class="input-icon-wrap">
            <i class="fa-regular fa-envelope"></i>
            <input type="email" class="field-input" id="signin-email" placeholder="you@example.com" required>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Password</label>
          <div class="input-icon-wrap">
            <i class="fa-solid fa-lock"></i>
            <input type="password" class="field-input" id="signin-password" placeholder="Your password" required minlength="6">
          </div>
        </div>
        <button type="submit" class="btn btn--primary btn--block btn--lg" id="signin-btn">
          Sign In
        </button>
      </form>

      <form id="signup-form" class="auth-form" style="display:none">
        <div class="field">
          <label class="field-label">Email</label>
          <div class="input-icon-wrap">
            <i class="fa-regular fa-envelope"></i>
            <input type="email" class="field-input" id="signup-email" placeholder="you@example.com" required>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Password</label>
          <div class="input-icon-wrap">
            <i class="fa-solid fa-lock"></i>
            <input type="password" class="field-input" id="signup-password" placeholder="At least 6 characters" required minlength="6">
          </div>
        </div>
        <div class="field">
          <label class="field-label">Confirm Password</label>
          <div class="input-icon-wrap">
            <i class="fa-solid fa-shield-halved"></i>
            <input type="password" class="field-input" id="signup-confirm" placeholder="Confirm your password" required minlength="6">
          </div>
        </div>
        <button type="submit" class="btn btn--primary btn--block btn--lg" id="signup-btn">
          Create Account
        </button>
      </form>

      <div class="auth-divider"><span>or</span></div>

      <button class="btn btn--outline btn--block" onclick="skipAuth()">
        <i class="fa-regular fa-user"></i> Continue as Guest
      </button>
      <p class="auth-guest-note">Sandbox mode — add items and explore, but everything resets when you leave</p>
    </div>
  </div>`;
});

function switchAuthTab(tab) {
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const errEl = document.getElementById('auth-error');

  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }

  if (tab === 'signin') {
    signinForm.style.display = 'block';
    signupForm.style.display = 'none';
    tabSignin.classList.add('active');
    tabSignup.classList.remove('active');
  } else {
    signinForm.style.display = 'none';
    signupForm.style.display = 'block';
    tabSignin.classList.remove('active');
    tabSignup.classList.add('active');
  }
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function skipAuth() {
  DB.setGuestMode(true);
  document.body.classList.remove('auth-page');
  App.toast('Guest mode — data will not be saved');
  Router.current = null;
  Router.navigate('home');
}

document.addEventListener('submit', async (e) => {
  if (e.target.id === 'signin-form') {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    const btn = document.getElementById('signin-btn');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    const { error } = await Auth.signIn(email, password);

    if (error) {
      showAuthError(error.message);
      btn.disabled = false;
      btn.textContent = 'Sign In';
    } else {
      DB.setGuestMode(false);
      await DB.open();
      document.body.classList.remove('auth-page');
      App.toast('Welcome back!');
      const localCount = (await DB.getAllItems()).length;
      if (localCount > 0) await Sync.pushAllToCloud();
      await Sync.pullFromCloud();
      Router.current = null;
      Router.navigate('home');
    }
  }

  if (e.target.id === 'signup-form') {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const btn = document.getElementById('signup-btn');

    if (password !== confirm) {
      showAuthError('Passwords do not match');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

    const { error } = await Auth.signUp(email, password);

    if (error) {
      showAuthError(error.message);
      btn.disabled = false;
      btn.textContent = 'Create Account';
    } else {
      App.toast('Account created! Check your email to confirm, then sign in.');
      switchAuthTab('signin');
      btn.disabled = false;
      btn.textContent = 'Create Account';
    }
  }
});
