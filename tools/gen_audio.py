#!/usr/bin/env python3
"""Generate all voice clips for Unicorn Reading Academy.

Three kinds of audio, each rendered the way that is actually correct:

  words / phrases  -> macOS `say` with normal text (natural prosody)
  letter SOUNDS    -> tools/phoneme_render.swift, using AVSpeechSynthesizer's
                      IPA notation attribute, so /b/ is a real phoneme and
                      never the letter name "bee"
  letter NAMES     -> `say` with explicit phonetic spellings ("bee", "jay")

NOTE: the legacy `say "[[inpt PHON]]..."` escape is NOT used — modern macOS
speaks the marker aloud instead of interpreting it, which produced garbled
audio. Verified broken on Darwin 24.x for every installed voice.

Outputs audio/{w,p,ph,l}/*.m4a plus audio/manifest.json.
Existing clips are skipped; delete audio/ to force a full rebuild.
Requires macOS (say, afconvert, swift).
"""
import concurrent.futures as cf
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, 'audio')
SWIFT_TOOL = os.path.join(ROOT, 'tools', 'phoneme_render.swift')
VOICE = 'Samantha'
WORD_RATE = '150'
PHRASE_RATE = '165'

# ── Letter SOUNDS: grapheme token -> (IPA, human label) ──
# Stops carry a minimal schwa (unavoidable in isolation); continuants are
# lengthened so they can be held while blending.
IPA = {
    # short vowels
    'a': 'æ', 'e': 'ɛ', 'i': 'ɪ', 'o': 'ɑ', 'u': 'ʌ',
    # single consonants
    'b': 'bə', 'c': 'kə', 'd': 'də', 'f': 'fː', 'g': 'ɡə', 'h': 'hə',
    'j': 'dʒə', 'k': 'kə', 'l': 'lː', 'm': 'mː', 'n': 'nː', 'p': 'pə',
    'q': 'kwə', 'qu': 'kwə', 'r': 'r', 's': 'sː', 't': 'tə', 'v': 'vv',
    'w': 'wə', 'x': 'ks', 'y': 'jə', 'z': 'zː',
    # digraphs
    'sh': 'ʃː', 'ch': 'tʃə', 'th': 'θː', 'wh': 'wə', 'ck': 'kə',
    'll': 'lː', 'ng': 'ŋː', 'kn': 'nː', 'wr': 'r',
    # r-controlled — NOTE: Apple's synth renders nothing for ɝ/ɚ/standalone ɹ,
    # so these use plain-r spellings (verified audible; see tools/README notes).
    'ar': 'ɑr', 'or': 'ɔr', 'er': 'ɜr', 'ir': 'ɜr', 'ur': 'ɜr',
    # long vowels / teams
    'ai': 'eɪ', 'ay': 'eɪ', 'a_e': 'eɪ',
    'ee': 'iː', 'ea': 'iː', 'ey': 'iː', 'y_e': 'iː',
    'igh': 'aɪ', 'i_e': 'aɪ', 'y_i': 'aɪ', 'eye': 'aɪ',
    'oa': 'oʊ', 'ow_o': 'oʊ', 'o_e': 'oʊ',
    'u_e': 'ju', 'oo': 'uː',
    'ou': 'aʊ', 'ow_ou': 'aʊ', 'oi': 'ɔɪ', 'oy': 'ɔɪ',
    # glued sounds
    'ing': 'ɪŋ', 'ang': 'æŋ', 'ank': 'æŋk', 'ink': 'ɪŋk', 'all': 'ɔl',
    # soft c / g
    'ce': 'sː', 'ci': 'sɪ', 'ge': 'dʒɛ', 'gi': 'dʒaɪ',
    # open/odd syllable chunks that text-mode TTS misreads
    'ba': 'beɪ', 'by': 'baɪ', 'po': 'poʊ', 'ny': 'niː', 'ti': 'taɪ',
    'la': 'leɪ', 'na': 'neɪ', 'vy': 'viː', 'pa': 'peɪ', 'ma': 'meɪ',
    'ta': 'teɪ', 'ca': 'keɪ', 'mu': 'mju', 'pu': 'pju', 'bo': 'boʊ',
    'fo': 'foʊ', 'ro': 'roʊ', 'mo': 'moʊ', 'spi': 'spaɪ', 'sto': 'stoʊ',
    'dy': 'diː', 'py': 'piː', 'ly': 'liː', 'ry': 'riː', 'ty': 'tiː',
    'ger': 'ɡər', 'der': 'dər', 'per': 'pər', 'ter': 'tər',
    'tle': 'təl', 'ble': 'bəl', 'gle': 'ɡəl', 'dle': 'dəl',
    'ple': 'pəl', 'kle': 'kəl', 'cle': 'kəl', 'cil': 'səl',
    'cen': 'sɛn', 'gen': 'dʒɛn', 'et': 'ɛt', 'ic': 'ɪk',
    'cher': 'tʃər', 'ber': 'bər', 'spar': 'spɑr', 'tur': 'tɜr',
    'pur': 'pɜr', 're': 'riː', 'pre': 'priː', 'un': 'ʌn',
    'ful': 'fʊl', 'est': 'ɛst', 'brav': 'breɪv',
    'dan': 'dæn', 'chan': 'tʃæn', 'prin': 'prɪn', 'fen': 'fɛn',
    'mag': 'mæɡ', 'muf': 'mʌf', 'rab': 'ɹæb',
}

