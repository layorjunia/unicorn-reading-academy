#!/usr/bin/env python3
"""Fold a batch of authored content into the corpus and the word allowlist.

Input is the JSON a content-authoring run produced:

  {"words":     [{"slot":{"lvl","pat"}, "keep":[...], "move":[{"word","to"}]}],
   "sentences": [{"lvl", "keep":[...]}],
   "stories":   [{"lvl", "stories":[{"title","lines":[...]}]}]}

Two destinations, because the build reads two files:

  .work/corpus.json     the authored corpus build_content.py merges in
  .work/wordaudit.json  the ALLOWLIST, which is authoritative — a word absent
                        from `keep` is dropped no matter what the corpus says,
                        so a new word has to land in BOTH or it silently
                        never ships.

Everything is additive and re-runnable: nothing already in the corpus is ever
removed, so running this twice is a no-op rather than a duplication.

  python3 dev/apply_authored.py .work/authored.json
"""
import json
import os
import re
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_WORK = os.path.join(ROOT, '.work')
os.makedirs(os.path.join(_WORK, 'tmp'), exist_ok=True)
tempfile.tempdir = os.path.join(_WORK, 'tmp')

WORD_OK = re.compile(r'^[a-z]{3,12}$')
SENT_OK = re.compile(r"^[A-Z][A-Za-z ,'-]*[.!?]$")

# Mirrors dev/audit_content.py. Checked here too so a bad word never even
# reaches the corpus file, rather than being caught two steps later.
BANNED = set("""
kill kills killed killing murder dead death dying corpse blood bloody
gun guns rifle bullet stab stabbed knife weapon war battle
drug drugs cocaine beer wine whiskey vodka drunk cigarette cigarettes smoking
cancer tumor surgery ambulance suicide abuse divorce
stupid idiot dumb hate hates hated ugly
""".split())


def load(path, default):
    p = os.path.join(ROOT, path)
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else default


def write_atomic(path, data):
    """Write via a temp file in .work/tmp, then replace.

    A half-written corpus.json is worse than none: the next build would read a
    truncated file and quietly ship a fraction of the words.
    """
    p = os.path.join(ROOT, path)
    fd, tmp = tempfile.mkstemp(suffix='.json')
    with os.fdopen(fd, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, p)


def words_of(s):
    return re.findall(r"[a-z']+", s.lower())


def sentence_ok(s):
    n = len(words_of(s))
    return bool(SENT_OK.match(s)) and 3 <= n <= 12 and not (set(words_of(s)) & BANNED)


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(_WORK, 'authored.json')
    batch = json.load(open(src, encoding='utf-8'))

    corpus = load('.work/corpus.json', {'words': {}, 'sentences': {}, 'stories': {}})
    audit = load('.work/wordaudit.json', {'keep': {}, 'dropped': {}, 'moved': {}})
    for sec in ('words', 'sentences', 'stories'):
        corpus.setdefault(sec, {})
        for lvl in ('1', '2', '3'):
            corpus[sec].setdefault(lvl, [])
    for lvl in ('1', '2', '3'):
        audit.setdefault('keep', {}).setdefault(lvl, [])

    # ── words ────────────────────────────────────────────────────────────
    # A word already taught at an easier level must not reappear at a harder
    # one, so build the "already spoken for" set once, up front.
    spoken_for = {w for lvl in ('1', '2', '3') for w in audit['keep'][lvl]}
    added = {'1': [], '2': [], '3': []}
    rejected = []
    for run in batch.get('words') or []:
        lvl = str((run.get('slot') or {}).get('lvl') or run.get('lvl') or '')
        proposals = [(w, lvl) for w in (run.get('keep') or [])]
        for mv in (run.get('move') or []):
            to = str(mv.get('to', '')).strip()[-1:]
            if to in ('1', '2', '3'):
                proposals.append((mv.get('word', ''), to))
        for raw, dest in proposals:
            w = str(raw or '').strip().lower()
            if dest not in ('1', '2', '3'):
                continue
            if not WORD_OK.match(w):
                rejected.append((w, 'shape')); continue
            # Every English word has a vowel. A dry-run batch slipped "zzz"
            # all the way through to content.js without this.
            if not re.search(r'[aeiouy]', w):
                rejected.append((w, 'no vowel')); continue
            if w in BANNED:
                rejected.append((w, 'banned')); continue
            if w in spoken_for:
                continue                      # already taught somewhere — fine
            spoken_for.add(w)
            added[dest].append(w)

    for lvl in ('1', '2', '3'):
        corpus['words'][lvl] = sorted(set(corpus['words'][lvl]) | set(added[lvl]))
        audit['keep'][lvl] = sorted(set(audit['keep'][lvl]) | set(added[lvl]))

    # ── sentences ────────────────────────────────────────────────────────
    sent_added = {'1': 0, '2': 0, '3': 0}
    for run in batch.get('sentences') or []:
        lvl = str(run.get('lvl') or '')
        if lvl not in ('1', '2', '3'):
            continue
        have = {s.lower() for s in corpus['sentences'][lvl]}
        for raw in (run.get('keep') or []):
            s = re.sub(r'\s+', ' ', str(raw or '')).strip()
            if sentence_ok(s) and s.lower() not in have:
                have.add(s.lower())
                corpus['sentences'][lvl].append(s)
                sent_added[lvl] += 1

    # ── stories ──────────────────────────────────────────────────────────
    story_added = {'1': 0, '2': 0, '3': 0}
    for run in batch.get('stories') or []:
        lvl = str(run.get('lvl') or '')
        if lvl not in ('1', '2', '3'):
            continue
        existing = []
        for raw in corpus['stories'][lvl]:
            existing.append(json.loads(raw) if isinstance(raw, str) else raw)
        titles = {str(st.get('title', '')).lower() for st in existing}
        for st in (run.get('stories') or []):
            title = re.sub(r'\s+', ' ', str(st.get('title', ''))).strip()
            lines = [re.sub(r'\s+', ' ', str(l)).strip() for l in (st.get('lines') or [])]
            if not title or title.lower() in titles:
                continue
            if not (3 <= len(lines) <= 5) or not all(sentence_ok(l) for l in lines):
                continue
            titles.add(title.lower())
            corpus['stories'][lvl].append({'title': title, 'lines': lines})
            story_added[lvl] += 1

    write_atomic('.work/corpus.json', corpus)
    write_atomic('.work/wordaudit.json', audit)

    print('words added   ' + '  '.join(f'L{l}=+{len(added[l])}' for l in '123'))
    print('sentences     ' + '  '.join(f'L{l}=+{sent_added[l]}' for l in '123'))
    print('stories       ' + '  '.join(f'L{l}=+{story_added[l]}' for l in '123'))
    print('allowlist now ' + '  '.join(f'L{l}={len(audit["keep"][l])}' for l in '123'))
    if rejected:
        print(f'{len(rejected)} rejected before the corpus: '
              + ', '.join(f'{w}({why})' for w, why in rejected[:12]))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
