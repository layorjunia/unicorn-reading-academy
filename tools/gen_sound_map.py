#!/usr/bin/env python3
"""The single source of truth for the app's SOUND layer.

Why this exists: four separate attempts to synthesise letter sounds failed —
browser TTS, eSpeak phonemes, Piper's phoneme layer, and Apple's IPA notation
all produced sounds that were robotic, wrong, or both (/a/ and /i/ came out
near-identical, which actively taught the wrong thing). That is not a tuning
problem. TTS models are trained on continuous speech; an isolated letter sound
— especially a stop like /b/, which physically cannot exist without a vowel
release — is outside what they can produce. Every reading app that works
(Starfall, Teach Your Monster to Read, Reading Eggs) uses HUMAN recordings of
the ~44 sounds. So does this one now.

This script defines the sound inventory and emits everything the rest of the
system needs:

  js/sound-map.js               grapheme -> [sound-id] map + labels (runtime)
  tools/recording-script.json   the guided script the recording rig walks through

It also cross-checks the inventory against the REAL curriculum (banks.js sound
segmentations, soundIt arrays, teach patterns) and fails loudly if any L1/L2
token has no mapping — so the recording script can never silently drift from
what the lessons teach.

  python3 tools/gen_sound_map.py
"""
import json
import os
import re
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

