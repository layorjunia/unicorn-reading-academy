#!/usr/bin/env python3
"""The Dolch sight-word lists — the ~300 words that make up over half of
everything a child reads.

Most cannot be sounded out ("said", "could", "one"), which is exactly why they
are learned by sight and why they belong in a read-aloud app: recognising them
instantly is what turns decoding into reading.

Grouped into the app's three levels by the grade band they are taught in.
"""

PRE_PRIMER = """a and away big blue can come down find for funny go help here I
in is it jump little look make me my not one play red run said see the three to
two up we where yellow you""".split()

PRIMER = """all am are at ate be black brown but came did do eat four get good
have he into like must new no now on our out please pretty ran ride saw say she
so soon that there they this too under want was well went what white who will
with yes""".split()

GRADE_1 = """after again an any as ask by could every fly from give going had has
her him his how just know let live may of old once open over put round some stop
take thank them then think walk were when""".split()

GRADE_2 = """always around because been before best both buy call cold does fast
first five found gave goes green its made many off or pull read right sing sit
sleep tell their these those upon us use very wash which why wish work would
write your""".split()

GRADE_3 = """about better bring carry clean cut done draw drink eight fall far
full got grow hold hot if keep kind laugh light long much myself never only own
pick seven shall show six small start ten today together try warm""".split()

# Dolch nouns — concrete, picturable, and useful in early sentences.
NOUNS = """apple baby back ball bear bed bell bird birthday boat box boy bread
brother cake car cat chair chicken children coat corn cow day dog doll door duck
egg eye farm farmer father feet fire fish floor flower game garden girl grass
hand head hill home horse house kitty leg letter man men milk money morning
mother name nest night paper party picture pig rabbit rain ring robin school
seed sheep shoe sister snow song squirrel stick street sun table thing time top
toy tree watch water way wind window wood""".split()


def by_level():
    """Level 1 = the first words taught; Level 3 = the last, plus the nouns."""
    l1 = PRE_PRIMER + PRIMER
    l2 = GRADE_1 + GRADE_2
    l3 = GRADE_3 + NOUNS
    out = {}
    for lvl, words in (('1', l1), ('2', l2), ('3', l3)):
        seen, keep = set(), []
        for w in words:
            k = w.lower()
            if k not in seen:
                seen.add(k)
                keep.append(k)
        out[lvl] = sorted(keep)
    # a word taught early should not reappear at a later level
    for later in ('2', '3'):
        earlier = set(sum((out[e] for e in ('1', '2') if e < later), []))
        out[later] = [w for w in out[later] if w not in earlier]
    return out


if __name__ == '__main__':
    d = by_level()
    for lvl in ('1', '2', '3'):
        print(f'L{lvl}: {len(d[lvl])} sight words')
    print('total:', sum(len(v) for v in d.values()))
