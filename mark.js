// Showing a word's sounds — the letter teams, the silent letters, the magic e.
//
// This is the single highest-value hint on a reading card: a new reader stalls
// on "boat" because she tries to say o and a separately, and on "knee" because
// she tries to say the k. Underlining "oa" as one unit, and fading the k,
// answers both without a word of explanation.
//
// FOUR marks and only four, because she has to hold them all in her head:
//
//   team    two or three letters making ONE sound      green underline
//   magic   a vowel saying its NAME, pulled by a final silent e   orange + arc
//   silent  a letter that makes no sound at all        faded grey
//   parts   the two halves of a compound word          two colours
//
// The bar is CORRECTNESS, not coverage. Marking letters that are NOT a team in
// that particular word actively teaches the wrong thing — "th" in mis-hap,
// "ar" in ca-rry — so every rule here carries a positional guard, and the whole
// shipped corpus is run through it by dev/audit_content.py at build time. When
// in doubt, mark nothing: a plain word is fine, a wrong hint is not.

const Mark = {

  // ── Words shown completely plain ───────────────────────────────────────
  // Either the spelling lies to every rule we have, or a rule would fire
  // across a syllable seam we cannot detect. Each one was caught by the
  // build-time audit rather than guessed at.
  SKIP: new Set([
    // a digraph that straddles a syllable seam, in a word we cannot split
    'mishap', 'mishaps', 'hothouse', 'shorthand', 'boathouse', 'pothole',
    'grasshopper', 'foothill',
    // spellings no rule survives
    'were', 'eye', 'eyes', 'busy', 'buy', 'says', 'been', 'their', 'friend',
    'choir', 'choirs', 'cupboard', 'cupboards', 'tongue', 'yacht',
    'league', 'nowhere',
    // the -ain of a longer word is an unstressed schwa, not the /ay/ of
    // "rain" — and "rain", "explain" and "plain" must keep theirs, so this
    // has to be a list rather than a rule
    'mountain', 'mountains', 'fountain', 'fountains', 'certain', 'certainly',
    'curtain', 'curtains', 'captain', 'captains', 'bargain', 'villain',
  ]),

  // ── Silent letters ─────────────────────────────────────────────────────
  // Checked FIRST, because they are the most specific claims we make. Each
  // entry is [test, index-of-the-silent-letter]. The tests are deliberately
  // anchored: `mb` only at the very end, or "number" and "bamboo" lose a b.
  // The number is the offset of the silent letter INSIDE the match, not inside
  // the word: /alk/ + 1 is the l of "walk", /stle$/ + 1 is the t of "castle".
  // Absolute indices got three of these pointing at the wrong letter.
  SILENT: [
    // Word-INITIAL only. Allowing kn anywhere faded the k of dar(k)ness and
    // nic(k)name, where it is fully pronounced and closes the first syllable.
    [/^kn/,   0],   // (k)nee, (k)nock, (k)now, (k)night
    [/wr/,    0],   // (w)rite, (w)rong, re(w)rite
    [/^gn/,   0],   // (g)naw
    [/^rh/,   1],   // r(h)yme, r(h)ino
    [/mb$/,   1],   // lam(b), thum(b), com(b), clim(b), crum(b)
    [/gn$/,   0],   // si(g)n, desi(g)n
    [/mn$/,   1],   // autum(n), colum(n)
    [/stle$/, 1],   // cas(t)le, whis(t)le, rus(t)le, wres(t)le
    [/sten$/, 1],   // lis(t)en, fas(t)en, glis(t)en
    [/alk/,   1],   // wa(l)k, ta(l)k, cha(l)k, sta(l)k
    [/alf$/,  1],   // ha(l)f, ca(l)f
    [/ould$/, 2],   // cou(l)d, shou(l)d, wou(l)d
  ],

  // Silent letters that live in one particular word and nowhere near a rule.
  // index = which letter of THAT word is silent, counted from 0. Every one of
  // these is spelled out in a comment because counting them by eye put five of
  // them on the wrong letter first time round.
  SILENT_WORDS: {
    hour: 0,     // (h)our
    honest: 0,   // (h)onest
    honor: 0,    // (h)onor
    ghost: 1,    // g(h)ost
    sword: 1,    // s(w)ord
    answer: 3,   // ans(w)er
    two: 1,      // t(w)o
    who: 0,      // (w)ho
    whom: 0,     // (w)hom
    whose: 0,    // (w)hose
    whole: 0,    // (w)hole
    often: 2,    // of(t)en
    island: 1,   // i(s)land
    aisle: 2,    // ai(s)le
    knowledge: 0,
    scissors: 1, // s(c)issors
  },

  // ── Magic e ────────────────────────────────────────────────────────────
  // vowel + ONE consonant + silent e. `r` is deliberately absent from the
  // consonant class: "care" and "more" are not long-a and long-o, they are
  // r-controlled, and the -are/-ore/-ire/-ure teams below handle them.
  MAGIC_E: /^(.*?)([aeiou])([bcdfgklmnpstvz])(e)$/,

  // Words ending in a silent e where the vowel is NOT long. Every phonics
  // programme teaches these as exceptions, and marking them magic would teach
  // the wrong sound outright. They still get the silent-e mark — the e really
  // is silent in all of them — just not the orange "says its name" arc.
  NOT_MAGIC: new Set([
    'come', 'become', 'welcome', 'some', 'someone', 'something', 'sometime',
    'somewhere', 'have', 'having', 'give', 'given', 'forgive', 'live', 'love',
    'above', 'glove', 'dove', 'shove', 'done', 'none', 'gone', 'one', 'once',
    'are', 'were', 'move', 'remove', 'prove', 'improve', 'lose', 'whose',
    'shoe', 'there', 'where', 'here', 'were', 'they', 'sure', 'true', 'blue',
    'were', 'nurse', 'purse', 'horse', 'house', 'mouse', 'goose', 'please',
    'promise', 'purchase',
  ]),

  // ── Letter teams ───────────────────────────────────────────────────────
  // Longest first — "igh" must be tried before "ig", "eigh" before "ei",
  // "tch" before "ch", "ore" before "or".
  TEAMS: [
    'eigh', 'ough', 'augh',
    'iew', 'eau',
    'igh', 'tch', 'dge', 'ear', 'air', 'are', 'ore', 'ire', 'ure', 'ere',
    'oar', 'oor', 'our',
    'sh', 'ch', 'th', 'wh', 'ck', 'ng', 'nk', 'ph', 'qu',
    'ai', 'ay', 'ea', 'ee', 'oa', 'oe', 'oo', 'ou', 'ow', 'oi', 'oy',
    'au', 'aw', 'ew', 'ue', 'ui', 'ie', 'gh',
    'ar', 'or', 'er', 'ir', 'ur',
    'le',
    'll', 'ss', 'ff', 'zz', 'gg', 'dd',
  ],

  // The r-controlled-plus-e families only hold together at the very end of a
  // word, optionally with a plain -d or -s after it (scared, stores). In the
  // middle of a word they are usually two syllables: pa-rent, ce-re-al.
  TAIL_TEAMS: new Set(['are', 'ore', 'ire', 'ure', 'ere']),

  // A doubled consonant is one sound only at the END of a word — the "floss"
  // rule (bell, off, miss, buzz). In the middle it is a syllable seam that
  // splits: rab-bit, lit-tle, sud-den.
  FINAL_ONLY: new Set(['ll', 'ss', 'ff', 'zz', 'gg', 'dd']),

  // Words where two vowels sit side by side but belong to DIFFERENT syllables:
  // ce-re-al, i-de-a, cre-ate, qui-et, cru-el, ru-in. Spelling alone cannot
  // tell these from cream, chief and fruit — "quiet" and "chief" have exactly
  // the same shape — so the only honest answer is to name them. Also holds
  // be-ware and a-ware, where the seam invents an "ew" and an "aw".
  SPLIT_VOWELS: new Set([
    'cereal', 'area', 'idea', 'ideal', 'create', 'created', 'creates',
    'creating', 'react', 'reaction', 'theater', 'quiet', 'quieter',
    'quietly', 'quietest', 'diet', 'science', 'poem', 'poet', 'poetry',
    'cruel', 'fuel', 'duel', 'ruin', 'fluid', 'beware', 'aware',
    'cocoa', 'realize', 'realized', 'realizing', 'realization', 'elsewhere',
    'friendly', 'friendship', 'friendliest', 'koala', 'koalas', 'penguin',
    'penguins', 'boa', 'stereo', 'rodeo', 'video',
  ]),

  // A final e that is actually SOUNDED. The silent-e rule is right about
  // dance and orange, but "maybe" is MAY-bee and "recipe" is RES-uh-pee —
  // fading that e tells her to drop a whole syllable.
  SOUNDED_E: new Set([
    'maybe', 'recipe', 'recipes', 'karate', 'coyote', 'sesame', 'simile',
    'apostrophe', 'machete', 'finale', 'ukulele',
  ]),

  VOWELS: 'aeiou',
  isVowel(c) { return !!c && 'aeiouy'.indexOf(c) >= 0; },

  // ── The marking pass ───────────────────────────────────────────────────
  // Returns [{t, kind}] where kind is 'team' | 'magic' | 'silent' | ''.
  // Spans are recorded as they are matched — reconstructing them afterwards
  // from per-letter flags loses the boundaries and splits "igh" into i-g-h.
  parts(word) {
    const w = String(word || '').toLowerCase();
    if (!/^[a-z]+$/.test(w) || this.SKIP.has(w)) return [{ t: word, kind: '' }];

    const claimed = new Array(w.length).fill(null);
    const spans = [];
    const free = (i, len) => {
      if (i < 0 || i + len > w.length) return false;
      for (let k = 0; k < len; k++) if (claimed[i + k] !== null) return false;
      return true;
    };
    const claim = (i, len, kind) => {
      if (!free(i, len)) return;
      const id = spans.length;
      spans.push({ start: i, len, kind });
      for (let k = 0; k < len; k++) claimed[i + k] = id;
    };

    // 1. Silent letters. Most specific, so they go first: the k of "knee" is
    //    claimed before "ee" can be looked at, and the t of "castle" before
    //    the "le".
    if (Object.prototype.hasOwnProperty.call(this.SILENT_WORDS, w)) {
      claim(this.SILENT_WORDS[w], 1, 'silent');
    } else {
      for (const [re, off] of this.SILENT) {
        const hit = re.exec(w);
        if (hit) claim(hit.index + off, 1, 'silent');
      }
    }

    // 2. The r-controlled-plus-e families, claimed up front. They end in an e
    //    that the silent-e pass below would otherwise take, leaving "more" as
    //    m-o-r-e with a faded e and no team at all.
    for (const t of this.TAIL_TEAMS) {
      const at = w.length - t.length - (/(d|s)$/.test(w) && w.length > t.length + 1 ? 1 : 0);
      if (at >= 1 && w.startsWith(t, at) && this.isRealTeam(w, at, t)) claim(at, t.length, 'team');
    }

    // 3. Magic e, before the teams, so its vowel is not swallowed by one.
    const notMagic = this.NOT_MAGIC.has(w);
    const m = this.MAGIC_E.exec(w);
    if (m) {
      const vi = m[1].length;
      // In "quite" and "guide" the u belongs to the qu/gu consonant unit, so
      // it must not count as the vowel that blocks magic e. Treating it as one
      // left quite, quote, quake and guide with a faded e and no long vowel.
      const prev = (vi >= 2 && w[vi - 1] === 'u' && (w[vi - 2] === 'q' || w[vi - 2] === 'g'))
        ? '' : w[vi - 1];
      // Ignoring the final e, how many vowel groups are there? More than one
      // means more than one syllable — village, machine, notice, message,
      // awesome — where the final e is an ending, not a magic e.
      const groups = (w.slice(0, -1).match(/[aeiouy]+/g) || []).length;
      const isMagic = !notMagic && groups === 1 && !(prev && this.VOWELS.indexOf(prev) >= 0);
      if (isMagic) claim(vi, 1, 'magic');
      // Either way the final e says nothing, so it fades. This is the whole
      // point for "have" and "come": she can SEE that the e is silent even
      // though the vowel before it is short. Unless it is actually sounded —
      // "recipe" matches the magic-e SHAPE but is RES-uh-pee.
      if (!this.SOUNDED_E.has(w)) claim(w.length - 1, 1, 'silent');
    } else if (w.length > 2 && w.endsWith('e') && !w.endsWith('le')) {
      // dance, orange, house, since — a final e is silent even when no magic-e
      // pattern matches. Two guards: the letter before it must be a CONSONANT
      // (after a vowel it is half of a team — tree, knee, blue — and fading it
      // destroys the team), and there must be another vowel earlier in the
      // word (which is what keeps "the", "he", "she" and "we" out, where the
      // e IS the vowel).
      const before = w[w.length - 2];
      if (!this.SOUNDED_E.has(w) && !this.isVowel(before) && /[aeiou]/.test(w.slice(0, -1))) {
        claim(w.length - 1, 1, 'silent');
      }
    }

    // 4. Teams, left to right, longest match wins.
    for (let i = 0; i < w.length;) {
      if (claimed[i] !== null) { i++; continue; }
      let hit = null;
      for (const t of this.TEAMS) {
        if (!w.startsWith(t, i)) continue;
        if (!free(i, t.length)) continue;
        if (!this.isRealTeam(w, i, t)) continue;
        hit = t; break;
      }
      if (!hit) { i++; continue; }
      claim(i, hit.length, 'team');
      i += hit.length;
    }

    const out = [];
    for (let i = 0; i < w.length;) {
      const id = claimed[i];
      if (id === null) { out.push({ t: word[i], kind: '' }); i++; continue; }
      const sp = spans[id];
      out.push({ t: word.slice(sp.start, sp.start + sp.len), kind: sp.kind });
      i = sp.start + sp.len;
    }
    return out;
  },

  // Is this really one sound HERE, or two letters that happen to sit together?
  // Every check below exists because a word got marked wrongly without it.
  isRealTeam(w, i, t) {
    const after = w[i + t.length];
    const end = i + t.length === w.length;

    // A named syllable seam. Only vowel-initial teams are suppressed, so
    // "quiet" keeps its qu and "beware" keeps its -are.
    if (this.SPLIT_VOWELS.has(w) && this.VOWELS.indexOf(t[0]) >= 0
        && !this.TAIL_TEAMS.has(t)) return false;

    // -are/-ore/-ire/-ure/-ere hold together only at the end of the word,
    // give or take a plain -d or -s: scared, stores, fires. In the middle
    // they are two syllables — pa-rent, ce-re-al, di-rect.
    if (this.TAIL_TEAMS.has(t)) {
      const tail = w.slice(i + t.length);
      if (tail === '') return true;
      // A trailing -d or -s is fine ONLY when what is left is itself a word
      // ending in this team: shared -> share, stores -> store. Allowing it
      // blindly marked "colored" and "discovered" as if they rhymed with
      // "more", because those also happen to end in e-r-e-d.
      if (tail === 'd' || tail === 's') {
        return !!this.VOCAB && this.VOCAB.has(w.slice(0, -1));
      }
      return false;
    }

    // A doubled consonant is one sound at the end of a word; in the middle
    // it is where the syllables split.
    if (this.FINAL_ONLY.has(t)) return end;

    // "le" is a syllable of its own only after a CONSONANT: lit-tle, ta-ble,
    // pur-ple. After a vowel it is a magic e wearing a disguise — whale,
    // smile, mile, mule, style — and marking it here would hide that.
    if (t === 'le') return end && i > 0 && !this.isVowel(w[i - 1]);

    // r-controlled only when no vowel follows: "car" and "farm" yes;
    // "sto-ry" and "ca-rry" no, where the r opens the next syllable.
    if (t.length === 2 && t[1] === 'r' && this.VOWELS.indexOf(t[0]) >= 0) {
      if (this.isVowel(after)) return false;
      // carry, sorry, hurry, berry, arrow, borrow — a doubled r splits the
      // syllables, so the first vowel is short and not r-controlled at all.
      if (after === 'r') return false;
    }
    // dan-ger, fin-ger — the n and g are in different syllables.
    if ((t === 'ng' || t === 'nk') && this.isVowel(after)) return false;
    // hun-gry, an-gry: ng before r is /ng/ + /g/, two sounds, not the one
    // sound of "sing".
    if (t === 'ng' && after === 'r') return false;
    // go-ing, do-ing: the o and i are in different syllables. "point" and
    // "pointing" keep their oi, because there the next letters are not "ng".
    if (t === 'oi' && w.startsWith('ng', i + t.length)) return false;
    // to-ward(s): the w begins the second syllable, so "ow" is not a team.
    if (t === 'ow' && w.startsWith('ar', i + 2)) return false;
    // fam-ous, nerv-ous, curi-ous: the -ous ending is a schwa, not the /ow/
    // of "cloud". Guarded on a preceding vowel so "ours" is untouched.
    if (t === 'ou' && w.slice(i + 2) === 's' && /[aeiou]/.test(w.slice(0, i))) return false;
    // sto-ries, hap-pi-er, fun-ni-est: in a longer word the -ie- of an -ies,
    // -ier or -iest ending spans a syllable break. "flies", "tries" and "pies"
    // have no vowel before the ie, so they keep theirs.
    if (t === 'ie' && /^(s|r|st|rs)$/.test(w.slice(i + 2))
        && /[aeiou]/.test(w.slice(0, i))) return false;
    // dan-gle, sin-gle, tan-gle, rec-tan-gle: like hungry, ng before l is
    // /ng/ + a hard /g/, two sounds.
    if (t === 'ng' && after === 'l') return false;
    // a-way, a-wake, a-wait: a word opening with a vowel + w + another vowel
    // is two syllables, and "aw" is not the /aw/ of "saw".
    if (i === 0 && t.length === 2 && t[1] === 'w' && this.isVowel(after)) return false;
    // re-ward, re-wind, re-write: the re- prefix leaves an "ew" that is not a
    // team. No English word has a true ew team one letter in after an r.
    if (t === 'ew' && i === 1 && w[0] === 'r') return false;
    // laugh is /laf/: "au" says short a and "gh" says /f/ — two sounds, so the
    // four-letter augh team is a lie here. In caught and daughter it is not.
    if (t === 'augh' && w.startsWith('laugh')) return false;
    // "ear" and "air" survive a following consonant (heart, learn, stairs)
    // but not a following vowel.
    if ((t === 'ear' || t === 'oar' || t === 'our') && this.isVowel(after)) return false;

    // A vowel team is the whole vowel sound; another vowel straight after it
    // usually means two syllables — li-on, qui-et, cre-ate, ra-di-o.
    if (t.length === 2 && this.VOWELS.indexOf(t[0]) >= 0 && this.VOWELS.indexOf(t[1]) >= 0) {
      if (after && this.VOWELS.indexOf(after) >= 0) return false;
    }
    return true;
  },

  // ── Compound words ─────────────────────────────────────────────────────
  // Split into two coloured halves ONLY when both halves are real words the
  // app itself teaches. That keeps the split honest without any linguistics:
  // "sunset" splits because "sun" and "set" are both taught; "carpet" does
  // not, because "car" + "pet" is a coincidence we cannot tell from a real
  // compound.
  VOCAB: null,
  setVocab(words) { this.VOCAB = new Set(words); },

  // Words that split into two real words by coincidence. Colouring the halves
  // puts the seam in the wrong place — "fat|her", "not|ice", "thin|king" —
  // and in father's case it also destroys the "th".
  NOT_COMPOUND: new Set([
    'father', 'mother', 'brother', 'another', 'together', 'weather', 'feather',
    'leather', 'rather', 'whether', 'gather', 'notice', 'message', 'restart',
    'thinking', 'nothing', 'inside', 'into', 'carpet', 'forest', 'basket',
    'pocket', 'rocket', 'ticket', 'butter', 'better', 'letter', 'matter',
    'winter', 'water', 'wonder', 'under', 'number', 'finger', 'garden',
    'market', 'monkey', 'napkin', 'muffin', 'pumpkin', 'shelter', 'planet',
    'candle', 'handle', 'bandit', 'carrot', 'parent', 'moment', 'present',
    'tiger', 'other', 'over', 'ever', 'never', 'clever', 'silver', 'seven',
    'cannot', 'become', 'begin', 'behind', 'below', 'beside', 'between',
    // more coincidences, each one caught by running the marker over the
    // corpus rather than guessed at
    'nowhere', 'anther', 'understand', 'hardship', 'kitten', 'piglet',
    'usage', 'chestnut', 'toward', 'towards', 'because', 'behave',
    'necklace', 'package', 'puppet', 'rectangle', 'cabbage', 'village',
    'cottage', 'carriage', 'sausage', 'bandage', 'manage', 'passage',
    'sandwich', 'sandwiches',
    // for- is a PREFIX here, not the word "for"
    'forgot', 'forget', 'forgotten', 'forgive', 'forgave', 'forever',
    'forward', 'forwards', 'format',
  ]),

  // "winking" is wink+ing, not win+king; "washer" is wash+er, not was+her;
  // "rustled" is rustle+d, not rust+led. Every one of those splits found two
  // real words and coloured the seam in the wrong place. Plurals are left
  // alone deliberately — "anthills" really is ant|hill+s.
  inflected(w) {
    const V = this.VOCAB;
    if (!V) return false;
    if (w.endsWith('ing')) {
      return V.has(w.slice(0, -3)) || V.has(w.slice(0, -4)) || V.has(w.slice(0, -3) + 'e');
    }
    if (w.endsWith('ed') || w.endsWith('er')) {
      return V.has(w.slice(0, -2)) || V.has(w.slice(0, -1)) || V.has(w.slice(0, -3));
    }
    return false;
  },

  // Real compounds the 3-letter minimum cannot find. Lowering that minimum
  // globally is not an option: "of|ten", "is|land" and "it|em" all become
  // compounds the moment two-letter halves are allowed.
  // Also used for compounds whose halves the vocabulary happens not to teach
  // separately — "works" is not a word card, so fireworks never split, and an
  // "ew" team appeared across its seam.
  SHORT_COMPOUNDS: {
    uphill: 2, upstairs: 2, upset: 2, uptown: 2, upstream: 2, upside: 2,
    myself: 2, itself: 2, ourselves: 3, oneself: 3,
    fireworks: 4, homework: 4, housework: 5, network: 3, teamwork: 4,
    // real compounds whose second half the suffix guard would otherwise eat,
    // or whose halves the vocabulary happens not to teach
    spaceship: 5, spaceships: 5, starship: 4, sideways: 4,
  },

  // Endings that are SUFFIXES, not the second half of a compound. friend+ship
  // is not a ship, child+hood is not a hood, wonder+ful is not full. Some of
  // these are also real words, which is exactly why the vocabulary test alone
  // waves them through.
  SUFFIXES: new Set(['ship', 'hood', 'ness', 'ment', 'less', 'ful', 'able',
                     'ible', 'ward', 'wards', 'like', 'ish', 'dom', 'age',
                     'ist', 'ing', 'est']),

  compound(word) {
    const w = String(word || '').toLowerCase();
    if (!this.VOCAB || w.length < 6 || this.NOT_COMPOUND.has(w)) return null;
    if (this.inflected(w)) return null;
    const short = this.SHORT_COMPOUNDS[w];
    if (short) return [w.slice(0, short), w.slice(short)];
    for (let i = 3; i <= w.length - 3; i++) {
      const a = w.slice(0, i), b = w.slice(i);
      if (this.SUFFIXES.has(b)) continue;
      if (this.VOCAB.has(a) && this.VOCAB.has(b)) return [a, b];
    }
    return null;
  },

  // ── What the card shows ────────────────────────────────────────────────
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
    const parts = this.parts(word);
    // The magic-e arc is drawn under one element spanning the vowel through
    // the silent e, so it has to be a real wrapper rather than a border on
    // each letter — the letters between are different widths.
    const magicAt = parts.findIndex(p => p.kind === 'magic');
    const out = parts.map(p => {
      if (p.kind === 'team') return `<u class="team">${p.t}</u>`;
      if (p.kind === 'magic') return `<u class="magic">${p.t}</u>`;
      if (p.kind === 'silent') return `<span class="silent">${p.t}</span>`;
      return p.t;
    });
    if (magicAt >= 0 && parts[parts.length - 1].kind === 'silent') {
      return out.slice(0, magicAt).join('') +
             `<span class="mgroup">${out.slice(magicAt).join('')}</span>`;
    }
    return out.join('');
  },
};
