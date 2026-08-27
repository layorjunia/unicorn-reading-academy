#!/usr/bin/env python3
"""Generate every voice clip for Unicorn Reading Academy.

MUST be run with the Piper venv, not system python:

  .venv-tts/bin/python tools/gen_audio.py              # piper (default)
  .venv-tts/bin/python tools/gen_audio.py --workers 6
  .venv-tts/bin/python tools/gen_audio.py --clean      # rebuild everything

Engines: piper (default, local neural, the one that ships), google, apple.
Voice: en_US-lessac-high, overridable with the PIPER_VOICE env var.

Two kinds of audio are actually played by the app:

  prose         whole sentences and words, spoken naturally by a neural voice
  letter NAME   for spelling a heart word out loud (AudioLib.spellOut)

Letter SOUNDS (audio/ph/) are still generated but NOTHING PLAYS THEM. Isolated
synthesised phonemes were inaccurate enough to teach the wrong thing — short a
and short i came out near-identical — so the app was changed to say whole words
only. The ph/ output is dead weight kept only until it is cleaned out.

Why sentences are stored whole: playing a sentence as separate word clips
sounds chopped and robotic. Every authored narration fragment therefore gets
its own recording, and validate() fails the build if any fragment is missing.

Outputs audio/{w,p,ph,l}/* plus audio/manifest.json.
Existing clips are skipped, so re-runs are cheap.
"""
import argparse
import concurrent.futures as cf
import hashlib
import json
import os
import re
import subprocess
import tempfile
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts_engines import get_engine  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

AUDIO = os.path.join(ROOT, 'audio')

# ── Letter SOUNDS: grapheme token -> IPA ──
IPA = {
    'a': 'æ', 'e': 'ɛ', 'i': 'ɪ', 'o': 'ɑ', 'u': 'ʌ',
    'b': 'bə', 'c': 'kə', 'd': 'də', 'f': 'fː', 'g': 'ɡə', 'h': 'hə',
    'j': 'dʒə', 'k': 'kə', 'l': 'lː', 'm': 'mː', 'n': 'nː', 'p': 'pə',
    'q': 'kwə', 'qu': 'kwə', 'r': 'ɹ', 's': 'sː', 't': 'tə', 'v': 'vː',
    'w': 'wə', 'x': 'ks', 'y': 'jə', 'z': 'zː',
    'sh': 'ʃː', 'ch': 'tʃə', 'th': 'θː', 'wh': 'wə', 'ck': 'kə',
    'll': 'lː', 'ng': 'ŋː', 'kn': 'nː', 'wr': 'ɹ',
    'ar': 'ɑɹ', 'or': 'ɔɹ', 'er': 'ɝ', 'ir': 'ɝ', 'ur': 'ɝ',
    'ai': 'eɪ', 'ay': 'eɪ', 'a_e': 'eɪ',
    'ee': 'iː', 'ea': 'iː', 'ey': 'iː', 'y_e': 'iː',
    'igh': 'aɪ', 'i_e': 'aɪ', 'y_i': 'aɪ', 'eye': 'aɪ',
    'oa': 'oʊ', 'ow_o': 'oʊ', 'o_e': 'oʊ',
    'u_e': 'ju', 'oo': 'uː',
    'ou': 'aʊ', 'ow_ou': 'aʊ', 'oi': 'ɔɪ', 'oy': 'ɔɪ',
    'ing': 'ɪŋ', 'ang': 'æŋ', 'ank': 'æŋk', 'ink': 'ɪŋk', 'all': 'ɔl',
    'ce': 'sː', 'ci': 'sɪ', 'ge': 'dʒɛ', 'gi': 'dʒaɪ',
    # open / odd syllable chunks that prose TTS would misread
    'ba': 'beɪ', 'by': 'baɪ', 'po': 'poʊ', 'ny': 'niː', 'ti': 'taɪ',
    'la': 'leɪ', 'na': 'neɪ', 'vy': 'viː', 'pa': 'peɪ', 'ma': 'meɪ',
    'ta': 'teɪ', 'ca': 'keɪ', 'mu': 'mju', 'pu': 'pju', 'bo': 'boʊ',
    'fo': 'foʊ', 'ro': 'roʊ', 'mo': 'moʊ', 'spi': 'spaɪ', 'sto': 'stoʊ',
    'dy': 'diː', 'py': 'piː', 'ly': 'liː', 'ry': 'riː', 'ty': 'tiː',
    'ger': 'ɡɚ', 'der': 'dɚ', 'per': 'pɚ', 'ter': 'tɚ',
    'tle': 'təl', 'ble': 'bəl', 'gle': 'ɡəl', 'dle': 'dəl',
    'ple': 'pəl', 'kle': 'kəl', 'cle': 'kəl', 'cil': 'səl',
    'cen': 'sɛn', 'gen': 'dʒɛn', 'et': 'ɛt', 'ic': 'ɪk',
    'cher': 'tʃɚ', 'ber': 'bɚ', 'spar': 'spɑɹ', 'tur': 'tɝ',
    'pur': 'pɝ', 're': 'riː', 'pre': 'priː', 'un': 'ʌn',
    'ful': 'fʊl', 'est': 'ɛst', 'brav': 'bɹeɪv',
    'dan': 'dæn', 'chan': 'tʃæn', 'prin': 'pɹɪn', 'fen': 'fɛn',
    'mag': 'mæɡ', 'muf': 'mʌf', 'rab': 'ɹæb',
}

