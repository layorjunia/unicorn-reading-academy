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


GOLD = {
    # Every entry is "letters:kind" per marked span, spaces between spans,
    # kind one of t(eam) m(agic) s(ilent) or absent for a plain letter. These
    # are the cases a rule change is most likely to break, and each one is
    # here because it was wrong at some point.
    #
    # teams
    'ship': 'sh:t i p', 'boat': 'b oa:t t', 'night': 'n igh:t t',
    'farm': 'f ar:t m', 'queen': 'qu:t ee:t n', 'tree': 't r ee:t',
    'cloud': 'c l ou:t d',
    # magic e, and the exceptions that keep the silent e without the arc
    'cake': 'c a:m k e:s', 'ate': 'a:m t e:s', 'smile': 's m i:m l e:s',
    'nice': 'n i:m c e:s', 'have': 'h a v e:s', 'come': 'c o m e:s',
    'give': 'g i v e:s', 'love': 'l o v e:s', 'done': 'd o n e:s',
    # silent letters
    'knee': 'k:s n ee:t', 'write': 'w:s r i:m t e:s', 'lamb': 'l a m b:s',
    'thumb': 'th:t u m b:s', 'castle': 'c a s t:s le:t',
    'listen': 'l i s t:s e n', 'walk': 'w a l:s k', 'half': 'h a l:s f',
    'could': 'c ou:t l:s d', 'sign': 's i g:s n', 'answer': 'a n s w:s er:t',
    'often': 'o f t:s e n', 'two': 't w:s o', 'island': 'i s:s l a n d',
    # r-controlled families, which are NOT magic e
    'more': 'm ore:t', 'care': 'c are:t', 'fire': 'f ire:t',
    'store': 's t ore:t', 'here': 'h ere:t', 'there': 'th:t ere:t',
    'shared': 'sh:t are:t d', 'stores': 's t ore:t s',
    'scared': 's c are:t d',
    # consonant-le against magic e
    'little': 'l i t t le:t', 'table': 't a b le:t', 'purple': 'p ur:t p le:t',
    'whale': 'wh:t a:m l e:s', 'mile': 'm i:m l e:s', 'mule': 'm u:m l e:s',
    # the floss rule: a doubled consonant is one sound only at the end
    'bell': 'b e ll:t', 'miss': 'm i ss:t', 'off': 'o ff:t', 'buzz': 'b u zz:t',
    # the traps that must stay plain, or nearly so
    'story': 's t o r y', 'carry': 'c a r r y', 'parent': 'p a r e n t',
    'village': 'v i l l a g e:s', 'machine': 'm a ch:t i n e:s',
    'house': 'h ou:t s e:s', 'goose': 'g oo:t s e:s',
    'orange': 'o r a n g e:s', 'dance': 'd a n c e:s',
    'the': 'th:t e', 'he': 'h e', 'we': 'w e',
    'colored': 'c o l o r e d', 'discovered': 'd i s c o v e r e d',
    'number': 'n u m b er:t', 'bamboo': 'b a m b oo:t',

    # Every marking that a full-corpus verification pass found wrong and this
    # build fixed. They are here so the next rule change cannot quietly undo
    # one of them. Compound words are noted rather than listed, because GOLD
    # compares Mark.parts on the whole word and the split is checked already.
    'away': 'a w ay:t',
    'awesome': 'a w e s o m e:s',
    'beautiful': 'b eau:t t i f u l',
    'dangle': 'd a n g le:t',
    # fireworks splits fire|works
    'fluffiest': 'f l u f f i e s t',
    'funnier': 'f u n n i er:t',
    'funniest': 'f u n n i e s t',
    'happier': 'h a p p i er:t',
    'happiest': 'h a p p i e s t',
    'jingle': 'j i n g le:t',
    'jungle': 'j u n g le:t',
    'koala': 'k o a l a',
    'laugh': 'l au:t gh:t',
    'laughed': 'l au:t gh:t e d',
    'laughing': 'l au:t gh:t i ng:t',
    'luckiest': 'l u ck:t i e s t',
    'maybe': 'm ay:t b e',
    # myself splits my|self
    'necklace': 'n e ck:t l a c e:s',
    'package': 'p a ck:t a g e:s',
    'penguin': 'p e n g u i n',
    'prettier': 'p r e t t i er:t',
    'prettiest': 'p r e t t i e s t',
    'preview': 'p r e v iew:t',
    'puppet': 'p u p p e t',
    'recipe': 'r e c i p e',
    'rectangle': 'r e c t a n g le:t',
    'reward': 'r e w ar:t d',
    'rewind': 'r e w i n d',
    'rewrite': 'r e w:s r i t e:s',
    'shiniest': 'sh:t i n i e s t',
    'sillier': 's i l l i er:t',
    'silliest': 's i l l i e s t',
    'single': 's i n g le:t',
    'spaghetti': 's p a gh:t e t t i',
    'tangle': 't a n g le:t',
    'triangle': 't r i a n g le:t',
    'untangle': 'u n t a n g le:t',
    'unwrap': 'u n w:s r a p',
    'unwrapped': 'u n w:s r a p p e d',
    # uphill splits up|hill
    # upstairs splits up|stairs

    # Every marking the new-word batch introduced, after three independent
    # readers checked all 144 of them and the four they agreed on were fixed.
    'above': 'a b o v e:s',
    'across': 'a c r o ss:t',
    'along': 'a l o ng:t',
    'already': 'a l r ea:t d y',
    'another': 'a n o th:t er:t',
    'appeared': 'a p p ea:t r e d',
    'awake': 'a w a k e:s',
    'backward': 'b a ck:t w ar:t d',
    'beeping': 'b ee:t p i ng:t',
    'beneath': 'b e n ea:t th:t',
    'beside': 'b e s i d e:s',
    'between': 'b e t w ee:t n',
    'bill': 'b i ll:t',
    'blackberries': 'b l a ck:t b e r r i e s',
    'blew': 'b l ew:t',
    'borrow': 'b o r r ow:t',
    'breath': 'b r ea:t th:t',
    'built': 'b ui:t l t',
    'bushes': 'b u sh:t e s',
    'cardinal': 'c ar:t d i n a l',
    'careless': 'c a r e l e ss:t',
    'carried': 'c a r r ie:t d',
    'chimes': 'ch:t i m e s',
    'cloudless': 'c l ou:t d l e ss:t',
    'cluck': 'c l u ck:t',
    'color': 'c o l or:t',
    'coop': 'c oo:t p',
    # cornfield splits corn|field
    'cover': 'c o v er:t',
    'crackled': 'c r a ck:t l e d',
    'creaky': 'c r ea:t k y',
    'creeps': 'c r ee:t p s',
    'darted': 'd ar:t t e d',
    'ditch': 'd i tch:t',
    'dock': 'd o ck:t',
    # dragonfly splits dragon|fly
    'drawn': 'd r aw:t n',
    'drooping': 'd r oo:t p i ng:t',
    'during': 'd u r i ng:t',
    'ears': 'ear:t s',
    'edge': 'e d g e:s',
    'endless': 'e n d l e ss:t',
    'ever': 'e v er:t',
    # everybody splits every|body
    # everything splits every|thing
    'fell': 'f e ll:t',
    'field': 'f ie:t l d',
    'flickering': 'f l i ck:t e r i ng:t',
    'flicks': 'f l i ck:t s',
    'fluffier': 'f l u f f i er:t',
    'forgot': 'f or:t g o t',
    'forward': 'f or:t w ar:t d',
    'gathering': 'g a th:t e r i ng:t',
    'gone': 'g o n e:s',
    'goodbye': 'g oo:t d b y e',
    'grandmother': 'g r a n d m o th:t er:t',
    'hear': 'h ear:t',
    'heart': 'h ear:t t',
    'heavy': 'h ea:t v y',
    'hedge': 'h e d g e:s',
    # hedgehog splits hedge|hog
    'helpless': 'h e l p l e ss:t',
    'hung': 'h u ng:t',
    'hurried': 'h u r r ie:t d',
    'knelt': 'k:s n e l t',
    'knew': 'k:s n ew:t',
    # lamppost splits lamp|post
    'lavender': 'l a v e n d er:t',
    'leads': 'l ea:t d s',
    'leave': 'l ea:t v e:s',
    'loose': 'l oo:t s e:s',
    'love': 'l o v e:s',
    'magnifying': 'm a g n i f y i ng:t',
    'marshmallows': 'm ar:t sh:t m a l l ow:t s',
    'moat': 'm oa:t t',
    'monster': 'm o n s t er:t',
    'nature': 'n a t ure:t',
    # nightlight splits night|light
    'noisy': 'n oi:t s y',
    # notepad splits note|pad
    'oats': 'oa:t t s',
    'other': 'o th:t er:t',
    'partner': 'p ar:t t n er:t',
    # pathway splits path|way
    'pecks': 'p e ck:t s',
    'peeked': 'p ee:t k e d',
    'peep': 'p ee:t p',
    'perfect': 'p er:t f e c t',
    'pieces': 'p ie:t c e s',
    'pour': 'p our:t',
    'practice': 'p r a c t i c e:s',
    'punch': 'p u n ch:t',
    'push': 'p u sh:t',
    'rack': 'r a ck:t',
    'ready': 'r ea:t d y',
    'restless': 'r e s t l e ss:t',
    'rise': 'r i:m s e:s',
    'rode': 'r o:m d e:s',
    'rumble': 'r u m b le:t',
    'sandwich': 's a n d w i ch:t',
    'scarves': 's c ar:t v e s',
    'searched': 's ear:t ch:t e d',
    'seedless': 's ee:t d l e ss:t',
    'seek': 's ee:t k',
    'shady': 'sh:t a d y',
    'shallow': 'sh:t a l l ow:t',
    'shivering': 'sh:t i v e r i ng:t',
    'shone': 'sh:t o:m n e:s',
    'shoot': 'sh:t oo:t t',
    # shoreline splits shore|line
    'should': 'sh:t ou:t l:s d',
    'shoulders': 'sh:t ou:t l d er:t s',
    'shovel': 'sh:t o v e l',
    # sideways splits side|ways
    'sleeveless': 's l ee:t v e l e ss:t',
    'slick': 's l i ck:t',
    'sneakers': 's n ea:t k er:t s',
    'sparrow': 's p a r r ow:t',
    'speckled': 's p e ck:t l e d',
    'spotless': 's p o t l e ss:t',
    'steep': 's t ee:t p',
    'stray': 's t r ay:t',
    # sunrise splits sun|rise
    'supper': 's u p p er:t',
    'swooped': 's w oo:t p e d',
    'taught': 't augh:t t',
    'through': 'th:t r ough:t',
    'thumped': 'th:t u m p e d',
    'tick': 't i ck:t',
    'tide': 't i:m d e:s',
    'till': 't i ll:t',
    'toward': 't o w ar:t d',
    'tricky': 't r i ck:t y',
    'undone': 'u n d o n e:s',
    # upside splits up|side
    'useless': 'u s e l e ss:t',
    'wearing': 'w ea:t r i ng:t',
    'whispering': 'wh:t i s p e r i ng:t',
    'whole': 'w:s h o:m l e:s',
    'willow': 'w i l l ow:t',
    'wooden': 'w oo:t d e n',
    'wriggled': 'w:s r i g g l e d',
    'wrinkly': 'w:s r i nk:t l y',
    'yesterday': 'y e s t er:t d ay:t',
}


