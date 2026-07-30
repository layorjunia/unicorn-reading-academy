// AudioLib — plays pre-generated voice clips (audio/manifest.json).
//
// Nothing here uses the browser's speech synthesiser for real content. Every
// word, sentence, letter sound and letter name is a file generated at build
// time by tools/gen_audio.py with a neural voice.
//
// The app does NOT speak isolated letter sounds. Synthesised phonemes were
// inaccurate enough to teach the wrong thing — /a/ and /i/ came out nearly
// identical — and they sounded mechanical next to the neural voice. Everything
// the child hears is a whole word or a whole sentence, in one human voice.
//
// A teaching line is still an ordered list of segments, so prose and example
// words can be composed:
//
//   [{say:"Let's read some words."}, {word:'cat'}, {word:'sit'}]

const AudioLib = {
  manifest: null,      // { words: {text->file}, ph: {token->file}, ltr: {letter->file} }
  ready: false,
  _current: null,
  _queueToken: 0,
  _unlocked: false,

  init() {
    fetch('audio/manifest.json')
      .then(r => r.ok ? r.json() : null)
      .then(m => { this.manifest = m; this.ready = !!m; })
      .catch(() => { this.manifest = null; });
    // iOS needs a user gesture before audio may play — unlock on first tap
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
    // Clip names drop apostrophes ("let's" is stored as "lets").
    return this.manifest.words[k] || this.manifest.words[k.replace(/'/g, '')] || null;
  },

  phFile(tok) {
    if (!this.manifest) return null;
    const k = String(tok).toLowerCase();
    return this.manifest.ph[k] || null;
  },

  ltrFile(ch) {
    if (!this.manifest) return null;
    return this.manifest.ltr[String(ch).toLowerCase()] || null;
  },

  // Resolve text to playable items and report HOW it was resolved.
  //   'clip'     one pre-generated recording — the good case
  //   'stitched' several word clips concatenated — acceptable only for a bare
  //              word list, never for prose (it sounds robotic and chopped)
  //   'tts'      browser fallback — should never happen for shipped content
  resolve(text) {
    const f = this.fileFor(text);
    if (f) return { kind: 'clip', items: [{ file: f }] };

    const words = this.norm(text).split(/[^a-z']+/).filter(Boolean);
    const found = words.map(w => this.manifest &&
      (this.manifest.words[w] || this.manifest.words[w.replace(/'/g, '')]));
    // length >= 1 so trailing punctuation ("cat!") still finds the word clip
    // instead of silently dropping to browser speech.
    if (words.length >= 1 && found.every(Boolean)) {
      const items = [];
      found.forEach((file, i) => {
        if (i) items.push({ gap: 90 });
        items.push({ file });
      });
      return { kind: 'stitched', items };
    }
    return { kind: 'tts', items: [{ tts: text }] };
  },

  _itemsFor(text, opts) {
    const r = this.resolve(text);
    if (r.kind === 'tts' && opts && opts.rate) r.items[0].rate = opts.rate;
    return r.items;
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

  // Resolves when whatever is currently speaking has finished. Screen changes
  // wait on this instead of a fixed timer — otherwise the next screen's audio
  // cancels the praise line halfway through, which is heard as it being
  // "cut off".
  _done: Promise.resolve(),
  done() { return this._done; },

  _playSeq(items) {
    this.stop();
    const token = this._queueToken;
    this._done = (async () => {
      for (const it of items) {
        if (token !== this._queueToken) return;
        if (it.gap) { await new Promise(r => setTimeout(r, it.gap)); continue; }
        if (it.cb) { try { it.cb(); } catch (e) {} }
        if (it.file) { await this._playFile(it.file); continue; }
        if (it.tts != null) { await this._tts(it.tts, it.rate); }
      }
    })();
    return this._done;
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
      setTimeout(resolve, 8000);
    });
  },

  speak(text, opts) { this._playSeq(this._itemsFor(text, opts)); },

  speakSeq(texts) {
    const items = [];
    texts.forEach((t, i) => {
      if (i) items.push({ gap: 160 });
      items.push(...this._itemsFor(t));
    });
    this._playSeq(items);
  },

  // ── Narration: the composed form used for all teaching lines ──
  narrationItems(segments) {
    const items = [];
    (segments || []).forEach((s, i) => {
      if (i) items.push({ gap: s.word ? 320 : 150 });
      if (s.say != null) items.push(...this._itemsFor(s.say));
      else if (s.word != null) items.push(...this._itemsFor(s.word));
      else if (s.ltr != null) {
        const f = this.ltrFile(s.ltr);
        items.push(f ? { file: f } : { tts: s.ltr });
      }
    });
    return items;
  },

  // Prefer the single continuous recording of the whole line — it has real
  // sentence prosody, where separate clips sound chopped.
  narrFile(id) {
    if (!this.manifest || !this.manifest.narr || !id) return null;
    return this.manifest.narr[id] || null;
  },

  playNarration(segments, id) {
    const whole = this.narrFile(id);
    if (whole) return this._playSeq([{ file: whole }]);
    this._playSeq(this.narrationItems(segments));
  },

  // Report how each segment resolves — used by the build-time audit so a
  // stitched or missing clip can never ship unnoticed.
  auditNarration(segments) {
    return (segments || []).map(s => {
      if (s.say != null) return { seg: 'say', text: s.say, kind: this.resolve(s.say).kind };
      if (s.word != null) return { seg: 'word', text: s.word, kind: this.resolve(s.word).kind };
      if (s.ltr != null) return { seg: 'ltr', text: s.ltr, kind: this.ltrFile(s.ltr) ? 'clip' : 'missing' };
      return { seg: '?', text: JSON.stringify(s), kind: 'missing' };
    });
  },

  // ── Letter sounds: HUMAN recordings only, never synthesised ──
  //
  // Four attempts at synthesising isolated sounds all failed (browser TTS,
  // eSpeak, Piper phonemes, Apple IPA): stops like /b/ physically need a vowel
  // release, so TTS either invents one ("buh") or emits silence, and /a/ vs
  // /i/ came out near-identical — the lesson taught the wrong thing. Every
  // real reading app records the ~44 sounds with a human. So does this one:
  // tools/record-sounds.html -> tools/import_sounds.py -> audio/s/ + manifest
  // 'snd'. If any needed sound has no recording yet, the activity falls back
  // to saying the whole word — never to a synthesiser.
  sndInfo(id) {
    return (this.manifest && this.manifest.snd && this.manifest.snd[id]) || null;
  },
  soundIdsFor(tok) {
    if (typeof SOUND_MAP === 'undefined') return null;
    return SOUND_MAP[String(tok).toLowerCase()] || null;
  },
  canSoundOut(tokens) {
    if (!tokens || !tokens.length) return false;
    return tokens.every(t => {
      const ids = this.soundIdsFor(t);
      return ids && ids.every(id => this.sndInfo(id));
    });
  },
  // Play each token's human sound with air between, then (optionally) the
  // whole word. opts.onSound(i) fires as token i starts — the UI uses it to
  // light the matching tile; opts.onWord() fires as the word starts.
  speakSounds(tokens, word, opts) {
    opts = opts || {};
    if (this.canSoundOut(tokens)) {
      const items = [];
      tokens.forEach((t, i) => {
        if (i) items.push({ gap: 420 });
        const ids = this.soundIdsFor(t);
        ids.forEach((id, k) => {
          if (k) items.push({ gap: 200 });
          const item = { file: this.sndInfo(id).f };
          if (k === 0 && opts.onSound) item.cb = () => opts.onSound(i);
          items.push(item);
        });
      });
      if (word) {
        items.push({ gap: 650 });
        const wordItems = this._itemsFor(word);
        if (opts.onWord && wordItems.length) wordItems[0].cb = () => opts.onWord();
        items.push(...wordItems);
      }
      this._playSeq(items);
    } else if (word) {
      this.speak(word);
    }
  },

  // Letter NAMES, for spelling a heart word out loud.
  spellOut(word, opts) {
    const items = [];
    if (opts && opts.prefix) items.push(...this._itemsFor(opts.prefix));
    word.toLowerCase().split('').forEach(ch => {
      items.push({ gap: 300 });
      const f = this.ltrFile(ch);
      items.push(f ? { file: f } : { tts: ch });
    });
    if (opts && opts.thenWord) {
      items.push({ gap: 420 });
      items.push(...this._itemsFor(word));
    }
    this._playSeq(items);
  }
};

// Sound effects are deliberately separate from speech: they must be able to
// overlap a spoken line rather than cancel it, and a fresh Audio per call lets
// rapid taps stack instead of cutting each other off.
const Sfx = {
  enabled: true,
  play(name, volume) {
    if (!this.enabled) return;
    try {
      const a = new Audio('audio/sfx/' + name + '.m4a');
      a.volume = volume == null ? 0.75 : volume;
      a.play().catch(() => {});
    } catch (e) { /* audio not available yet */ }
  }
};

AudioLib.init();
