// Reading Star — she reads, the app listens.
//
// Show a word, a sentence, or one line of a story BIG; she taps the microphone
// and reads it out loud; the browser's built-in dictation (Apple's on
// iPhone/iPad, Google's on Android) confirms it.
//
// The app itself stays quiet. No narration, no synthesized teaching voice —
// that whole class of mispronunciation problems is gone by deletion. The only
// sounds are chimes and, on word cards, an optional pre-recorded human clip.
//
// It never punishes: one gentle retry, then it moves on. Items she misses are
// remembered and come back in Tricky Words, which is where real progress
// happens.

const KEY = 'readingstar:v1';

// A parent has no way to guess which level fits their child, so say it plainly
// in words they can check against a book at home.
const LEVEL_HINT = {
  '1': 'Level 1 · short words like cat, ship, jump',
  '2': 'Level 2 · longer sounds like cake, rain, farm',
  '3': 'Level 3 · big words like rainbow, gentle, unhappy',
};

const MODES = {
  words:     { label: '🔤 Words',       kind: 'word' },
  sight:     { label: '⭐ Star Words',  kind: 'word' },
  sentences: { label: '📖 Sentences',   kind: 'line' },
  stories:   { label: '📚 Stories',     kind: 'story' },
  tricky:    { label: '💪 Tricky Words', kind: 'word' },
};