# Apple's synthesiser renders nothing for these IPA symbols; Google handles
# them fine. Substituted only when running --engine apple.
APPLE_IPA_FIX = [('ɝ', 'ɜr'), ('ɚ', 'ər'), ('ɹː', 'r'), ('ɹ', 'r'), ('vː', 'vv')]

# Blend / label tokens shown on the Learn screen's pattern buttons. Without
# these the button falls back to a word clip of the raw letters.
BLEND_IPA = {
    'st': 'st', 'sl': 'sl', 'sp': 'sp', 'sn': 'sn', 'sw': 'sw', 'sm': 'sm',
    'fr': 'fɹ', 'gr': 'ɡɹ', 'br': 'bɹ', 'cr': 'kɹ', 'dr': 'dɹ', 'tr': 'tɹ',
    'pr': 'pɹ', 'pl': 'pl', 'bl': 'bl', 'cl': 'kl', 'fl': 'fl', 'gl': 'ɡl',
    'tw': 'tw', 'nd': 'nd', 'nt': 'nt', 'mp': 'mp', 'lk': 'lk', 'lt': 'lt',
    'ft': 'ft', 'sk': 'sk', 'less': 'lɛs',
}

# Words whose isolated clip would otherwise be a coin-flip. Every word in a
# story is individually tappable, so the clip has no sentence context to
# disambiguate a homograph — we pin the sense the app actually means.
WORD_IPA = {
    'a': 'ə',            # the article, not the letter name "ay"
    'i': 'aɪ',           # the pronoun
    'read': 'ɹiːd',      # present tense
    'live': 'lɪv',       # to dwell (the heart-word lesson)
    'close': 'kloʊs',    # near, not "to shut"
    'wind': 'wɪnd',      # moving air, not "to coil"
    'bow': 'boʊ',        # a ribbon / knot
    'does': 'dʌz',       # verb form of "do"
    'contest': 'ˈkɑntɛst',  # the noun
    'redone': 'ɹiˈdʌn',
    'minute': 'ˈmɪnɪt',
    'tear': 'tɛɹ',
    'bass': 'beɪs',
}