def mark_report():
    """Check the letter marking the child actually sees.

    A wrong underline teaches a wrong sound, so this runs the SHIPPED mark.js
    over the SHIPPED words and fails on: a mark that loses or invents letters,
    a team invented across a compound join, magic-e claimed where the vowel is
    not long, any GOLD case that has drifted, and a Key screen example that no
    longer demonstrates the mark it claims to.
    """
    script = r"""
const fs = require('fs');
eval(fs.readFileSync(process.argv[2],'utf8').replace('const Mark','var Mark'));
const src = fs.readFileSync(process.argv[3],'utf8');
const C = JSON.parse(src.slice(src.indexOf('= ')+2, src.lastIndexOf(';')));
const uniq = [...new Set([].concat(...['words','sight'].map(s=>['1','2','3'].map(l=>C[s][l].map(i=>i.t))).flat().flat()))];
Mark.setVocab(new Set(uniq));
const GOLD = JSON.parse(process.argv[4]);
const strip = h => h.replace(/<[^>]+>/g,'');
const sig = w => Mark.parts(w).map(p => p.kind ? p.t+':'+p.kind[0] : p.t).join(' ');
const out = {lost: [], straddle: [], magic: [], gold: [], keyrow: [], coverage: {}};
for (const w of uniq) {
  if (strip(Mark.html(w)) !== w) out.lost.push(w);
  // Check what html() ACTUALLY renders. For a compound it marks each half
  // separately, so a team cannot cross the join — verify that rather than
  // re-deriving spans from the whole word, which is not the shipped path.
  const comp = Mark.compound(w);
  if (comp) {
    const halves = Mark.html(w).split('<span class="syl2">');
    if (halves.length !== 2) out.straddle.push(w+':structure');
    else if (strip(halves[0]).replace(/^.*?>/,'') && strip(halves[0]).length !== comp[0].length)
      out.straddle.push(w+':split '+strip(halves[0])+'|'+strip(halves[1]));
  }
  // magic-e must only ever appear on a one-syllable chunk
  for (const chunk of (comp || [w])) {
    const groups = (chunk.slice(0,-1).match(/[aeiouy]+/g) || []).length;
    if (Mark.parts(chunk).some(p => p.kind === 'magic') && groups > 1) out.magic.push(chunk);
  }
}
for (const [w, want] of Object.entries(GOLD)) {
  const got = sig(w);
  if (got !== want) out.gold.push(w+' :: want ['+want+'] got ['+got+']');
}
// Every row of the in-app key must really show the mark it names, or the
// screen that teaches her the code is itself lying.
const NEED = {team:'team', magic:'magic', silent:'silent', parts:'syl2'};
for (const [word, kind] of [['ship','team'],['cake','magic'],['knee','silent'],['sunset','parts']]) {
  if (!Mark.html(word).includes('class="'+NEED[kind]+'"')) out.keyrow.push(word+' no longer shows '+kind);
}
// magic-e is drawn as an arc under one wrapper spanning the vowel to the e
if (!/<span class="mgroup">/.test(Mark.html('cake'))) out.keyrow.push('cake has no magic-e arc wrapper');
for (const lvl of ['1','2','3']) {
  const ws = [...new Set([].concat(C.words[lvl].map(i=>i.t), C.sight[lvl].map(i=>i.t)))];
  const m = ws.filter(w => /class="(team|magic|silent|syl2)"/.test(Mark.html(w))).length;
  out.coverage[lvl] = [m, ws.length];
}
console.log(JSON.stringify(out));
"""
    path = os.path.join(_WORK, 'mark_audit.js')
    open(path, 'w').write(script)
    r = subprocess.run(['node', path, os.path.join(ROOT, 'mark.js'),
                        os.path.join(ROOT, 'content.js'), json.dumps(GOLD)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        return {'error': r.stderr[:300]}
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

    mr = mark_report()
    if 'error' in mr:
        problems.append('mark audit failed: ' + mr['error'])
    else:
        for w in mr['lost']:
            problems.append(f'marking loses letters: {w}')
        for x in mr['straddle']:
            problems.append(f'letter team invented across a compound join: {x}')
        for w in mr['magic']:
            problems.append(f'magic-e on a multi-syllable chunk: {w}')
        for x in mr['gold']:
            problems.append(f'marking drifted from the agreed answer: {x}')
        for x in mr['keyrow']:
            problems.append(f'the in-app key no longer matches the marker: {x}')
        cov = mr.get('coverage') or {}
        if cov:
            bits = ' '.join(f'L{l}={cov[l][0]}/{cov[l][1]}' for l in ('1', '2', '3'))
            tot_m = sum(cov[l][0] for l in cov)
            tot_n = sum(cov[l][1] for l in cov)
            print(f'marks shown  {bits}  ({tot_m}/{tot_n} = {tot_m/max(1,tot_n)*100:.0f}% of words)')

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