# ── The sound inventory ──────────────────────────────────────────────────────
# type:
#   stop      clipped burst; the #1 recording rule is NO trailing "uh"
#   cont      continuant; can be held ("mmm", "sss")
#   glide     brief on-glide; short, no vowel added
#   vowel     held clean
#   glued     a natural chunk ("ing", "all") — said as a unit
# graphemes: every spelling in the curriculum that makes this sound.
SOUNDS = [
    # consonants
    dict(id='b',  label='/b/',  type='stop',  graphemes=['b'],              ex=['bat', 'big', 'bed']),
    dict(id='k',  label='/k/',  type='stop',  graphemes=['c', 'k', 'ck'],   ex=['cat', 'kit', 'duck']),
    dict(id='d',  label='/d/',  type='stop',  graphemes=['d'],              ex=['dog', 'dad', 'mud']),
    dict(id='f',  label='/f/',  type='cont',  graphemes=['f'],              ex=['fan', 'fish', 'fun']),
    dict(id='g',  label='/g/',  type='stop',  graphemes=['g'],              ex=['got', 'bag', 'pig']),
    dict(id='h',  label='/h/',  type='glide', graphemes=['h'],              ex=['hat', 'hen', 'hop']),
    dict(id='j',  label='/j/',  type='stop',  graphemes=['j', 'ge', 'gi'],  ex=['jam', 'jet', 'jug']),
    dict(id='l',  label='/l/',  type='cont',  graphemes=['l', 'll'],        ex=['lap', 'leg', 'shell']),
    dict(id='m',  label='/m/',  type='cont',  graphemes=['m'],              ex=['map', 'man', 'ham']),
    dict(id='n',  label='/n/',  type='cont',  graphemes=['n', 'kn'],        ex=['net', 'nap', 'sun']),
    dict(id='p',  label='/p/',  type='stop',  graphemes=['p'],              ex=['pan', 'pig', 'cup']),
    dict(id='r',  label='/r/',  type='cont',  graphemes=['r', 'wr'],        ex=['run', 'red', 'rat']),
    dict(id='s',  label='/s/',  type='cont',  graphemes=['s', 'ce', 'ci'],  ex=['sun', 'sit', 'bus']),
    dict(id='t',  label='/t/',  type='stop',  graphemes=['t'],              ex=['top', 'ten', 'cat']),
    dict(id='v',  label='/v/',  type='cont',  graphemes=['v'],              ex=['vet', 'van']),
    dict(id='w',  label='/w/',  type='glide', graphemes=['w', 'wh'],        ex=['wet', 'wig', 'when']),
    dict(id='y',  label='/y/',  type='glide', graphemes=['y'],              ex=['yes', 'yak']),
    dict(id='z',  label='/z/',  type='cont',  graphemes=['z'],              ex=['zip', 'buzz']),
    dict(id='sh', label='/sh/', type='cont',  graphemes=['sh'],             ex=['ship', 'fish', 'shop']),
    dict(id='ch', label='/ch/', type='stop',  graphemes=['ch'],             ex=['chat', 'chip', 'much']),
    dict(id='th', label='/th/', type='cont',  graphemes=['th'],             ex=['thin', 'bath', 'math']),
    dict(id='ng', label='/ng/', type='cont',  graphemes=['ng'],             ex=['ring', 'song']),
    dict(id='kw', label='/kw/', type='stop',  graphemes=['qu'],             ex=['quick', 'quit']),
    dict(id='ks', label='/ks/', type='cont',  graphemes=['x'],              ex=['six', 'box', 'fox']),
    # short vowels
    dict(id='short-a', label='/a/', type='vowel', graphemes=['a'], ex=['cat', 'hat', 'map']),
    dict(id='short-e', label='/e/', type='vowel', graphemes=['e'], ex=['bed', 'pen', 'net']),
    dict(id='short-i', label='/i/', type='vowel', graphemes=['i'], ex=['sit', 'pig', 'win']),
    dict(id='short-o', label='/o/', type='vowel', graphemes=['o'], ex=['hot', 'dog', 'top']),
    dict(id='short-u', label='/u/', type='vowel', graphemes=['u'], ex=['sun', 'bug', 'cup']),
    # long vowels and teams
    dict(id='long-a', label='/ā/', type='vowel', graphemes=['a_e', 'ai', 'ay'],                 ex=['cake', 'rain', 'play']),
    dict(id='long-e', label='/ē/', type='vowel', graphemes=['ee', 'ea', 'ey', 'y_e'],           ex=['see', 'read', 'key']),
    dict(id='long-i', label='/ī/', type='vowel', graphemes=['i_e', 'igh', 'y_i', 'eye', 'ie'],  ex=['ride', 'light', 'sky']),
    dict(id='long-o', label='/ō/', type='vowel', graphemes=['o_e', 'oa', 'ow_o'],               ex=['home', 'boat', 'snow']),
    dict(id='long-u', label='/ū/', type='vowel', graphemes=['u_e'],                             ex=['cube', 'mule', 'cute']),
    dict(id='oo',     label='/oo/', type='vowel', graphemes=['oo'],                             ex=['moon', 'zoo', 'food']),
    # r-controlled
    dict(id='ar', label='/ar/', type='vowel', graphemes=['ar'],             ex=['star', 'car', 'barn']),
    dict(id='or', label='/or/', type='vowel', graphemes=['or'],             ex=['corn', 'fort', 'storm']),
    dict(id='er', label='/er/', type='vowel', graphemes=['er', 'ir', 'ur'], ex=['her', 'bird', 'turn']),
    # diphthongs
    dict(id='ow', label='/ow/', type='vowel', graphemes=['ou', 'ow_ou'],    ex=['out', 'cow', 'loud']),
    dict(id='oy', label='/oy/', type='vowel', graphemes=['oi', 'oy'],       ex=['coin', 'boy', 'joy']),
    # glued sounds — natural chunks, said as units
    dict(id='ing', label='-ing', type='glued', graphemes=['ing'], ex=['ring', 'king']),
    dict(id='ang', label='-ang', type='glued', graphemes=['ang'], ex=['sang', 'bang']),
    dict(id='ank', label='-ank', type='glued', graphemes=['ank'], ex=['thank', 'bank']),
    dict(id='ink', label='-ink', type='glued', graphemes=['ink'], ex=['pink', 'wink']),
    dict(id='all', label='-all', type='glued', graphemes=['all'], ex=['ball', 'tall']),
    dict(id='ant', label='-ant', type='glued', graphemes=['ant'], ex=['ant', 'plant']),
]

