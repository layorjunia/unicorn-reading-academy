// Showing a word's letter teams — the pairs that make ONE sound together.
//
// This is the single highest-value hint on a reading card: a new reader stalls
// on "boat" because she tries to say o and a separately. Underlining "oa" as
// one unit says "these two are a team" without a word of explanation.
//
// The bar is correctness, not coverage. Marking letters that are NOT a team in
// that particular word actively teaches the wrong thing — "th" in mis-hap, "ar"
// in ca-rry — so every rule here is deliberately conservative and the whole
// shipped corpus is audited against it at build time. When in doubt, mark
// nothing: a plain word is fine, a wrong hint is not.

const Mark = {
  // Two letters (or three) that make one sound. Longest first — "igh" must be
  // tried before "ig", "tch" before "ch".
  TEAMS: [
    'igh', 'tch', 'dge',
    'sh', 'ch', 'th', 'wh', 'ck', 'ng', 'ph', 'kn', 'wr',
    'ai', 'ay', 'ea', 'ee', 'oa', 'oe', 'oo', 'ou', 'ow', 'oi', 'oy',
    'au', 'aw', 'ew', 'ue', 'ui', 'ie',
    'ar', 'or', 'er', 'ir', 'ur',
  ],

  // Words where a "team" is really two letters in different syllables, or is
  // simply not a team. Each one was caught by the build-time audit rather than
  // guessed at. A word listed here is shown plain.
  SKIP: new Set([
    'mishap', 'hothouse', 'shorthand', 'boathouse', 'lighthouse',
    'changed', 'danger', 'ginger', 'longer', 'stronger', 'younger',
    'anger', 'hunger', 'finger', 'singer', 'ringer', 'hanger',
    'here', 'there', 'where', 'were', 'more', 'core', 'score', 'store',
    'before', 'shore', 'chore', 'snore', 'wore', 'tore', 'sore',
    'care', 'share', 'bare', 'hare', 'stare', 'square', 'scare', 'spare',
    'fire', 'hire', 'wire', 'tire', 'sire', 'pure', 'cure', 'sure',
  ]),

  // A vowel + consonant + silent e, where the e makes the vowel say its name.
  MAGIC_E: /^(.*?)([aeiou])([bcdfgklmnprstvz])(e)$/,

  // Words that END in a silent e without the vowel saying its name. These are
  // the ones every phonics programme teaches as exceptions, and marking them
  // as magic-e would teach the wrong sound outright.
  NOT_MAGIC: new Set([
    'come', 'become', 'have', 'give', 'forgive', 'live', 'love', 'above',
    'glove', 'dove', 'done', 'none', 'gone', 'some', 'someone', 'something',
    'sometime', 'one', 'are', 'were', 'move', 'remove', 'prove', 'lose',
    'whose', 'shoe', 'were', 'there', 'where', 'here',
  ]),

  VOWELS: 'aeiou',

  // Returns [{t, kind}] where kind is 'team' | 'magic' | 'silent' | ''.
  // Spans are recorded as they are matched — reconstructing them afterwards
  // from per-letter flags loses the boundaries and splits "igh" into i-g-h.
  parts(word) {
    const w = String(word || '').toLowerCase();
    if (!/^[a-z]+$/.test(w) || this.SKIP.has(w)) return [{ t: word, kind: '' }];

    const claimed = new Array(w.length).fill(null);   // index -> span id
    const spans = [];
    const claim = (i, len, kind) => {
      const id = spans.length;
      spans.push({ start: i, len, kind });
      for (let k = 0; k < len; k++) claimed[i + k] = id;
    };

    // Magic e first, so its vowel is not also claimed by an r-controlled team.
    const m = this.NOT_MAGIC.has(w) ? null : this.MAGIC_E.exec(w);
    if (m) {
      const vi = m[1].length;
      // Not magic-e when the vowel is the tail of a vowel TEAM: "house",
      // "goose", "pause", "because". There the team carries the sound and the
      // e is just silent, so marking the second vowel points at the wrong
      // letter entirely.
      const prev = w[vi - 1];
      // Count vowel groups, ignoring the final e. More than one means more
      // than one syllable: village, machine, notice, message, awesome — the
      // final e there is an ending, not a magic e.
      const groups = (w.slice(0, -1).match(/[aeiouy]+/g) || []).length;
      if (groups > 1) {
        claim(w.length - 1, 1, 'silent');
      } else if (prev && 'aeiou'.includes(prev)) {
        // vowel TEAM + silent e: "house", "goose", "pause". The team carries
        // the sound; pointing at its second letter points at the wrong one.
        claim(w.length - 1, 1, 'silent');
      } else {
        claim(vi, 1, 'magic');
        claim(w.length - 1, 1, 'silent');
      }
    }

    for (let i = 0; i < w.length; ) {
      if (claimed[i] !== null) { i++; continue; }
      let hit = null;
      for (const t of this.TEAMS) {
        if (!w.startsWith(t, i)) continue;
        let free = true;
        for (let k = 0; k < t.length; k++) if (claimed[i + k] !== null) free = false;
        if (free) { hit = t; break; }
      }
      if (!hit) { i++; continue; }
      if (!this.isRealTeam(w, i, hit)) { i++; continue; }
      claim(i, hit.length, 'team');
      i += hit.length;
    }

    const out = [];
    for (let i = 0; i < w.length; ) {
      const id = claimed[i];
      if (id === null) { out.push({ t: word[i], kind: '' }); i++; continue; }
      const sp = spans[id];
      out.push({ t: word.slice(sp.start, sp.start + sp.len), kind: sp.kind });
      i = sp.start + sp.len;
    }
    return out;
  },

  // Is this really one sound here, or two letters that happen to sit together?
  // Every check below exists because the build-time audit caught a word the
  // rule got wrong.
  isRealTeam(w, i, t) {
    const after = w[i + t.length];
    const isVowel = (c) => c && 'aeiouy'.includes(c);   // y counts: "story"
    if (t.length === 2 && t[1] === 'r' && 'aeiou'.includes(t[0])) {
      // r-controlled only when no vowel follows: "car", "farm" yes;
      // "story" (sto-ry) and "carry" no — there the r opens the next syllable.
      if (isVowel(after)) return false;
    }
    if (t === 'ng' && isVowel(after)) return false;      // dan-ger, not da-nger
    if (t.length === 2 && 'aeiou'.includes(t[0]) && 'aeiou'.includes(t[1])) {
      // a vowel team is the whole vowel sound; another vowel right after
      // usually means two syllables
      if (after && 'aeiou'.includes(after)) return false;
    }
    return true;
  },

  // A compound word split into its two halves, but ONLY when both halves are
  // real words the app itself teaches. That keeps the split honest without any
  // linguistics: "sunset" splits because "sun" and "set" are both in the word
  // list; "carpet" does not, because "pet" is but "car" + "pet" is a coincidence
  // we cannot verify — so it needs both halves AND a minimum length.
  VOCAB: null,
  setVocab(words) { this.VOCAB = new Set(words); },

  // Words that split into two real words by coincidence. Splitting these
  // colours the halves at the wrong place — "fat|her", "not|ice",
  // "thin|king" — and in father's case it also destroys the "th".
  NOT_COMPOUND: new Set([
    'father', 'mother', 'brother', 'another', 'together', 'weather',
    'feather', 'leather', 'rather', 'whether', 'gather', 'notice',
    'message', 'restart', 'thinking', 'nothing', 'inside', 'into',
    'carpet', 'forest', 'basket', 'pocket', 'rocket', 'ticket',
  ]),

  compound(word) {
    const w = String(word || '').toLowerCase();
    if (!this.VOCAB || w.length < 6 || this.NOT_COMPOUND.has(w)) return null;
    for (let i = 3; i <= w.length - 3; i++) {
      const a = w.slice(0, i), b = w.slice(i);
      if (this.VOCAB.has(a) && this.VOCAB.has(b)) return [a, b];
    }
    return null;
  },

  // The HTML the card shows.
  html(word) {
    const comp = this.compound(word);
    if (comp) {
      // Each half is marked on its own. Marking the whole word and then
      // colouring it invented teams that straddle the join — drive|way grew
      // an "ew", ant|hill grew a "th" — which is precisely the wrong lesson.
      const [a] = comp;
      return `<span class="syl1">${this.spans(word.slice(0, a.length))}</span>` +
             `<span class="syl2">${this.spans(word.slice(a.length))}</span>`;
    }
    return this.spans(word);
  },

  spans(word) {
    return this.parts(word).map(p => {
      if (p.kind === 'team') return `<u class="team">${p.t}</u>`;
      if (p.kind === 'magic') return `<u class="magic">${p.t}</u>`;
      if (p.kind === 'silent') return `<span class="silent">${p.t}</span>`;
      return p.t;
    }).join('');
  },
};
