#!/usr/bin/env python3
"""Work out which level a word's SPELLING belongs to.

Mechanical, so a word's level is never a guess:

  L1  one syllable, short vowel, closed. Blends and digraphs are fine.
      NO silent e, NO vowel team, NO r-controlled vowel.
  L2  one syllable with a long or complex vowel: magic-e, a vowel team,
      an r-controlled vowel, or -igh/-ind/-old/-ild.
  L3  two or more syllables.

Familiarity is a SEPARATE test this file deliberately does not attempt —
"clink" is flawless Level 1 spelling and still has no business on a card.
"""
import re

VOWEL_TEAMS = ('eigh', 'ough', 'augh', 'igh', 'ai', 'ay', 'ea', 'ee', 'oa', 'oe',
               'oo', 'ou', 'ow', 'oi', 'oy', 'au', 'aw', 'ew', 'ue', 'ui', 'ie')
R_CONTROLLED = ('air', 'are', 'ear', 'eer', 'ire', 'oar', 'oor', 'ore', 'our',
                'ure', 'ar', 'er', 'ir', 'or', 'ur')
LONG_TAILS = ('ind', 'old', 'ild', 'olt', 'ost')


MAGIC_E = re.compile(r'[aeiou][bcdfgklmnpstvz]e$')
SIBILANT = ('s', 'z', 'x', 'c', 'ch', 'sh', 'ge', 'ce')


def syllables(w):
    """Count the syllables of a word from its spelling.

    Vowel groups get you most of the way, but three endings have to be peeled
    off first or every one of them adds a syllable that is not spoken:

      -es  is a syllable only after a sibilant: box-es, wish-es. In "chimes",
           "gloves" and "scarves" it is just a /z/.
      -ed  is a syllable only after t or d: want-ed, need-ed. In "swapped",
           "moved" and "searched" it is just a /t/ or /d/.
      -e   at the end after a consonant is silent: hedge, whale, scarve(s).
           EXCEPT in consonant-le, where it really is the second syllable:
           lit-tle, ta-ble, pur-ple.
    """
    w = w.lower()
    if w.endswith('es') and len(w) > 3 and not w[:-2].endswith(SIBILANT):
        w = w[:-1]                          # chimes -> chime, gloves -> glove
    if w.endswith('ed') and len(w) > 3 and w[-3] not in 'td':
        w = w[:-2]                          # swapped -> swapp, moved -> mov
        if re.search(r'[^aeiouy]l$', w):
            w += 'e'                        # crackl -> crackle, so -le counts
    consonant_le = bool(re.search(r'[^aeiouy]le$', w))
    if (w.endswith('e') and len(w) > 2 and not consonant_le
            and w[-2] not in 'aeiouy' and re.search(r'[aeiou]', w[:-1])):
        w = w[:-1]                          # hedge -> hedg, whale -> whal
    return max(1, len(re.findall(r'[aeiouy]+', w)))


def stem(word):
    """Strip a regular inflection and restore the base word's spelling.

    The LEVEL of an inflected word is the level of its stem: "moved" is the
    magic-e of "move", "chimes" the magic-e of "chime". Judging the inflected
    spelling directly loses that — the final e is gone, so it reads as a plain
    closed syllable and lands at Level 1.
    """
    w = word
    for suf in ('ing', 'es', 'ed', 's'):
        if w.endswith(suf) and len(w) - len(suf) >= 3:
            base = w[:-len(suf)]
            doubled = len(base) > 2 and base[-1] == base[-2] and base[-1] not in 'aeiousl'
            if doubled:
                base = base[:-1]                       # swapped -> swap
            # Restore the e that -ed/-es/-ing drops (move->moved, chime->chimes)
            # but NOT after a plain plural -s, or "bud"+"e" invents a magic e
            # and "buds" lands at Level 2. A DOUBLED consonant is the spelling's
            # own signal that the vowel is short, so no e was ever dropped there.
            if suf != 's' and not doubled and MAGIC_E.search(base + 'e'):
                return base + 'e'
            return base
    return w


def level_of(word):
    w = str(word or '').lower()
    if not re.fullmatch(r'[a-z]+', w):
        return None
    if syllables(w) >= 2:
        return '3'
    # One syllable: the vowel pattern of the STEM decides Level 1 vs Level 2.
    base = stem(w)
    if MAGIC_E.search(base):
        return '2'                                  # magic e: cake, home, cute
    for t in VOWEL_TEAMS:
        if t in base:
            return '2'
    for t in R_CONTROLLED:
        if t in base:
            return '2'
    if base.endswith(LONG_TAILS) and len(base) > 3:
        return '2'                                  # kind, cold, wild
    return '1'


if __name__ == '__main__':
    import sys
    for w in sys.argv[1:]:
        print(f'{w:<14} L{level_of(w)}  ({syllables(w)} syllable(s))')