# Syllable chunks used as build tiles for multisyllabic words. Each is
# the sound the chunk makes INSIDE its example word, so tapping a tile
# never plays a letter name or a same-spelled different word.
CHUNK_IPA = {
    'ant': 'ænt',
    'ap': 'æp',
    'back': 'bæk',
    'bas': 'bæs',
    'bath': 'bæθ',
    'bed': 'bɛd',
    'bel': 'bɛl',
    'bit': 'bɪt',
    'blan': 'blæn',
    'boat': 'boʊt',
    'bon': 'bən',
    'bot': 'bɑt',
    'bow': 'boʊ',
    'boy': 'bɔɪ',
    'brave': 'bɹeɪv',
    'bright': 'bɹaɪt',
    'bub': 'bʌb',
    'build': 'bɪld',
    'bun': 'bʌn',
    'cake': 'keɪk',
    'can': 'kæn',
    'care': 'kɛɹ',
    'cat': 'kæt',
    'cheer': 'tʃɪɹ',
    'coat': 'koʊt',
    'col': 'kʌl',
    'con': 'kɑn',
    'corn': 'kɔɹn',
    'cot': 'kɑt',
    'cow': 'kaʊ',
    'cup': 'kʌp',
    'cus': 'kəs',
    'day': 'deɪ',
    'den': 'dɛn',
    'dex': 'dɛks',
    'do': 'duː',
    'drop': 'dɹɑp',
    'end': 'ɛnd',
    'fair': 'fɛɹ',
    'fast': 'fæst',
    'fear': 'fɪɹ',
    'fill': 'fɪl',
    'fin': 'fɪn',
    'fish': 'fɪʃ',
    'fun': 'fʌn',
    'gig': 'ɡɪɡ',
    'glad': 'ɡlæd',
    'han': 'hæn',
    'hap': 'hæp',
    'harm': 'hɑɹm',
    'heat': 'hit',
    'hel': 'hɛl',
    'help': 'hɛlp',
    'hill': 'hɪl',
    'home': 'hoʊm',
    'hope': 'hoʊp',
    'in': 'ɪn',
    'jel': 'dʒɛl',
    'joy': 'dʒɔɪ',
    'jun': 'dʒʌŋ',
    'ket': 'kɛt',
    'kin': 'kɪn',
    'kind': 'kaɪnd',
    'kit': 'kɪt',
    'lap': 'læp',
    'lem': 'lɛm',
    'less': 'lɛs',
    'light': 'laɪt',
    'lit': 'lɪt',
    'lock': 'lɑk',
    'loud': 'laʊd',
    'luck': 'lʌk',
    'make': 'meɪk',
    'man': 'mæn',
    'mas': 'mæs',
    'ment': 'mɛnt',
    'met': 'mɛt',
    'mid': 'mɪd',
    'mit': 'mɪt',
    'moon': 'muːn',
    'nap': 'næp',
    'net': 'nɛt',
    'nic': 'nɪk',
    'nis': 'nɪs',
    'nus': 'nəs',
    'out': 'aʊt',
    'ow': 'aʊ',
    'pack': 'pæk',
    'pad': 'pæd',
    'paint': 'peɪnt',
    'pan': 'pæn',
    'pen': 'pɛn',
    'pet': 'pɛt',
    'pic': 'pɪk',
    'pil': 'pəl',
    'play': 'pleɪ',
    'pock': 'pɑk',
    'pop': 'pɑp',
    'prob': 'pɹɑb',
    'pud': 'pʌd',
    'pump': 'pʌmp',
    'pup': 'pʌp',
    'quick': 'kwɪk',
    'rain': 'ɹeɪn',
    'read': 'ɹid',
    'rib': 'ɹɪb',
    'rid': 'ɹɪd',
    'rip': 'ɹɪp',
    'rise': 'ɹaɪz',
    'rob': 'ɹɑb',
    'rock': 'ɹɑk',
    'sad': 'sæd',
    'safe': 'seɪf',
    'sail': 'seɪl',
    'san': 'sæn',
    'school': 'skul',
    'sea': 'siː',
    'sect': 'sɛkt',
    'set': 'sɛt',
    'sic': 'zɪk',
    'side': 'saɪd',
    'sil': 'sɪl',
    'sim': 'sɪm',
    'slow': 'sloʊ',
    'small': 'smɔl',
    'snow': 'snoʊ',
    'soft': 'sɔft',
    'spot': 'spɑt',
    'star': 'stɑɹ',
    'sud': 'sʌd',
    'sun': 'sʌn',
    'sweet': 'swit',
    'tall': 'tɔl',
    'tell': 'tɛl',
    'ten': 'tɛn',
    'test': 'tɛst',
    'thank': 'θæŋk',
    'tie': 'taɪ',
    'time': 'taɪm',
    'tist': 'tɪst',
    'top': 'tɑp',
    'trum': 'tɹʌm',
    'tub': 'tʌb',
    'turn': 'tɝn',
    'twin': 'twɪn',
    'vel': 'vɛl',
    'vet': 'vɛt',
    'view': 'vjuː',
    'weed': 'wid',
    'week': 'wik',
    'wig': 'wɪɡ',
    'win': 'wɪn',
    'wob': 'wɑb',
    'yard': 'jɑɹd',
    'zip': 'zɪp',
}


