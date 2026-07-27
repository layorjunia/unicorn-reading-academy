#!/usr/bin/env python3
"""Replace individual story illustrations in js/story-art.js.

The stories were rewritten, and several pictures now show the wrong thing — a
unicorn where the story says a girl, a bunny where it says a goat, an indoor
room where it says a pond. Art is keyed by story id, so each bad one can be
swapped without touching the rest.

Each SVG is sanitised the same way tools/build_characters.py does it: model-
authored markup can carry markdown fences, banned elements, or ids that collide
with another picture's gradients on the same page. It also gets checked for the
faults specific to these illustrations:

  * the background <rect> must carry width/height, or it collapses to nothing
    and the picture renders on a transparent background
  * attribute values must be plain ASCII — a stray non-ASCII byte inside a fill
    is a sign the generation glitched mid-attribute

  python3 tools/patch_story_art.py <dir-of-ID.svg-files>
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

ART = os.path.join(ROOT, 'js', 'story-art.js')
BANNED = re.compile(r'<(script|style|text|image|foreignObject|use)\b', re.I)


def clean(key, svg):
    s = svg.strip()
    s = re.sub(r'^```[a-z]*\s*', '', s)
    s = re.sub(r'\s*```$', '', s)
    s = re.sub(r'<\?xml.*?\?>', '', s, flags=re.S)
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    i, j = s.find('<svg'), s.rfind('</svg>')
    if i < 0 or j < 0:
        return None, 'no complete <svg> element'
    s = s[i:j + 6]

    if BANNED.search(s):
        return None, 'contains a banned element'
    if 'viewBox="0 0 320 180"' not in s:
        return None, 'wrong or missing viewBox'

    # A glitched attribute value (non-ASCII inside a fill/stroke) means the
    # generation corrupted mid-attribute. When the element is invisible anyway
    # (opacity="0") the safe repair is to delete it; when it is visible we
    # cannot guess the intended colour, so reject the whole picture.
    def corrupt(tag):
        return any(any(ord(c) > 127 for c in m.group(2))
                   for m in re.finditer(r'(fill|stroke|stop-color)="([^"]*)"', tag))

    kept = []
    for tag in re.split(r'(<[^>]*>)', s):
        if tag.startswith('<') and corrupt(tag):
            if re.search(r'opacity="0(\.0+)?"', tag) and tag.endswith('/>'):
                continue          # invisible: drop it
            return None, 'corrupt colour on a visible element'
        kept.append(tag)
    s = ''.join(kept)

    # let CSS own the outer size
    s = re.sub(r'<svg([^>]*?)\s(width|height)="[^"]*"', r'<svg\1', s)

    # namespace ids so two pictures on one page cannot steal each other's fills
    for old in set(re.findall(r'id="([^"]+)"', s)):
        new = old if old.startswith(key + '-') else f'{key}-{old}'
        s = s.replace(f'id="{old}"', f'id="{new}"')
        s = s.replace(f'url(#{old})', f'url(#{new})')

    # The background rect must be sized. Without width/height it paints nothing
    # and the illustration renders over whatever is behind it.
    def size_rect(m):
        tag = m.group(0)
        if 'width=' in tag:
            return tag
        return tag.replace('<rect', '<rect width="320" height="180"', 1)
    s = re.sub(r'<rect(?![^>]*\bwidth=)[^>]*?/>', size_rect, s, count=1)

    if re.search(r'<rect(?![^>]*\bwidth=)', s):
        return None, 'a <rect> still has no width'

    s = re.sub(r'\s+', ' ', s).strip()
    return s, None


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    src_dir = sys.argv[1]

    raw = open(ART, encoding='utf-8').read()
    head = raw[:raw.find('const STORY_ART')]
    blk = raw[raw.find('const STORY_ART'):raw.find('const QUEST')]
    tail = raw[raw.find('const QUEST'):]
    obj = re.sub(r',\s*}\s*$', '}', blk[blk.find('{'):blk.rfind('}') + 1])
    art = json.loads(obj)
    before = len(art)

    # An SVG <rect> with no width/height paints nothing. Most of the original
    # illustrations declared their sky as a bare <rect fill="url(#...-sky)"/>,
    # so in the app the sky simply was not there — the characters and ground
    # drew over blank white. Size every background rect that is missing it.
    repaired = []
    for key, svg in art.items():
        fixed = re.sub(r'<rect(?![^>]*\bwidth=)',
                       '<rect width="320" height="180"', svg, count=1)
        if fixed != svg:
            art[key] = fixed
            repaired.append(key)

    added, rejected = [], []
    for fn in sorted(os.listdir(src_dir)):
        if not fn.endswith('.svg'):
            continue
        key = fn[:-4]
        svg, err = clean(key, open(os.path.join(src_dir, fn), encoding='utf-8').read())
        if err:
            rejected.append((key, err))
        else:
            art[key] = svg
            added.append(key)

    out = (head + 'const STORY_ART = {\n' +
           ''.join(f'  {json.dumps(k)}: {json.dumps(v)},\n'
                   for k, v in sorted(art.items())) +
           '};\n\n' + tail)
    open(ART, 'w', encoding='utf-8').write(out)

    print(f'story art: {before} -> {len(art)}  ({len(added)} written, '
          f'{len(repaired)} backgrounds repaired)')
    if repaired:
        print('  sized the background rect on: ' + ', '.join(sorted(repaired)))
    for k in added:
        print(f'  + {k}  ({len(art[k]) / 1024:.1f} KB)')
    for k, e in rejected:
        print(f'  REJECTED {k}: {e}')
    return 1 if rejected else 0


if __name__ == '__main__':
    sys.exit(main())
