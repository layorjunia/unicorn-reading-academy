// Unicorn Reading Academy — main app
// Screens: profiles → home (level map + hubs) → island lesson loop,
// heart garden, fluency stage, creature cove, parent corner.

const LEVELS = [LEVEL1, LEVEL2, LEVEL3];
const PRAISE = ['Great job!', 'You did it!', 'Super sparkle!', 'Amazing!', 'Wow, fantastic!', 'You are a reading star!'];
const ENCOURAGE = ['Almost! Try again!', 'Good try! Listen again!', 'You can do it!', 'So close! One more try!'];

const App = {
  data: null,
  profile: null,
  voice: null,
  isl: null,        // current island lesson state
  hw: null,         // heart word session state
  fl: null,         // fluency session state

  // ───────────────────────── init ─────────────────────────
  init() {
    this.data = Store.load();
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    const pick = () => {
      const vs = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      this.voice = vs.find(v => /Samantha/i.test(v.name))
        || vs.find(v => /female|Victoria|Karen|Google US/i.test(v.name)) || vs[0] || null;
    };
    if (window.speechSynthesis) { pick(); speechSynthesis.onvoiceschanged = pick; }
    if (Sync.configured()) Sync.ensureLoaded().catch(() => {});
    const active = this.data.activeProfileId && this.data.profiles[this.data.activeProfileId];
    if (active) { this.profile = active; this.showHome(); } else { this.showProfiles(); }
  },

  save() {
    if (this.profile) {
      this.profile.updatedAt = Date.now();
      Store.save(this.data);
      Sync.schedulePush(this.profile);
    } else {
      Store.save(this.data);
    }
  },

  render(html) {
    document.getElementById('app').innerHTML = `<div class="screen">${html}</div>`;
    window.scrollTo(0, 0);
  },

  // ───────────────────────── speech ─────────────────────────
  speak(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (this.voice) u.voice = this.voice;
    u.rate = rate || 0.92;
    u.pitch = 1.15;
    speechSynthesis.speak(u);
    return u;
  },

  speakQueue(parts, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    parts.forEach(p => {
      const u = new SpeechSynthesisUtterance(p);
      if (this.voice) u.voice = this.voice;
      u.rate = rate || 0.8;
      u.pitch = 1.15;
      speechSynthesis.speak(u);
    });
  },

  speakSounds(sounds) {
    this.speakQueue(sounds.map(s => PHONEME_SPEAK[s] || s), 0.75);
  },

  praise() { this.speak(PRAISE[Math.floor(Math.random() * PRAISE.length)]); },
  encourage() { this.speak(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]); },

  burst(emoji) {
    const layer = document.getElementById('feedback-layer');
    layer.innerHTML = `<div class="big-burst">${emoji}</div>`;
    setTimeout(() => { layer.innerHTML = ''; }, 950);
  },

  confetti() {
    const bits = ['🎉', '⭐', '💖', '🌸', '✨', '🦄', '🎀'];
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('span');
      s.className = 'confetti-bit';
      s.textContent = bits[Math.floor(Math.random() * bits.length)];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 3400);
    }
  },

  addStars(n) {
    this.profile.progress.stars += n;
    this.save();
  },

  // ───────────────────────── profiles ─────────────────────────
  showProfiles() {
    const profiles = Object.values(this.data.profiles);
    this.render(`
      <div class="logo">
        <span class="big-emoji">🦄</span>
        <h1>Unicorn Reading Academy</h1>
        <div class="sub">Let's read together! 💖</div>
      </div>
      <div class="profile-grid">
        ${profiles.map(p => `
          <div class="profile-card" onclick="App.pickProfile('${p.id}')">
            <div class="avatar">${p.avatar}</div>
            <div class="name">${p.name}${p.cloud ? ' ☁️' : ''}</div>
          </div>`).join('')}
        <div class="profile-card" onclick="App.showNewProfile()">
          <div class="avatar">➕</div>
          <div class="name">New Reader</div>
        </div>
      </div>
      ${Sync.configured() ? `<div class="center"><button class="btn ghost small" onclick="App.showCloudLogin()">☁️ I have a cloud backpack</button></div>` : ''}
    `);
  },

  pickProfile(id) {
    this.profile = this.data.profiles[id];
    this.data.activeProfileId = id;
    this.save();
    this.speak('Hi ' + this.profile.name + '! Ready to read?');
    if (this.profile.cloud && Sync.configured()) {
      Sync.ensureLoaded()
        .then(() => Sync.pull(this.profile.uid))
        .then(cloud => { if (Sync.mergeInto(this.profile, cloud)) { Store.save(this.data); this.showHome(); } })
        .catch(() => {});
    }
    this.showHome();
  },

  showNewProfile() {
    const avatars = ['🦄', '🐱', '🐰', '🦋', '🧜‍♀️', '🧚', '🐼', '🦩'];
    this.render(`
      <div class="logo"><span class="big-emoji">🌸</span><h1>Hi, new friend!</h1></div>
      <div class="card center">
        <h2>What is your name?</h2>
        <input type="text" id="np-name" maxlength="16" placeholder="Your name">
        <h2 class="mt">Pick your buddy!</h2>
        <div class="choices" id="np-avatars">
          ${avatars.map(a => `<button class="choice" data-av="${a}" onclick="App._pickAvatar(this)">${a}</button>`).join('')}
        </div>
        <button class="btn big mt" onclick="App.createProfile()">Let's go! 🚀</button>
        <div class="mt"><button class="btn ghost small" onclick="App.showProfiles()">⬅ Back</button></div>
      </div>
    `);
    this._avatar = '🦄';
  },

  _pickAvatar(el) {
    document.querySelectorAll('#np-avatars .choice').forEach(c => c.classList.remove('correct'));
    el.classList.add('correct');
    this._avatar = el.dataset.av;
    this.speak(el.dataset.av === '🦄' ? 'A unicorn!' : 'Good pick!');
  },

  createProfile() {
    const name = (document.getElementById('np-name').value || '').trim();
    if (!name) { this.speak('Type your name first!'); return; }
    const p = Store.newProfile(name, this._avatar || '🦄');
    this.data.profiles[p.id] = p;
    this.data.activeProfileId = p.id;
    this.profile = p;
    this.save();
    this.confetti();
    this.speak('Welcome, ' + name + '! Let the reading adventure begin!');
    this.showHome();
  },

  // ── Cloud login (existing account from another device) ──
  showCloudLogin(forProfile) {
    this._pw = [];
    this._cloudMode = forProfile ? 'connect' : 'signin';
    this.render(`
      <div class="logo"><span class="big-emoji">☁️</span><h1>Cloud Backpack</h1>
      <div class="sub">${forProfile ? 'Make a cloud backpack to keep your stars safe!' : 'Get your stars from the cloud!'}</div></div>
      <div class="card center">
        <h2>Your name</h2>
        <input type="text" id="cl-name" maxlength="16" value="${forProfile ? this.profile.name : ''}" placeholder="Your name">
        <h2 class="mt">Tap your 4 secret pictures</h2>
        <div class="pw-slots" id="pw-slots">${'<div class="pw-slot"></div>'.repeat(4)}</div>
        <div class="emoji-grid">
          ${PW_EMOJI.map(e => `<button class="emoji-key" onclick="App._pwTap('${e}')">${e}</button>`).join('')}
        </div>
        <button class="btn ghost small" onclick="App._pwClear()">Clear</button>
        <div class="mt">
          ${forProfile
            ? `<button class="btn big" onclick="App.cloudConnect(true)">Make my backpack ☁️</button>
               <div class="mt"><button class="btn small purple" onclick="App.cloudConnect(false)">I already have one</button></div>`
            : `<button class="btn big" onclick="App.cloudSignIn()">Open my backpack ☁️</button>`}
        </div>
        <div class="mt"><button class="btn ghost small" onclick="${forProfile ? 'App.showParent(true)' : 'App.showProfiles()'}">⬅ Back</button></div>
      </div>
    `);
  },

  _pwTap(e) {
    if (this._pw.length >= 4) return;
    this._pw.push(e);
    this._pwRender();
  },
  _pwClear() { this._pw = []; this._pwRender(); },
  _pwRender() {
    const slots = document.querySelectorAll('#pw-slots .pw-slot');
    slots.forEach((s, i) => { s.textContent = this._pw[i] || ''; });
  },

  _cloudCreds() {
    const name = (document.getElementById('cl-name').value || '').trim();
    if (!name) { this.speak('Type your name first!'); return null; }
    if (this._pw.length !== 4) { this.speak('Tap your four secret pictures!'); return null; }
    return { name, pw: this._pw.slice() };
  },

  async cloudSignIn() {
    const c = this._cloudCreds(); if (!c) return;
    try {
      const uid = await Sync.signIn(c.name, c.pw);
      const cloud = await Sync.pull(uid);
      let p = Object.values(this.data.profiles).find(x => x.uid === uid);
      if (!p) {
        p = Store.newProfile(c.name, (cloud && cloud.avatar) || '🦄');
        this.data.profiles[p.id] = p;
      }
      p.cloud = true; p.uid = uid;
      if (cloud) { p.progress = cloud.progress; p.avatar = cloud.avatar || p.avatar; }
      p.updatedAt = Date.now();
      this.profile = p; this.data.activeProfileId = p.id;
      this.save(); this.confetti();
      this.speak('Welcome back, ' + p.name + '!');
      this.showHome();
    } catch (e) {
      this.speak('Hmm, that did not match. Ask a grown-up to help!');
      alert('Could not open the cloud backpack.\n\n' + (e && e.message ? e.message : e));
    }
  },

  async cloudConnect(isNew) {
    const c = this._cloudCreds(); if (!c) return;
    try {
      const uid = isNew ? await Sync.signUp(c.name, c.pw) : await Sync.signIn(c.name, c.pw);
      this.profile.cloud = true;
      this.profile.uid = uid;
      this.profile.name = c.name;
      if (!isNew) {
        const cloud = await Sync.pull(uid);
        Sync.mergeInto(this.profile, cloud);
      }
      this.profile.updatedAt = Date.now();
      await Sync.push(this.profile);
      this.save(); this.confetti();
      this.speak('Your cloud backpack is ready!');
      this.showParent(true);
    } catch (e) {
      alert('Cloud setup did not work.\n\n' + (e && e.message ? e.message : e));
    }
  },

  // ───────────────────────── home ─────────────────────────
  islandsDone() {
    return LEVELS.flatMap(l => l.islands).filter(i => this.isDone(i.id)).length;
  },
  isDone(id) { const r = this.profile.progress.islands[id]; return r && r.done; },

  isUnlocked(levelIdx, islandIdx) {
    if (this.profile.progress.freeRoam) return true;
    const flat = LEVELS.flatMap(l => l.islands.map(i => i.id));
    const id = LEVELS[levelIdx].islands[islandIdx].id;
    const pos = flat.indexOf(id);
    if (pos === 0) return true;
    return this.isDone(flat[pos - 1]);
  },

  heartMastered() {
    const hb = this.profile.progress.heartBox;
    return Object.values(hb).filter(x => x.box >= 3).length;
  },

  showHome() {
    const p = this.profile;
    const creatures = Math.min(CREATURES.length, Math.floor(p.progress.stars / STARS_PER_CREATURE));
    this.render(`
      <div class="topbar">
        <div class="title">${p.avatar} Hi, ${p.name}!</div>
        <div>
          <span class="star-chip">⭐ ${p.progress.stars}</span>
          <button class="btn ghost small" onclick="App.showProfiles()">👥</button>
          <button class="btn ghost small" onclick="App.showParentGate()">👨‍👩‍👧 Parents</button>
        </div>
      </div>
      <div class="hub-row">
        <div class="hub-card" onclick="App.showGarden()">
          <div class="h-emoji">🌷</div><div class="h-label">Heart Words</div>
          <div class="h-note">${this.heartMastered()} flowers bloomed</div>
        </div>
        <div class="hub-card" onclick="App.showFluency()">
          <div class="h-emoji">🎤</div><div class="h-label">Fluency Stage</div>
          <div class="h-note">read like a star</div>
        </div>
        <div class="hub-card" onclick="App.showCove()">
          <div class="h-emoji">🏝️</div><div class="h-label">Creature Cove</div>
          <div class="h-note">${creatures} friends found</div>
        </div>
      </div>
      ${LEVELS.map((lv, li) => `
        <div class="level-section">
          <div class="level-head"><span class="lv-emoji">${lv.emoji}</span><h2>${lv.name}</h2></div>
          <div class="island-row">
            ${lv.islands.map((isl, ii) => {
              const done = this.isDone(isl.id);
              const unlocked = this.isUnlocked(li, ii);
              return `<div class="island ${done ? 'done' : ''} ${unlocked ? '' : 'locked'}"
                onclick="${unlocked ? `App.startIsland('${isl.id}')` : 'App.lockedTap()'}">
                <div class="isl-emoji">${isl.emoji}</div>
                <div class="isl-title">${isl.title}</div>
                <div class="isl-sub">${isl.sub}</div>
              </div>`;
            }).join('')}
          </div>
        </div>`).join('')}
    `);
  },

  lockedTap() { this.speak('Finish the island before this one to unlock it!'); },

  // ───────────────────────── island lesson loop ─────────────────────────
  findIsland(id) {
    for (const lv of LEVELS) for (const isl of lv.islands) if (isl.id === id) return isl;
    return null;
  },

  startIsland(id) {
    const island = this.findIsland(id);
    this.isl = { island, step: 'learn', sub: 0, right: 0, tries: 0, built: [], page: 0, q: 0, quizScore: 0 };
    this.renderIsland();
    setTimeout(() => this.speak(island.teach.intro), 300);
  },

  stepList() { return ['learn', 'sound', 'build', 'sort', 'read', 'quiz']; },

  dots() {
    const steps = this.stepList();
    const cur = steps.indexOf(this.isl.step);
    return `<div class="progress-dots">${steps.map((s, i) =>
      `<div class="pdot ${i < cur ? 'on' : i === cur ? 'now' : ''}"></div>`).join('')}</div>`;
  },

  islHead(text) {
    const isl = this.isl.island;
    const guides = { Pip: '🦄', Mimi: '🐱', Bun: '🐰', Dot: '🐉' };
    return `
      <div class="topbar">
        <button class="btn ghost small" onclick="App.showHome()">🏠 Map</button>
        <div class="title">${isl.emoji} ${isl.title}</div>
        <span class="star-chip">⭐ ${this.profile.progress.stars}</span>
      </div>
      ${this.dots()}
      <div class="activity-head">
        <span class="guide-emoji">${guides[isl.guide] || '🦄'}</span>
        <div class="guide-bubble" onclick="App.speak(this.textContent)">${text}</div>
      </div>`;
  },

  awardActivity(key, stars) {
    const acts = this.profile.progress.activities;
    if (!acts[this.isl.island.id]) acts[this.isl.island.id] = {};
    if (!acts[this.isl.island.id][key]) {
      acts[this.isl.island.id][key] = 1;
      this.addStars(stars);
    }
    this.save();
  },

  nextStep() {
    const steps = this.stepList();
    const i = steps.indexOf(this.isl.step);
    this.isl.step = steps[i + 1];
    this.isl.sub = 0; this.isl.page = 0; this.isl.q = 0; this.isl.quizScore = 0;
    this.renderIsland();
  },

  renderIsland() {
    const s = this.isl.step;
    if (s === 'learn') return this.renderLearn();
    if (s === 'sound') return this.renderSound();
    if (s === 'build') return this.renderBuild();
    if (s === 'sort') return this.renderSort();
    if (s === 'read') return this.renderStory();
    if (s === 'quiz') return this.renderQuiz();
  },

  // ── Learn it ──
  renderLearn() {
    const t = this.isl.island.teach;
    this.render(`
      ${this.islHead(t.intro)}
      <div class="card center">
        <div class="choices">
          ${t.patterns.map(p => `<button class="choice" onclick="App.speakQueue(['${p.say}','like','${p.ex}'])">${p.g}</button>`).join('')}
        </div>
        <div class="sound-btns">
          ${t.examples.map(w => `<button class="sound-chip" onclick="App.speak('${w}')">${w}</button>`).join('')}
        </div>
        <button class="btn big green mt" onclick="App.awardActivity('learn',1); App.nextStep()">I'm ready! ➜</button>
      </div>
    `);
  },

  // ── Sound it (robot blending) ──
  renderSound() {
    const items = this.isl.island.soundIt;
    const it = items[this.isl.sub];
    this.render(`
      ${this.islHead('Robot talk! Tap the robot, listen to the sounds, and tap the word you hear!')}
      <div class="card center">
        <div style="font-size:4rem; cursor:pointer" onclick="App.speakSounds(${JSON.stringify(it.sounds).replace(/"/g, '&quot;')})">🤖</div>
        <div class="small-note">tap the robot to hear the sounds</div>
        <div class="choices">
          ${it.choices.map(c => `<button class="choice" onclick="App.soundPick(this,'${c}')">${c}</button>`).join('')}
        </div>
        <div class="small-note">${this.isl.sub + 1} of ${items.length}</div>
      </div>
    `);
    setTimeout(() => this.speakSounds(it.sounds), 400);
  },

  soundPick(el, chosen) {
    const it = this.isl.island.soundIt[this.isl.sub];
    if (chosen === it.word) {
      el.classList.add('correct');
      this.burst('🌟'); this.speakQueue([PRAISE[Math.floor(Math.random() * PRAISE.length)], it.word + '!']);
      setTimeout(() => {
        this.isl.sub++;
        if (this.isl.sub >= this.isl.island.soundIt.length) { this.awardActivity('sound', 2); this.nextStep(); }
        else this.renderSound();
      }, 1100);
    } else {
      el.classList.add('wrong');
      this.encourage();
      setTimeout(() => { el.classList.remove('wrong'); this.speakSounds(it.sounds); }, 700);
    }
  },

  // ── Build it (letter tiles) ──
  renderBuild() {
    const items = this.isl.island.buildIt;
    const it = items[this.isl.sub];
    if (!this.isl.trayOrder || this.isl.trayFor !== it.word) {
      const all = it.tiles.concat(it.extra);
      this.isl.trayOrder = all.map((t, i) => ({ t, i })).sort(() => Math.random() - 0.5);
      this.isl.trayFor = it.word;
      this.isl.built = [];
    }
    this.render(`
      ${this.islHead('Build the word! Tap the tiles in order. Tap the speaker to hear it again!')}
      <div class="card center">
        <button class="sound-chip" onclick="App.speak('${it.word}')">🔊 Hear the word</button>
        <div class="build-slots">
          ${it.tiles.map((t, i) => `<div class="build-slot ${this.isl.built[i] != null ? 'filled' : ''}">${this.isl.built[i] != null ? this.isl.trayOrder[this.isl.built[i]].t : ''}</div>`).join('')}
        </div>
        <div class="tile-tray">
          ${this.isl.trayOrder.map((x, idx) => `<button class="tile ${this.isl.built.includes(idx) ? 'used' : ''}" onclick="App.buildTap(${idx})">${x.t}</button>`).join('')}
        </div>
        <button class="btn ghost small" onclick="App.buildClear()">Start over 🔄</button>
        <div class="small-note">${this.isl.sub + 1} of ${items.length}</div>
      </div>
    `);
    if (this.isl.built.length === 0) setTimeout(() => this.speak('Build the word... ' + it.word), 350);
  },

  buildTap(idx) {
    const it = this.isl.island.buildIt[this.isl.sub];
    if (this.isl.built.includes(idx)) return;
    const tile = this.isl.trayOrder[idx];
    this.speak(PHONEME_SPEAK[tile.t] || tile.t, 0.8);
    this.isl.built.push(idx);
    if (this.isl.built.length === it.tiles.length) {
      const word = this.isl.built.map(i => this.isl.trayOrder[i].t).join('');
      if (word === it.tiles.join('')) {
        this.burst('💖'); this.confetti();
        setTimeout(() => this.speakQueue(['You built it!', it.word + '!']), 200);
        setTimeout(() => {
          this.isl.sub++; this.isl.trayOrder = null;
          if (this.isl.sub >= this.isl.island.buildIt.length) { this.awardActivity('build', 2); this.nextStep(); }
          else this.renderBuild();
        }, 1400);
        this.renderBuild();
        return;
      } else {
        this.encourage();
        setTimeout(() => { this.isl.built = []; this.renderBuild(); }, 900);
      }
    }
    this.renderBuild();
  },

  buildClear() { this.isl.built = []; this.renderBuild(); },

  // ── Sort it ──
  renderSort() {
    const st = this.isl.island.sortIt;
    if (!this.isl.sortOrder) {
      this.isl.sortOrder = st.words.slice().sort(() => Math.random() - 0.5);
    }
    const it = this.isl.sortOrder[this.isl.sub];
    this.render(`
      ${this.islHead('Which team does this word belong to? Tap the word to hear it, then tap its team!')}
      <div class="card center">
        <div class="sort-word" onclick="App.speak('${it.w}')">${it.w} 🔊</div>
        <div class="sort-buckets">
          <button class="bucket" onclick="App.sortPick(this,'a')">${st.a.label}<span class="b-ex">like "${st.a.ex}"</span></button>
          <button class="bucket" onclick="App.sortPick(this,'b')">${st.b.label}<span class="b-ex">like "${st.b.ex}"</span></button>
        </div>
        <div class="small-note mt">${this.isl.sub + 1} of ${this.isl.sortOrder.length}</div>
      </div>
    `);
    setTimeout(() => this.speak(it.w), 350);
  },

  sortPick(el, cat) {
    const it = this.isl.sortOrder[this.isl.sub];
    if (cat === it.cat) {
      el.style.borderStyle = 'solid'; el.style.background = 'var(--green)'; el.style.color = '#fff';
      this.burst('⭐'); this.praise();
      setTimeout(() => {
        this.isl.sub++;
        if (this.isl.sub >= this.isl.sortOrder.length) { this.awardActivity('sort', 2); this.isl.sortOrder = null; this.nextStep(); }
        else this.renderSort();
      }, 900);
    } else {
      el.style.background = 'var(--red)'; el.style.color = '#fff';
      this.encourage();
      setTimeout(() => { el.style.background = ''; el.style.color = ''; this.speak(it.w); }, 700);
    }
  },

  // ── Read it (decodable story) ──
  renderStory() {
    const story = this.isl.island.readIt;
    const pg = this.isl.page;
    if (pg >= story.pages.length) return this.renderStoryQuestions();
    const words = story.pages[pg].split(' ');
    this.render(`
      ${this.islHead('Story time! Read it out loud. Tap any word if you need help. 📖')}
      <div class="card">
        <div class="story-emoji">${story.emoji}</div>
        <h2 class="center">${story.title}</h2>
        <div class="story-page">
          ${words.map(w => `<span class="story-word" onclick="App.speak('${w.replace(/[^a-zA-Z]/g, '')}')">${w}</span>`).join(' ')}
        </div>
        <div class="story-nav">
          <button class="btn ghost small" ${pg === 0 ? 'disabled' : ''} onclick="App.isl.page--; App.renderStory()">⬅</button>
          <button class="btn purple small" onclick="App.readPageAloud()">🔊 Read to me</button>
          <button class="btn green" onclick="App.isl.page++; App.renderStory()">${pg === story.pages.length - 1 ? 'Questions! ➜' : 'Next ➜'}</button>
        </div>
        <div class="small-note center mt">page ${pg + 1} of ${story.pages.length}</div>
      </div>
    `);
  },

  readPageAloud() {
    const story = this.isl.island.readIt;
    this.speak(story.pages[this.isl.page], 0.82);
  },

  renderStoryQuestions() {
    const story = this.isl.island.readIt;
    const q = story.questions[this.isl.q];
    if (!q) {
      this.awardActivity('read', 3);
      this.burst('📖'); this.confetti();
      this.speak('You read the whole story! Now for the sparkle quiz!');
      return this.nextStep();
    }
    this.render(`
      ${this.islHead(q.q)}
      <div class="card center">
        <div class="choices" style="flex-direction:column; align-items:center">
          ${q.choices.map((c, i) => `<button class="choice" style="font-size:1.2rem" onclick="App.storyAnswer(this,${i})">${c}</button>`).join('')}
        </div>
      </div>
    `);
    setTimeout(() => this.speak(q.q), 300);
  },

  storyAnswer(el, i) {
    const q = this.isl.island.readIt.questions[this.isl.q];
    if (i === q.answer) {
      el.classList.add('correct'); this.burst('🌟'); this.praise();
      setTimeout(() => { this.isl.q++; this.renderStoryQuestions(); }, 1000);
    } else {
      el.classList.add('wrong'); this.encourage();
      setTimeout(() => el.classList.remove('wrong'), 700);
    }
  },

  // ── Mastery quiz ──
  renderQuiz() {
    const items = this.isl.island.mastery;
    const it = items[this.isl.sub];
    if (!it) return this.finishIsland();
    this.render(`
      ${this.islHead('Sparkle Quiz! Listen to the word and tap it!')}
      <div class="card center">
        <button class="sound-chip" style="font-size:2rem" onclick="App.speak('${it.word}')">🔊 Hear the word</button>
        <div class="choices">
          ${it.choices.map(c => `<button class="choice" onclick="App.quizPick(this,'${c}')">${c}</button>`).join('')}
        </div>
        <div class="small-note">${this.isl.sub + 1} of ${items.length} • ⭐ ${this.isl.quizScore} right</div>
      </div>
    `);
    setTimeout(() => this.speak(it.word), 400);
  },

  quizPick(el, chosen) {
    const it = this.isl.island.mastery[this.isl.sub];
    document.querySelectorAll('.choice').forEach(c => c.style.pointerEvents = 'none');
    if (chosen === it.word) {
      el.classList.add('correct'); this.isl.quizScore++;
      this.burst('⭐');
    } else {
      el.classList.add('wrong');
      document.querySelectorAll('.choice').forEach(c => { if (c.textContent === it.word) c.classList.add('correct'); });
      this.speak('It was ' + it.word);
    }
    setTimeout(() => { this.isl.sub++; this.renderQuiz(); }, 1100);
  },

  finishIsland() {
    const score = this.isl.quizScore;
    const total = this.isl.island.mastery.length;
    const passed = score >= Math.ceil(total * 0.75);
    if (passed) {
      const first = !this.isDone(this.isl.island.id);
      this.profile.progress.islands[this.isl.island.id] = { done: true, best: Math.max(score, (this.profile.progress.islands[this.isl.island.id] || {}).best || 0) };
      if (first) this.addStars(5);
      this.save();
      this.confetti(); this.burst('🏆');
      const newCreature = Math.floor(this.profile.progress.stars / STARS_PER_CREATURE);
      this.render(`
        <div class="logo"><span class="big-emoji">🏆</span>
          <h1>Island complete!</h1>
          <div class="sub">You got ${score} out of ${total} on the Sparkle Quiz!</div>
        </div>
        <div class="card center">
          <div style="font-size:2.2rem">⭐ +5 stars!</div>
          ${newCreature > 0 && newCreature <= CREATURES.length ? `<div class="mt">A new friend may be waiting in Creature Cove... 🏝️</div>` : ''}
          <button class="btn big green mt" onclick="App.showHome()">Back to the map! 🗺️</button>
          <div class="mt"><button class="btn ghost small" onclick="App.showCove()">🏝️ Visit Creature Cove</button></div>
        </div>
      `);
      this.speak('Island complete! You earned five stars! Amazing reading!');
    } else {
      this.render(`
        <div class="logo"><span class="big-emoji">💪</span>
          <h1>So close!</h1>
          <div class="sub">You got ${score} of ${total}. Let's practice once more — you've got this!</div>
        </div>
        <div class="card center">
          <button class="btn big" onclick="App.startIsland('${this.isl.island.id}')">Try the island again 🔄</button>
          <div class="mt"><button class="btn ghost small" onclick="App.showHome()">🏠 Back to map</button></div>
        </div>
      `);
      this.speak('So close! Let\'s try one more time. Practice makes sparkle!');
    }
  },

  // ───────────────────────── Heart Word Garden ─────────────────────────
  unlockedHeartSets() {
    return Math.max(1, Math.min(HEART_WORDS.length, this.islandsDone() + 1));
  },

  heartInterval(box) { return [0, 1, 2, 4, 7][Math.min(box, 4)] * 86400000; },

  dueHeartWords() {
    const sets = HEART_WORDS.slice(0, this.unlockedHeartSets());
    const hb = this.profile.progress.heartBox;
    const due = [];
    for (const set of sets) for (const w of set.words) {
      const st = hb[w.w];
      if (!st) due.push(w);
      else if (st.box < 4 && Date.now() - st.last >= this.heartInterval(st.box)) due.push(w);
    }
    return due;
  },

  showGarden() {
    const sets = HEART_WORDS.slice(0, this.unlockedHeartSets());
    const hb = this.profile.progress.heartBox;
    const due = this.dueHeartWords();
    this.render(`
      <div class="topbar">
        <button class="btn ghost small" onclick="App.showHome()">🏠 Map</button>
        <div class="title">🌷 Heart Word Garden</div>
        <span class="star-chip">⭐ ${this.profile.progress.stars}</span>
      </div>
      <div class="card center">
        <p>Heart words are tricky words we learn by heart! 💖 Water your garden every day and watch the flowers bloom.</p>
        <button class="btn big mt" ${due.length ? '' : 'disabled'} onclick="App.startHeartSession()">
          ${due.length ? `💧 Water the garden (${Math.min(due.length, 7)} words)` : '🌈 All watered! Come back later!'}
        </button>
      </div>
      <div class="card">
        <div class="garden-grid">
          ${sets.flatMap(s => s.words).map(w => {
            const st = hb[w.w];
            const stage = !st ? '🌱' : st.box >= 4 ? '🌸' : st.box >= 3 ? '🌷' : st.box >= 1 ? '🌿' : '🌱';
            return `<div class="flower ${st && st.box >= 3 ? '' : 'budding'}" onclick="App.speak('${w.w}')">
              <div class="f-emoji">${stage}</div><div class="f-word">${w.w}</div></div>`;
          }).join('')}
        </div>
        <div class="small-note center mt">🌱 new → 🌿 growing → 🌷 blooming → 🌸 mastered! More words unlock as you finish islands.</div>
      </div>
    `);
  },

  startHeartSession() {
    const due = this.dueHeartWords().slice(0, 7);
    if (!due.length) return this.showGarden();
    this.hw = { words: due, idx: 0, phase: 'teach' };
    this.renderHeart();
  },

  heartHtml(w, hideHearts) {
    return w.w.split('').map((ch, i) =>
      w.heart.includes(i)
        ? (hideHearts ? `<span class="heart-letter">_</span>` : `<span class="heart-letter">${ch}</span>`)
        : ch
    ).join('');
  },

  renderHeart() {
    const w = this.hw.words[this.hw.idx];
    if (!w) return this.finishHeartSession();
    if (this.hw.phase === 'teach') {
      this.render(`
        <div class="topbar">
          <button class="btn ghost small" onclick="App.showGarden()">🌷 Garden</button>
          <div class="title">💖 Learn by heart</div>
          <span class="star-chip">${this.hw.idx + 1}/${this.hw.words.length}</span>
        </div>
        <div class="card center">
          <p>The pink letters are the tricky part — learn them by heart!</p>
          <div class="word-big" onclick="App.speak('${w.w}')">${this.heartHtml(w)} 🔊</div>
          <div class="sound-btns">
            ${w.w.split('').map((ch, i) => `<button class="sound-chip" style="${w.heart.includes(i) ? 'background:var(--pink);box-shadow:0 4px 0 #d84f85' : ''}" onclick="App.speak('${ch === 'I' ? 'capital I' : ch}')">${ch}</button>`).join('')}
          </div>
          <button class="btn big green mt" onclick="App.hw.phase='quiz'; App.renderHeart()">Got it! ➜</button>
        </div>
      `);
      setTimeout(() => this.speakQueue([w.w, '...', w.w.split('').join(', '), '...', w.w]), 350);
    } else {
      // quiz: pick correct spelling among distractors
      const distract = (word) => {
        const letters = 'aeiou';
        const chars = word.w.split('');
        const pos = word.heart[Math.floor(Math.random() * word.heart.length)] || 0;
        const orig = chars[pos];
        let sub = letters[Math.floor(Math.random() * letters.length)];
        if (sub === orig.toLowerCase()) sub = orig === 'e' ? 'a' : 'e';
        chars[pos] = sub;
        return chars.join('');
      };
      const opts = [w.w];
      let guard = 0;
      while (opts.length < 3 && guard++ < 30) {
        const d = distract(w);
        if (!opts.includes(d)) opts.push(d);
      }
      opts.sort(() => Math.random() - 0.5);
      this.render(`
        <div class="topbar">
          <button class="btn ghost small" onclick="App.showGarden()">🌷 Garden</button>
          <div class="title">💖 Which is right?</div>
          <span class="star-chip">${this.hw.idx + 1}/${this.hw.words.length}</span>
        </div>
        <div class="card center">
          <button class="sound-chip" style="font-size:2rem" onclick="App.speak('${w.w}')">🔊 Hear the word</button>
          <div class="choices">
            ${opts.map(o => `<button class="choice" onclick="App.heartPick(this,'${o}')">${o}</button>`).join('')}
          </div>
        </div>
      `);
      setTimeout(() => this.speak(w.w), 350);
    }
  },

  heartPick(el, chosen) {
    const w = this.hw.words[this.hw.idx];
    const hb = this.profile.progress.heartBox;
    const st = hb[w.w] || { box: 0, last: 0 };
    if (chosen === w.w) {
      el.classList.add('correct'); this.burst('🌸'); this.praise();
      st.box = Math.min(4, st.box + 1);
    } else {
      el.classList.add('wrong'); this.speak('It is spelled ' + w.w.split('').join(', '));
      st.box = Math.max(0, st.box - 1);
      document.querySelectorAll('.choice').forEach(c => { if (c.textContent === w.w) c.classList.add('correct'); });
    }
    st.last = Date.now();
    hb[w.w] = st;
    this.save();
    setTimeout(() => { this.hw.idx++; this.hw.phase = 'teach'; this.renderHeart(); }, 1300);
  },

  finishHeartSession() {
    this.addStars(3);
    this.confetti(); this.burst('🌷');
    this.speak('Your garden is watered! Three stars for you!');
    this.showGarden();
  },

  // ───────────────────────── Fluency Stage ─────────────────────────
  showFluency() {
    const hist = this.profile.progress.fluency;
    this.render(`
      <div class="topbar">
        <button class="btn ghost small" onclick="App.showHome()">🏠 Map</button>
        <div class="title">🎤 Fluency Stage</div>
        <span class="star-chip">⭐ ${this.profile.progress.stars}</span>
      </div>
      <div class="card center">
        <p>Pick a story. Listen first, then read it out loud 3 times — each time gets smoother! 🌟</p>
      </div>
      ${FLUENCY_PASSAGES.map(p => {
        const best = hist.filter(h => h.passageId === p.id && h.wcpm).sort((a, b) => b.wcpm - a.wcpm)[0];
        return `<div class="card" style="cursor:pointer" onclick="App.startFluency('${p.id}')">
          <div style="display:flex; align-items:center; gap:14px">
            <span style="font-size:2.4rem">${p.emoji}</span>
            <div style="flex:1"><b style="font-size:1.15rem">${p.title}</b>
              <div class="small-note">Level ${p.level}${best ? ` • best: ${best.wcpm} words/min 🏅` : ''}</div>
            </div>
            <span style="font-size:1.6rem">➜</span>
          </div>
        </div>`;
      }).join('')}
    `);
  },

  startFluency(id) {
    const p = FLUENCY_PASSAGES.find(x => x.id === id);
    this.fl = { p, missed: new Set(), startAt: null, parentMode: false, reads: 0 };
    this.renderFluency();
  },

  renderFluency() {
    const p = this.fl.p;
    const words = p.text.split(' ');
    const running = !!this.fl.startAt;
    this.render(`
      <div class="topbar">
        <button class="btn ghost small" onclick="App.showFluency()">⬅ Stories</button>
        <div class="title">${p.emoji} ${p.title}</div>
        <span class="star-chip">${words.length} words</span>
      </div>
      <div class="card">
        <div class="fluency-text" id="fl-text">
          ${words.map((w, i) => `<span class="fl-word ${this.fl.missed.has(i) ? 'missed' : ''}" data-i="${i}" onclick="App.flWordTap(${i}, '${w.replace(/[^a-zA-Z]/g, '')}')">${w}</span>`).join(' ')}
        </div>
      </div>
      <div class="card center">
        <button class="btn purple" onclick="App.speak(${JSON.stringify(p.text).replace(/"/g, '&quot;')}, 0.85)">🔊 Listen first</button>
        ${running
          ? `<button class="btn big green" onclick="App.flFinish()">✅ I finished reading!</button>`
          : `<button class="btn big" onclick="App.flStart()">⏱️ Start reading!</button>`}
        <div class="mt">
          <label class="small-note" style="cursor:pointer">
            <input type="checkbox" ${this.fl.parentMode ? 'checked' : ''} onchange="App.fl.parentMode=this.checked; App.renderFluency()">
            Parent check mode (tap words that were missed)
          </label>
        </div>
        <div class="small-note mt">Goal for 2nd grade: ~${FLUENCY_BENCHMARKS.winter} words per minute by winter, ~${FLUENCY_BENCHMARKS.spring} by spring.</div>
      </div>
    `);
  },

  flWordTap(i, word) {
    if (this.fl.parentMode && this.fl.startAt) {
      if (this.fl.missed.has(i)) this.fl.missed.delete(i); else this.fl.missed.add(i);
      document.querySelector(`.fl-word[data-i="${i}"]`).classList.toggle('missed');
    } else if (!this.fl.startAt) {
      this.speak(word);
    }
  },

  flStart() {
    this.fl.startAt = Date.now();
    this.fl.missed = new Set();
    this.speak('Ready, set, read!');
    this.renderFluency();
  },

  flFinish() {
    const secs = (Date.now() - this.fl.startAt) / 1000;
    const total = this.fl.p.text.split(' ').length;
    const missed = this.fl.missed.size;
    const wcpm = Math.round((total - missed) / (secs / 60));
    this.fl.startAt = null;
    this.fl.reads++;
    this.addStars(2);
    if (this.fl.parentMode) {
      this.profile.progress.fluency.push({ passageId: this.fl.p.id, wcpm, errors: missed, date: Date.now() });
      this.save();
    }
    const bench = FLUENCY_BENCHMARKS;
    this.confetti();
    this.render(`
      <div class="logo"><span class="big-emoji">🎉</span><h1>Nice reading!</h1></div>
      <div class="card center">
        ${this.fl.parentMode ? `
          <div class="wcpm-big">${wcpm} <span style="font-size:1.2rem">words/min</span></div>
          <div class="bench-note">missed ${missed} of ${total} words • 2nd grade goals: fall ${bench.fall} • winter ${bench.winter} • spring ${bench.spring}</div>
        ` : `<div class="wcpm-big">${Math.round(secs)}s</div><div class="bench-note">You read the whole story! ⭐ +2 stars</div>`}
        <p class="mt">Reading it again makes it even smoother! (${this.fl.reads} read${this.fl.reads > 1 ? 's' : ''} so far)</p>
        <button class="btn big mt" onclick="App.renderFluency()">Read it again! 🔄</button>
        <div class="mt"><button class="btn ghost small" onclick="App.showFluency()">⬅ Pick another story</button></div>
      </div>
    `);
    this.speak(this.fl.reads >= 3 ? 'Three reads! You are super fluent!' : 'Great reading! Reading it again makes your brain even stronger!');
  },

  // ───────────────────────── Creature Cove ─────────────────────────
  showCove() {
    const unlocked = Math.min(CREATURES.length, Math.floor(this.profile.progress.stars / STARS_PER_CREATURE));
    const next = STARS_PER_CREATURE - (this.profile.progress.stars % STARS_PER_CREATURE);
    this.render(`
      <div class="topbar">
        <button class="btn ghost small" onclick="App.showHome()">🏠 Map</button>
        <div class="title">🏝️ Creature Cove</div>
        <span class="star-chip">⭐ ${this.profile.progress.stars}</span>
      </div>
      <div class="card center">
        <p>Every ${STARS_PER_CREATURE} stars, a new friend joins your cove! ${unlocked < CREATURES.length ? `Only <b>${next} more stars</b> until the next one!` : 'You found them ALL! 🎊'}</p>
      </div>
      <div class="card">
        <div class="creature-grid">
          ${CREATURES.map((c, i) => `
            <div class="creature ${i < unlocked ? '' : 'locked-c'}" onclick="${i < unlocked ? `App.speakQueue(['${c.name}!','Hello!'])` : `App.speak('Keep reading to meet this friend!')`}">
              <div class="c-emoji">${i < unlocked ? c.emoji : '❓'}</div>
              <div class="c-name">${i < unlocked ? c.name : '???'}</div>
            </div>`).join('')}
        </div>
      </div>
    `);
  },

  // ───────────────────────── Parent Corner ─────────────────────────
  showParentGate() {
    const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 6);
    this._gate = a * b;
    this.render(`
      <div class="logo"><span class="big-emoji">👨‍👩‍👧</span><h1>Parent Corner</h1>
      <div class="sub">Grown-ups only! What is ${a} × ${b}?</div></div>
      <div class="card center">
        <input type="text" id="gate-in" inputmode="numeric" placeholder="?">
        <div class="mt">
          <button class="btn" onclick="App.checkGate()">Enter</button>
          <button class="btn ghost" onclick="App.showHome()">Back</button>
        </div>
      </div>
    `);
  },

  checkGate() {
    if (parseInt(document.getElementById('gate-in').value, 10) === this._gate) this.showParent();
    else { this.speak('Hmm, that is not right!'); this.showParentGate(); }
  },

  showParent(skipGate) {
    const p = this.profile;
    const totalIslands = LEVELS.reduce((n, l) => n + l.islands.length, 0);
    const flu = p.progress.fluency.slice(-10);
    const chart = flu.length ? this.wcpmChart(flu) : '<div class="small-note center">No fluency checks yet — use "Parent check mode" on the Fluency Stage.</div>';
    this.render(`
      <div class="topbar">
        <button class="btn ghost small" onclick="App.showHome()">🏠 Back to app</button>
        <div class="title">👨‍👩‍👧 Parent Corner</div>
      </div>
      <div class="card">
        <h2>${p.avatar} ${p.name}'s progress</h2>
        <table class="parent-table">
          <tr><td>Islands completed</td><td><b>${this.islandsDone()} / ${totalIslands}</b></td></tr>
          <tr><td>Heart words mastered</td><td><b>${this.heartMastered()} / ${HEART_WORDS.reduce((n, s) => n + s.words.length, 0)}</b></td></tr>
          <tr><td>Stars earned</td><td><b>⭐ ${p.progress.stars}</b></td></tr>
          <tr><td>Latest fluency</td><td><b>${flu.length ? flu[flu.length - 1].wcpm + ' WCPM' : '—'}</b> <span class="small-note">(goals: fall ${FLUENCY_BENCHMARKS.fall} / winter ${FLUENCY_BENCHMARKS.winter} / spring ${FLUENCY_BENCHMARKS.spring})</span></td></tr>
        </table>
        <div class="mt">${chart}</div>
      </div>
      <div class="card">
        <h2>Settings</h2>
        <label style="display:block; margin:10px 0; cursor:pointer">
          <input type="checkbox" ${p.progress.freeRoam ? 'checked' : ''} onchange="App.profile.progress.freeRoam=this.checked; App.save()">
          Unlock all islands (free roam — default is one at a time, in teaching order)
        </label>
      </div>
      <div class="card">
        <h2>☁️ Cloud sync</h2>
        ${!Sync.configured() ? `
          <p class="small-note">Cloud sync is not set up yet. Open <b>js/firebase-config.js</b> in the app folder (or the README on GitHub) for the 10-minute setup steps. Until then, progress saves on this device only.</p>
        ` : p.cloud ? `
          <p class="small-note">✅ This profile is backed up to the cloud as <b>${p.name}</b>. It syncs automatically after activities.</p>
          <button class="btn small purple mt" onclick="Sync.push(App.profile).then(()=>App.speak('Synced!'))">Sync now</button>
        ` : `
          <p class="small-note">Cloud is ready! Connect this profile so progress follows ${p.name} to any device.</p>
          <button class="btn small purple mt" onclick="App.showCloudLogin(true)">Connect ${p.name}'s cloud backpack</button>
        `}
      </div>
      <div class="card">
        <h2>Danger zone</h2>
        <button class="btn small" style="background:#c94f4f; box-shadow:0 4px 0 #a03030" onclick="App.resetProgress()">Reset ${p.name}'s progress</button>
      </div>
      <div class="small-note center mt">Built with the science of reading: systematic phonics → decodable stories → heart words → repeated-reading fluency. 💖</div>
    `);
  },

  wcpmChart(flu) {
    const W = 600, H = 170, pad = 30;
    const max = Math.max(100, ...flu.map(f => f.wcpm)) + 10;
    const x = i => pad + i * ((W - pad * 2) / Math.max(1, flu.length - 1));
    const y = v => H - pad - (v / max) * (H - pad * 2);
    const line = flu.map((f, i) => `${i ? 'L' : 'M'}${x(i)},${y(f.wcpm)}`).join(' ');
    const bench = v => `<line x1="${pad}" y1="${y(v)}" x2="${W - pad}" y2="${y(v)}" stroke="#e8dbff" stroke-width="2" stroke-dasharray="6 4"/><text x="${W - pad + 2}" y="${y(v) + 4}" font-size="10" fill="#b08ab5">${v}</text>`;
    return `<svg class="wcpm-chart" viewBox="0 0 ${W} ${H}">
      ${bench(FLUENCY_BENCHMARKS.fall)}${bench(FLUENCY_BENCHMARKS.winter)}${bench(FLUENCY_BENCHMARKS.spring)}
      <path d="${line}" fill="none" stroke="#ff6fa5" stroke-width="4" stroke-linecap="round"/>
      ${flu.map((f, i) => `<circle cx="${x(i)}" cy="${y(f.wcpm)}" r="6" fill="#ff6fa5"/><text x="${x(i)}" y="${y(f.wcpm) - 10}" font-size="11" text-anchor="middle" fill="#5a3d5c">${f.wcpm}</text>`).join('')}
    </svg>`;
  },

  resetProgress() {
    if (!confirm('Really reset ALL progress for ' + this.profile.name + '? This cannot be undone.')) return;
    const { name, avatar, cloud, uid, id } = this.profile;
    const fresh = Store.newProfile(name, avatar);
    fresh.id = id; fresh.cloud = cloud; fresh.uid = uid;
    this.data.profiles[id] = fresh;
    this.profile = fresh;
    this.save();
    if (cloud) Sync.push(fresh);
    this.showParent();
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
