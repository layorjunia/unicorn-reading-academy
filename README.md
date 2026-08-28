# Reading Star ⭐

**Live: https://layorjunia.github.io/unicorn-reading-academy/**

A reading-practice app for a 2nd grader. A word, a sentence, or one line of a
story appears large on the screen; she taps the microphone and **reads it out
loud**; the browser's built-in speech recognition confirms she read it.

That direction is the whole point. The app does not read *to* her.

## Why it's silent

An earlier version taught phonics with synthesized speech and could not
pronounce letter sounds reliably — short *a* and short *i* came out nearly
identical, so the lesson taught the wrong thing. Rather than keep tuning a
synthesizer, that whole layer was removed. Reading Star speaks **no**
synthesized audio. The only sounds are three chimes and an optional
"Hear it first" button on word cards, which plays a pre-recorded, human-checked
clip that already existed. Nothing can be mispronounced because nothing is
generated.

## What she can practice

| Mode | What it is |
|---|---|
| 🔤 **Words** | Graded decodable words — short vowels through multisyllable words |
| ⭐ **Star Words** | The Dolch sight words: the ~300 words that make up over half of everything a child reads, most of which cannot be sounded out |
| 📖 **Sentences** | Whole sentences read aloud in one breath |
| 📚 **Stories** | 3–5 line mini-stories, one line at a time; earlier lines stay on screen so the story builds up |
| 💪 **Tricky Words** | Anything she missed, saved and brought back. Reading it correctly retires it. |

Three levels: **L1** short vowels/digraphs/blends, **L2** silent-e, vowel teams
and r-controlled, **L3** multisyllable, prefixes/suffixes, soft c/g, silent
letters.

**📊 My Reading** shows stars, best streak, days practised, and how much of
each pool she has read.

## How the checking works

`listen.js` wraps `webkitSpeechRecognition` and judges the result. It is
deliberately **generous**, because a false "wrong" is far more damaging to a
new reader than a false pass:

- every alternative the recognizer offers is considered, not just the first
- homophones count (*knight* / *night*), as do digit transcriptions
  (*eight* → "8") and contractions (*can not* → "can't")
- sentences are scored by how many of their words appear **in order**
- **but** a word that is itself a real word in the app's vocabulary is never
  forgiven as a near-miss — *mitten* for *kitten* is a reading error, not a
  transcription slip
- short words get no fuzzy matching at all: minimal pairs are the lesson

**It never punishes.** One gentle retry, then it moves on and remembers the
word for Tricky Words.

The microphone needs an internet connection and works best in Safari
(iPhone/iPad) or Chrome. If it is unavailable the app says so plainly and
offers the classic app instead — it never dead-ends.

## The classic app

The original full phonics adventure — journey map, characters, illustrated
decodable stories, Firebase sync — still lives at **`/classic/`**, unchanged
and linked from the home screen. Progress carries over because it is the same
origin.

## Working on it

```bash
python3 dev/build_content.py .work/corpus.json
```

Regenerates `content.js` from the classic word banks, the Dolch lists
(`dev/sight_words.py`) and the authored corpus.

```bash
python3 dev/audit_content.py
```

Fails the build on anything unshippable: a word at the wrong level, a sentence
that cannot render cleanly, anything upsetting, a confusable pair inside one
level, or — the important one — any item the app's own judge would mark wrong
when read correctly.

```bash
python3 dev/stamp.py
```

Stamps the build id into `index.html`, `sw.js` and `version.json`. **Run this
after every edit** — the `?v=` fingerprint is what makes browsers pick up new
JavaScript. Editing without stamping serves stale code and looks like the fix
did not work.

Or double-click **Preview Reading Star.command** to run it locally, and
**Rebuild Content.command** to regenerate and audit.

### Two apps, one origin

Caches and service-worker registrations are origin-wide, not path-scoped. Each
app must only ever delete its own (`rs-*` vs `classic-*`) in both its
`sw.js` activate handler and its update self-heal, or deploying one silently
breaks the other. `.gitignore` patterns are unanchored (`**/tools/voices/`) so
they keep working from any directory depth.