const Sfx = {
  // iOS only lets audio start from a user gesture. Chimes fire from
  // recognition callbacks and timers — seconds after any tap — so each clip is
  // created and primed during a real tap, then rewound and replayed later.
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
      } catch (e) { /* no audio here */ }
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
  data: { stars: 0, best: 0, mode: 'words', level: '1', read: {}, miss: {}, days: {},
          friends: [], buddy: null, seen: 0 },
  round: null,
  _clip: null,
  _advance: null,      // pending "next item" timer — cancelled on navigation
  _unlock: null,       // pending creature-ceremony timer — same rule
  _listening: false,

  init() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) this.data = Object.assign(this.data, JSON.parse(raw));
    } catch (e) { /* fresh start */ }
    for (const k of ['read', 'miss', 'days']) if (!this.data[k]) this.data[k] = {};
    if (!Array.isArray(this.data.friends)) this.data.friends = [];
    // Everyone starts with Pip, so the collection is never empty and there
    // is always a buddy on screen cheering her on.
    if (!this.data.friends.length) this.data.friends = [CREATURES[0].k];
    // Drop anything we no longer have art for, so a stale save cannot leave
    // a blank space where a creature should be.
    this.data.friends = this.data.friends.filter(k => this.creature(k));
    if (!this.data.friends.length) this.data.friends = [CREATURES[0].k];
    // Honour stars earned before this feature existed (or before a creature
    // was added): her stars already paid for these, so grant the backlog
    // quietly at load rather than firing five ceremonies in a row.
    while (this.data.friends.length < this.earned()) {
      const nxt = CREATURES[this.data.friends.length];
      if (!nxt) break;
      this.data.friends.push(nxt.k);
    }
    if (!this.data.buddy || !this.has(this.data.buddy)) {
      this.data.buddy = this.data.friends[this.data.friends.length - 1];
    }
    this.save();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    // Teach the judge the whole vocabulary so a real-but-wrong word is never
    // forgiven as a near miss ("mitten" for "kitten" is a reading error).
    const vocab = [];
    for (const sec of ['words', 'sight']) {
      for (const lvl of Object.values(CONTENT[sec] || {})) for (const it of lvl) vocab.push(it.t);
    }
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

  key(mode, lvl, text) { return mode + lvl + ':' + text; },
  today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); },

  render(html) {
    // Kill everything the previous screen had in flight: a pending advance
    // timer would otherwise fire on the new screen, and a hear-it clip would
    // keep playing over it.
    Listener.stop();
    this._listening = false;
    if (this._advance) { clearTimeout(this._advance); this._advance = null; }
    if (this._unlock) { clearTimeout(this._unlock); this._unlock = null; }
    if (this._clip) { this._clip.pause(); this._clip = null; }
    document.getElementById('app').innerHTML = html;
    window.scrollTo(0, 0);
  },

  // Owned by its round, so a stale timer can never act on a replaced round.
  scheduleNext(ms) {
    const mine = this.round;
    if (this._advance) clearTimeout(this._advance);
    this._advance = setTimeout(() => {
      this._advance = null;
      if (this.round === mine) this.next();
    }, ms);
  },

  // ── Home ──
  trickyCount() {
    return Object.keys(this.data.miss).filter(k => this.data.miss[k] > 0).length;
  },

  home() {
    const d = this.data;
    const tricky = this.trickyCount();
    this.render(`
      <div class="screen center">
        <div class="hero-pet">${this.creatureHtml(d.buddy, 'big')}</div>
        <h1>Reading Star</h1>
        <p class="tag">${this.nextFriend()
          ? `Read ${this.starsToNext()} more to meet a new friend!`
          : 'You found every friend!'}</p>
        <div class="statrow">
          <span class="stat">⭐ ${d.stars}</span>
          <span class="stat">🔥 best ${d.best}</span>
        </div>
        <div class="pickrow">
          ${['1', '2', '3'].map(l => `
            <button class="pill ${d.level === l ? 'on' : ''}" onclick="App.setLevel('${l}')">Level ${l}</button>`).join('')}
        </div>
        <div class="levelhint">${LEVEL_HINT[d.level]}</div>
        ${this.micBanner()}
        <button class="btn big go" onclick="App.start('words')">🔤 Words</button>
        <button class="btn big go" onclick="App.start('sight')">⭐ Star Words</button>
        <button class="btn big go" onclick="App.start('sentences')">📖 Sentences</button>
        <button class="btn big go" onclick="App.start('stories')">📚 Stories</button>
        ${tricky ? `<button class="btn big tricky" onclick="App.start('tricky')">💪 Tricky Words (${tricky})</button>` : ''}
        <button class="btn big friends" onclick="App.friends()">🐾 My Friends (${d.friends.length}/${CREATURES.length})</button>
        <button class="btn ghost" onclick="App.progress()">📊 My Reading</button>
        <a class="classic-link" href="classic/">🌈 Unicorn Island adventure</a>
      </div>
    `);
  },

  setLevel(l) { this.data.level = l; this.save(); this.home(); },

  // ── Building a round ──
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  // Least-practised first, shuffled properly within each tier.
  // (`sort(() => Math.random())` is not a shuffle — the comparator is
  // inconsistent, so the order stays visibly stable.)
  pick(pool, mode, n) {
    const lvl = this.data.level;
    const byCount = new Map();
    for (const it of pool) {
      const c = this.data.read[this.key(mode, lvl, it.t)] || 0;
      if (!byCount.has(c)) byCount.set(c, []);
      byCount.get(c).push(it);
    }
    const ordered = [];
    for (const c of [...byCount.keys()].sort((a, b) => a - b)) ordered.push(...this.shuffle(byCount.get(c)));
    return this.shuffle(ordered.slice(0, n));
  },

  start(mode) {
    if (!Listener.available) return this.noMic('unsupported');
    this.data.mode = mode;
    this.save();
    const lvl = this.data.level;

    if (mode === 'stories') {
      const pool = (CONTENT.stories && CONTENT.stories[lvl]) || [];
      if (!pool.length) return this.empty('stories');
      const story = this.pick(pool.map(s => ({ t: s.title, s })), 'stories', 1)[0].s;
      const items = story.lines.map(l => ({ t: l }));
      this.round = { mode, items, i: 0, got: 0, tries: 0, streak: 0,
                     redo: [], redone: false, story };
      return this.showItem();
    }

    if (mode === 'tricky') {
      const missed = Object.keys(this.data.miss).filter(k => this.data.miss[k] > 0);
      if (!missed.length) return this.empty('tricky');
      // hardest first, and only text we can still find in the corpus
      missed.sort((a, b) => this.data.miss[b] - this.data.miss[a]);
      const items = missed.slice(0, 10).map(k => ({ t: k.slice(k.indexOf(':') + 1), key: k }));
      this.round = { mode, items, i: 0, got: 0, tries: 0, streak: 0, redo: [], redone: false };
      return this.showItem();
    }

    const pool = (CONTENT[mode] && CONTENT[mode][lvl]) || [];
    if (!pool.length) return this.empty(mode);
    const items = this.pick(pool, mode, 10);
    this.round = { mode, items, i: 0, got: 0, tries: 0, streak: 0, redo: [], redone: false };
    this.showItem();
  },

  empty(mode) {
    const msg = mode === 'tricky'
      ? 'No tricky words right now — you have read them all correctly! 🎉'
      : 'Nothing here for this level yet. Try another level!';
    this.render(`
      <div class="screen center">
        <div class="hero">🌟</div>
        <h1>All clear!</h1>
        <p class="tag">${msg}</p>
        <button class="btn big go" onclick="App.home()">🏠 Home</button>
      </div>
    `);
  },

  item() { return this.round.items[this.round.i]; },
  kind() { return (MODES[this.round.mode] || {}).kind || 'word'; },

  showItem() {
    const r = this.round;
    const it = this.item();
    r.tries = 0;
    r.settled = false;
    const kind = this.kind();
    const isWord = kind === 'word';
    const done = r.story ? r.items.slice(0, r.i).map(l => `<div class="story-done">${l.t}</div>`).join('') : '';
    this.render(`
      <div class="screen">
        <div class="topbar">
          <button class="btn ghost small" onclick="App.home()">🏠</button>
          <span class="count">${r.story ? r.story.title : (r.i + 1) + ' of ' + r.items.length}</span>
          <span class="stat">🔥 ${r.streak}</span>
        </div>
        <div class="card ${isWord ? '' : 'sentence'}" id="card">
          ${done}
          <div class="target ${isWord ? 'word' : 'sent'}" id="target">${it.t}</div>
          <div class="feedback" id="feedback">&nbsp;</div>
        </div>
        <button class="btn mic big" id="mic-btn" onclick="App.listen()">🎤 Tap, then read it!</button>
        ${isWord && it.a ? `<button class="btn ghost small" id="hear" onclick="App.hear()">🔊 Hear it first</button>` : ''}
        ${r.story ? `<div class="small-note">line ${r.i + 1} of ${r.items.length}</div>` : ''}
        <div id="skip-holder"></div>
        <div class="buddyrow">
          <div id="buddy" class="buddy-pet">${this.creatureHtml(this.data.buddy)}</div>
          <div class="meter" title="stars until a new friend">
            <div class="meterfill" style="width:${this.meterPct()}%"></div>
          </div>
          <span class="meterlabel">${this.starsToNext() || '★'}</span>
        </div>
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
    if (!this.round || this.round.settled) return;
    // Re-entry would call Listener.start(), whose first act is stop() —
    // silently discarding speech she has already given us.
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
    const isWord = this.kind() === 'word';
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

    const k = it.key || this.key(r.mode, this.data.level, it.t);

    // ONLY a real match passes. A "near" used to count on the second try,
    // which meant a wrong answer could slip through — the item has to be
    // read correctly, full stop.
    if (verdict === 'match') {
      r.settled = true;
      r.got++;
      r.streak++;
      this.data.stars++;
      if (r.streak > this.data.best) this.data.best = r.streak;
      this.data.read[k] = (this.data.read[k] || 0) + 1;
      // reading it right retires it from Tricky Words
      if (this.data.miss[k]) {
        this.data.miss[k] = Math.max(0, this.data.miss[k] - 1);
        if (!this.data.miss[k]) delete this.data.miss[k];
      }
      this.data.days[this.today()] = (this.data.days[this.today()] || 0) + 1;
      this.save();
      if (card) card.classList.add('right');
      if (fb) { fb.className = 'feedback good'; fb.innerHTML = '⭐ You read it!'; }
      Sfx.play('correct');
      this.confetti();
      // the buddy bounces for her, and the meter creeps toward the next friend
      const pet = document.getElementById('buddy');
      if (pet) { pet.classList.remove('cheer'); void pet.offsetWidth; pet.classList.add('cheer'); }
      const fill = document.querySelector('.meterfill');
      if (fill) fill.style.width = this.meterPct() + '%';
      const label = document.querySelector('.meterlabel');
      if (label) label.textContent = this.starsToNext() || '★';
      // A new friend interrupts everything — it is the best moment in the app.
      const got = this.claimFriend();
      if (got) {
        // No scheduled advance here — afterUnlock() moves her on when she
        // leaves the ceremony. Scheduling one as well advanced the round
        // twice and silently skipped a word.
        if (this._advance) { clearTimeout(this._advance); this._advance = null; }
        // Owned by this round, like every other timer here. Without the guard
        // the ceremony painted itself over whatever screen she had navigated
        // to in the 900ms gap — including a brand-new round, which its
        // "Keep reading!" button would then end on her behalf.
        const mine = r;
        this._unlock = setTimeout(() => {
          this._unlock = null;
          if (this.round !== mine) return;
          this.showUnlock(got);
        }, 900);
        return;
      }
      this.scheduleNext(1200);
      return;
    }

    // A wrong answer NEVER moves her on. The word stays until she reads it.
    // After SKIP_AFTER tries she gets a skip button — but she has to choose
    // it; the app will not give up on her behalf.
    r.streak = 0;
    if (card) { card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500); }
    if (fb) {
      fb.className = 'feedback soft';
      fb.innerHTML = verdict === 'silence'
        ? 'I didn\'t hear you — tap and try again!'
        : (verdict === 'near' ? 'So close! Say it once more.'
           : r.tries === 1 ? 'Not quite — try again, nice and clear!'
           : 'Keep going! Take your time and say it big.');
    }
    Sfx.play('retry', 0.4);
    if (r.tries >= this.SKIP_AFTER) this.offerSkip();
  },

  // Coming back from an unlock: the item she just read is done, so move on
  // through next() — which is what runs the second pass over anything she
  // skipped. Jumping straight to finish() here silently threw that away.
  afterUnlock() {
    if (!this.round) return this.home();
    this.next();
  },

  // Shown only after several honest attempts, and only ever tapped by her.
  SKIP_AFTER: 3,

  offerSkip() {
    if (document.getElementById('skip-btn')) return;
    const holder = document.getElementById('skip-holder');
    if (!holder) return;
    holder.innerHTML = '<button class="btn ghost small" id="skip-btn" ' +
      'onclick="App.skip()">Skip this one for now →</button>';
  },

  skip() {
    const r = this.round;
    if (!r || r.settled) return;
    const it = this.item();
    const k = it.key || this.key(r.mode, this.data.level, it.t);
    r.settled = true;
    r.streak = 0;
    // Skipped is not failed — it just comes back in Tricky Words later.
    this.data.miss[k] = (this.data.miss[k] || 0) + 1;
    this.save();
    if (!r.redone) r.redo.push(it);
    const fb = document.getElementById('feedback');
    if (fb) { fb.className = 'feedback soft'; fb.innerHTML = 'No problem — we will come back to it 💪'; }
    Listener.stop();
    this._listening = false;
    this.micIdle();
    this.scheduleNext(1000);
  },

  next() {
    const r = this.round;
    if (!r) return;
    r.i++;
    if (r.i >= r.items.length) {
      // A story is read straight through; everything else gets a second pass
      // at whatever she missed.
      if (!r.story && r.redo.length && !r.redone) {
        r.items = r.redo; r.redo = []; r.redone = true; r.i = 0;
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
    const again = MODES[r.mode] ? r.mode : 'words';
    this.render(`
      <div class="screen center">
        <div class="hero">${total >= 8 ? '🏆' : total >= 5 ? '🌟' : '💖'}</div>
        <h1>${total} star${total === 1 ? '' : 's'}!</h1>
        <p class="tag">${r.story ? 'You read the whole story!' :
          total >= 8 ? 'Amazing reading!' : total >= 5 ? 'Great reading!' : 'Good practice — keep going!'}</p>
        <div class="statrow">
          <span class="stat">⭐ ${this.data.stars} total</span>
          <span class="stat">🐾 ${this.data.friends.length}/${CREATURES.length}</span>
        </div>
        ${this.nextFriend() ? `<p class="tag">${this.starsToNext()} more to meet ${this.nextFriend().n}!</p>` : ''}
        <button class="btn big go" onclick="App.start('${again}')">Read more!</button>
        <button class="btn ghost" onclick="App.home()">🏠 Home</button>
      </div>
    `);
  },


  // ── The star economy ──────────────────────────────────────────────────
  // One star per item read correctly. Every STARS_PER_FRIEND stars, the next
  // creature joins her — that is the whole loop, and it is deliberately
  // simple enough for a 7-year-old to hold in her head.
  STARS_PER_FRIEND: 10,

  earned() {
    // +1 because Pip is a gift, not something she had to earn.
    return Math.min(CREATURES.length,
      1 + Math.floor(this.data.stars / this.STARS_PER_FRIEND));
  },

  creature(k) { return CREATURES.find(c => c.k === k); },
  has(k) { return this.data.friends.indexOf(k) >= 0; },

  nextFriend() {
    const i = this.data.friends.length;
    return i < CREATURES.length ? CREATURES[i] : null;
  },

  starsToNext() {
    if (!this.nextFriend()) return 0;
    const need = this.data.friends.length * this.STARS_PER_FRIEND;
    return Math.max(0, need - this.data.stars);
  },

  // Returns the newly earned creature, if this star crossed a threshold.
  claimFriend() {
    const want = this.earned();
    if (this.data.friends.length >= want) return null;
    const next = CREATURES[this.data.friends.length];
    if (!next) return null;
    this.data.friends.push(next.k);
    this.data.buddy = next.k;      // the newest friend comes along to play
    this.save();
    return next;
  },

  // How full the bar to the next friend is.
  meterPct() {
    if (!this.nextFriend()) return 100;
    const done = this.STARS_PER_FRIEND - this.starsToNext();
    return Math.round(done / this.STARS_PER_FRIEND * 100);
  },

  creatureHtml(k, cls) {
    const c = this.creature(k);
    return c ? `<div class="creature ${cls || ''}">${c.svg}</div>` : '';
  },

  // ── The unlock moment ──
  // This is the payoff for ten pieces of reading, so it gets the whole
  // screen, its own animation, and a line from the creature itself.
  showUnlock(c) {
    Sfx.play('fanfare', 0.8);
    this.confetti(30);
    this.render(`
      <div class="screen center unlock">
        <div class="pop-in">${this.creatureHtml(c.k, 'huge')}</div>
        <h1>${c.n} joined you!</h1>
        <p class="cheer">${c.c}</p>
        <div class="statrow"><span class="stat">🐾 ${this.data.friends.length} of ${CREATURES.length} friends</span></div>
        <button class="btn big go" onclick="App.afterUnlock()">Keep reading!</button>
        <button class="btn ghost" onclick="App.friends()">See all my friends</button>
      </div>
    `);
  },

  // ── The collection ──
  friends() {
    const total = CREATURES.length;
    const have = this.data.friends.length;
    const next = this.nextFriend();
    const toNext = this.starsToNext();
    const cells = CREATURES.map((c, i) => {
      if (this.has(c.k)) {
        const isBuddy = this.data.buddy === c.k;
        return `<button class="cell ${isBuddy ? 'buddy' : ''}" onclick="App.pickBuddy('${c.k}')">
          ${this.creatureHtml(c.k)}
          <div class="cname">${c.n}</div>
          ${isBuddy ? '<div class="badge">with you</div>' : ''}
        </button>`;
      }
      const locked = i === have;   // the very next one gets a teaser
      return `<div class="cell locked">
        <div class="mystery">${locked ? '❔' : '🔒'}</div>
        <div class="cname">${locked ? `${toNext} more star${toNext === 1 ? '' : 's'}` : '???'}</div>
      </div>`;
    }).join('');
    this.render(`
      <div class="screen">
        <div class="topbar">
          <button class="btn ghost small" onclick="App.home()">🏠</button>
          <span class="count">My Friends</span>
          <span class="stat">🐾 ${have}/${total}</span>
        </div>
        ${next ? `<p class="tag center-text">Read ${toNext} more word${toNext === 1 ? '' : 's'} to meet a new friend!</p>`
               : '<p class="tag center-text">You found every friend! 🏆</p>'}
        <div class="grid">${cells}</div>
        <p class="small-note">Tap a friend to bring them along while you read.</p>
      </div>
    `);
  },

  pickBuddy(k) {
    if (!this.has(k)) return;
    this.data.buddy = k;
    this.save();
    Sfx.play('correct', 0.5);
    this.friends();
  },

  // ── Progress ──
  progress() {
    const d = this.data;
    const rows = [];
    for (const mode of ['words', 'sight', 'sentences', 'stories']) {
      for (const lvl of ['1', '2', '3']) {
        const pool = (CONTENT[mode] && CONTENT[mode][lvl]) || [];
        if (!pool.length) continue;
        const pre = mode + lvl + ':';
        const done = Object.keys(d.read).filter(k => k.startsWith(pre) && d.read[k] > 0).length;
        if (!done) continue;
        rows.push({ mode, lvl, done, total: pool.length });
      }
    }
    const days = Object.keys(d.days).length;
    const tricky = this.trickyCount();
    this.render(`
      <div class="screen">
        <div class="topbar">
          <button class="btn ghost small" onclick="App.home()">🏠</button>
          <span class="count">My Reading</span>
          <span class="stat">⭐ ${d.stars}</span>
        </div>
        <div class="card progress">
          <div class="bigstat">${d.stars}<span>stars earned</span></div>
          <div class="statrow">
            <span class="stat">🔥 best streak ${d.best}</span>
            <span class="stat">📅 ${days} day${days === 1 ? '' : 's'}</span>
          </div>
          ${rows.length ? rows.map(r => {
            const pct = Math.round(r.done / r.total * 100);
            return `<div class="prow">
              <div class="plabel">${MODES[r.mode].label} · Level ${r.lvl}</div>
              <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
              <div class="pnum">${r.done} of ${r.total}</div>
            </div>`;
          }).join('') : '<p class="tag">Read some words and your progress shows up here!</p>'}
          ${tricky ? `<p class="tag">${tricky} word${tricky === 1 ? '' : 's'} to practice in 💪 Tricky Words</p>` : ''}
        </div>
        <button class="btn ghost small" onclick="App.confirmReset()">Start over</button>
      </div>
    `);
  },

  confirmReset() {
    this.render(`
      <div class="screen center">
        <div class="hero">🧹</div>
        <h1>Start over?</h1>
        <p class="tag">This erases all stars and progress. It cannot be undone.</p>
        <button class="btn big go" onclick="App.progress()">No, keep it</button>
        <button class="btn ghost" onclick="App.doReset()">Yes, erase everything</button>
      </div>
    `);
  },

  doReset() {
    this.data = { stars: 0, best: 0, mode: 'words', level: this.data.level,
                  read: {}, miss: {}, days: {},
                  friends: [CREATURES[0].k], buddy: CREATURES[0].k, seen: 0 };
    this.save();
    this.home();
  },

  // ── When listening can't work ──
  // A mic failure must never throw away the round she is in the middle of.
  standalone() {
    return window.navigator.standalone === true ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  },

  // In an iOS standalone web app, a target="_blank" link is one of the few
  // things that escapes to Safari — which is the only place the microphone
  // exists. The plain URL is shown too, so there is always a way through even
  // if the tap does nothing.
  safariEscape() {
    const url = location.href.split('#')[0];
    const pretty = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `<a class="btn big go safari" href="${url}" target="_blank" rel="noopener">
        🧭 Open in Safari
      </a>
      <div class="urlnote">or type this in Safari:<br><b>${pretty}</b></div>`;
  },

  // iOS home-screen apps get no microphone at all, so say so the moment she
  // arrives rather than letting her tap the mic and be told she was too quiet.
  iosStandalone() {
    return this.standalone() && /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  micBanner() {
    return this.iosStandalone()
      ? `<div class="micwarn">
           🎤 <b>I can't hear you in this app.</b>
           iPads only let Safari use the microphone.
           ${this.safariEscape()}
         </div>`
      : '';
  },

  noMic(why) {
    const canResume = !!(this.round && this.round.items && this.round.i < this.round.items.length);
    const iosApp = why === 'blocked' && this.standalone() &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);
    let msg, fix = '';
    if (why === 'unsupported') {
      msg = 'Reading Star listens using Safari (iPhone/iPad) or Chrome. Please open it there!';
    } else if (iosApp) {
      // The real cause, stated plainly. iOS gives a home-screen web app no
      // microphone at all, so no amount of tapping will make this work — the
      // icon has to be re-made now that the app no longer asks iOS to launch
      // it that way.
      msg = 'This app was added to the Home Screen the old way, and iPads do not let those apps use the microphone.';
      fix = `<div class="fixbox">
        <b>Grown-up fix — takes 20 seconds:</b>
        <ol>
          <li>Press and hold the Reading Star icon → <b>Remove App</b>.</li>
          <li>Open <b>Safari</b> and go to the Reading Star web page.</li>
          <li>Tap <b>Share</b> → <b>Add to Home Screen</b> again.</li>
        </ol>
        The new icon opens in Safari, where the microphone works.
      </div>`;
    } else {
      msg = 'Ask a grown-up to allow the microphone, and check you are online — then try again.';
    }
    this.render(`
      <div class="screen center">
        <div class="hero">🎤</div>
        <h1>I can't hear you yet</h1>
        <p class="tag">${msg}</p>
        ${iosApp ? this.safariEscape() : ''}
        ${fix}
        ${canResume
          ? `<button class="btn ${iosApp ? 'ghost' : 'big go'}" onclick="App.resume()">🔁 Try again</button>
             <button class="btn ghost" onclick="App.home()">🏠 Home</button>`
          : `<button class="btn ${iosApp ? 'ghost' : 'big go'}" onclick="App.home()">🏠 Home</button>`}
        <a class="classic-link" href="classic/">🌈 Play Unicorn Island instead</a>
      </div>
    `);
  },

  resume() {
    if (!this.round || this.round.i >= this.round.items.length) return this.home();
    this.showItem();
  },

  confetti(n) {
    const holder = document.createElement('div');
    holder.className = 'confetti';
    for (let i = 0; i < (n || 18); i++) {
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
        // Keyed by build id, not a session flag: a later deploy in the same
        // session must still be able to heal.
        if (sessionStorage.getItem('rs-updating') !== v.build) {
          sessionStorage.setItem('rs-updating', v.build);
          location.reload();
        }
      }
    } catch (e) { /* offline is fine */ }
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
