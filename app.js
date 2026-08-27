// Reading Star — she reads, the app listens.
//
// The whole design in one sentence: show a word or sentence BIG, she taps the
// microphone and reads it out loud, and the browser's built-in dictation
// (Apple's on iPhone/iPad, Google's on Android) confirms it.
//
// The app itself stays quiet. No narration, no synthesized teaching voice.
// The only sound it makes is a chime, and — on the little speaker button —
// a pre-recorded, transcription-verified clip of the word. Never punishes:
// one gentle retry, then move on; missed items come back once at the end of
// the round.

const KEY = 'readingstar:v1';

const Sfx = {
  // iOS only lets audio start from a user gesture. Chimes fire from
  // recognition callbacks and timers — seconds after the tap — so each clip
  // is pre-created and primed during a real tap; afterwards it can be
  // rewound and played from anywhere.
  _pool: {},
  _ready: false,
  NAMES: ['correct', 'retry', 'fanfare'],

  unlock() {
    if (this._ready) return;
    this._ready = true;
    for (const n of this.NAMES) {
      try {
        const a = new Audio('classic/audio/sfx/' + n + '.m4a');
        a.muted = true;
        a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; })
          .catch(() => { a.muted = false; });
        this._pool[n] = a;
      } catch (e) { /* no audio on this device */ }
    }
  },

  play(name, vol) {
    try {
      const a = this._pool[name];
      if (a) {
        a.volume = vol == null ? 0.7 : vol;
        a.currentTime = 0;
        a.play().catch(() => {});
        return;
      }
      const fresh = new Audio('classic/audio/sfx/' + name + '.m4a');
      fresh.volume = vol == null ? 0.7 : vol;
      fresh.play().catch(() => {});
    } catch (e) { /* not ready yet */ }
  }
};

