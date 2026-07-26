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
- 🌷 **Heart Word Garden** — 40 irregular high-frequency words taught the
  "heart word" way, reviewed on a spaced-repetition schedule
- 🎤 **Fluency Stage** — repeated reading with a parent-check mode that
  computes real WCPM against 2nd-grade benchmarks (51/72/89)
- 🏝️ **Creature Cove** — collectible friends earned with stars
- 👨‍👩‍👧 **Parent Corner** — progress dashboard, WCPM chart, free-roam toggle,
  cloud sync controls (gated behind a multiplication question)

All narration/audio uses the device's built-in text-to-speech — no downloads.

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
file, bump `CACHE` in `sw.js` (e.g. `ura-v2`) so installed iPads fetch the
update.

## Adding content / new apps

- Curriculum lives in `js/curriculum-l*.js` (islands) and `js/extras.js`
  (heart words, fluency passages, creatures). Data-only — copy the schema to
  add islands or stories.
- `js/sync.js` + `js/firebase-config.js` are app-agnostic: reuse them for
  future homeschool apps (each app writes its own `app` field in the profile
  doc; give each app its own Firestore collection if progress shapes differ).