# IPA for the letter NAMES, so "the letter a" says "ay" inside a single
# continuous utterance rather than needing a separate clip.
LETTER_NAME_IPA = {
    'a': 'eɪ', 'b': 'biː', 'c': 'siː', 'd': 'diː', 'e': 'iː', 'f': 'ɛf',
    'g': 'dʒiː', 'h': 'eɪtʃ', 'i': 'aɪ', 'j': 'dʒeɪ', 'k': 'keɪ', 'l': 'ɛl',
    'm': 'ɛm', 'n': 'ɛn', 'o': 'oʊ', 'p': 'piː', 'q': 'kjuː', 'r': 'ɑɹ',
    's': 'ɛs', 't': 'tiː', 'u': 'juː', 'v': 'viː', 'w': 'ˈdʌbəljuː',
    'x': 'ɛks', 'y': 'waɪ', 'z': 'ziː',
}

SEG_RE = re.compile(r"\{\s*(say|ph|word|ltr)\s*:\s*'((?:[^'\\]|\\.)*)'\s*\}")


def parse_narrations():
    """Pull each island's narration segment array out of the curriculum files.

    Returns [(islandId, [segment, ...]), ...] in file order.
    """
    out = []
    for lvl in (1, 2, 3):
        src = read(f'js/curriculum-l{lvl}.js')
        for m in re.finditer(r"id:\s*'(L\d-\d+)'", src):
            island = m.group(1)
            tail = src[m.start():]
            nm = re.search(r'(?:^|[\s,{])narration\s*:\s*\[', tail)
            if not nm:
                continue
            # bounded to this island's teach block
            stop = re.search(r'\bpatterns\s*:', tail)
            if stop and stop.start() < nm.start():
                continue
            block = tail[nm.end():]
            end = block.index(']')
            segs = []
            for sm in SEG_RE.finditer(block[:end]):
                segs.append({sm.group(1): sm.group(2).replace("\\'", "'")})
            if segs:
                out.append((island, segs))
    return out


def enrich(segments, ipa_map):
    """Attach the IPA each phoneme/letter segment needs for one-shot rendering."""
    enriched = []
    for s in segments:
        s = dict(s)
        if s.get('ph') is not None:
            ipa = ipa_map.get(s['ph'])
            if not ipa:
                return None      # caller falls back to per-segment clips
            s['ph_ipa'] = ipa
        elif s.get('ltr') is not None:
            s['ltr_ipa'] = LETTER_NAME_IPA.get(s['ltr'].lower())
        enriched.append(s)
    return enriched


ALLCAPS_RE = re.compile(r'\b[A-Z]{2,}\b')


def for_speech(text):
    """Sanitise a string before it reaches the TTS.

    Emoji get read out as their names, and an ALL-CAPS word is often spelled
    letter by letter, so both are normalised away. The manifest key is
    computed from the original text, so lookups are unaffected.
    """
    t = EMOJI_RE.sub('', text)
    t = ALLCAPS_RE.sub(lambda m: m.group(0).capitalize(), t)
    return re.sub(r'\s+', ' ', t).strip()

EMOJI_RE = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍]')

DATA_FILES = ['js/curriculum-l1.js', 'js/curriculum-l2.js', 'js/curriculum-l3.js',
              'js/extras.js', 'js/storylib.js', 'js/ui-speech.js']


def norm(text):
    """Must match AudioLib.norm in js/audio.js exactly."""
    t = text.lower().replace('‘', "'").replace('’', "'")
    t = EMOJI_RE.sub('', t)
    return re.sub(r'\s+', ' ', t).strip()


def read(path):
    p = os.path.join(ROOT, path)
    if not os.path.exists(p):
        return ''
    with open(p, encoding='utf-8') as f:
        return f.read()


