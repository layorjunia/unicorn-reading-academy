// AudioLib — plays pre-generated voice clips (audio/manifest.json).
// Every word, letter sound, story page, and instruction in the app has a
// pre-recorded clip generated with macOS TTS in phoneme mode, so letter
// SOUNDS are always sounds (/b/) and never letter names ("bee"), and the
// voice is identical on every device. Browser speechSynthesis is only a
// fallback for rare dynamic text (e.g. greetings with the child's name).

const AudioLib = {
  manifest: null,      // { words: {text->file}, ph: {token->file}, ltr: {letter->file} }
  _current: null,
  _queueToken: 0,
  _unlocked: false,

  init() {
    fetch('audio/manifest.json')
      .then(r => r.ok ? r.json() : null)
      .then(m => { this.manifest = m; })
      .catch(() => { this.manifest = null; });
    // iOS requires a user gesture before audio can play — unlock on first tap
    const unlock = () => {
      if (this._unlocked) return;
      this._unlocked = true;
      const a = new Audio();
      a.muted = true;
      a.play().catch(() => {});
      document.removeEventListener('touchend', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchend', unlock);
    document.addEventListener('click', unlock);
  },

  norm(text) {
    return String(text).toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  fileFor(text) {
    if (!this.manifest) return null;
    const k = this.norm(text);
    // Clip filenames drop apostrophes ("let's" is stored as "lets"), so retry
    // without them before giving up.
    return this.manifest.words[k] || this.manifest.words[k.replace(/'/g, '')] || null;
  },

  stop() {
    this._queueToken++;
    if (this._current) { this._current.pause(); this._current = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
  },

  _playFile(file) {
    return new Promise(resolve => {
      const a = new Audio('audio/' + file);
      this._current = a;
      a.onended = () => resolve();
      a.onerror = () => resolve();
      a.play().catch(() => resolve());
    });
  },

  // Play a sequence of items; each item is {file} or {tts, rate} or {gap}
  async _playSeq(items) {
    this.stop();
    const token = this._queueToken;
    for (const it of items) {
      if (token !== this._queueToken) return;
      if (it.gap) { await new Promise(r => setTimeout(r, it.gap)); continue; }
      if (it.file) { await this._playFile(it.file); continue; }
      if (it.tts != null) { await this._tts(it.tts, it.rate); }
    }
  },

  _tts(text, rate) {
    return new Promise(resolve => {
      if (!window.speechSynthesis) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith('en'));
      const v = vs.find(x => /Samantha/i.test(x.name)) || vs[0];
      if (v) u.voice = v;
      u.rate = rate || 0.92; u.pitch = 1.05;
      u.onend = resolve; u.onerror = resolve;
      speechSynthesis.speak(u);
      setTimeout(resolve, 8000); // safety
    });
  },

  // Speak one text: clip if we have it, else split into clip-covered words,
  // else TTS fallback.
  speak(text, opts) {
    const items = this._itemsFor(text, opts);
    this._playSeq(items);
  },

  // Speak several texts in a row with small gaps.
  speakSeq(texts) {
    const items = [];
    texts.forEach((t, i) => {
      if (i) items.push({ gap: 160 });
      items.push(...this._itemsFor(t));
    });
    this._playSeq(items);
  },

  _itemsFor(text, opts) {
    const f = this.fileFor(text);
    if (f) return [{ file: f }];
    // try word-by-word coverage (sentences are pre-generated, but this
    // catches dynamic strings and hyphenated compounds like "wake-up")
    const words = this.norm(text).split(/[^a-z']+/).filter(Boolean);
    const found = words.map(w => this.manifest && (this.manifest.words[w] || this.manifest.words[w.replace(/'/g, '')]));
    if (words.length > 1 && found.every(Boolean)) {
      const items = [];
      found.forEach((file, i) => {
        if (i) items.push({ gap: 90 });
        items.push({ file });
      });
      return items;
    }
    return [{ tts: text, rate: opts && opts.rate }];
  },

  // Pure letter-sounds (phoneme clips), spaced for blending practice.
  speakSounds(tokens) {
    const items = [];
    tokens.forEach((t, i) => {
      if (i) items.push({ gap: 420 });
      const key = String(t).toLowerCase();
      if (this.manifest && this.manifest.ph[key]) items.push({ file: this.manifest.ph[key] });
      else if (this.manifest && this.manifest.words[key]) items.push({ file: this.manifest.words[key] });
      else items.push({ tts: (typeof PHONEME_SPEAK !== 'undefined' && PHONEME_SPEAK[key]) || key, rate: 0.75 });
    });
    this._playSeq(items);
  },

  // Letter NAMES (for spelling out heart words: "s", "a", "i", "d")
  spellOut(word, opts) {
    const items = [];
    const pre = opts && opts.prefix ? this._itemsFor(opts.prefix) : [];
    items.push(...pre);
    word.toLowerCase().split('').forEach((ch) => {
      items.push({ gap: 300 });
      if (this.manifest && this.manifest.ltr[ch]) items.push({ file: this.manifest.ltr[ch] });
      else items.push({ tts: ch });
    });
    if (opts && opts.thenWord) {
      items.push({ gap: 420 });
      items.push(...this._itemsFor(word));
    }
    this._playSeq(items);
  }
};

AudioLib.init();