# Blend PATTERNS (st, pl, fr...) are deliberately not sounds: Science of
# Reading teaches blends as two sounds said quickly, never as a new unit. The
# teach screen plays their constituent sounds in sequence.
BLEND_PATTERNS = {
    'st': ['s', 't'], 'sp': ['s', 'p'], 'sl': ['s', 'l'], 'sn': ['s', 'n'],
    'sm': ['s', 'm'], 'sw': ['s', 'w'], 'sk': ['s', 'k'], 'sc': ['s', 'k'],
    'pl': ['p', 'l'], 'bl': ['b', 'l'], 'cl': ['k', 'l'], 'fl': ['f', 'l'],
    'gl': ['g', 'l'],
    'pr': ['p', 'r'], 'br': ['b', 'r'], 'cr': ['k', 'r'], 'dr': ['d', 'r'],
    'fr': ['f', 'r'], 'gr': ['g', 'r'], 'tr': ['t', 'r'],
    'tw': ['t', 'w'],
    'nd': ['n', 'd'], 'nt': ['n', 't'], 'mp': ['m', 'p'], 'lk': ['l', 'k'],
    'lt': ['l', 't'], 'ft': ['f', 't'], 'sk_end': ['s', 'k'], 'nk': ['n', 'k'],
}


def build_map():
    """grapheme -> [sound-id, ...]; one id normally, several for blends."""
    m = {}
    for s in SOUNDS:
        for g in s['graphemes']:
            m[g] = [s['id']]
    for g, parts in BLEND_PATTERNS.items():
        if g not in m:
            m[g] = parts
    return m


def read(path):
    p = os.path.join(ROOT, path)
    return open(p, encoding='utf-8').read() if os.path.exists(p) else ''


def curriculum_tokens():
    """Every sound token the curriculum actually uses, split by level."""
    by_level = {}
    for m in re.finditer(r"'(L\d)-\d+':\s*\[(.*?)\]", read('js/banks.js'), re.S):
        lvl = m.group(1)
        toks = by_level.setdefault(lvl, set())
        for w in re.finditer(r"'([a-z]+):([a-z_.|]+)'", m.group(2)):
            for t in w.group(2).split('|')[0].split('.'):
                if t:
                    toks.add(t)
    cur = {}
    for lvl in ('L1', 'L2', 'L3'):
        src = read(f'js/curriculum-l{lvl[1]}.js')
        toks = by_level.setdefault(lvl, set())
        for m in re.finditer(r"sounds:\s*\[([^\]]*)\]", src):
            toks.update(re.findall(r"'([^']+)'", m.group(1)))
        cur[lvl] = toks
    return by_level


def chunk_items(tokens, mapped):
    """L3 syllable/morpheme chunks: everything the sound table doesn't cover.

    These are normal speakable fragments ("rab", "muf", "pre"), so they get
    their own optional recording group rather than a place in the sound table.
    """
    return sorted(t for t in tokens if t not in mapped and re.fullmatch(r'[a-z]+', t))


def pattern_keys():
    """Every Learn-screen pattern's sound key (sk if given, else g), by level.

    Patterns are what the child TAPS to hear a sound, so an unmapped one is a
    button that silently never gains its recording. Display-only patterns
    (affixes like 'pre-', example words like 'baby', slashed pairs) are
    excluded — they legitimately fall back to speaking the example word.
    """
    out = {}
    for lvl in ('L1', 'L2', 'L3'):
        src = read(f'js/curriculum-l{lvl[1]}.js')
        keys = out.setdefault(lvl, set())
        for m in re.finditer(
                r"\{\s*g:\s*'([^']+)'(?:,\s*sk:\s*'([^']+)')?"
                r"[^}]*?ex:\s*'([^']*)'", src):
            key = m.group(2) or m.group(1)
            if '/' in key or '-' in key or len(key) > 4:
                continue
            if '|' in m.group(3):     # syllable-division demo, display-only
                continue
            keys.add(key)
    return out