def extract():
    """Collect every string the app can speak.

    Narration `say` fragments are collected as phrases so each gets its own
    recording — that is what keeps sentences from being stitched out of words.
    """
    words, phrases = set(), set()
    src = '\n'.join(read(p) for p in DATA_FILES)

    # Narration segments: {say:'...'} / {word:'...'}
    for m in re.finditer(r"\bsay\s*:\s*'((?:[^'\\]|\\.)*)'|\bsay\s*:\s*\"((?:[^\"\\]|\\.)*)\"", src):
        s = (m.group(1) or m.group(2) or '').replace("\\'", "'")
        if s.strip():
            phrases.add(s.strip())
    for m in re.finditer(r"\bword\s*:\s*'([a-zA-Z'\-]+)'|\bword\s*:\s*\"([a-zA-Z'\-]+)\"", src):
        w = (m.group(1) or m.group(2) or '')
        if w:
            words.add(w.replace("'", '').lower())

    # teach.intro is DISPLAY-ONLY — it may legitimately show letters and
    # grapheme spellings on screen ("sh in ship"), which is exactly what must
    # never be handed to a TTS. Audio for these screens comes from
    # teach.narration, so no clip is generated for the intro text and none can
    # be played by accident.
    intros = {(m.group(1) or m.group(2) or '').replace("\\'", "'")
              for m in re.finditer(
                  r"\bintro:\s*'((?:[^'\\]|\\.)*)'|\bintro:\s*\"((?:[^\"\\]|\\.)*)\"", src)}

    # Every other quoted string in the content files
    for m in re.finditer(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"", src):
        s = (m.group(1) or m.group(2) or '').replace("\\'", "'")
        if s in intros:
            continue
        clean = EMOJI_RE.sub('', s).strip()
        if not clean:
            continue
        if re.fullmatch(r"[a-zA-Z']+", clean) and len(clean) <= 16:
            words.add(clean.replace("'", '').lower())
        elif re.search(r'[a-zA-Z]{2}', clean) and len(clean) <= 1200:
            # Anything else carrying real letters becomes a phrase clip. This
            # deliberately includes single words with punctuation ("Synced!",
            # "Hello!") — those used to fall through both branches and get no
            # recording at all. The cap is generous because fluency passages
            # run ~500 chars, are played whole, and have tappable words.
            phrases.add(clean)
            for tok in re.findall(r"[a-zA-Z']+", clean):
                t = tok.replace("'", '').lower()
                if 1 <= len(t) <= 16:
                    words.add(t)

    # Practice banks: 'word:sound.sound|tile.tile'
    for m in re.finditer(r"'([a-z]+):([a-z_.|]+)'", read('js/banks.js')):
        words.add(m.group(1))
        for seg in re.split(r'[.|]', m.group(2)):
            if seg and seg not in IPA and re.fullmatch(r'[a-z]+', seg):
                words.add(seg)

    # Single letters must never become "word" clips — `say "b"` produces the
    # letter NAME "bee". Letter sounds live in ph/, letter names in l/. The
    # only exceptions are the genuine one-letter English words, and those get
    # a forced pronunciation via WORD_IPA.
    words = {w for w in words if len(w) > 1 or w in ('a', 'i')}

    phrases = {p for p in phrases if norm(p) not in words}
    return sorted(words), sorted(phrases)


def duration(path):
    out = subprocess.run(['afinfo', path], capture_output=True, text=True).stdout
    for line in out.splitlines():
        if 'estimated duration' in line:
            try:
                return float(line.split(':')[1].strip().split()[0])
            except (ValueError, IndexError):
                return -1.0
    return -1.0


def clip_energy(path):
    """(peak, seconds-above-floor) for a clip."""
    import wave as _w, tempfile as _t, array as _a
    wav = _t.mktemp(suffix='.wav')
    subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@22050', '-c', '1',
                    path, wav], capture_output=True)
    if not os.path.exists(wav):
        return 0.0, 0.0
    with _w.open(wav, 'rb') as f:
        a = _a.array('h')
        a.frombytes(f.readframes(f.getnframes()))
    os.unlink(wav)
    if not len(a):
        return 0.0, 0.0
    peak = max(abs(v) for v in a)
    loud = sum(1 for v in a if abs(v) > 1500) / 22050.0
    return float(peak), float(loud)


