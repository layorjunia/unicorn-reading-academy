#!/usr/bin/env python3
"""Write the rewritten stories back into the curriculum and library files.

The originals were written by fitting words to a phonics constraint and
accepting whatever came out, which produced lines like "So fine!" — filler that
means nothing. These replacements keep the decodability but read like real
language.

Refuses to write anything that still contains known filler, so the defect
cannot come back silently.

  python3 tools/apply_stories.py <result.json> [--dry-run]
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

# Meaningless exclamations that made the old stories read as nonsense.
FILLER = re.compile(
    r'\b(so fine|what fun|so neat|how fun|so nice|what a day|so good)\b[!.]?',
    re.I)


def load(path):
    raw = open(path, encoding='utf-8').read()
    i = raw.find('"result"')
    j = raw.find('{', i)
    depth = 0
    for k, ch in enumerate(raw[j:], j):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return json.loads(raw[j:k + 1])
    return None


def js_str(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def check(rec):
    bad = []
    for p in rec.get('pages', []):
        m = FILLER.search(p)
        if m:
            bad.append(f"filler {m.group(0)!r} in: {p[:60]}")
    if len(rec.get('pages', [])) < 3:
        bad.append('too few pages')
    for q in rec.get('questions', []):
        if not (0 <= q.get('answer', -1) < len(q.get('choices', []))):
            bad.append(f"answer index out of range: {q.get('q','')[:40]}")
    return bad


def replace_block(src, story_id, rec, is_library):
    """Swap the pages/questions of one story, leaving everything else alone."""
    if is_library:
        anchor = re.search(r"id:\s*'" + re.escape(story_id) + r"'", src)
    else:
        anchor = re.search(r"id:\s*'" + re.escape(story_id) + r"'", src)
    if not anchor:
        return src, False

    tail = src[anchor.start():]
    pm = re.search(r'(\bpages:\s*\[)(.*?)(\n\s*\],)', tail, re.S)
    if not pm:
        return src, False
    indent = re.search(r'\n(\s*)pages:', tail).group(1)
    pages = (',\n').join(indent + '  ' + js_str(p) for p in rec['pages'])
    new_pages = pm.group(1) + '\n' + pages + '\n' + indent + '],'
    start = anchor.start() + pm.start()
    end = anchor.start() + pm.end()
    src = src[:start] + new_pages + src[end:]

    tail = src[anchor.start():]
    qm = re.search(r'(\bquestions:\s*\[)(.*?)(\n\s*\])', tail, re.S)
    if qm:
        qs = []
        for q in rec['questions']:
            ch = ', '.join(js_str(c) for c in q['choices'])
            qs.append(f"{indent}  {{ q: {js_str(q['q'])}, choices: [{ch}], "
                      f"answer: {q['answer']} }}")
        new_q = qm.group(1) + '\n' + ',\n'.join(qs) + '\n' + indent + ']'
        s2 = anchor.start() + qm.start()
        e2 = anchor.start() + qm.end()
        src = src[:s2] + new_q + src[e2:]

    # title, where the file has one
    if rec.get('title'):
        tm = re.search(r"(id:\s*'" + re.escape(story_id) + r"'[\s\S]{0,400}?title:\s*)'[^']*'", src)
        if tm:
            src = src[:tm.end(1)] + js_str(rec['title']) + src[tm.end():]
    return src, True


def main():
    data = load(sys.argv[1])
    dry = '--dry-run' in sys.argv
    if not data:
        print('could not parse result')
        return 1
    stories = {s['id']: s for s in data.get('stories', []) if s and s.get('id')}
    print(f'{len(stories)} rewritten stories')

    problems = []
    for sid, rec in stories.items():
        for b in check(rec):
            problems.append(f'{sid}: {b}')
    if problems:
        print(f'REFUSING TO APPLY — {len(problems)} problems:')
        for p in problems[:20]:
            print('  ', p)
        return 1

    files = {
        'L1': os.path.join(ROOT, 'js', 'curriculum-l1.js'),
        'L2': os.path.join(ROOT, 'js', 'curriculum-l2.js'),
        'L3': os.path.join(ROOT, 'js', 'curriculum-l3.js'),
        'S': os.path.join(ROOT, 'js', 'storylib.js'),
    }
    applied = {k: [] for k in files}
    for sid, rec in sorted(stories.items()):
        key = 'S' if sid.startswith('S') else sid[:2]
        path = files.get(key)
        if not path:
            continue
        src = open(path, encoding='utf-8').read()
        src, ok = replace_block(src, sid, rec, key == 'S')
        if ok:
            if not dry:
                open(path, 'w', encoding='utf-8').write(src)
            applied[key].append(sid)
        else:
            print('  ! could not locate', sid)

    for k, v in applied.items():
        if v:
            print(f'{os.path.basename(files[k])}: {len(v)} -> {sorted(v)}')
    if dry:
        print('(dry run — nothing written)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
