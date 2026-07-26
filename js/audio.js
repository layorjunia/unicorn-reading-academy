// AudioLib — plays pre-generated voice clips (audio/manifest.json).
//
// Nothing here uses the browser's speech synthesiser for real content. Every
// word, sentence, letter sound and letter name is a file generated at build
// time by tools/gen_audio.py with a neural voice.
//
// NARRATION is the important concept. A teaching line is never one blob of
// text, because a voice reading "Short a says ah" pronounces the lone "a" as
// the article ("uh") and "i" as "eye" — teaching the wrong sound. Instead a
// line is an ordered list of segments:
//
//   [{say:'This letter says'}, {ph:'a'}, {say:'like in'}, {word:'cat'}]
//
// Prose is spoken by the neural voice; letter SOUNDS come from dedicated IPA
// phoneme clips. The two can never be confused.

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
      if (i) items.push({ gap: s.ph || s.ltr ? 260 : 150 });
      if (s.say != null) items.push(...this._itemsFor(s.say));
      else if (s.ph != null) {
        const f = this.phFile(s.ph);
        items.push(f ? { file: f } : { tts: s.ph, rate: 0.7 });
      } else if (s.word != null) items.push(...this._itemsFor(s.word));
      else if (s.ltr != null) {
        const f = this.ltrFile(s.ltr);
        items.push(f ? { file: f } : { tts: s.ltr });
      }
    });
    return items;
  },

  // Prefer the single continuous recording of the whole line. Playing the
  // segments individually works, but the gaps between clips make it sound
  // chopped and robotic — the one-shot clip has real sentence prosody with the
  // exact phonemes rendered inside it.
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
      if (s.ph != null) return { seg: 'ph', text: s.ph, kind: this.phFile(s.ph) ? 'clip' : 'missing' };
      if (s.word != null) return { seg: 'word', text: s.word, kind: this.resolve(s.word).kind };
      if (s.ltr != null) return { seg: 'ltr', text: s.ltr, kind: this.ltrFile(s.ltr) ? 'clip' : 'missing' };
      return { seg: '?', text: JSON.stringify(s), kind: 'missing' };
    });
  },

  // Blending practice: the separate sounds, then the WHOLE WORD.
  //
  // Playing only the fragments is not blending — it is the opposite of it. The
  // point of the exercise is arriving at the word, so the sounds are always
  // followed by the real word in the natural voice. The individual sounds come
  // from the phoneme engine (exact); the word comes from the neural voice
  // (human), which is also what stops the whole thing sounding robotic.
  speakSounds(tokens, word) {
    const items = [];
    tokens.forEach((t, i) => {
      if (i) items.push({ gap: 500 });
      const f = this.phFile(t);
      if (f) items.push({ file: f });
      else items.push(...this._itemsFor(String(t)));
    });
    if (word) {
      items.push({ gap: 700 });             // a beat, then the payoff
      items.push(...this._itemsFor(word));
    }
    this._playSeq(items);
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