def validate(manifest, phrases):
    """Silence, missing files, and — critically — any narration fragment that
    lacks its own recording (which would be played as stitched word clips)."""
    problems = []
    for tok, f in sorted(manifest['ph'].items()):
        p = os.path.join(AUDIO, f)
        d = duration(p) if os.path.exists(p) else -1
        if d < 0.10:
            problems.append(f'phoneme /{tok}/ is silent or missing ({d:.3f}s, IPA {IPA[tok]!r})')
            continue
        # A file can have length and still be SILENT: /b/, /d/ and /g/ once
        # shipped as pure zeroes because a stop with nothing after it makes no
        # sound. Duration alone never caught it — check real energy.
        peak, loud = clip_energy(p)
        if peak < 9000 or loud < 0.05:
            problems.append(
                f'phoneme /{tok}/ is too quiet to hear '
                f'(peak {peak:.0f}, {loud:.3f}s audible)')
    for ch, f in sorted(manifest['ltr'].items()):
        p = os.path.join(AUDIO, f)
        d = duration(p) if os.path.exists(p) else -1
        if d < 0.12:
            problems.append(f'letter name {ch!r} is silent or missing ({d:.3f}s)')
    missing = [f for f in manifest['words'].values()
               if not os.path.exists(os.path.join(AUDIO, f))]
    if missing:
        problems.append(f'{len(missing)} word/phrase clips missing on disk: '
                        + ', '.join(sorted(missing)[:6]))
    # A truncated encode leaves a file that exists but holds no audio.
    empty = [f for f in manifest['words'].values()
             if os.path.exists(os.path.join(AUDIO, f))
             and os.path.getsize(os.path.join(AUDIO, f)) < 900]
    if empty:
        problems.append(f'{len(empty)} clips are too small to contain audio: '
                        + ', '.join(sorted(empty)[:6]))
    # Narration is the one recording per island the lesson actually plays; a
    # missing file here means the guide says nothing at all on that screen.
    for island, f in sorted((manifest.get('narr') or {}).items()):
        if not os.path.exists(os.path.join(AUDIO, f)):
            problems.append(f'narration for {island} missing on disk ({f})')
    for p in phrases:
        if norm(p) not in manifest['words']:
            problems.append(f'phrase would be stitched from words: {p[:70]!r}')

    # Every island MUST carry a narration array. Without one the guide bubble
    # falls back to speaking teach.intro, which is display text and contains
    # bare letters — the original bug. Fail the build rather than ship that.
    cur = '\n'.join(read(f'js/curriculum-l{i}.js') for i in (1, 2, 3))
    NARR_KEY = re.compile(r'(?:^|[\s,{])narration\s*:\s*\[')
    for m in re.finditer(r"id:\s*'(L\d-\d+)'", cur):
        island = m.group(1)
        # teach block only — stop at the next activity key
        block = re.split(r'\bsoundIt\s*:', cur[m.start():m.start() + 6000])[0]
        if not NARR_KEY.search(block):
            problems.append(f'island {island} has no teach.narration')
    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--engine', default=os.environ.get('TTS_ENGINE', 'piper'),
                    choices=['piper', 'google', 'apple'])
    ap.add_argument('--clean', action='store_true')
    ap.add_argument('--workers', type=int, default=8)
    args = ap.parse_args()

    try:
        engine = get_engine(args.engine)
    except RuntimeError as e:
        print('ERROR:', e)
        return 2

    ipa_map = dict(IPA)
    ipa_map.update(BLEND_IPA)
    ipa_map.update(CHUNK_IPA)
    if engine.name == 'apple':
        for tok, val in ipa_map.items():
            for a, b in APPLE_IPA_FIX:
                val = val.replace(a, b)
            ipa_map[tok] = val

    # The 'snd' section is HUMAN recordings imported by tools/import_sounds.py.
    # This tool doesn't generate them and must never destroy them: rebuilding
    # the manifest from scratch silently un-registered every recorded sound,
    # and --clean deleted the audio/s/ clips themselves. Carry them across.
    old_manifest = {}
    man_path = os.path.join(AUDIO, 'manifest.json')
    if os.path.exists(man_path):
        try:
            old_manifest = json.load(open(man_path))
        except (json.JSONDecodeError, OSError):
            old_manifest = {}

    if args.clean:
        import shutil
        for d in ['w', 'p', 'ph', 'l', 'n']:      # never audio/s/ or audio/sfx/
            shutil.rmtree(os.path.join(AUDIO, d), ignore_errors=True)

    words, phrases = extract()
    for d in ['w', 'p', 'ph', 'l']:
        os.makedirs(os.path.join(AUDIO, d), exist_ok=True)

    ext = engine.ext
    manifest = {'words': {}, 'ph': {}, 'ltr': {}, 'engine': engine.name}
    snd = {sid: rec for sid, rec in (old_manifest.get('snd') or {}).items()
           if os.path.exists(os.path.join(AUDIO, rec.get('f', '')))}
    if snd:
        manifest['snd'] = snd
    if getattr(engine, 'VOICE_NAME', None):
        manifest['voice'] = engine.VOICE_NAME
    jobs = []   # (callable, out_path)

    for w in words:
        fn = f'w/{w}{ext}'
        manifest['words'][w] = fn
        if w in WORD_IPA:
            jobs.append((lambda out, v=WORD_IPA[w]: engine.speak_phoneme(v, out),
                         os.path.join(AUDIO, fn)))
        else:
            jobs.append((lambda out, t=w: engine.speak_text(t, out),
                         os.path.join(AUDIO, fn)))

    for p in phrases:
        h = hashlib.md5(norm(p).encode()).hexdigest()[:12]
        fn = f'p/{h}{ext}'
        manifest['words'][norm(p)] = fn
        jobs.append((lambda out, t=for_speech(p): engine.speak_text(t, out),
                     os.path.join(AUDIO, fn)))

    for tok, ipa in ipa_map.items():
        safe = tok.replace('_', '-')
        fn = f'ph/{safe}{ext}'
        manifest['ph'][tok] = fn
        jobs.append((lambda out, v=ipa: engine.speak_phoneme(v, out), os.path.join(AUDIO, fn)))

    for ch in 'abcdefghijklmnopqrstuvwxyz':
        fn = f'l/{ch}{ext}'
        manifest['ltr'][ch] = fn
        jobs.append((lambda out, c=ch: engine.speak_letter_name(c, out), os.path.join(AUDIO, fn)))

    todo = [(fn, out) for fn, out in jobs if not os.path.exists(out)]
    print(f'engine={engine.name} voice-clips: {len(words)} words, {len(phrases)} phrases, '
          f'{len(ipa_map)} sounds, 26 letter names — {len(todo)} to render '
          f'({len(jobs) - len(todo)} cached)')

    fails = []

    def run(job):
        fn, out = job
        try:
            fn(out)
            return None
        except Exception as e:  # noqa: BLE001 - report and continue
            return (out, str(e)[:200])

    if todo:
        with cf.ThreadPoolExecutor(max_workers=args.workers) as ex:
            for i, res in enumerate(ex.map(run, todo), 1):
                if res:
                    fails.append(res)
                if i % 250 == 0:
                    print(f'  {i}/{len(todo)}')

    # ── One continuous clip per teaching line ──
    # This is what stops narration sounding like glued-together fragments.
    os.makedirs(os.path.join(AUDIO, 'n'), exist_ok=True)
    manifest['narr'] = {}
    narrations = parse_narrations()
    pending = []
    for island, segs in narrations:
        e = enrich(segs, ipa_map)
        if e is None:
            print(f'  ! {island}: unknown phoneme token, will play as segments')
            continue
        fn = f'n/{island}{ext}'
        manifest['narr'][island] = fn
        if not os.path.exists(os.path.join(AUDIO, fn)):
            pending.append((island, e))

    if pending:
        print(f'rendering {len(pending)} narration lines as single utterances...')
        if engine.name == 'apple':
            try:
                engine.speak_narration_batch(pending, os.path.join(AUDIO, 'n'))
            except Exception as e:  # noqa: BLE001
                fails.append(('narration-batch', str(e)[:200]))
        else:
            def one(job):
                island, segs = job
                try:
                    engine.speak_narration(segs, os.path.join(AUDIO, 'n', island + ext))
                    return None
                except Exception as e:  # noqa: BLE001
                    return (island, str(e)[:200])
            with cf.ThreadPoolExecutor(max_workers=args.workers) as ex:
                for res in ex.map(one, pending):
                    if res:
                        fails.append(res)

    # Any line that failed to render must fall back to segment playback, so
    # drop it from the manifest rather than pointing at a missing file.
    for island in list(manifest['narr']):
        if not os.path.exists(os.path.join(AUDIO, manifest['narr'][island])):
            del manifest['narr'][island]

    # Atomic write: dumping straight onto the live manifest truncates it first,
    # so a crash mid-dump leaves the app with no audio index at all.
    tmp = man_path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(manifest, f, separators=(',', ':'))
    os.replace(tmp, man_path)

    print('validating...')
    problems = validate(manifest, phrases)
    print(f'done. {len(fails)} render failures, {len(problems)} validation problems')
    for out, err in fails[:15]:
        print('  FAIL', os.path.basename(out), err)
    for p in problems[:25]:
        print('  BAD ', p)
    return 1 if (fails or problems) else 0


if __name__ == '__main__':
    sys.exit(main())
