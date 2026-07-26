# Setup

## 1. Cloud sync — ✅ DONE

Firebase project `homeschool-apps` is live on your second Google account and
wired into the app. Nothing left to do here.

- **Email/Password** sign-in enabled
- **Firestore** created (production mode, nam5/US)
- **Security rules published** — each child can read and write only their own
  profile; signed-out access is denied outright
- Web app registered and its config committed to `js/firebase-config.js`

That config is *public by design* — it identifies the project and is not a
secret. The rules are the real security boundary.

Verified end to end: created an account, saved 42 stars, wiped local storage to
simulate a second device, signed back in with just a name plus four emoji, and
the progress came back. Also confirmed a signed-in child cannot read or write
another child's document. The test account and its data were deleted afterward.

**How your daughter uses it:** Parent Corner → "Connect cloud backpack" → she
picks her name and four secret pictures. On any other device she taps "I have a
cloud backpack" and enters the same two things.

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
