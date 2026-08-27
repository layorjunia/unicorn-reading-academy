// Listener — the child READS the word out loud and the app checks it.
//
// Uses the browser's built-in speech recognition (Apple's dictation on
// iPhone/iPad, Google's on Android/Chrome). Recognising a word we already
// know the answer to is a far easier problem than synthesising sounds ever
// was: we take every alternative the recogniser offers and accept anything
// that plausibly matches the target.
//
// Design rule, non-negotiable: THE APP NEVER PUNISHES A MISS. Recognisers are
// mediocre on children's speech, and a false "wrong!" when she said it right
// is poison for a new reader. So the judge is generous, the first miss is a
// gentle "try again", and the second miss models the word in the app's own
// voice and moves on. Reading practice, not a test.

const Listener = {
  _SR: window.SpeechRecognition || window.webkitSpeechRecognition || null,
  _rec: null,
  _timer: null,

  get available() { return !!this._SR; },

  // Start one listening attempt. Must be called from a tap handler (browsers
  // require a user gesture for the mic). Calls exactly one of:
  //   onHeard(alternatives)  — list of transcript strings, best first
  //   onSilence()            — mic worked, nothing recognisable was said
  //   onBlocked()            — permission denied / recogniser unavailable
  start(opts) {
    this.stop();
    let settled = false;
    const done = (fn, arg) => {
      if (settled) return;
      settled = true;
      clearTimeout(this._timer);
      this._rec = null;
      this._cancel = null;
      (fn || (() => {}))(arg);
    };
    // stop() must settle FIRST, silently: aborting the recogniser fires its
    // onend, and without this a screen change would deliver onSilence to a
    // screen that no longer exists (and speak over the new one).
    this._cancel = () => { settled = true; };
    let rec;
    try {
      rec = new this._SR();
    } catch (e) {
      return done(opts.onBlocked);
    }
    this._rec = rec;
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 8;

    rec.onresult = (ev) => {
      const alts = [];
      for (const result of ev.results) {
        for (const alt of result) {
          if (alt.transcript && alt.transcript.trim()) alts.push(alt.transcript);
        }
      }
      done(alts.length ? opts.onHeard : opts.onSilence, alts);
    };
    rec.onerror = (ev) => {
      // Anything that means "the mic cannot work right now" — denied,
      // offline, no microphone — must fall back to the tap version, not
      // loop "I didn't hear you" at a child whose device can't hear her.
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed' ||
          ev.error === 'network' || ev.error === 'audio-capture') {
        done(opts.onBlocked);
      } else {
        done(opts.onSilence);   // no-speech, aborted — genuine quiet
      }
    };
    rec.onend = () => done(opts.onSilence);

    // The speaking budget must not start until recognition actually starts:
    // on a fresh device the OS permission dialog sits between rec.start()
    // and onstart, and every second a parent spends reading it would
    // otherwise count against the child's attempt.
    const armWatchdog = () => {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        try { rec.stop(); } catch (e) { /* already stopped */ }
        // rec.stop() finalises asynchronously through Apple/Google's
        // service — a real transcript commonly lands 0.5–1.5s later, so
        // the grace period must comfortably exceed that round-trip or a
        // slow reader's correct answer is thrown away as silence.
        setTimeout(() => done(opts.onSilence), 2500);
      }, 8000);
    };
    rec.onstart = armWatchdog;

    try {
      rec.start();
    } catch (e) {
      return done(opts.onBlocked);
    }
    // Outer safety net for engines that never fire onstart (or hang in the
    // permission dialog forever): generous, because it only exists to keep
    // the button from being stuck.
    this._timer = setTimeout(() => {
      try { rec.stop(); } catch (e) { /* already stopped */ }
      setTimeout(() => done(opts.onSilence), 2500);
    }, 25000);
  },

  stop() {
    clearTimeout(this._timer);
    if (this._cancel) { this._cancel(); this._cancel = null; }
    if (this._rec) {
      try { this._rec.abort(); } catch (e) { /* fine */ }
      this._rec = null;
    }
  },

  // ── The judge ──────────────────────────────────────────────────────────
  // Dictation writes what it THINKS was meant, not what was spelled: digits
  // for numbers, homophone spellings, joined words. All of those are correct
  // readings and must be accepted.
  DIGITS: {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
    '10': 'ten', '11': 'eleven', '12': 'twelve'
  },

  // Groups of spellings that sound identical (or near enough that a child
  // reading the target correctly could be transcribed as the other).
  HOMOPHONES: [
    ['ate', 'eight'], ['to', 'too', 'two'], ['for', 'four', 'fore'],
    ['one', 'won'], ['see', 'sea'], ['be', 'bee'], ['no', 'know'],
    ['hear', 'here'], ['right', 'write', 'rite'], ['road', 'rode', 'rowed'],
    ['so', 'sew', 'sow'], ['sun', 'son'], ['blue', 'blew'],
    ['red', 'read'], ['new', 'knew'], ['not', 'knot'], ['night', 'knight'],
    ['rap', 'wrap'], ['ring', 'wring'], ['maid', 'made'], ['tail', 'tale'],
    ['sail', 'sale'], ['mail', 'male'], ['pail', 'pale'], ['rain', 'reign'],
    ['plain', 'plane'], ['week', 'weak'], ['meet', 'meat'], ['deer', 'dear'],
    ['bear', 'bare'], ['hare', 'hair'], ['pair', 'pear', 'pare'],
    ['flour', 'flower'], ['our', 'hour'], ['I', 'eye', 'aye'],
    ['by', 'buy', 'bye'], ['hi', 'high'], ['toad', 'towed'],
    ['role', 'roll'], ['hole', 'whole'], ['wait', 'weight'],
    ['way', 'weigh'], ['days', 'daze'], ['gem', 'jem'], ['cue', 'queue'],
    ['oh', 'o', 'owe'], ['in', 'inn'], ['an', 'ann'], ['aunt', 'ant'],
    ['cell', 'sell'], ['cent', 'sent', 'scent'], ['seen', 'scene'],
    ['fined', 'find'], ['mist', 'missed'], ['band', 'banned'],
    ['side', 'sighed'], ['seas', 'seize', 'sees'], ['knead', 'need'],
    ['nose', 'knows'], ['pain', 'pane'], ['groan', 'grown'],
    ['moose', 'mousse'], ['dew', 'do', 'due'], ['heel', 'heal'],
    ['steel', 'steal'], ['peek', 'peak'], ['creek', 'creak'],
    ['beet', 'beat'], ['flee', 'flea'], ['seem', 'seam'], ['team', 'teem'],
    // spelling variants dictation may prefer
    ['gray', 'grey'], ['mom', 'mum'], ['donut', 'doughnut']
  ],

  _canon(word) {
    let w = String(word).toLowerCase().replace(/[^a-z0-9']/g, '').replace(/'/g, '');
    w = this.DIGITS[w] || w;
    return w;
  },

  _sameSound(a, b) {
    if (a === b) return true;
    for (const group of this.HOMOPHONES) {
      const g = group.map(x => x.toLowerCase());
      if (g.includes(a) && g.includes(b)) return true;
    }
    // trivial inflection the recogniser adds on its own ("cats" for "cat")
    if (a.length > 2 && (b === a + 's' || a === b + 's')) return true;
    return false;
  },

  _close(a, b) {
    // Edit distance 1, ONLY for long words, where a one-letter difference is
    // far more likely a transcription slip ("playgroun") than a different
    // word. Short words get no fuzz at all: the curriculum is built of
    // 4-and-5-letter minimal pairs (cake/lake, duck/dock, bone/cone), and
    // fuzzing those accepts the exact misreadings the lessons teach against.
    if (Math.min(a.length, b.length) < 6) return false;
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  },

  // Judge every alternative against the target.
  //   'match' — she read it (exact / homophone / digit form, any alternative)
  //   'near'  — one letter off on a long word; treat as a match on the
  //             second attempt, "try again" on the first
  //   'miss'  — nothing resembling the target anywhere
  //
  // opts.reject: the activity's OTHER choices — the anticipated misreadings.
  // A transcript word that IS one of those is evidence she read the wrong
  // word, so it must never count as near-the-target, and it turns the whole
  // attempt into a hard miss.
  judge(target, alternatives, opts) {
    const t = this._canon(target);
    const reject = ((opts && opts.reject) || [])
      .map(r => this._canon(r)).filter(r => r && !this._sameSound(t, r));
    const isRejected = (w) => reject.some(r => this._sameSound(r, w));
    let near = false, distractor = false;
    for (const alt of alternatives || []) {
      for (const raw of String(alt).split(/\s+/)) {
        const w = this._canon(raw);
        if (!w) continue;
        if (this._sameSound(t, w)) return 'match';
        if (isRejected(w)) { distractor = true; continue; }
        if (this._close(t, w)) near = true;
      }
      // joined transcription of the exact target ("in to" -> "into")
      const joined = this._canon(String(alt).replace(/\s+/g, ''));
      if (joined && this._sameSound(t, joined)) return 'match';
    }
    if (distractor) return 'miss';
    return near ? 'near' : 'miss';
  }
};
