// Profiles, local storage and optional cloud sync for Reading Star.
//
// Two rules govern everything here, because the progress belongs to a child
// who earned it one word at a time:
//
//   1. NOTHING IS EVER LOST. The upgrade from the old single-player save is
//      silent and non-destructive, the old key is left on disk untouched as a
//      backup, and merging two devices only ever takes the HIGHER value. A
//      sync can add stars; it can never take one away.
//   2. Local first. Everything saves instantly offline. The cloud is a bonus
//      that lets her stars follow her to another device — never a dependency.

const Store = {
  KEY: 'readingstar:v2',
  LEGACY_KEY: 'readingstar:v1',

  blank() {
    return {
      stars: 0, best: 0, mode: 'words', level: '1',
      read: {}, miss: {}, days: {},
      friends: [], buddy: null,
    };
  },

  newProfile(name, avatar, data, updatedAt) {
    return {
      id: 'p' + Math.random().toString(36).slice(2, 10),
      name: name || 'Reader',
      avatar: avatar || '🦄',
      cloud: false, uid: null,
      data: Object.assign(this.blank(), data || {}),
      // A profile that has not been played yet must NOT out-rank real history
      // in the cloud. merge() lets the more recently PLAYED record decide the
      // tricky-word pile and the current level.
      updatedAt: updatedAt == null ? 0 : updatedAt,
      playedAt: updatedAt == null ? 0 : updatedAt,
    };
  },

  load() {
    let root = null;
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) root = JSON.parse(raw);
    } catch (e) { /* corrupted — fall through to migration */ }
    if (root && root.profiles && Object.keys(root.profiles).length) return root;

    // ── First run on the new version ────────────────────────────────────
    // Adopt the existing single-player save exactly as it is, so she opens
    // the app and finds every star and every creature already there. The old
    // key is deliberately NOT deleted: if anything about this migration is
    // wrong, her progress is still sitting on disk untouched.
    let legacy = null;
    try {
      const raw = localStorage.getItem(this.LEGACY_KEY);
      if (raw) legacy = JSON.parse(raw);
    } catch (e) { /* nothing to adopt */ }

    const first = this.newProfile(
      (legacy && legacy.name) || 'My Stars',
      (legacy && legacy.avatar) || '🦄',
      legacy || null);
    return { profiles: { [first.id]: first }, activeId: first.id, migrated: !!legacy };
  },

  // Re-read before writing. This key holds EVERY profile, so blindly writing
  // an in-memory copy erases whatever another tab (or a bfcache-restored
  // page) has saved since we loaded. Only the profiles we actually changed
  // are allowed to win.
  save(root) {
    try {
      let disk = null;
      try { disk = JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch (e) { disk = null; }
      if (disk && disk.profiles) {
        for (const id of Object.keys(disk.profiles)) {
          const mine = root.profiles[id];
          const theirs = disk.profiles[id];
          if (!mine) { root.profiles[id] = theirs; continue; }
          // another tab wrote this profile more recently — keep the union
          if ((theirs.updatedAt || 0) > (mine.updatedAt || 0)) {
            root.profiles[id] = this.merge(mine, theirs);
          }
        }
      }
      localStorage.setItem(this.KEY, JSON.stringify(root));
    } catch (e) { /* storage full or blocked — the session still works */ }
  },

  // ── The merge ────────────────────────────────────────────────────────
  // Never returns less than either side had. Additive things take the
  // maximum; sets take the union. The only field allowed to shrink is `miss`
  // (the tricky-word pile), and only from the more recently used device —
  // otherwise a word she has since read correctly would keep coming back.
  merge(a, b) {
    if (!a) return b;
    if (!b) return a;
    // Decide by when the child last PLAYED, not when the file was last
    // written. Merely opening the app rewrites the profile, and a device that
    // has only been opened must never out-rank one she has actually read on —
    // otherwise a fresh install wins and her tricky-word list and level are
    // replaced with the empty defaults.
    // NOT `x.playedAt || x.updatedAt` — a playedAt of 0 is meaningful (never
    // played) and would fall through to the write time, which is exactly the
    // value we are trying to ignore.
    const played = (x) => (x.playedAt != null ? x.playedAt : (x.updatedAt || 0));
    const newer = played(b) > played(a) ? b : a;
    const out = Object.assign({}, newer.data);

    out.stars = Math.max(a.data.stars || 0, b.data.stars || 0);
    out.best = Math.max(a.data.best || 0, b.data.best || 0);

    const maxMap = (x = {}, y = {}) => {
      const m = Object.assign({}, x);
      for (const k of Object.keys(y)) m[k] = Math.max(m[k] || 0, y[k] || 0);
      return m;
    };
    out.read = maxMap(a.data.read, b.data.read);
    out.days = maxMap(a.data.days, b.data.days);

    // Every creature either device has met stays met.
    const order = (typeof CREATURES !== 'undefined') ? CREATURES.map(c => c.k) : [];
    const both = new Set([...(a.data.friends || []), ...(b.data.friends || [])]);
    out.friends = order.length
      ? order.filter(k => both.has(k))
      : [...both];

    out.miss = Object.assign({}, newer.data.miss || {});
    out.buddy = newer.data.buddy || out.friends[out.friends.length - 1] || null;
    out.level = newer.data.level || a.data.level || '1';
    return { ...newer, data: out,
             updatedAt: Math.max(a.updatedAt || 0, b.updatedAt || 0),
             playedAt: Math.max(played(a), played(b)) };
  },
};

