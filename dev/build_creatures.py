#!/usr/bin/env python3
"""Build creatures.js — every friend she can earn by reading.

Two sources:

  classic/js/characters.js   the 28 hand-drawn originals from the classic app
  dev/extra_creatures.py     38 more, drawn to match

The unlock ORDER below deliberately alternates old and new, and never puts two
similar animals side by side, so the next friend is always a surprise. Because
it interleaves, a save from before the new art existed no longer holds a plain
PREFIX of this list — App.claimFriend and friends grant "the first one she does
not own" rather than CREATURES[friends.length], which is what makes any order
safe. Do not reintroduce index-based granting.

  python3 dev/build_creatures.py
"""
import json
import os
import re
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK
sys.path.insert(0, os.path.join(ROOT, 'dev'))

from extra_creatures import NEW as EXTRA          # noqa: E402

ORDER = [
    'pip',                                        # free starter — the app's unicorn
    'mimi', 'fern', 'biscuit', 'cuddle', 'bun', 'buzz', 'peep', 'mochi',
    'nova', 'fawn', 'flutter', 'puff', 'ember', 'peaches', 'dot', 'nori',
    'pinky', 'prickle', 'sage', 'axie', 'marina', 'roary', 'rexy', 'luna',
    'bamboo', 'kiwi', 'sheldon', 'woolly', 'dottie', 'pinch', 'clover',
    'rusty', 'inky', 'petal', 'nutmeg', 'zip', 'grace', 'bandit', 'waddle',
    'coral', 'blaze', 'doze', 'stretch', 'jelly', 'twinkle', 'mango',
    'sparkle', 'sandy', 'splash', 'lulu', 'snuggles', 'robin', 'whiskers',
    'ziggy', 'glim', 'honey', 'shelly', 'quackers', 'frost', 'plume',
    'button', 'skye', 'ruby', 'pearl', 'arc',
]

CHEER = {
    'pip': "Let's read together!",
    'mimi': 'I purr when you read!',
    'biscuit': 'You read that so well!',
    'bun': 'I hopped over to hear you!',
    'peep': 'I just hatched to listen!',
    'nova': 'You are a real star!',
    'flutter': 'I fluttered here for you!',
    'ember': 'I heard you all the way here!',
    'dot': 'Reading makes me sparkle!',
    'pinky': 'I stood on one leg to listen!',
    'sage': 'Whooo is a good reader? You!',
    'marina': 'I swam up to hear that!',
    'rexy': 'That was a mighty good read!',
    'bamboo': 'You read better than I chew!',
    'sheldon': 'Slow and steady, just like reading!',
    'dottie': 'Spot on reading!',
    'clover': 'You are my lucky friend!',
    'inky': 'Eight arms, all clapping!',
    'nutmeg': 'I stored up all your words!',
    'grace': 'That was beautiful reading!',
    'waddle': 'I waddled a long way to hear you!',
    'blaze': 'Your reading is on fire!',
    'stretch': 'I can see how far you have come!',
    'twinkle': 'You make the whole sky twinkle!',
    'sparkle': 'Sparkles for every word!',
    'splash': 'You made a big splash!',
    'snuggles': 'Come read to me any time!',
    'whiskers': 'My whiskers wiggle when you read!',
}


def unsized_rects(key, svg):
    """An SVG <rect> with no width/height paints NOTHING.

    Sparkle shipped with a missing leg this way — invisible until someone
    looked closely. Never let that through silently again.
    """
    return [f'{key}: {tag}' for tag in re.findall(r'<rect[^>]*>', svg)
            if 'width=' not in tag or 'height=' not in tag]


def main():
    src = open(os.path.join(ROOT, 'classic/js/characters.js'), encoding='utf-8').read()
    chars = {}
    for m in re.finditer(r'^  ([a-z]+): ("(?:[^"\\]|\\.)*"),$', src, re.M):
        chars[m.group(1)] = json.loads(m.group(2))
    names = json.loads(re.search(r'const CHARACTER_NAMES = (\{[\s\S]*?\});', src).group(1))

    art, name_of, cheer_of = {}, {}, {}
    for k, svg in chars.items():
        art[k] = svg
        name_of[k] = names.get(k, k.title())
        cheer_of[k] = CHEER.get(k, 'You read that so well!')
    for c in EXTRA:
        if c['k'] in art:
            raise SystemExit(f"duplicate creature key: {c['k']}")
        art[c['k']] = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
                       + (f"<defs>{c['defs']}</defs>" if c['defs'] else '')
                       + c['body'] + '</svg>')
        name_of[c['k']] = c['n']
        cheer_of[c['k']] = c['c']

    missing = [k for k in ORDER if k not in art]
    if missing:
        raise SystemExit(f'missing art for: {missing}')
    extra = [k for k in art if k not in ORDER]
    if extra:
        raise SystemExit(f'art with no place in the unlock order: {extra}')
    if len(set(ORDER)) != len(ORDER):
        dupes = [k for k in set(ORDER) if ORDER.count(k) > 1]
        raise SystemExit(f'creature listed twice in the unlock order: {dupes}')

    broken = []
    for key in ORDER:
        broken += unsized_rects(key, art[key])
    if broken:
        raise SystemExit('unsized <rect> paints nothing:\n  ' + '\n  '.join(broken))

    # Every id inside an SVG lands in ONE shared document, so a gradient id
    # reused across two creatures makes the second one paint with the first
    # one's colours. Namespacing is the rule; this proves it held.
    seen_ids = {}
    for key in ORDER:
        for gid in re.findall(r'\sid="([^"]+)"', art[key]):
            if gid in seen_ids:
                raise SystemExit(f'id "{gid}" used by both {seen_ids[gid]} and {key}')
            seen_ids[gid] = key

    out = [{'k': k, 'n': name_of[k], 'c': cheer_of[k], 'svg': art[k]} for k in ORDER]

    path = os.path.join(ROOT, 'creatures.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('// Creature friends, earned by reading.\n')
        f.write('// Generated by dev/build_creatures.py — do not hand-edit.\n')
        f.write('const CREATURES = ' + json.dumps(out, separators=(',', ':')) + ';\n')
    print(f'wrote {len(out)} creatures to {path} ({os.path.getsize(path)/1024:.0f} KB)')
    print(f'  {len(chars)} from the classic app + {len(EXTRA)} new')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
