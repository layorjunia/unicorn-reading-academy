# 🦄 Unicorn Reading Academy

A bright, evidence-based reading app for 2nd graders. Works on laptops and
iPads (add it to the iPad home screen for a full-screen app feel). Built on
the science of reading: systematic phonics → decodable stories → heart
words with spaced repetition → repeated-reading fluency.

**Live app:** https://layorjunia.github.io/unicorn-reading-academy/

## What's inside

- **3 levels, 21 phonics islands** in a research-based teaching order:
  - 🌸 *Sparkle Meadow* — short vowels, digraphs, blends, glued sounds
  - 🦄 *Rainbow Forest* — magic e, bossy r, vowel teams, diphthongs
  - 👑 *Crystal Castle* — multisyllabic words, prefixes/suffixes, soft c/g, silent letters
- Each island: **Learn it → Read it out loud → Build it → Sort it → Read it
  (decodable story) → Sparkle Quiz** (mastery check gates the next island)
- 🎤 **Read it out loud** shows the word big; she taps the microphone and reads
  it, and the browser's built-in speech recognition (Apple's dictation on
  iPhone/iPad, Google's on Android) checks her. The judge is deliberately
  generous — homophones, digit transcriptions, and every recognizer
  alternative count — and the app **never punishes a miss**: first miss is a
  gentle try-again, second miss models the word in the app's voice and moves
  on. Needs internet + mic permission; without either it falls back to
  listen-and-tap automatically. Short words get zero fuzzy matching, because
  minimal pairs (cat/cot, cut/cute) are the lesson.
- 🌈 **Rainbow Practice** — after an island is finished, tap it again for
  endlessly re-generated practice drawn from an **865-word bank** (blend /
  build / listen-and-pick rounds). This is the daily-review engine.
- 🗓️ **Daily Quest** — island work + heart words + a fluency read in one day
  earns 5 bonus stars.
- 🌷 **Heart Word Garden** — **100** irregular/high-frequency words in 20 sets,
  taught the heart-word way, reviewed on a spaced-repetition schedule
- 🎤 **Fluency Stage** — **18** leveled passages, repeated reading, parent-check
  mode computing real WCPM against 2nd-grade benchmarks (51/72/89)
- 📚 **Story Library** — 10 bonus decodable books with comprehension questions
- 🏝️ **Creature Cove** — 24 collectible friends earned with stars
- 👨‍👩‍👧 **Parent Corner** — progress dashboard, WCPM chart, free-roam toggle,
  cloud sync controls (gated behind a multiplication question)

### A year of material

Roughly 21 island lessons + 21 endlessly-regenerating practice sets + 100
heart words on spaced repetition + 18 fluency passages (each read 3–4×) + 10
bonus books. At ~15 minutes/day that is a full school year of work, and the
practice/heart-word/fluency loops keep producing new sessions after every
island is finished.

## Voice / audio

**All speech is pre-generated audio files. The browser's speech synthesiser is
never used for real content.** See `SETUP.md` for the API key step.

### Why narration is structured, not plain text

A reading app cannot let a voice read a sentence like:

> "Short a says ah, like in cat."

Every TTS pronounces the lone `a` as the article ("uh") and a lone `i` as
"eye" — so the app teaches the wrong sound. This is not fixable by choosing a
better voice; it is a property of reading letters as text.

So a teaching line is an ordered list of segments, not a string:

```js
teach: {
  intro: 'This letter says /a/, like in cat.',        // what you SEE
  narration: [                                        // what you HEAR
    { say: 'This letter says' },   // neural voice, prose only
    { ph:  'a' },                  // a real IPA phoneme clip
    { say: 'like in' },
    { word: 'cat' },
  ],
}
```

`say` fragments are guaranteed never to contain a bare letter or a grapheme
spelling. Letter **sounds** only ever come from `ph` clips; letter **names**
(for spelling heart words) only from `ltr` clips. The two cannot be confused.

### Engines

`tools/gen_audio.py` renders everything through a pluggable engine
(`tools/tts_engines.py`):

- **piper** (default, and the one that ships) — a neural voice that runs
  locally. No API key, no billing, no network at build time. Voice
  `en_US-lessac-high`, overridable with the `PIPER_VOICE` env var.
- **google** — Cloud TTS. Legacy; needs an API key and a card on file, see
  `SETUP.md`.
- **apple** — offline macOS fallback, noticeably more robotic.

Every command must use the venv interpreter. System `python3` has no `piper`
module and `gen_audio.py` will stop with a setup message.

```bash
.venv-tts/bin/python tools/gen_audio.py               # piper (default)
.venv-tts/bin/python tools/gen_audio.py --workers 6
.venv-tts/bin/python tools/gen_audio.py --clean       # full rebuild
```

Unchanged clips are skipped, so re-runs are cheap.

### What the build refuses to ship

`validate()` fails the build on any of:

- a phoneme or letter-name clip that came out **silent** (an IPA symbol the
  engine rejects renders as ~0.01s of nothing — worse than a wrong sound)
- a clip listed in the manifest but missing on disk
- **a narration fragment with no recording of its own** — that would be played
  as individual word clips stitched together, which sounds chopped and robotic.
  This check exists because an earlier version shipped exactly that bug and the
  audit could not tell the difference.

Other traps handled in the generator: single letters never become word clips
(`say "b"` says "bee"); homographs (`read`, `live`, `close`, `wind`, `bow`,
`does`) get a pinned pronunciation via `WORD_IPA` because every story word is
individually tappable and has no sentence context; emoji and ALL-CAPS runs are
stripped before synthesis.

## Saving & sync

- Progress saves **locally, automatically** per profile (localStorage). No
  account needed to play.
- **Cloud sync (optional):** with Firebase configured, a child connects a
  "cloud backpack" — name + 4 secret emoji pictures — and progress follows
  them to any device.

### One-time Firebase setup (~10 min)

1. Go to https://console.firebase.google.com → **Add project** (e.g.
   `homeschool-apps` — one project can serve all future apps). Analytics off.
2. **Build → Authentication → Get started → Sign-in method →** enable
   **Email/Password**. (The app turns "name + emoji password" into an
   email/password pair under the hood.)
3. **Build → Firestore Database → Create database** → production mode → US
   location.
4. **Firestore → Rules** → paste the rules below → **Publish**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /profiles/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

5. **Project settings (gear) → Your apps → Web (`</>`)** → register → copy
   the `firebaseConfig` object.
6. Paste it into `js/firebase-config.js` (replacing `null`), commit, push.
   The config is not a secret — security lives in the rules above.

## Development

Plain HTML/CSS/JS, no build step. Serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Deployed via GitHub Pages from the `main` branch. After changing any app
file, bump `CACHE` in `sw.js` (e.g. `ura-v3`) so installed iPads fetch the
update.

## Adding content / new apps

- Curriculum lives in `js/curriculum-l*.js` (island lessons), `js/banks.js`
  (practice word banks, format `word:sound.sound|tile.tile`), `js/extras.js`
  (heart words, fluency passages, creatures), and `js/storylib.js` (bonus
  books). All data-only — copy the schema to add more.
- **After adding words, re-run `tools/gen_audio.py`** or new words will fall
  back to browser TTS.
- `js/sync.js` + `js/firebase-config.js` + `js/audio.js` are app-agnostic:
  reuse them for future homeschool apps.
