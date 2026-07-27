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
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

# The defect was a phrase like "So fine!" standing alone as a whole sentence,
# attached to nothing. The same words inside a real sentence are fine — "That
# cake smells so good" is exactly what we want — so match only the standalone
# case, or the guard rejects good writing.
FILLER_PHRASE = r'(so fine|what fun|so neat|how fun|so nice|so good|what a day|so fun|how neat)'
FILLER = re.compile(r'^[\'"\s]*' + FILLER_PHRASE + r'[!.?\'"\s]*$', re.I)


def sentences(text):
    return [s for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]


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
        for s in sentences(p):
            if FILLER.match(s.strip()):
                bad.append(f"standalone filler sentence {s.strip()!r} in: {p[:50]}")
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

    # Title. In a curriculum file the FIRST title after the id belongs to the
    # island (its phonics skill — "Short a & i", "Digraphs"), and the story's
    # own title lives inside readIt. Anchoring on the first title therefore
    # renames the skill and leaves the story untouched — exactly backwards — so
    # curriculum titles are matched inside readIt only.
    # The existing title may contain an escaped apostrophe ("The Knight\'s
    # Puzzle"); a naive [^']* stops at that backslash-quote and leaves the tail
    # of the old title behind, producing a broken string literal.
    if rec.get('title'):
        anchor_pat = (r"(id:\s*'" + re.escape(story_id) + r"'[\s\S]{0,400}?title:\s*)"
                      if is_library else
                      r"(id:\s*'" + re.escape(story_id) +
                      r"'[\s\S]*?readIt:\s*\{[\s\S]{0,300}?title:\s*)")
        tm = re.search(anchor_pat + r"'(?:\\.|[^'\\])*'", src)
        if tm:
            src = src[:tm.end(1)] + js_str(rec['title']) + src[tm.end():]
    return src, True


def syntax_ok(src, path):
    probe = os.path.join(_WORK, 'probe-' + os.path.basename(path))
    open(probe, 'w', encoding='utf-8').write(src)
    r = subprocess.run(['node', '--check', probe], capture_output=True, text=True)
    if r.returncode != 0:
        print('    ', r.stderr.strip().split('\n')[-1][:120])
    return r.returncode == 0


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
            # Parse-check before committing the write. A quoting slip inside a
            # replacement produces a file that looks fine and breaks the app at
            # load time; catching it here keeps a bad edit from reaching disk.
            if not syntax_ok(src, path):
                print(f'  ! {sid}: edit would break {os.path.basename(path)} '
                      f'— skipped, file left unchanged')
                continue
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