# ── Letter NAMES (for spelling out heart words) ──
LETTER_NAME = {
    'a': 'ay', 'b': 'bee', 'c': 'see', 'd': 'dee', 'e': 'ee', 'f': 'eff',
    'g': 'jee', 'h': 'aitch', 'i': 'eye', 'j': 'jay', 'k': 'kay', 'l': 'ell',
    'm': 'em', 'n': 'en', 'o': 'oh', 'p': 'pee', 'q': 'cue', 'r': 'are',
    's': 'ess', 't': 'tee', 'u': 'you', 'v': 'vee', 'w': 'double you',
    'x': 'ex', 'y': 'why', 'z': 'zee',
}

PHRASES_EXTRA = [
    'Great job!', 'You did it!', 'Super sparkle!', 'Amazing!', 'Wow, fantastic!',
    'You are a reading star!',
    'Almost! Try again!', 'Good try! Listen again!', 'You can do it!', 'So close! One more try!',
    'Hi! Ready to read?', 'Welcome! Let the reading adventure begin!',
    'Type your name first!', 'Tap your four secret pictures!', 'A unicorn!', 'Good pick!',
    'Finish the island before this one to unlock it!',
    'Build the word', 'It was', 'It is spelled', 'You built it!', 'like',
    'Robot talk! Tap the robot, listen to the sounds, and tap the word you hear!',
    'Build the word! Tap the tiles in order. Tap the speaker to hear it again!',
    'Which team does this word belong to? Tap the word to hear it, then tap its team!',
    'Story time! Read it out loud. Tap any word if you need help.',
    'Sparkle Quiz! Listen to the word and tap it!',
    'You read the whole story! Now for the sparkle quiz!',
    'Island complete! You earned five stars! Amazing reading!',
    "So close! Let's try one more time. Practice makes sparkle!",
    'Your garden is watered! Three stars for you!',
    'Ready, set, read!',
    'Great reading! Reading it again makes your brain even stronger!',
    'Three reads! You are super fluent!',
    'Keep reading to meet this friend!', 'Hello!',
    'Hmm, that is not right!', 'Hmm, that did not match. Ask a grown-up to help!',
    'Your cloud backpack is ready!', 'Welcome back!', 'Synced!',
    'Daily quest complete! Five bonus stars!',
    'Practice time!', 'Practice complete! Three stars!',
    'You read the whole story!',
    'The pink letters are the tricky part. Learn them by heart!',
    'Tap the robot, listen to the sounds, tap the word!',
    'Listen and tap the word!', 'Build the word!',
]

