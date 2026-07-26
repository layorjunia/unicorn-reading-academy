// Local storage + optional Firebase cloud sync.
// The app is local-first: everything saves to localStorage instantly.
// If FIREBASE_CONFIG is set and the profile is cloud-connected, changes
// are also pushed to Firestore (newer updatedAt wins on merge).

const Store = {
  KEY: 'ura:v1',

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* corrupted or unavailable — start fresh */ }
    return { profiles: {}, activeProfileId: null };
  },

  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); }
    catch (e) { console.warn('local save failed', e); }
  },

  newProfile(name, avatar) {
    return {
      id: 'p' + Math.random().toString(36).slice(2, 10),
      name, avatar,
      cloud: false, uid: null,
      progress: {
        stars: 0,
        islands: {},        // islandId -> {done:true, best:score}
        activities: {},     // islandId -> {learn:1, sound:1, build:1, sort:1, read:1}
        heartBox: {},       // word -> {box:0..4, last:timestamp}
        fluency: [],        // {passageId, wcpm, errors, date}
        sessions: 0
      },
      updatedAt: Date.now()
    };
  }
};

// ── Firebase (loaded on demand, only if configured) ──
const Sync = {
  app: null, auth: null, db: null,
  status: 'off',   // off | loading | ready | error
  _loadPromise: null,

  configured() { return typeof FIREBASE_CONFIG !== 'undefined' && !!FIREBASE_CONFIG; },

  ensureLoaded() {
    if (!this.configured()) return Promise.reject(new Error('not-configured'));
    if (this.status === 'ready') return Promise.resolve();
    if (this._loadPromise) return this._loadPromise;
    this.status = 'loading';
    const base = 'https://www.gstatic.com/firebasejs/10.14.1/';
    const load = (src) => new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = base + src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    this._loadPromise = load('firebase-app-compat.js')
      .then(() => Promise.all([load('firebase-auth-compat.js'), load('firebase-firestore-compat.js')]))
      .then(() => {
        this.app = firebase.initializeApp(FIREBASE_CONFIG);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.status = 'ready';
      })
      .catch((e) => { this.status = 'error'; this._loadPromise = null; throw e; });
    return this._loadPromise;
  },

  // Kid login: name + emoji picture password → synthetic email/password.
  _email(name) {
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'reader';
    return slug + '@unicorn-academy.family';
  },
  _password(emojis) { return emojis.join('') + '-URA1'; },

  async signUp(name, emojis) {
    await this.ensureLoaded();
    const cred = await this.auth.createUserWithEmailAndPassword(this._email(name), this._password(emojis));
    return cred.user.uid;
  },

  async signIn(name, emojis) {
    await this.ensureLoaded();
    const cred = await this.auth.signInWithEmailAndPassword(this._email(name), this._password(emojis));
    return cred.user.uid;
  },

  async push(profile) {
    if (!profile.cloud || !profile.uid || this.status !== 'ready') return;
    try {
      await this.db.collection('profiles').doc(profile.uid).set({
        name: profile.name,
        avatar: profile.avatar,
        app: 'unicorn-reading-academy',
        progress: profile.progress,
        updatedAt: profile.updatedAt
      });
    } catch (e) { console.warn('cloud push failed', e); }
  },

  async pull(uid) {
    await this.ensureLoaded();
    const snap = await this.db.collection('profiles').doc(uid).get();
    return snap.exists ? snap.data() : null;
  },

  // Merge cloud data into a local profile if cloud copy is newer.
  mergeInto(profile, cloudData) {
    if (cloudData && cloudData.updatedAt > profile.updatedAt) {
      profile.progress = cloudData.progress;
      profile.updatedAt = cloudData.updatedAt;
      return true;
    }
    return false;
  },

  // Debounced auto-push
  _timer: null,
  schedulePush(profile) {
    if (!profile.cloud || this.status !== 'ready') return;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.push(profile), 4000);
  }
};

// Flush pending sync when leaving the page
window.addEventListener('pagehide', () => {
  if (Sync._timer) { clearTimeout(Sync._timer); }
  if (window.App && App.profile && App.profile.cloud) Sync.push(App.profile);
});
