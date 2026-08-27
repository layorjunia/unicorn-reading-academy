#!/usr/bin/env python3
"""Write verified narration segment arrays into the curriculum files.

Reads the letter-safe-narration workflow journal, then for each island
replaces teach.intro with the cleaned display text and inserts the
teach.narration array after it.

  python3 tools/apply_narration.py <journal.jsonl> [--dry-run]
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = {
    'L1': os.path.join(ROOT, 'js', 'curriculum-l1.js'),
    'L2': os.path.join(ROOT, 'js', 'curriculum-l2.js'),
    'L3': os.path.join(ROOT, 'js', 'curriculum-l3.js'),
}

BARE_LETTER = re.compile(r"(?<![A-Za-z'])[a-zA-Z](?![A-Za-z'])")
GRAPHEME = re.compile(r'\b(sh|ch|th|wh|ck|ai|ay|ee|ea|oa|ow|oi|oy|oo|ou|igh|ar|er|ir|ur|ing|ank|ink)\b',
                      re.I)
# "all" and "or" are ordinary English words as well as grapheme names — spoken
# inside a sentence they are perfectly safe, so they are not in the pattern.


def load(journal):
    out = {}
    with open(journal, encoding='utf-8') as f:
        for line in f:
            try:
                e = json.loads(line)
            except json.JSONDecodeError:
                continue
            if e.get('type') != 'result':
                continue
            r = e.get('result') or e.get('value')
            if isinstance(r, str):
                try:
                    r = json.loads(r)
                except json.JSONDecodeError:
                    continue
            if isinstance(r, dict) and r.get('islandId') and r.get('fixed'):
                out[r['islandId']] = r
    return out


def js_str(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def seg_js(seg):
    for k in ('say', 'ph', 'word', 'ltr'):
        if seg.get(k) is not None:
            return '{ %s: %s }' % (k, js_str(str(seg[k])))
    return None


def check(island_id, rec):
    """Last line of defence: a bare letter or grapheme inside a spoken `say`
    fragment is the whole bug, so refuse to write one."""
    problems = []
    for seg in rec['fixed']:
        t = seg.get('say')
        if t is None:
            continue
        for m in BARE_LETTER.finditer(t):
            problems.append(f'{island_id}: bare letter {m.group(0)!r} in say {t!r}')
        for m in GRAPHEME.finditer(t):
            # only flag when it stands alone as a spelling, not inside a word
            if re.search(r'(^|[\s"\'])' + m.group(0) + r'([\s.,!?"\']|$)', t, re.I):
                problems.append(f'{island_id}: grapheme {m.group(0)!r} in say {t!r}')
        if any(c in t for c in '_/*'):
            problems.append(f'{island_id}: symbol in say {t!r}')
    return problems


def apply_to(path, records, dry):
    src = open(path, encoding='utf-8').read()
    orig = src
    applied = []
    for island_id, rec in records.items():
        # locate the island object, then its teach.intro
        m = re.search(r"id:\s*'" + re.escape(island_id) + r"'", src)
        if not m:
            continue
        seg = src[m.start():]
        im = re.search(r'(\n(\s*)intro:\s*)(".*?"|\'.*?\')(,)', seg, re.S)
        if not im:
            print(f'  ! no intro found for {island_id}')
            continue
        indent = im.group(2)
        segs = [seg_js(s) for s in rec['fixed']]
        segs = [s for s in segs if s]
        narr = (',\n' + indent + 'narration: [\n' + indent + '  '
                + (',\n' + indent + '  ').join(segs)
                + '\n' + indent + ']')
        new = im.group(1) + js_str(rec['fixedDisplay']) + narr + im.group(4)
        start = m.start() + im.start()
        end = m.start() + im.end()
        src = src[:start] + new + src[end:]
        applied.append(island_id)
    if src != orig and not dry:
        open(path, 'w', encoding='utf-8').write(src)
    return applied


def main():
    journal = sys.argv[1]
    dry = '--dry-run' in sys.argv
    recs = load(journal)
    print(f'{len(recs)} verified narrations: {sorted(recs)}')

    problems = []
    for k, v in recs.items():
        problems += check(k, v)
    if problems:
        print(f'\nREFUSING TO APPLY — {len(problems)} rule violations:')
        for p in problems[:30]:
            print('  ', p)
        return 1

    for lvl, path in FILES.items():
        subset = {k: v for k, v in recs.items() if k.startswith(lvl)}
        if not subset:
            continue
        done = apply_to(path, subset, dry)
        print(f'{os.path.basename(path)}: applied {len(done)} -> {sorted(done)}')
    if dry:
        print('(dry run — nothing written)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