CREATURE_NAMES = ['Sparkle', 'Whiskers', 'Clover', 'Biscuit', 'Ember', 'Bamboo',
                  'Flutter', 'Splash', 'Pinky', 'Sheldon', 'Inky', 'Sage', 'Peep',
                  'Marina', 'Twinkle', 'Blaze', 'Rexy', 'Nutmeg', 'Grace', 'Dottie',
                  'Stretch', 'Waddle', 'Snuggles', 'Nova']

EMOJI_RE = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍]')


def norm(text):
    """Must match AudioLib.norm in js/audio.js exactly."""
    t = text.lower().replace('‘', "'").replace('’', "'")
    t = EMOJI_RE.sub('', t)
    return re.sub(r'\s+', ' ', t).strip()


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


def extract():
    words, phrases = set(), set()
    src = ''
    for p in ['js/curriculum-l1.js', 'js/curriculum-l2.js', 'js/curriculum-l3.js',
              'js/extras.js', 'js/storylib.js']:
        src += read(p) + '\n'

    for m in re.finditer(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"", src):
        s = (m.group(1) or m.group(2) or '').replace("\\'", "'")
        clean = EMOJI_RE.sub('', s).strip()
        if not clean:
            continue
        if ' ' in clean and re.search(r'[a-zA-Z]{2}', clean):
            # Cap is generous on purpose: fluency passages run ~500 chars and
            # are played whole ("Listen first"), plus every word inside them is
            # tappable, so both the passage and its words need clips.
            if len(clean) <= 1200:
                phrases.add(clean)
                for tok in re.findall(r"[a-zA-Z']+", clean):
                    t = tok.replace("'", '').lower()
                    if 1 <= len(t) <= 16:
                        words.add(t)
        elif re.fullmatch(r"[a-zA-Z']+", clean) and len(clean) <= 14:
            words.add(clean.replace("'", '').lower())

    banks = read('js/banks.js')
    for m in re.finditer(r"'([a-z]+):([a-z_.|]+)'", banks):
        words.add(m.group(1))
        for seg in re.split(r'[.|]', m.group(2)):
            if seg and seg not in IPA and re.fullmatch(r'[a-z]+', seg):
                words.add(seg)

    phrases.update(PHRASES_EXTRA)
    phrases.update(n + '!' for n in CREATURE_NAMES)
    phrases = {p for p in phrases if norm(p) not in words}
    return sorted(words), sorted(phrases)


def say_clip(rate, text, out_aiff, out_m4a):
    if os.path.exists(out_m4a):
        return 'skip'
    # Text goes on stdin, never argv: strings like "-ful" would otherwise be
    # parsed by `say` as command-line flags.
    r = subprocess.run(['say', '-v', VOICE, '-r', rate, '-o', out_aiff],
                       input=text, capture_output=True, text=True)
    if r.returncode != 0:
        return 'say-fail: ' + r.stderr.strip()
    return convert(out_aiff, out_m4a)


def convert(aiff, m4a):
    r = subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '40000', aiff, m4a],
                       capture_output=True, text=True)
    try:
        os.unlink(aiff)
    except OSError:
        pass
    return 'ok' if r.returncode == 0 else 'conv-fail: ' + r.stderr.strip()


def render_phonemes(manifest):
    """Render every letter-sound via the Swift IPA tool, then convert."""
    todo = {tok: ipa for tok, ipa in IPA.items()
            if not os.path.exists(os.path.join(AUDIO, 'ph', tok.replace('_', '-') + '.m4a'))}
    for tok in IPA:
        manifest['ph'][tok] = f"ph/{tok.replace('_', '-')}.m4a"
    if not todo:
        return []

    with tempfile.NamedTemporaryFile('w', suffix='.tsv', delete=False, encoding='utf-8') as f:
        spec = f.name
        for tok, ipa in todo.items():
            f.write(f"{tok.replace('_', '-')}\t{ipa}\t{tok}\n")

    r = subprocess.run(['swift', SWIFT_TOOL, os.path.join(AUDIO, 'ph'), spec],
                       capture_output=True, text=True)
    os.unlink(spec)
    fails = []
    if r.returncode != 0:
        fails.append(('phoneme-render', r.stderr.strip()[:300]))

    for tok in todo:
        safe = tok.replace('_', '-')
        aiff = os.path.join(AUDIO, 'ph', safe + '.aiff')
        m4a = os.path.join(AUDIO, 'ph', safe + '.m4a')
        if os.path.exists(aiff):
            res = convert(aiff, m4a)
            if res != 'ok':
                fails.append((safe, res))
        elif not os.path.exists(m4a):
            fails.append((safe, 'no aiff produced'))
    return fails