def main():
    gmap = build_map()
    levels = curriculum_tokens()
    chunks = chunk_items(levels.get('L3', set()), gmap)

    # L3 syllable chunks are recordable too ('rab' -> the chunk-rab clip);
    # without these entries the rig collects ~200 recordings that no code
    # path could ever play.
    for c in chunks:
        gmap.setdefault(c, ['chunk-' + c])

    # L1 + L2 sound tokens AND every level's pattern buttons must be covered —
    # that is the promise this generator enforces.
    problems = []
    for lvl in ('L1', 'L2'):
        for t in sorted(levels.get(lvl, ())):
            if t not in gmap:
                problems.append(f'{lvl} token {t!r} has no sound mapping')
    for lvl, keys in pattern_keys().items():
        for k in sorted(keys):
            if k not in gmap:
                problems.append(f'{lvl} pattern button {k!r} has no sound '
                                f'mapping (add sk: to the pattern or a table '
                                f'entry)')
    if problems:
        print(f'COVERAGE FAILURE — {len(problems)} unmapped tokens:')
        for p in problems:
            print('  ', p)
        return 1

    # runtime map
    sound_info = {s['id']: {'label': s['label'], 'type': s['type']} for s in SOUNDS}
    with open(os.path.join(ROOT, 'js', 'sound-map.js'), 'w', encoding='utf-8') as f:
        f.write('// Generated by tools/gen_sound_map.py — do not hand-edit.\n')
        f.write('// grapheme -> [sound-id]; ids resolve to human recordings in audio/s/.\n')
        f.write('const SOUND_MAP = ')
        f.write(json.dumps(gmap, separators=(',', ':'), sort_keys=True))
        f.write(';\nconst SOUND_INFO = ')
        f.write(json.dumps(sound_info, separators=(',', ':'), sort_keys=True))
        f.write(';\n')

    # recording script for the rig, with example-word clips resolved from the
    # real audio manifest so the rig can play them back as pronunciation anchors
    man = {}
    mp = os.path.join(ROOT, 'audio', 'manifest.json')
    if os.path.exists(mp):
        man = json.load(open(mp)).get('words', {})
    script = {
        'groups': [
            {'key': 'consonants', 'title': 'Consonant sounds',
             'items': [s['id'] for s in SOUNDS if s['type'] in ('stop', 'cont', 'glide') ]},
            {'key': 'vowels', 'title': 'Vowel sounds',
             'items': [s['id'] for s in SOUNDS if s['type'] == 'vowel']},
            {'key': 'glued', 'title': 'Glued sounds',
             'items': [s['id'] for s in SOUNDS if s['type'] == 'glued']},
            {'key': 'chunks', 'title': 'Level 3 syllables (optional)',
             'items': ['chunk-' + c for c in chunks]},
        ],
        'sounds': {},
    }
    for s in SOUNDS:
        script['sounds'][s['id']] = {
            'label': s['label'], 'type': s['type'],
            'graphemes': s['graphemes'],
            'examples': [{'w': w, 'clip': ('audio/' + man[w]) if w in man else None}
                         for w in s['ex']],
        }
    for c in chunks:
        script['sounds']['chunk-' + c] = {
            'label': c, 'type': 'chunk', 'graphemes': [c],
            'examples': [],
        }
    with open(os.path.join(ROOT, 'tools', 'recording-script.json'), 'w',
              encoding='utf-8') as f:
        json.dump(script, f, indent=1)

    n_core = sum(len(g['items']) for g in script['groups'][:3])
    print(f'sound table: {len(SOUNDS)} sounds, {len(gmap)} grapheme mappings')
    print(f'L1 tokens covered: {len(levels["L1"])}  L2: {len(levels["L2"])}')
    print(f'recording script: {n_core} core sounds + {len(chunks)} optional L3 chunks')
    print('wrote js/sound-map.js and tools/recording-script.json')
    return 0


if __name__ == '__main__':
    sys.exit(main())