// ── Firebase, loaded on demand and only if configured ──────────────────
const Sync = {
  status: 'off',              // off | loading | ready | error
  _loadPromise: null,
  _timer: null,

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
      .then(() => Promise.all([load('firebase-auth-compat.js'),
                               load('firebase-firestore-compat.js')]))
      .then(() => {
        this.app = firebase.initializeApp(FIREBASE_CONFIG);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.status = 'ready';
      })
      // Reset the status too, so a session that starts offline can still reach
      // the cloud once the network returns instead of latching for good.
      .catch((e) => { this.status = 'off'; this._loadPromise = null; throw e; });
    return this._loadPromise;
  },

  // A child logs in with her name and a 4-digit PIN — nothing to type but
  // numbers she chose, and nothing to forget.
  //
  // The domain is deliberately NOT the classic app's. Both apps turn a name
  // into a synthetic email, but the classic app derives its password from
  // emoji; the same child using the same name in both would land on one
  // account with two different passwords and be locked out of whichever she
  // set up second. Separate namespaces, no interference.
  _email(name) {
    const slug = String(name).trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'reader';
    return slug + '@readingstar.family';
  },
  _password(pin) { return 'RS-' + String(pin); },

  async signUp(name, pin) {
    await this.ensureLoaded();
    const c = await this.auth.createUserWithEmailAndPassword(
      this._email(name), this._password(pin));
    return c.user.uid;
  },
  async signIn(name, pin) {
    await this.ensureLoaded();
    const c = await this.auth.signInWithEmailAndPassword(
      this._email(name), this._password(pin));
    return c.user.uid;
  },

  // Reading Star lives in its OWN field of the shared profile document, and
  // writes with merge:true, so it can never clobber the classic app's
  // progress sitting in the same doc.
  signedInAs(uid) {
    return !!(this.auth && this.auth.currentUser && this.auth.currentUser.uid === uid);
  },

  async push(profile) {
    if (!profile || !profile.cloud || !profile.uid || this.status !== 'ready') return;
    // Writing without a session for THIS profile is either a no-op or, worse,
    // a write as whoever is signed in. Skip; local stays authoritative.
    if (!this.signedInAs(profile.uid)) return;
    try {
      await this.db.collection('profiles').doc(profile.uid).set({
        name: profile.name,
        // JSON string, not a map. Firestore's merge:true DEEP-merges maps, so
        // a word removed from the tricky pile would never be removed in the
        // cloud and would return on the next sync. A string is replaced whole.
        readingstar: JSON.stringify({ data: profile.data,
                                      updatedAt: profile.updatedAt,
                                      playedAt: profile.playedAt || 0 }),
      }, { merge: true });
    } catch (e) { /* offline — the local copy is still correct */ }
  },

  async pull(uid) {
    await this.ensureLoaded();
    const snap = await this.db.collection('profiles').doc(uid).get();
    if (!snap.exists) return null;
    const d = snap.data();
    if (!d || !d.readingstar) return null;
    if (typeof d.readingstar === 'string') {
      try { return JSON.parse(d.readingstar); } catch (e) { return null; }
    }
    return d.readingstar;   // an older record written as a map
  },

  schedulePush(profile) {
    if (!profile || !profile.cloud || this.status !== 'ready') return;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.push(profile), 3000);
  },
};

// Don't let a few last stars die with the page.
window.addEventListener('pagehide', () => {
  clearTimeout(Sync._timer);
  if (window.App && App.profile && App.profile.cloud) Sync.push(App.profile);
});
