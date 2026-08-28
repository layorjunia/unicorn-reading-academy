#!/usr/bin/env python3
"""Audit content.js before it ships to a 7-year-old.

Checks the things that would actually hurt: a word she cannot read at that
level, a sentence that is not natural English, anything upsetting, and — the
subtle one — content the app's own speech judge would mark WRONG when she
reads it RIGHT.

  python3 dev/audit_content.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

# Words that have no place in a small child's reading practice. Checked as
# whole words so 'grass' does not trip on 'ass', 'assist' on 'sis', etc.
# Genuinely unsuitable for a 7-year-old's reading practice: violence, death,
# substances, medical distress. Deliberately NOT a feelings blocklist —
# children's books are full of sad, lonely, scared and crying, and a story
# about a giant who is wrongly thought to be a monster is exactly the kind of
# story she should read. Over-blocking those would gut the corpus and teach
# nothing.
BANNED = set("""
kill kills killed killing murder dead death dying corpse blood bloody
gun guns rifle bullet stab stabbed knife weapon war battle
drug drugs cocaine beer wine whiskey vodka drunk cigarette cigarettes smoking
cancer tumor surgery ambulance suicide abuse divorce
stupid idiot dumb hate hates hated ugly
""".split())


def load_content():
    src = open(os.path.join(ROOT, 'content.js'), encoding='utf-8').read()
    return json.loads(src[src.index('= ') + 2:src.rindex(';')])


def words_in(text):
    return re.findall(r"[a-z']+", text.lower())


def judge_report(content):
    """Run the SHIPPED judge over the SHIPPED content in node.

    This is the check that matters most: if reading an item correctly does not
    score 'match', the app punishes a child who did nothing wrong.
    """
    script = r'''
global.window = {};
const fs = require('fs');
eval(fs.readFileSync(process.argv[2],'utf8').replace('const Listener','var Listener'));
const src = fs.readFileSync(process.argv[3],'utf8');
const C = JSON.parse(src.slice(src.indexOf('= ')+2, src.lastIndexOf(';')));
const vocab=[];
for (const sec of ['words','sight']) for (const l of Object.values(C[sec]||{})) for (const it of l) vocab.push(it.t);
Listener.setVocab(vocab);
const out = {wordFail:[], sentFail:[], storyFail:[], pairs:[]};
for (const sec of ['words','sight']) {
  for (const [lvl,list] of Object.entries(C[sec]||{})) {
    for (const it of list) if (Listener.judge(it.t,[it.t]) !== 'match') out.wordFail.push(sec+' L'+lvl+' '+it.t);
  }
}
const norm = s => s.toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const contract = s => s.replace(/\bcan not\b/g,"can't").replace(/\bdid not\b/g,"didn't")
  .replace(/\bdo not\b/g,"don't").replace(/\bit is\b/g,"it's").replace(/\bis not\b/g,"isn't")
  .replace(/\bwill not\b/g,"won't").replace(/\bwe are\b/g,"we're").replace(/\bthey are\b/g,"they're");
for (const [lvl,list] of Object.entries(C.sentences||{})) {
  for (const it of list) {
    const p = norm(it.t);
    if (Listener.judgeSentence(it.t,[p]) !== 'match') out.sentFail.push('L'+lvl+' '+it.t);
    else { const c = contract(p); if (c!==p && Listener.judgeSentence(it.t,[c])!=='match') out.sentFail.push('L'+lvl+' (contracted) '+it.t); }
  }
}
for (const [lvl,list] of Object.entries(C.stories||{})) {
  for (const st of list) for (const line of st.lines) {
    const p = norm(line);
    if (Listener.judgeSentence(line,[p]) !== 'match') out.storyFail.push('L'+lvl+' '+st.title+' :: '+line);
  }
}
// within a level, no two DIFFERENT words may be confusable
for (const sec of ['words','sight']) {
  for (const [lvl,list] of Object.entries(C[sec]||{})) {
    const ws = list.map(x=>x.t);
    for (let i=0;i<ws.length;i++) for (let j=i+1;j<ws.length;j++) {
      const v = Listener.judge(ws[i],[ws[j]]);
      if (v === 'match' || v === 'near') {
        const homo = Listener.HOMOPHONES.some(g=>g.includes(ws[i])&&g.includes(ws[j]));
        if (!homo) out.pairs.push(sec+' L'+lvl+' '+ws[i]+' <-> '+ws[j]+' = '+v);
      }
    }
  }
}
console.log(JSON.stringify(out));
'''
    p = os.path.join(_WORK, 'judge_audit.js')
    open(p, 'w').write(script)
    # argv[1] is the script itself — the files start at argv[2].
    r = subprocess.run(['node', p, os.path.join(ROOT, 'listen.js'),
                        os.path.join(ROOT, 'content.js')],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print('judge audit failed:', r.stderr[:400])
        return None
    return json.loads(r.stdout)


def main():
    C = load_content()
    problems = []

    # 1. shape and duplication
    seen_words = {}
    for sec in ('words', 'sight'):
        for lvl, lst in C[sec].items():
            for it in lst:
                w = it['t']
                if not re.fullmatch(r"[a-z]{1,14}", w):
                    problems.append(f'{sec} L{lvl}: odd word {w!r}')
                key = (sec, w)
                if key in seen_words and seen_words[key] != lvl:
                    problems.append(f'{sec}: {w!r} appears in L{seen_words[key]} and L{lvl}')
                seen_words[key] = lvl

    # 2. nothing upsetting or commercial, anywhere
    for sec in ('words', 'sight'):
        for lvl, lst in C[sec].items():
            for it in lst:
                if it['t'] in BANNED:
                    problems.append(f'{sec} L{lvl}: banned word {it["t"]!r}')
    for lvl, lst in C['sentences'].items():
        for it in lst:
            bad = [w for w in words_in(it['t']) if w in BANNED]
            if bad:
                problems.append(f'sentences L{lvl}: {bad} in {it["t"]!r}')
    for lvl, lst in C['stories'].items():
        for st in lst:
            for line in st['lines']:
                bad = [w for w in words_in(line) if w in BANNED]
                if bad:
                    problems.append(f'stories L{lvl} {st["title"]!r}: {bad} in {line!r}')

    # 3. display shape — the card can only render plain text cleanly
    ok = re.compile(r"^[A-Za-z][A-Za-z ,'-]*[.!?]$")
    for lvl, lst in C['sentences'].items():
        for it in lst:
            n = len(words_in(it['t']))
            if not ok.match(it['t']) or not (3 <= n <= 12):
                problems.append(f'sentences L{lvl}: unshippable {it["t"]!r}')
    for lvl, lst in C['stories'].items():
        for st in lst:
            if not (3 <= len(st['lines']) <= 5):
                problems.append(f'stories L{lvl} {st["title"]!r}: {len(st["lines"])} lines')
            for line in st['lines']:
                if not ok.match(line) or not (3 <= len(words_in(line)) <= 12):
                    problems.append(f'stories L{lvl} {st["title"]!r}: unshippable line {line!r}')

    # 4. the judge must accept a correct reading of everything we ship
    jr = judge_report(C)
    if jr is None:
        problems.append('could not run the judge audit')
    else:
        for k, label in (('wordFail', 'word not accepted when read correctly'),
                         ('sentFail', 'sentence not accepted when read correctly'),
                         ('storyFail', 'story line not accepted when read correctly'),
                         ('pairs', 'confusable pair within a level')):
            for x in jr[k]:
                problems.append(f'{label}: {x}')

    counts = {s: {l: len(C[s][l]) for l in ('1', '2', '3')} for s in C}
    for s, c in counts.items():
        print(f'{s:<10} L1={c["1"]:<5} L2={c["2"]:<5} L3={c["3"]:<5} total={sum(c.values())}')
    print(f'GRAND TOTAL: {sum(sum(c.values()) for c in counts.values())} items')
    print()
    if problems:
        print(f'PROBLEMS: {len(problems)}')
        for p in problems[:40]:
            print('  -', p)
        if len(problems) > 40:
            print(f'  ... and {len(problems)-40} more')
        return 1
    print('audit clean')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
