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


def syllables(w):
    """Count vowel groups, which is close enough for the one- and two-syllable
    words this app ships.

    The only subtlety is the final e. Drop it when it is a MAGIC e (whale,
    smile, mule) because it is not a syllable of its own; keep it when the
    word ends in consonant-le (little, table, purple) because there it IS the
    second syllable. Adding a flat +1 for consonant-le instead double-counted
    the e that was already in the group list.
    """
    w = w.lower()
    core = w[:-1] if MAGIC_E.search(w) else w
    return max(1, len(re.findall(r'[aeiouy]+', core)))


def level_of(word):
    w = str(word or '').lower()
    if not re.fullmatch(r'[a-z]+', w):
        return None
    if syllables(w) >= 2:
        return '3'
    # one syllable from here
    if re.search(r'[aeiou][bcdfgklmnpstvz]e$', w):
        return '2'                                  # magic e: cake, home, cute
    for t in VOWEL_TEAMS:
        if t in w:
            return '2'
    for t in R_CONTROLLED:
        if t in w:
            return '2'
    if w.endswith(LONG_TAILS) and len(w) > 3:
        return '2'                                  # kind, cold, wild
    return '1'


if __name__ == '__main__':
    import sys
    for w in sys.argv[1:]:
        print(f'{w:<14} L{level_of(w)}  ({syllables(w)} syllable(s))')
