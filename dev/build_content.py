#!/usr/bin/env python3
"""Build content.js — everything Reading Star shows the child.

Four sources, merged and de-duplicated:

  words      the classic curriculum's graded word banks + an authored corpus
  sight      the Dolch sight-word lists (dev/sight_words.py)
  sentences  real story sentences from the classic app + an authored corpus
  stories    authored 3-5 line mini-stories, read one line at a time

A word gets an `a` field when the classic app already has a
transcription-verified human-checked recording of it, which powers the
optional "Hear it first" button. Everything else is display-only text, so the
app never has to synthesize speech.

  python3 dev/build_content.py [authored-corpus.json]
"""
import json
import os
import re
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'dev'))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

from sight_words import by_level as sight_by_level   # noqa: E402


def read(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()


# Bank filler that has no business on a practice card: non-words ('hup',
# 'bubby'), archaic or odd picks ('bane', 'bard', 'coo'), brand-ish words.
EXCLUDE = {'hup', 'bane', 'bard', 'coke', 'coo', 'bubby'}


def split_sentences(page):
    """Split a story page into sentences a child can read off a card.

    Splitting on sentence-enders alone tears quoted dialogue apart, leaving
    fragments with a dangling quote mark — `"Help!` or `I can not stop!"` —
    which look like a mistake on a big display card. So: keep a quoted span
    whole, and if a fragment still ends up unbalanced, drop the quote marks.
    """
    parts, buf, in_q = [], '', False
    for ch in page:
        buf += ch
        if ch == '"':
            in_q = not in_q
        elif ch in '.!?' and not in_q:
            parts.append(buf.strip())
            buf = ''
    if buf.strip():
        parts.append(buf.strip())

    out = []
    for p in parts:
        p = re.sub(r'^[",\s]+', '', p.strip())
        if p.count('"') % 2:
            p = p.replace('"', '')
        p = re.sub(r'\s+', ' ', p).strip()
        if p:
            out.append(p)
    return out


def classic_words():
    words = {1: set(), 2: set(), 3: set()}
    for lvl in (1, 2, 3):
        src = read(f'classic/js/curriculum-l{lvl}.js')
        for m in re.finditer(r"word:\s*'([a-z]+)'", src):
            words[lvl].add(m.group(1))
        for m in re.finditer(r"mastery:\s*\[([^\]]+)\]", src):
            for w in re.findall(r"'([a-z]+)'", m.group(1)):
                words[lvl].add(w)
    bank = read('classic/js/banks.js')
    for m in re.finditer(r"'(L(\d))-\d+'\s*:\s*\[([^\]]+)\]", bank):
        lvl = int(m.group(2))
        for w in re.findall(r"'([a-z]+):", m.group(3)):
            words[lvl].add(w)
    return words


def classic_sentences():
    def grab(src, get_level):
        out = []
        for sm in re.finditer(r"id:\s*'([A-Z0-9-]+)'", src):
            seg = src[sm.start():]
            pm = re.search(r"pages:\s*\[(.*?)\n\s*\],", seg, re.S)
            if not pm:
                continue
            lvl = get_level(sm.group(1), seg)
            for x in re.finditer(r"'((?:[^'\\]|\\.)*)'", pm.group(1)):
                for s in split_sentences(x.group(1).replace("\\'", "'")):
                    n = len(re.findall(r"[A-Za-z']+", s))
                    if 3 <= n <= 12:
                        out.append((lvl, s))
        return out

    sents = []
    for lvl in (1, 2, 3):
        sents += grab(read(f'classic/js/curriculum-l{lvl}.js'), lambda sid, seg, l=lvl: l)
    sents += grab(read('classic/js/storylib.js'),
                  lambda sid, seg: int((re.search(r"level:\s*(\d)", seg[:400]) or [None, '2'])[1]))
    return sents


CLEAN_SENT = re.compile(r"^[A-Za-z][A-Za-z ,'-]*[.!?]$")


def ok_sentence(s):
    """Only ship a sentence the app can display and judge cleanly."""
    s = s.strip()
    n = len(re.findall(r"[A-Za-z']+", s))
    return bool(CLEAN_SENT.match(s)) and 3 <= n <= 12


def main():
    authored = {}
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        authored = json.load(open(sys.argv[1]))

    man = json.load(open(os.path.join(ROOT, 'classic/audio/manifest.json')))

    def clip(w):
        f = man['words'].get(w)
        return 'classic/audio/' + f if f else None

    # ── words ────────────────────────────────────────────────────────────
    cw = classic_words()
    words = {}
    for lvl in (1, 2, 3):
        pool = set(cw[lvl])
        pool |= {w.lower().strip() for w in (authored.get('words', {}).get(str(lvl)) or [])}
        keep = sorted(w for w in pool
                      if re.fullmatch(r"[a-z]{3,12}", w) and w not in EXCLUDE)
        words[str(lvl)] = keep

    # a word introduced at an easier level should not reappear later
    seen = set()
    for lvl in ('1', '2', '3'):
        words[lvl] = [w for w in words[lvl] if w not in seen]
        seen |= set(words[lvl])

    # ── sight words ──────────────────────────────────────────────────────
    sight = sight_by_level()

    # ── sentences ────────────────────────────────────────────────────────
    sentences = {}
    cs = classic_sentences()
    for lvl in (1, 2, 3):
        pool, seen_s = [], set()
        for l, s in cs:
            if l == lvl and ok_sentence(s) and s.lower() not in seen_s:
                seen_s.add(s.lower())
                pool.append(s)
        for s in (authored.get('sentences', {}).get(str(lvl)) or []):
            s = re.sub(r'\s+', ' ', str(s)).strip()
            if ok_sentence(s) and s.lower() not in seen_s:
                seen_s.add(s.lower())
                pool.append(s)
        sentences[str(lvl)] = pool

    # ── stories ──────────────────────────────────────────────────────────
    stories = {}
    for lvl in ('1', '2', '3'):
        out, seen_t = [], set()
        for raw in (authored.get('stories', {}).get(lvl) or []):
            st = json.loads(raw) if isinstance(raw, str) else raw
            title = re.sub(r'\s+', ' ', str(st.get('title', ''))).strip()
            lines = [re.sub(r'\s+', ' ', str(l)).strip() for l in (st.get('lines') or [])]
            if not title or len(lines) < 3 or title.lower() in seen_t:
                continue
            if not all(ok_sentence(l) for l in lines):
                continue
            seen_t.add(title.lower())
            out.append({'title': title, 'lines': lines})
        stories[lvl] = out

    data = {
        'words': {l: [{'t': w, 'a': clip(w)} for w in words[l]] for l in ('1', '2', '3')},
        'sight': {l: [{'t': w, 'a': clip(w)} for w in sight[l]] for l in ('1', '2', '3')},
        'sentences': {l: [{'t': s} for s in sentences[l]] for l in ('1', '2', '3')},
        'stories': stories,
    }

    out = os.path.join(ROOT, 'content.js')
    with open(out, 'w', encoding='utf-8') as f:
        f.write('// Everything Reading Star shows the child.\n')
        f.write('// Generated by dev/build_content.py — do not hand-edit.\n')
        f.write('const CONTENT = ' + json.dumps(data, separators=(',', ':')) + ';\n')

    for sec in ('words', 'sight', 'sentences', 'stories'):
        counts = ' '.join(f'L{l}={len(data[sec][l])}' for l in ('1', '2', '3'))
        print(f'{sec:<10} {counts}')
    total = sum(len(data[s][l]) for s in data for l in ('1', '2', '3'))
    withclip = sum(1 for s in ('words', 'sight') for l in ('1', '2', '3')
                   for it in data[s][l] if it['a'])
    print(f'total items: {total} | words with a recording: {withclip}')
    print(f'wrote {out} ({os.path.getsize(out)/1024:.0f} KB)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
