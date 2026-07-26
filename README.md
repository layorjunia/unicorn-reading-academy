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
- Each island: **Learn it → Sound it → Build it → Sort it → Read it (decodable
  story) → Sparkle Quiz** (mastery check gates the next island)
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

**All speech is pre-generated audio, not live browser text-to-speech.** This
was a deliberate fix: browser TTS pronounced letters inconsistently (saying
the letter *name* "bee" where the app needed the *sound* /b/), and varied by
device.

`tools/gen_audio.py` renders every word, phrase, story sentence, letter name,
and letter sound with macOS `say` (voice: Samantha) into `audio/*.m4a`, plus
`audio/manifest.json` that maps text → file. Letter **sounds** use Apple's
phoneme input mode (`[[inpt PHON]]`), so /b/, /sh/, /ar/ are true phonemes —
never letter names. Letter **names** (for spelling out heart words) use
`[[char LTRL]]`. `js/audio.js` plays clips and only falls back to browser TTS
for text with no clip.

Regenerate after adding curriculum content:

```bash
python3 tools/gen_audio.py
```

Existing clips are skipped, so re-runs are fast; delete `audio/` to force a
full rebuild. **Requires macOS** (uses `say` + `afconvert`).

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