const App = {
  data: { stars: 0, best: 0, mode: 'words', level: '1', read: {} },
  round: null,
  _clip: null,
  _advance: null,     // pending "next item" timer — must be cancelled on nav
  _listening: false,

  init() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) this.data = Object.assign(this.data, JSON.parse(raw));
    } catch (e) { /* fresh start */ }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    // Teach the judge our whole vocabulary so a real-but-wrong word is never
    // forgiven as a near miss (kitten read as "mitten" is an error, not a
    // transcription slip).
    const vocab = [];
    for (const lvl of Object.values(CONTENT.words)) for (const it of lvl) vocab.push(it.t);
    Listener.setVocab(vocab);
    const prime = () => Sfx.unlock();
    document.addEventListener('touchend', prime, { once: true });
    document.addEventListener('click', prime, { once: true });
    this.home();
    this.checkForUpdate();
  },

  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* full */ }
  },

  render(html) {
    // Kill everything the previous screen had in flight: a pending advance
    // timer would otherwise fire on the new screen (tapping Home during the
    // celebration used to jump straight back into the round), and a hear-it
    // clip would keep playing over it.
    Listener.stop();
    this._listening = false;
    if (this._advance) { clearTimeout(this._advance); this._advance = null; }
    if (this._clip) { this._clip.pause(); this._clip = null; }
    document.getElementById('app').innerHTML = html;
    window.scrollTo(0, 0);
  },

  // Schedule the move to the next item, owned by this round so a stale timer
  // can never act on a round that has been replaced.
  scheduleNext(ms) {
    const mine = this.round;
    if (this._advance) clearTimeout(this._advance);
    this._advance = setTimeout(() => {
      this._advance = null;
      if (this.round === mine) this.next();
    }, ms);
  },

  // ── Home ──
  home() {
    const d = this.data;
    this.render(`
      <div class="screen center">
        <div class="hero">🦄</div>
        <h1>Reading Star</h1>
        <p class="tag">Read it out loud — I'm listening!</p>
        <div class="statrow">
          <span class="stat">⭐ ${d.stars}</span>
          <span class="stat">🔥 best ${d.best}</span>
        </div>
        <div class="pickrow">
          ${['1', '2', '3'].map(l => `
            <button class="pill ${d.level === l ? 'on' : ''}" onclick="App.setLevel('${l}')">Level ${l}</button>`).join('')}
        </div>
        <button class="btn big go" onclick="App.start('words')">🔤 Words</button>
        <button class="btn big go" onclick="App.start('sentences')">📖 Sentences</button>
        <a class="classic-link" href="classic/">🌈 Unicorn Island adventure</a>
      </div>
    `);
  },

  setLevel(l) { this.data.level = l; this.save(); this.home(); },

  // ── A round: 10 items, misses re-queued once ──
  start(mode) {
    if (!Listener.available) return this.noMic('unsupported');
    this.data.mode = mode;
    this.save();
    const pool = CONTENT[mode][this.data.level] || [];
    if (!pool.length) return this.home();
    // Least-practised first, but shuffled properly. `sort(() => random)` is
    // not a shuffle — the comparator is inconsistent, so V8's sort leaves it
    // noticeably ordered and she'd meet the same words in the same sequence.
    const readCount = (it) => (this.data.read[mode + this.data.level + ':' + it.t] || 0);
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    const byCount = new Map();
    for (const it of pool) {
      const c = readCount(it);
      if (!byCount.has(c)) byCount.set(c, []);
      byCount.get(c).push(it);
    }
    const ordered = [];
    for (const c of [...byCount.keys()].sort((a, b) => a - b)) {
      ordered.push(...shuffle(byCount.get(c)));
    }
    const items = shuffle(ordered.slice(0, 10));
    this.round = { items, i: 0, got: 0, tries: 0, streak: 0, redo: [], redone: false };
    this.showItem();
  },

  item() { return this.round.items[this.round.i]; },

  showItem() {
    const r = this.round;
    const it = this.item();
    r.tries = 0;
    r.settled = false;
    const isWord = this.data.mode === 'words';
    this.render(`
      <div class="screen">
        <div class="topbar">
          <button class="btn ghost small" onclick="App.home()">🏠</button>
          <span class="count">${r.i + 1} of ${r.items.length}</span>
          <span class="stat">🔥 ${r.streak}</span>
        </div>
        <div class="card ${isWord ? '' : 'sentence'}" id="card">
          <div class="target ${isWord ? 'word' : 'sent'}" id="target">${it.t}</div>
          <div class="feedback" id="feedback">&nbsp;</div>
        </div>
        <button class="btn mic big" id="mic-btn" onclick="App.listen()">🎤 Tap, then read it!</button>
        ${isWord && it.a ? `<button class="btn ghost small" id="hear" onclick="App.hear()">🔊 Hear it first</button>` : ''}
      </div>
    `);
  },

  hear() {
    if (!this.round || this.round.settled) return;
    Listener.stop();
    this._listening = false;
    this.micIdle();
    if (this._clip) { this._clip.pause(); this._clip = null; }
    const it = this.item();
    if (it.a) {
      this._clip = new Audio(it.a);
      this._clip.play().catch(() => {});
    }
  },

  micIdle() {
    const btn = document.getElementById('mic-btn');
    if (btn) { btn.classList.remove('listening'); btn.textContent = '🎤 Tap, then read it!'; }
  },

  listen() {
    // once this item is decided and the advance is scheduled, extra taps and
    // stray results must do nothing — a double-tap was double-counting stars
    // and double-queueing the redo item
    if (!this.round || this.round.settled) return;
    // Re-entry would call Listener.start(), whose first act is stop() —
    // silently throwing away speech she has already given us.
    if (this._listening) return;
    this._listening = true;
    if (this._clip) { this._clip.pause(); this._clip = null; }   // never judge our own clip
    const it = this.item();
    const btn = document.getElementById('mic-btn');
    const fb = document.getElementById('feedback');
    const hear = document.getElementById('hear');
    if (btn) { btn.classList.add('listening'); btn.textContent = '👂 I\'m listening…'; }
    if (fb) { fb.className = 'feedback'; fb.innerHTML = 'read it now!'; }
    if (hear) hear.disabled = true;
    const isWord = this.data.mode === 'words';
    Listener.start({
      budgetMs: Listener.budgetFor(it.t),
      onHeard: (alts) => this.result(isWord
        ? Listener.judge(it.t, alts)
        : Listener.judgeSentence(it.t, alts)),
      onSilence: () => this.result('silence'),
      onBlocked: () => { this._listening = false; this.noMic('blocked'); },
    });
  },

  result(verdict) {
    const r = this.round;
    if (!r || r.settled) return;
    const it = this.item();
    const fb = document.getElementById('feedback');
    const card = document.getElementById('card');
    const hear = document.getElementById('hear');
    this._listening = false;
    this.micIdle();
    if (hear) hear.disabled = false;
    r.tries++;

    if (verdict === 'match' || (verdict === 'near' && r.tries >= 2)) {
      r.settled = true;
      r.got++;
      r.streak++;
      this.data.stars++;
      if (r.streak > this.data.best) this.data.best = r.streak;
      const k = this.data.mode + this.data.level + ':' + it.t;
      this.data.read[k] = (this.data.read[k] || 0) + 1;
      this.save();
      if (card) card.classList.add('right');
      if (fb) { fb.className = 'feedback good'; fb.innerHTML = '⭐ You read it!'; }
      Sfx.play('correct');
      this.confetti();
      this.scheduleNext(1200);
      return;
    }

    if (r.tries >= 2) {
      // done trying this one — no wall, no lecture; it returns once later
      r.settled = true;
      r.streak = 0;
      if (!r.redone) r.redo.push(it);
      if (fb) { fb.className = 'feedback soft'; fb.innerHTML = 'Good try! Let\'s do the next one 💪'; }
      Sfx.play('retry', 0.4);
      this.scheduleNext(1400);
      return;
    }

    if (card) { card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500); }
    if (fb) {
      fb.className = 'feedback soft';
      fb.innerHTML = verdict === 'silence'
        ? 'I didn\'t hear you — tap and try again!'
        : (verdict === 'near' ? 'SO close — once more!' : 'Try again — nice and clear!');
    }
    Sfx.play('retry', 0.4);
  },

  next() {
    const r = this.round;
    if (!r) return;
    r.i++;
    if (r.i >= r.items.length) {
      if (r.redo.length && !r.redone) {
        r.items = r.redo;
        r.redo = [];
        r.redone = true;
        r.i = 0;
        return this.showItem();
      }
      return this.finish();
    }
    this.showItem();
  },

  finish() {
    const r = this.round;
    const total = r.got;
    Sfx.play('fanfare', 0.7);
    this.confetti();
    this.render(`
      <div class="screen center">
        <div class="hero">${total >= 8 ? '🏆' : total >= 5 ? '🌟' : '💖'}</div>
        <h1>${total} star${total === 1 ? '' : 's'}!</h1>
        <p class="tag">${total >= 8 ? 'Amazing reading!' : total >= 5 ? 'Great reading!' : 'Good practice — keep going!'}</p>
        <div class="statrow"><span class="stat">⭐ ${this.data.stars} total</span></div>
        <button class="btn big go" onclick="App.start('${this.data.mode}')">Read more!</button>
        <button class="btn ghost" onclick="App.home()">🏠 Home</button>
      </div>
    `);
  },

  // ── When listening can't work ──
  // A mic failure must never throw away the round she is in the middle of:
  // "Try again" resumes the same item where possible.
  standalone() {
    return window.navigator.standalone === true ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  },

  noMic(why) {
    const canResume = !!(this.round && this.round.items && this.round.i < this.round.items.length);
    // Safari's speech recognition is unreliable inside a home-screen app;
    // in Safari proper it works. Say so plainly instead of blaming the mic.
    const iosApp = why === 'blocked' && this.standalone() &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    let msg;
    if (why === 'unsupported') {
      msg = 'Reading Star listens using Safari (iPhone/iPad) or Chrome. Please open it there!';
    } else if (iosApp) {
      msg = 'Listening works best in Safari. Open Reading Star in Safari — tap the ••• or share button and choose Open in Safari — then try again.';
    } else {
      msg = 'Ask a grown-up to allow the microphone, and check you are online — then try again.';
    }
    this.render(`
      <div class="screen center">
        <div class="hero">🎤</div>
        <h1>I can't hear you yet</h1>
        <p class="tag">${msg}</p>
        ${canResume
          ? `<button class="btn big go" onclick="App.resume()">🔁 Try again</button>
             <button class="btn ghost" onclick="App.home()">🏠 Home</button>`
          : `<button class="btn big go" onclick="App.home()">🏠 Home</button>`}
        <a class="classic-link" href="classic/">🌈 Play Unicorn Island instead</a>
      </div>
    `);
  },

  // Back to the exact item she was on, round and stars intact.
  resume() {
    if (!this.round || this.round.i >= this.round.items.length) return this.home();
    this.showItem();
  },

  confetti() {
    const holder = document.createElement('div');
    holder.className = 'confetti';
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      s.textContent = ['⭐', '💖', '✨', '🌸'][i % 4];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDelay = (Math.random() * 0.4) + 's';
      holder.appendChild(s);
    }
    document.body.appendChild(holder);
    setTimeout(() => holder.remove(), 2200);
  },

  // Self-healing updates: if the server has a newer build, refresh once.
  async checkForUpdate() {
    try {
      const v = await fetch('version.json', { cache: 'no-store' }).then(r => r.json());
      const mine = document.querySelector('meta[name="build"]');
      if (v.build && mine && mine.content && v.build !== mine.content) {
        // Keyed by build id, not a session-wide flag: a later deploy in the
        // same session must still be able to heal.
        if (sessionStorage.getItem('rs-updating') !== v.build) {
          sessionStorage.setItem('rs-updating', v.build);
          location.reload();
        }
      }
    } catch (e) { /* offline is fine */ }
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
