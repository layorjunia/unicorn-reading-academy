# Setup — the two things that need your hands

Everything else is done and deployed. These two need your own click because
they involve a legal agreement and a credential, which I shouldn't accept or
create on your behalf.

---

## 1. Finish the Firebase project (~1 min) — for cross-device sync

The console is already open in Chrome with the form filled in
(project name `homeschool-apps`).

1. Tick **"I accept the Firebase terms"**, click **Continue**.
2. Google Analytics: not needed — toggle it **off**, click **Create project**.
3. Then set up the two services:
   - **Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save**
   - **Build → Firestore Database → Create database → production mode → US location**
4. **Firestore → Rules**, replace with this, click **Publish**:

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

5. **Project settings (gear) → Your apps → Web (`</>`)** → register the app →
   copy the `firebaseConfig` object it shows.
6. Paste it into `js/firebase-config.js`, replacing `null`.

That config is *public by design* — it identifies the project, it is not a
secret. The Firestore rules above are the actual security boundary, which is
why step 4 matters.

Tell me when it's done and I'll commit and redeploy, or run:

```bash
cd "/Users/jacob/Desktop/Schooling Apps/unicorn-reading-academy" && git add -A && git commit -m "Add Firebase config" && git push
```

---

## 2. Google Text-to-Speech API key (~3 min) — for the best voice

The app already works with a good offline voice. This upgrades the narration to
Google's neural voice, which sounds markedly more human.

**Cost: $0 at our size.** The whole app is roughly 60,000 characters and
Google's free tier covers 1,000,000 neural characters per month. Regenerating
is cheap because unchanged clips are skipped.

1. Go to https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
2. Pick the **homeschool-apps** project (top bar), click **Enable**.
   - If it asks to enable billing, you must add a card. You stay inside the free
     tier at this volume, but Google requires a card on file for this API.
3. Go to **APIs & Services → Credentials → Create credentials → API key**.
4. Copy the key. Then **Restrict key → API restrictions → Cloud Text-to-Speech
   API** and save. (Good hygiene — limits what the key can do.)
5. Save it to a file:

   ```bash
   cd "/Users/jacob/Desktop/Schooling Apps/unicorn-reading-academy" && pbpaste > tools/.tts-key && chmod 600 tools/.tts-key
   ```

   (`pbpaste` reads your clipboard, so the key never gets typed or shown.
   `tools/.tts-key` is git-ignored — it never leaves your Mac and is never
   shipped in the app.)

6. Regenerate all the audio with the neural voice:

   ```bash
   cd "/Users/jacob/Desktop/Schooling Apps/unicorn-reading-academy" && python3 tools/gen_audio.py --engine google --clean
   ```

   Takes a few minutes. It validates every clip and refuses to finish if any
   came out silent or if any sentence lacks its own recording.

7. Ship it:

   ```bash
   cd "/Users/jacob/Desktop/Schooling Apps/unicorn-reading-academy" && git add -A && git commit -m "Regenerate audio with Google neural voice" && git push
   ```

To hear a different voice first, try `en-US-Neural2-C`, `en-US-Neural2-E`, or
the higher-end `en-US-Studio-O`:

```bash
cd "/Users/jacob/Desktop/Schooling Apps/unicorn-reading-academy" && GOOGLE_TTS_VOICE=en-US-Studio-O python3 tools/gen_audio.py --engine google --clean
```