def duration(path):
    out = subprocess.run(['afinfo', path], capture_output=True, text=True).stdout
    for line in out.splitlines():
        if 'estimated duration' in line:
            try:
                return float(line.split(':')[1].strip().split()[0])
            except (ValueError, IndexError):
                return -1.0
    return -1.0


def validate(manifest):
    """Catch silent/missing clips. An IPA symbol the engine rejects renders
    as ~0.01s of nothing, which is worse than a wrong voice — it is no voice."""
    problems = []
    for tok, f in sorted(manifest['ph'].items()):
        p = os.path.join(AUDIO, f)
        d = duration(p) if os.path.exists(p) else -1
        if d < 0.12:
            problems.append(f'phoneme /{tok}/ -> {d:.3f}s (IPA {IPA[tok]!r})')
    for ch, f in sorted(manifest['ltr'].items()):
        p = os.path.join(AUDIO, f)
        d = duration(p) if os.path.exists(p) else -1
        if d < 0.15:
            problems.append(f'letter name {ch!r} -> {d:.3f}s')
    missing = [f for f in manifest['words'].values()
               if not os.path.exists(os.path.join(AUDIO, f))]
    if missing:
        problems.append(f'{len(missing)} word/phrase clips missing on disk')
    return problems


def main():
    words, phrases = extract()
    for d in ['w', 'p', 'ph', 'l']:
        os.makedirs(os.path.join(AUDIO, d), exist_ok=True)

    manifest = {'words': {}, 'ph': {}, 'ltr': {}}
    jobs = []

    for w in words:
        fn = f'w/{w}.m4a'
        jobs.append((WORD_RATE, w, f'{AUDIO}/w/{w}.aiff', f'{AUDIO}/{fn}'))
        manifest['words'][w] = fn

    for p in phrases:
        h = hashlib.md5(norm(p).encode()).hexdigest()[:12]
        fn = f'p/{h}.m4a'
        jobs.append((PHRASE_RATE, p, f'{AUDIO}/p/{h}.aiff', f'{AUDIO}/{fn}'))
        manifest['words'][norm(p)] = fn

    for ch, name in LETTER_NAME.items():
        fn = f'l/{ch}.m4a'
        jobs.append((WORD_RATE, name, f'{AUDIO}/l/{ch}.aiff', f'{AUDIO}/{fn}'))
        manifest['ltr'][ch] = fn

    print(f'{len(words)} words, {len(phrases)} phrases, {len(LETTER_NAME)} letter names '
          f'(via say) + {len(IPA)} phonemes (via IPA renderer)')

    fails = []
    with cf.ThreadPoolExecutor(max_workers=6) as ex:
        futs = {ex.submit(say_clip, *j): j for j in jobs}
        done = 0
        for f in cf.as_completed(futs):
            res = f.result()
            done += 1
            if done % 250 == 0:
                print(f'  {done}/{len(jobs)}')
            if res.startswith(('say-fail', 'conv-fail')):
                fails.append((futs[f][3], res))

    print('rendering phonemes via AVSpeechSynthesizer IPA...')
    fails += render_phonemes(manifest)

    with open(os.path.join(AUDIO, 'manifest.json'), 'w') as f:
        json.dump(manifest, f, separators=(',', ':'))

    print('validating clips...')
    problems = validate(manifest)

    print(f'done. {len(fails)} render failures, {len(problems)} validation problems')
    for fn, err in fails[:20]:
        print('  FAIL', fn, err)
    for p in problems[:30]:
        print('  BAD ', p)
    return 1 if (fails or problems) else 0


if __name__ == '__main__':
    sys.exit(main())
