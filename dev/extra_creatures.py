#!/usr/bin/env python3
"""New creature friends, drawn to match the 28 hand-drawn originals.

The classic app had 28 characters and they were all we had. This module adds
more so the collection keeps going: same 100x100 viewBox, same pastel-fill +
darker-outline look, same big eyes with a highlight, blush, and a sparkle or
two floating nearby.

Shared parts (eyes, blush, sparkles, the sitting-critter chassis) are helpers
so each creature only spells out what makes it ITSELF — the ears, the tail,
the pattern. That is what keeps thirty-odd of them from turning into thirty
recolours of one drawing.

Nothing here is hand-edited into creatures.js; dev/build_creatures.py imports
this module and writes the file.
"""

DARK = '#3f2b57'


# ── shared bits ──────────────────────────────────────────────────────────

def sparkle(x, y, s, c='#ffd93d'):
    """The little four-point twinkle that floats beside every character."""
    k = s * 0.3
    return (f'<path d="M{x} {y-s}Q{x+k} {y-k} {x+s} {y}Q{x+k} {y+k} {x} {y+s}'
            f'Q{x-k} {y+k} {x-s} {y}Q{x-k} {y-k} {x} {y-s}Z" fill="{c}"/>')


def eyes(y, dx=9, cx=50, rx=4.7, ry=5.5, dark=DARK):
    x1, x2 = cx - dx, cx + dx
    return (f'<g fill="{dark}"><ellipse cx="{x1}" cy="{y}" rx="{rx}" ry="{ry}"/>'
            f'<ellipse cx="{x2}" cy="{y}" rx="{rx}" ry="{ry}"/></g>'
            f'<g fill="#fff"><circle cx="{x1-1.3}" cy="{y-2.2}" r="{round(rx*0.42,2)}"/>'
            f'<circle cx="{x2-1.3}" cy="{y-2.2}" r="{round(rx*0.42,2)}"/>'
            f'<circle cx="{x1+1.7}" cy="{y+2.3}" r="{round(rx*0.2,2)}"/>'
            f'<circle cx="{x2+1.7}" cy="{y+2.3}" r="{round(rx*0.2,2)}"/></g>')


def happy_eyes(y, dx=9, cx=50, w=4.6, c=DARK):
    """Closed, upturned eyes — for the sleepy and the delighted."""
    x1, x2 = cx - dx, cx + dx
    return (f'<g fill="none" stroke="{c}" stroke-width="2.6" stroke-linecap="round">'
            f'<path d="M{x1-w} {y}q{w} -{w} {w*2} 0"/>'
            f'<path d="M{x2-w} {y}q{w} -{w} {w*2} 0"/></g>')


def blush(y, dx=16, cx=50, rx=4.6, ry=3.5, c='#ff6fa5', op='.32'):
    x1, x2 = cx - dx, cx + dx
    return (f'<g fill="{c}" opacity="{op}"><ellipse cx="{x1}" cy="{y}" rx="{rx}" ry="{ry}"/>'
            f'<ellipse cx="{x2}" cy="{y}" rx="{rx}" ry="{ry}"/></g>')


def smile(y, cx=50, w=4.5, c='#c9709e', sw=2.1):
    return (f'<path d="M{cx-w} {y}q{w} {w*0.85} {w*2} 0" fill="none" stroke="{c}" '
            f'stroke-width="{sw}" stroke-linecap="round"/>')


def cat_mouth(y, cx=50, c='#c9709e'):
    """The little w-shaped mouth under a round nose."""
    return (f'<path d="M{cx} {y}v1.6m0 0q-1.1 2.6 -4 1.9m4 -1.9q1.1 2.6 4 1.9" '
            f'fill="none" stroke="{c}" stroke-width="1.7" stroke-linecap="round"/>')


def nose(y, cx=50, w=3.2, c='#ff7fae', line='#c9709e'):
    return (f'<path d="M{cx-w} {y-w*0.55}q{w} -{w*0.75} {w*2} 0q-{w*0.55} {w*1.5} -{w} {w*1.5}'
            f'q-{w*0.45} 0 -{w} -{w*1.5}Z" fill="{c}" stroke="{line}" stroke-width="1.2" '
            f'stroke-linejoin="round"/>')


def grad(gid, top, bottom):
    return (f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/>'
            f'</linearGradient>')


def rgrad(gid, inner, outer):
    return (f'<radialGradient id="{gid}" cx="34%" cy="26%" r="82%">'
            f'<stop offset="0" stop-color="{inner}"/><stop offset="1" stop-color="{outer}"/>'
            f'</radialGradient>')


def critter(key, light, deep, line, belly, *, ears='', tail='', behind='', front='',
            head_r=23, head_y=36, paws=None):
    """A sitting animal: tail, feet, arms, body, belly, ears, head.

    Drawn back-to-front so the ears tuck behind the head and the arms behind
    the body, which is what makes it read as one creature rather than a pile
    of shapes.
    """
    paws = paws or belly
    return (
        f'{tail}{behind}'
        f'<g stroke="{line}" stroke-width="2.2" stroke-linejoin="round">'
        f'<ellipse cx="38" cy="91" rx="8.6" ry="5.6" fill="{light}"/>'
        f'<ellipse cx="62" cy="91" rx="8.6" ry="5.6" fill="{light}"/>'
        f'<ellipse cx="27" cy="72" rx="6.2" ry="8.6" fill="{light}"/>'
        f'<ellipse cx="73" cy="72" rx="6.2" ry="8.6" fill="{light}"/>'
        f'<ellipse cx="50" cy="70" rx="25" ry="22" fill="url(#{key}-b)"/>'
        f'</g>'
        f'<ellipse cx="50" cy="76" rx="15.5" ry="13" fill="{belly}"/>'
        f'<g fill="{paws}"><ellipse cx="38" cy="91.4" rx="3.6" ry="2.3"/>'
        f'<ellipse cx="62" cy="91.4" rx="3.6" ry="2.3"/></g>'
        f'{ears}'
        f'<circle cx="50" cy="{head_y}" r="{head_r}" fill="url(#{key}-b)" '
        f'stroke="{line}" stroke-width="2.2"/>'
        f'{front}'
    )


def ear_pair(shape, fill, line, inner=None, inner_shape=None, sw=2.2):
    out = (f'<g fill="{fill}" stroke="{line}" stroke-width="{sw}" stroke-linejoin="round">'
           f'{shape}</g>')
    if inner and inner_shape:
        out += f'<g fill="{inner}">{inner_shape}</g>'
    return out


# ── the cast ─────────────────────────────────────────────────────────────
# Each entry is (key, name, cheer, defs, body). Order here is the order she
# meets them, deliberately alternating fluffy / sea / bug / magical so two
# similar friends never arrive back to back.

NEW = []


def add(key, name, cheer, defs, body):
    NEW.append({'k': key, 'n': name, 'c': cheer, 'defs': defs, 'body': body})


# ---- Fern the fox --------------------------------------------------------
add('fern', 'Fern', 'You are as clever as a fox!',
    grad('fern-b', '#ffd2aa', '#f2914c'),
    ('<path d="M70 80C87 80 95 66 90 53" fill="none" stroke="#d4703a" stroke-width="18" '
     'stroke-linecap="round"/>'
     '<path d="M70 80C87 80 95 66 90 53" fill="none" stroke="#f7ac6d" stroke-width="13.5" '
     'stroke-linecap="round"/>'
     '<circle cx="90" cy="53" r="7.2" fill="#fff6ec" stroke="#d4703a" stroke-width="2"/>'
     + critter('fern', '#f7ac6d', '#f2914c', '#d4703a', '#fff1e0',
               ears=(ear_pair('<path d="M32 20C27 7 31 4 36 7.5C41 11 45.5 16 47.5 20.5Z"/>'
                              '<path d="M68 20C73 7 69 4 64 7.5C59 11 54.5 16 52.5 20.5Z"/>',
                              '#f7ac6d', '#d4703a', '#ffd9c2',
                              '<path d="M34.6 18.4C32.2 10.4 34 8.8 36.8 10.8C39.6 12.8 42 16 43.2 19Z"/>'
                              '<path d="M65.4 18.4C67.8 10.4 66 8.8 63.2 10.8C60.4 12.8 58 16 56.8 19Z"/>')),
               front=('<ellipse cx="50" cy="46" rx="13.5" ry="9.6" fill="#fff6ec"/>'
                      + eyes(34) + blush(43, 17.5, c='#ff8a6a')
                      + nose(42.5, c='#4b3357', line='#4b3357')
                      + cat_mouth(45.5, c='#b2775c')))
     + sparkle(14, 26, 4.2) + sparkle(87, 20, 3.2, '#8fd3ff')))

# ---- Prickle the hedgehog ------------------------------------------------
add('prickle', 'Prickle', 'Sharp reading, my friend!',
    grad('prickle-b', '#f0d9bd', '#d9b183'),
    ('<g fill="#8d6b52" stroke="#6d5140" stroke-width="2" stroke-linejoin="round">'
     '<path d="M50 24C24 24 10 44 12 66C13 80 26 88 50 88C74 88 87 80 88 66C90 44 76 24 50 24Z"/>'
     '</g>'
     '<g fill="#a5805f">'
     '<path d="M22 44l-9-9 12 3zM30 33l-6-11 11 7zM45 27l-2-13 8 11zM58 28l4-12 4 12z'
     'M71 34l9-9-3 12zM80 46l12-5-9 10zM16 58l-12 0 11-6zM86 58l12 1-11 5z"/></g>'
     '<g stroke="#c99f6f" stroke-width="2.2" stroke-linejoin="round">'
     '<ellipse cx="34" cy="86" rx="7.6" ry="5" fill="#f0d9bd"/>'
     '<ellipse cx="66" cy="86" rx="7.6" ry="5" fill="#f0d9bd"/></g>'
     '<path d="M50 44C34 44 26 54 26 64C26 76 37 84 50 84C63 84 74 76 74 64C74 54 66 44 50 44Z" '
     'fill="url(#prickle-b)" stroke="#c99f6f" stroke-width="2.2"/>'
     + eyes(60, 9.5) + blush(69, 17, c='#ff6fa5')
     + '<ellipse cx="50" cy="72" rx="4.4" ry="3.4" fill="#4b3357"/>'
     + smile(78, w=4.2, c='#b08a63')
     + sparkle(88, 26, 4, '#ffd93d') + sparkle(12, 24, 3, '#ff8fc7')))

# ---- Cuddle the koala ----------------------------------------------------
add('cuddle', 'Cuddle', 'Come read with me in my tree!',
    grad('cuddle-b', '#dcd7e8', '#b3aec6'),
    (critter('cuddle', '#c9c3da', '#b3aec6', '#8b85a4', '#f2eff8',
             ears=('<g fill="#c9c3da" stroke="#8b85a4" stroke-width="2.2">'
                   '<circle cx="26" cy="28" r="12"/><circle cx="74" cy="28" r="12"/></g>'
                   '<g fill="#fff" opacity=".75"><circle cx="26" cy="28" r="7.5"/>'
                   '<circle cx="74" cy="28" r="7.5"/></g>'),
             front=(eyes(35, 9.5)
                    + '<ellipse cx="50" cy="46" rx="8" ry="6.6" fill="#5b5470" '
                      'stroke="#453f58" stroke-width="1.6"/>'
                    + '<ellipse cx="47.4" cy="44" rx="2.4" ry="1.7" fill="#fff" opacity=".5"/>'
                    + blush(44, 18)
                    + smile(54, w=4, c='#8b85a4')))
     + sparkle(16, 62, 3.6, '#7fe3c4') + sparkle(88, 46, 4, '#ffd93d')))

# ---- Doze the sloth ------------------------------------------------------
add('doze', 'Doze', 'Slow reading is good reading!',
    grad('doze-b', '#e3cdb0', '#c2a179'),
    (critter('doze', '#d5bb9a', '#c2a179', '#9a7c58', '#f4e8d8',
             front=('<ellipse cx="50" cy="40" rx="17" ry="15" fill="#f7ecdc"/>'
                    '<g fill="#7d6247"><ellipse cx="40" cy="33" rx="6.6" ry="7.6" '
                    'transform="rotate(-14 40 33)"/>'
                    '<ellipse cx="60" cy="33" rx="6.6" ry="7.6" transform="rotate(14 60 33)"/></g>'
                    + happy_eyes(34, 9, c='#4b3357')
                    + '<ellipse cx="50" cy="43" rx="4" ry="3" fill="#4b3357"/>'
                    + smile(47.5, w=4.4, c='#9a7c58')
                    + blush(45, 17.5)))
     + '<g fill="none" stroke="#9a7c58" stroke-width="2.4" stroke-linecap="round">'
       '<path d="M22 66q-6 4 -8 10M78 66q6 4 8 10"/></g>'
     + sparkle(86, 24, 3.4, '#b28fff') + sparkle(15, 30, 3, '#8fd3ff')))

# ---- Mochi the mouse -----------------------------------------------------
add('mochi', 'Mochi', 'Squeak! That was lovely!',
    grad('mochi-b', '#f4e4ef', '#dcc3d6'),
    ('<path d="M74 82C90 84 94 72 88 64" fill="none" stroke="#c093b6" stroke-width="4.5" '
     'stroke-linecap="round"/>'
     + critter('mochi', '#eddaea', '#dcc3d6', '#c093b6', '#fdf6fb',
               ears=('<g fill="#eddaea" stroke="#c093b6" stroke-width="2.2">'
                     '<circle cx="27" cy="24" r="12.5"/><circle cx="73" cy="24" r="12.5"/></g>'
                     '<g fill="#ffbcd8"><circle cx="27" cy="24" r="8"/>'
                     '<circle cx="73" cy="24" r="8"/></g>'),
               front=(eyes(35, 8.5, rx=4.4, ry=5.2) + blush(44, 16.5)
                      + '<ellipse cx="50" cy="45" rx="3.4" ry="2.7" fill="#ff7fae"/>'
                      + cat_mouth(47.5)
                      + '<g stroke="#c093b6" stroke-width="1.5" stroke-linecap="round">'
                        '<path d="M36 45h-11M36 48l-10 3M64 45h11M64 48l10 3"/></g>'))
     + sparkle(15, 32, 3.6, '#ffd93d') + sparkle(87, 34, 3, '#7fe3c4')))

# ---- Bandit the raccoon --------------------------------------------------
add('bandit', 'Bandit', 'I sneaked over to hear that!',
    grad('bandit-b', '#d6dbe6', '#a9b1c4'),
    ('<path d="M72 82C88 82 94 70 90 58" fill="none" stroke="#6f7893" stroke-width="15" '
     'stroke-linecap="round"/>'
     '<g fill="none" stroke="#d6dbe6" stroke-width="4.5" stroke-linecap="round">'
     '<path d="M78 81.5q4 -1 7 -3.5M87 74q3 -4 3.6 -8"/></g>'
     + critter('bandit', '#c2c9d8', '#a9b1c4', '#6f7893', '#f0f2f7',
               ears=(ear_pair('<path d="M30 20C26 9 30 6 35 9.5C40 13 44 17 46 21Z"/>'
                              '<path d="M70 20C74 9 70 6 65 9.5C60 13 56 17 54 21Z"/>',
                              '#c2c9d8', '#6f7893', '#ffd0e2',
                              '<path d="M33 18.6C30.8 11.4 33 10 35.6 12C38.2 14 40.4 16.8 41.6 19.4Z"/>'
                              '<path d="M67 18.6C69.2 11.4 67 10 64.4 12C61.8 14 59.6 16.8 58.4 19.4Z"/>')),
               front=('<path d="M28 32C34 26 43 25 50 25C57 25 66 26 72 32C70 40 63 44 50 44'
                      'C37 44 30 40 28 32Z" fill="#4b4f63"/>'
                      '<ellipse cx="50" cy="46" rx="12" ry="9" fill="#fbfaff"/>'
                      + eyes(33.5, 9.5, rx=4.9, ry=5.6, dark='#2b2c3c')
                      + blush(45, 18)
                      + '<ellipse cx="50" cy="43" rx="3.8" ry="3" fill="#2b2c3c"/>'
                      + cat_mouth(46, c='#8b8fa6')))
     + sparkle(14, 28, 3.8, '#ffd93d') + sparkle(20, 12, 2.8, '#ff8fc7')))

# ---- Peaches the hamster -------------------------------------------------
add('peaches', 'Peaches', 'I filled my cheeks with your words!',
    grad('peaches-b', '#ffe6bd', '#f0bf78'),
    (critter('peaches', '#ffd9a2', '#f0bf78', '#cf9a4f', '#fff5e4',
             ears=('<g fill="#ffd9a2" stroke="#cf9a4f" stroke-width="2.2">'
                   '<circle cx="31" cy="21" r="8.5"/><circle cx="69" cy="21" r="8.5"/></g>'
                   '<g fill="#ffb9c9"><circle cx="31" cy="21" r="5"/>'
                   '<circle cx="69" cy="21" r="5"/></g>'),
             front=('<g fill="#ffeacb" stroke="#cf9a4f" stroke-width="2">'
                    '<ellipse cx="30" cy="45" rx="9" ry="8"/>'
                    '<ellipse cx="70" cy="45" rx="9" ry="8"/></g>'
                    '<ellipse cx="50" cy="46" rx="11" ry="8.4" fill="#fff5e4"/>'
                    + eyes(34, 8.8) + blush(48, 20, c='#ff6fa5', op='.35')
                    + '<ellipse cx="50" cy="43.5" rx="3.4" ry="2.6" fill="#c9709e"/>'
                    + cat_mouth(46)))
     + '<circle cx="17" cy="72" r="5" fill="#a7d98a" stroke="#79b163" stroke-width="2"/>'
     + sparkle(86, 30, 4, '#ffd93d')))

# ---- Rusty the red panda -------------------------------------------------
add('rusty', 'Rusty', 'You climbed to the top of that page!',
    grad('rusty-b', '#f0a878', '#cf6f42'),
    ('<path d="M72 84C90 84 95 70 90 58" fill="none" stroke="#a45733" stroke-width="15" '
     'stroke-linecap="round"/>'
     '<g fill="none" stroke="#f7d3ae" stroke-width="4.5" stroke-linecap="round">'
     '<path d="M79 83.5q4 -0.6 7 -2.6M88.5 76q2.6 -4 2.6 -8.6"/></g>'
     + critter('rusty', '#eda173', '#cf6f42', '#a45733', '#f7d3ae',
               paws='#e2b68d',
               ears=('<g fill="#f7d3ae" stroke="#a45733" stroke-width="2.2" stroke-linejoin="round">'
                     '<path d="M29 22C25 10 30 7 36 11C40 14 44 18 46 22Z"/>'
                     '<path d="M71 22C75 10 70 7 64 11C60 14 56 18 54 22Z"/></g>'),
               front=('<path d="M50 25C40 25 32 29 29 36C33 44 40 48 50 48C60 48 67 44 71 36'
                      'C68 29 60 25 50 25Z" fill="#fdf1e2"/>'
                      '<g fill="#cf6f42"><path d="M39 27q-4 8 -3 16q-4 -6 -5 -12Z"/>'
                      '<path d="M61 27q4 8 3 16q4 -6 5 -12Z"/></g>'
                      + eyes(35, 9.5, rx=4.9, ry=5.6) + blush(44, 18)
                      + '<ellipse cx="50" cy="44" rx="3.8" ry="3" fill="#3b2e29"/>'
                      + cat_mouth(47, c='#a45733')))
     + sparkle(13, 34, 4, '#7fe3c4') + sparkle(88, 24, 3.2, '#ffd93d')))

# ---- Roary the lion cub --------------------------------------------------
add('roary', 'Roary', 'Roar! Read it loud and proud!',
    grad('roary-b', '#ffdf9e', '#efb457'),
    (critter('roary', '#ffd88e', '#efb457', '#cf8f34', '#fff4dd',
             behind='<circle cx="50" cy="36" r="31" fill="#e29a3f"/>'
                    '<g fill="#f5b45c"><circle cx="50" cy="36" r="28"/></g>',
             ears=('<g fill="#ffd88e" stroke="#cf8f34" stroke-width="2.2">'
                   '<circle cx="30" cy="22" r="8"/><circle cx="70" cy="22" r="8"/></g>'),
             front=('<ellipse cx="50" cy="45" rx="13" ry="9.6" fill="#fff4dd"/>'
                    + eyes(34, 9) + blush(43, 18)
                    + nose(42.5, c='#e08aa6', line='#c9709e')
                    + cat_mouth(46)))
     + sparkle(88, 18, 4, '#ffd93d') + sparkle(12, 20, 3.4, '#ff8fc7')))

# ---- Ziggy the zebra -----------------------------------------------------
add('ziggy', 'Ziggy', 'Every stripe cheers when you read!',
    grad('ziggy-b', '#ffffff', '#e6e6f0'),
    (critter('ziggy', '#fbfbff', '#e6e6f0', '#5a5570', '#fbfbff',
             behind='<g fill="#3f3a52"><path d="M50 8q4 0 5 5l-2 8q-3 -6 -6 -6Z"/></g>',
             ears=('<g fill="#fbfbff" stroke="#5a5570" stroke-width="2.2" stroke-linejoin="round">'
                   '<path d="M32 19C29 9 33 6 38 10C41 13 44 17 46 21Z"/>'
                   '<path d="M68 19C71 9 67 6 62 10C59 13 56 17 54 21Z"/></g>'
                   '<g fill="#3f3a52"><path d="M36 12q3 3 5 7l-3 1q-2 -4 -4 -6Z"/>'
                   '<path d="M64 12q-3 3 -5 7l3 1q2 -4 4 -6Z"/></g>'),
             front=('<g fill="#3f3a52">'
                    '<path d="M50 13q4 0 6 4l-2 4q-3 -3 -4 -3q-1 0 -4 3l-2 -4q2 -4 6 -4Z"/>'
                    '<path d="M29 30q7 -3 9 -1l-1 4q-4 -1 -9 1Z"/>'
                    '<path d="M71 30q-7 -3 -9 -1l1 4q4 -1 9 1Z"/>'
                    '<path d="M28 41q6 0 8 2l-2 4q-3 -2 -7 -2Z"/>'
                    '<path d="M72 41q-6 0 -8 2l2 4q3 -2 7 -2Z"/></g>'
                    '<ellipse cx="50" cy="47" rx="12" ry="8.6" fill="#dcd6e6" '
                    'stroke="#5a5570" stroke-width="2"/>'
                    + eyes(33, 9.5) + blush(41, 19)
                    + '<g fill="#5a5570"><ellipse cx="45.5" cy="45" rx="2" ry="1.5"/>'
                      '<ellipse cx="54.5" cy="45" rx="2" ry="1.5"/></g>'
                    + smile(50, w=4, c='#5a5570')))
     + '<g fill="#3f3a52"><path d="M30 62q9 3 10 8l-4 1q-2 -5 -8 -6Z"/>'
       '<path d="M70 62q-9 3 -10 8l4 1q2 -5 8 -6Z"/></g>'
     + sparkle(14, 30, 3.6, '#ff8fc7') + sparkle(88, 40, 3.2, '#8fd3ff')))

# ---- Lulu the llama ------------------------------------------------------
add('lulu', 'Lulu', 'You read that beautifully!',
    grad('lulu-b', '#fff6e9', '#eddcc4'),
    ('<g stroke="#c9ab86" stroke-width="2.2" stroke-linejoin="round">'
     '<ellipse cx="34" cy="90" rx="7.4" ry="5.4" fill="#fff6e9"/>'
     '<ellipse cx="66" cy="90" rx="7.4" ry="5.4" fill="#fff6e9"/>'
     '<ellipse cx="50" cy="76" rx="24" ry="19" fill="url(#lulu-b)"/>'
     '<path d="M50 58q-9 0 -9 -8v-8q0 -8 9 -8t9 8v8q0 8 -9 8Z" fill="url(#lulu-b)"/>'
     '</g>'
     '<g fill="#fff" opacity=".65"><circle cx="40" cy="70" r="7"/><circle cx="52" cy="66" r="7"/>'
     '<circle cx="62" cy="72" r="7"/><circle cx="45" cy="82" r="6.5"/>'
     '<circle cx="58" cy="83" r="6.5"/></g>'
     '<g fill="#fff6e9" stroke="#c9ab86" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M37 21C32 6 37 3 42 8C45 12 46 17 47 22Z"/>'
     '<path d="M63 21C68 6 63 3 58 8C55 12 54 17 53 22Z"/>'
     '<ellipse cx="50" cy="34" rx="18" ry="16"/></g>'
     '<ellipse cx="50" cy="41" rx="10" ry="7.4" fill="#f6e7d2"/>'
     + eyes(31, 7.5, rx=4.2, ry=5) + blush(39, 14.5)
     + '<g fill="#a98a64"><ellipse cx="47" cy="39.5" rx="1.7" ry="1.3"/>'
       '<ellipse cx="53" cy="39.5" rx="1.7" ry="1.3"/></g>'
     + smile(43.5, w=3.6, c='#a98a64')
     + '<g fill="#ff8fc7"><circle cx="34" cy="18" r="3.4"/><circle cx="29" cy="21" r="3.4"/>'
       '<circle cx="31" cy="26" r="3.4"/><circle cx="36" cy="25" r="3.4"/>'
       '<circle cx="38" cy="20" r="3.4"/></g>'
     '<circle cx="33.6" cy="22" r="2.4" fill="#ffd93d"/>'
     + sparkle(86, 28, 4, '#b28fff')))

# ---- Fawn the deer -------------------------------------------------------
add('fawn', 'Fawn', 'You leapt right over that word!',
    grad('fawn-b', '#f7d5ac', '#ddab74'),
    (critter('fawn', '#efc79b', '#ddab74', '#b58553', '#fdf0de',
             behind=('<g fill="none" stroke="#b58553" stroke-width="3.6" stroke-linecap="round">'
                     '<path d="M36 18q-3 -9 -1 -13M35 8q-4 -1 -6 -4M35 11q-5 1 -8 -1"/>'
                     '<path d="M64 18q3 -9 1 -13M65 8q4 -1 6 -4M65 11q5 1 8 -1"/></g>'),
             ears=('<g fill="#efc79b" stroke="#b58553" stroke-width="2.2" stroke-linejoin="round">'
                   '<ellipse cx="25" cy="30" rx="10" ry="6" transform="rotate(-22 25 30)"/>'
                   '<ellipse cx="75" cy="30" rx="10" ry="6" transform="rotate(22 75 30)"/></g>'
                   '<g fill="#ffc9d8"><ellipse cx="26" cy="30" rx="6" ry="3.2" '
                   'transform="rotate(-22 26 30)"/>'
                   '<ellipse cx="74" cy="30" rx="6" ry="3.2" transform="rotate(22 74 30)"/></g>'),
             front=('<ellipse cx="50" cy="46" rx="12" ry="9" fill="#fdf0de"/>'
                    + eyes(34, 9) + blush(44, 18)
                    + '<ellipse cx="50" cy="43.5" rx="3.6" ry="2.8" fill="#4b3357"/>'
                    + cat_mouth(46.5, c='#b58553')))
     + '<g fill="#fff3e2"><circle cx="34" cy="66" r="3"/><circle cx="44" cy="61" r="2.6"/>'
       '<circle cx="60" cy="63" r="3"/><circle cx="68" cy="70" r="2.6"/>'
       '<circle cx="40" cy="74" r="2.4"/></g>'
     + sparkle(87, 22, 4, '#7fe3c4') + sparkle(13, 26, 3.2, '#ffd93d')))

# ---- Woolly the lamb -----------------------------------------------------
add('woolly', 'Woolly', 'That was worth a whole cloud of wool!',
    grad('woolly-b', '#ffffff', '#f0ecf7'),
    ('<g stroke="#b9b2c9" stroke-width="2.2" stroke-linejoin="round">'
     '<ellipse cx="36" cy="90" rx="6.6" ry="5" fill="#7e7690"/>'
     '<ellipse cx="64" cy="90" rx="6.6" ry="5" fill="#7e7690"/></g>'
     '<g fill="url(#woolly-b)" stroke="#c8c1d6" stroke-width="2.2">'
     '<circle cx="30" cy="72" r="12"/><circle cx="70" cy="72" r="12"/>'
     '<circle cx="40" cy="62" r="13"/><circle cx="60" cy="62" r="13"/>'
     '<circle cx="50" cy="74" r="16"/><circle cx="36" cy="82" r="11"/>'
     '<circle cx="64" cy="82" r="11"/><circle cx="50" cy="58" r="12"/></g>'
     '<g fill="url(#woolly-b)" stroke="#c8c1d6" stroke-width="2.2">'
     '<circle cx="36" cy="24" r="9"/><circle cx="64" cy="24" r="9"/>'
     '<circle cx="50" cy="19" r="10"/></g>'
     '<g fill="#e8ddf2" stroke="#b9b2c9" stroke-width="2.2" stroke-linejoin="round">'
     '<ellipse cx="26" cy="34" rx="9.5" ry="5.6" transform="rotate(18 26 34)"/>'
     '<ellipse cx="74" cy="34" rx="9.5" ry="5.6" transform="rotate(-18 74 34)"/>'
     '<ellipse cx="50" cy="36" rx="16" ry="15"/></g>'
     + eyes(34, 7.6, rx=4.2, ry=5) + blush(43, 13.5)
     + '<ellipse cx="50" cy="43" rx="3.2" ry="2.4" fill="#8d85a0"/>'
     + smile(46.5, w=3.6, c='#8d85a0')
     + sparkle(14, 40, 4, '#ffd93d') + sparkle(88, 52, 3.4, '#ff8fc7')))

# ---- Mango the monkey ----------------------------------------------------
add('mango', 'Mango', 'You swung through that page!',
    grad('mango-b', '#d2a273', '#a9743f'),
    ('<path d="M76 80C92 78 94 62 86 54" fill="none" stroke="#a9743f" stroke-width="5" '
     'stroke-linecap="round"/>'
     + critter('mango', '#c69463', '#a9743f', '#7f5228', '#f5dcbd',
               ears=('<g fill="#c69463" stroke="#7f5228" stroke-width="2.2">'
                     '<circle cx="25" cy="36" r="9"/><circle cx="75" cy="36" r="9"/></g>'
                     '<g fill="#f0cba4"><circle cx="25" cy="36" r="5.4"/>'
                     '<circle cx="75" cy="36" r="5.4"/></g>'),
               front=('<path d="M50 24C40 24 33 30 33 40C33 51 41 56 50 56C59 56 67 51 67 40'
                      'C67 30 60 24 50 24Z" fill="#f5dcbd"/>'
                      + eyes(35, 8.6, rx=4.4, ry=5.2) + blush(44, 17.5)
                      + '<g fill="#8a6440"><ellipse cx="46.6" cy="45" rx="1.9" ry="2.4"/>'
                        '<ellipse cx="53.4" cy="45" rx="1.9" ry="2.4"/></g>'
                      + smile(49.5, w=5, c='#8a6440', sw=2.3)))
     + sparkle(13, 30, 3.8, '#7fe3c4') + sparkle(88, 34, 3.2, '#ffd93d')))

# ---- Honey the bear cub --------------------------------------------------
add('honey', 'Honey', 'Sweet as honey, that reading!',
    grad('honey-b', '#e8c08c', '#c08d54'),
    (critter('honey', '#dcb17c', '#c08d54', '#96683a', '#f8ead6',
             ears=('<g fill="#dcb17c" stroke="#96683a" stroke-width="2.2">'
                   '<circle cx="29" cy="21" r="9.5"/><circle cx="71" cy="21" r="9.5"/></g>'
                   '<g fill="#f2cfa8"><circle cx="29" cy="21" r="5.6"/>'
                   '<circle cx="71" cy="21" r="5.6"/></g>'),
             front=('<ellipse cx="50" cy="45" rx="13" ry="10" fill="#f8ead6"/>'
                    + eyes(34, 9) + blush(43, 18)
                    + '<ellipse cx="50" cy="42.5" rx="4.4" ry="3.4" fill="#5a4030"/>'
                    + cat_mouth(46, c='#96683a')))
     + '<g><ellipse cx="80" cy="80" rx="9" ry="8" fill="#ffd066" stroke="#dda52f" '
       'stroke-width="2"/><path d="M74 76h12" stroke="#dda52f" stroke-width="2"/></g>'
     + sparkle(15, 28, 4, '#ffd93d')))

# ---- Kiwi the parrot -----------------------------------------------------
add('kiwi', 'Kiwi', 'Pretty reading! Pretty reading!',
    grad('kiwi-b', '#8ce89b', '#3fbf6a'),
    ('<g fill="#5cc9f5" stroke="#2f9fd4" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M50 84C40 92 30 94 24 90C28 80 34 70 42 64Z"/></g>'
     '<g fill="#ff8fc7" stroke="#e0578e" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M52 84C46 94 38 98 32 96C34 86 40 76 46 70Z"/></g>'
     '<g stroke="#2f9a58" stroke-width="2.2" stroke-linejoin="round">'
     '<ellipse cx="50" cy="62" rx="24" ry="27" fill="url(#kiwi-b)"/></g>'
     '<ellipse cx="50" cy="68" rx="15" ry="17" fill="#e6ffe9"/>'
     '<g fill="#4fc97e" stroke="#2f9a58" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M28 56C20 62 20 76 26 82C30 76 30 64 32 58Z"/></g>'
     '<g fill="#ffd93d" stroke="#dda52f" stroke-width="2" stroke-linejoin="round">'
     '<ellipse cx="43" cy="93" rx="5" ry="3"/><ellipse cx="57" cy="93" rx="5" ry="3"/></g>'
     '<g fill="#ffb0d0" stroke="#e0578e" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M50 12C60 12 66 17 66 24C66 28 63 30 60 30H40C37 30 34 28 34 24C34 17 40 12 50 12Z"/>'
     '</g>'
     '<circle cx="50" cy="34" r="20" fill="#5cc9f5" stroke="#2f9fd4" stroke-width="2.2"/>'
     '<path d="M50 44C44 44 40 40 40 36q10 -4 20 0C60 40 56 44 50 44Z" fill="#f6fbff"/>'
     + eyes(31, 8.2, rx=4.4, ry=5.2)
     + '<path d="M50 40C56 40 60 44 58 50C56 55 50 58 46 55C42 52 44 42 50 40Z" '
       'fill="#ffb03d" stroke="#d98914" stroke-width="2" stroke-linejoin="round"/>'
     + '<path d="M47 48q4 2 8 -1" fill="none" stroke="#d98914" stroke-width="1.6" '
       'stroke-linecap="round"/>'
     + blush(40, 17, c='#ff6fa5')
     + sparkle(14, 24, 4, '#ffd93d') + sparkle(88, 18, 3.2, '#b28fff')))

# ---- Plume the peacock ---------------------------------------------------
add('plume', 'Plume', 'Show off that beautiful reading!',
    grad('plume-b', '#6fd0f0', '#2f8fc4'),
    ('<g stroke="#2f8fc4" stroke-width="2" fill="none">'
     '<path d="M50 70C30 70 14 54 16 34"/><path d="M50 70C34 70 22 50 26 28"/>'
     '<path d="M50 70C42 68 36 48 42 26"/><path d="M50 70C50 60 50 40 50 22"/>'
     '<path d="M50 70C58 68 64 48 58 26"/><path d="M50 70C66 70 78 50 74 28"/>'
     '<path d="M50 70C70 70 86 54 84 34"/></g>'
     '<g stroke="#2f8fc4" stroke-width="2">'
     '<circle cx="16" cy="32" r="7.5" fill="#7fe3c4"/><circle cx="26" cy="26" r="7.5" fill="#b28fff"/>'
     '<circle cx="42" cy="24" r="7.5" fill="#ffd93d"/><circle cx="50" cy="20" r="7.5" fill="#7fe3c4"/>'
     '<circle cx="58" cy="24" r="7.5" fill="#ffd93d"/><circle cx="74" cy="26" r="7.5" fill="#b28fff"/>'
     '<circle cx="84" cy="32" r="7.5" fill="#7fe3c4"/></g>'
     '<g fill="#2b6f9c"><circle cx="16" cy="32" r="3.4"/><circle cx="26" cy="26" r="3.4"/>'
     '<circle cx="42" cy="24" r="3.4"/><circle cx="50" cy="20" r="3.4"/>'
     '<circle cx="58" cy="24" r="3.4"/><circle cx="74" cy="26" r="3.4"/>'
     '<circle cx="84" cy="32" r="3.4"/></g>'
     '<g fill="#ffd93d" stroke="#dda52f" stroke-width="2" stroke-linejoin="round">'
     '<ellipse cx="43" cy="95" rx="5" ry="3"/><ellipse cx="57" cy="95" rx="5" ry="3"/></g>'
     '<ellipse cx="50" cy="72" rx="20" ry="21" fill="url(#plume-b)" stroke="#2f8fc4" '
     'stroke-width="2.2"/>'
     '<ellipse cx="50" cy="76" rx="12" ry="13" fill="#ddf4ff"/>'
     '<g fill="none" stroke="#2f8fc4" stroke-width="2.4" stroke-linecap="round">'
     '<path d="M50 34v-8M46 27l-2 -6M54 27l2 -6"/></g>'
     '<g fill="#7fe3c4"><circle cx="50" cy="24" r="2.6"/><circle cx="43.6" cy="20" r="2.2"/>'
     '<circle cx="56.4" cy="20" r="2.2"/></g>'
     '<circle cx="50" cy="46" r="17" fill="#4fb6e0" stroke="#2f8fc4" stroke-width="2.2"/>'
     + eyes(44, 7.6, rx=4.2, ry=5) + blush(52, 14)
     + '<path d="M50 50C54 50 56 53 53 56C51 58 49 58 47 56C44 53 46 50 50 50Z" '
       'fill="#ffb03d" stroke="#d98914" stroke-width="1.8" stroke-linejoin="round"/>'
     ))

# ---- Robin the robin -----------------------------------------------------
add('robin', 'Robin', 'Your reading is my favourite song!',
    grad('robin-b', '#a8bdd6', '#6f8bb0'),
    ('<g fill="#8aa4c4" stroke="#5c769b" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M74 74C88 70 94 60 92 52C84 54 76 60 70 68Z"/>'
     '<path d="M30 62C20 66 16 76 20 82C26 78 30 70 34 66Z"/></g>'
     '<g fill="#ffb03d" stroke="#d98914" stroke-width="2" stroke-linejoin="round">'
     '<path d="M44 92l-3 6M56 92l3 6M42 96h6M54 96h6"/></g>'
     '<ellipse cx="50" cy="62" rx="24" ry="26" fill="url(#robin-b)" stroke="#5c769b" '
     'stroke-width="2.2"/>'
     '<path d="M50 44C62 44 70 54 70 66C70 78 61 88 50 88C39 88 30 78 30 66C30 54 38 44 50 44Z" '
     'fill="#ff9a5c"/>'
     '<circle cx="50" cy="34" r="20" fill="#8aa4c4" stroke="#5c769b" stroke-width="2.2"/>'
     + eyes(31, 8.4, rx=4.4, ry=5.2)
     + '<path d="M50 39l7 5l-7 5l-7 -5Z" fill="#ffd066" stroke="#d98914" stroke-width="1.8" '
       'stroke-linejoin="round"/>'
     + blush(40, 16, c='#ff6fa5')
     + '<g fill="none" stroke="#5c769b" stroke-width="2.2" stroke-linecap="round">'
       '<path d="M50 14v-5M45 16l-3 -4M55 16l3 -4"/></g>'
     + sparkle(15, 24, 4, '#ffd93d') + sparkle(86, 26, 3.2, '#7fe3c4')))

# ---- Quackers the duckling ----------------------------------------------
add('quackers', 'Quackers', 'Quack! Read me one more!',
    grad('quackers-b', '#ffe98f', '#f4c93f'),
    ('<g fill="#ffb03d" stroke="#d98914" stroke-width="2" stroke-linejoin="round">'
     '<path d="M40 92q-6 4 -8 6h14ZM60 92q6 4 8 6h-14Z"/></g>'
     '<ellipse cx="50" cy="68" rx="25" ry="24" fill="url(#quackers-b)" stroke="#d9ab2e" '
     'stroke-width="2.2"/>'
     '<ellipse cx="50" cy="74" rx="15" ry="14" fill="#fffbe8"/>'
     '<path d="M74 60C86 62 90 74 84 80C78 78 74 70 72 64Z" fill="#ffe273" stroke="#d9ab2e" '
     'stroke-width="2.2" stroke-linejoin="round"/>'
     '<circle cx="50" cy="34" r="21" fill="url(#quackers-b)" stroke="#d9ab2e" stroke-width="2.2"/>'
     + eyes(31, 8.4, rx=4.4, ry=5.2)
     + '<path d="M50 38C58 38 63 41 63 44C63 47 58 50 50 50C42 50 37 47 37 44C37 41 42 38 50 38Z" '
       'fill="#ffb03d" stroke="#d98914" stroke-width="2" stroke-linejoin="round"/>'
     + '<path d="M39 44h22" stroke="#d98914" stroke-width="1.5"/>'
     + blush(40, 17, c='#ff6fa5')
     + '<g fill="#ffe98f" stroke="#d9ab2e" stroke-width="2" stroke-linejoin="round">'
       '<path d="M46 15q1 -8 4 -8t4 8Z"/></g>'
     + sparkle(87, 30, 3.6, '#8fd3ff') + sparkle(13, 34, 3.2, '#ffd93d')))

# ---- Nori the narwhal ----------------------------------------------------
add('nori', 'Nori', 'You are the sparkle of the sea!',
    grad('nori-b', '#c4eaff', '#6bb4e6'),
    (
     # The tusk grows OUT of the forehead and up-left, tapering to a point. Drawn
     # before the body so its base tucks under, or it reads as a tag pinned on.
     '<path d="M38 58L45 53L13 21L10.5 25.5Z" fill="#fff4fa" stroke="#d9a8c8" '
     'stroke-width="2" stroke-linejoin="round"/>'
     '<g fill="none" stroke="#e3b6d4" stroke-width="1.5" stroke-linecap="round">'
     '<path d="M31 51l5 -4.5M25 43.5l4.8 -4.3M19 36l4.5 -4"/></g>'
     '<path d="M78 56C90 44 98 50 96 62C94 76 86 82 78 76Z" fill="#a5daf7" '
     'stroke="#4d95c9" stroke-width="2.2" stroke-linejoin="round"/>'
     '<path d="M30 68C30 52 44 42 58 42C74 42 86 54 86 68C86 82 72 90 58 90C42 90 30 82 30 68Z" '
     'fill="url(#nori-b)" stroke="#4d95c9" stroke-width="2.4"/>'
     '<path d="M38 76C48 68 74 68 84 76C80 86 68 90 58 90C46 90 40 84 38 76Z" fill="#eef9ff"/>'
     '<path d="M50 44C56 34 66 36 66 46" fill="none" stroke="#4d95c9" stroke-width="2.4" '
     'stroke-linecap="round"/>'
     '<path d="M52 82C46 92 54 96 60 92C63 89 62 85 58 83Z" fill="#a5daf7" stroke="#4d95c9" '
     'stroke-width="2.2" stroke-linejoin="round"/>'
     + eyes(64, 9, cx=52, rx=4.4, ry=5.2) + blush(73, 17, cx=52)
     + smile(73, cx=52, w=4.6, c='#4d95c9')
     + '<g fill="none" stroke="#4d95c9" stroke-width="2" stroke-linecap="round" opacity=".55">'
       '<path d="M74 60q3 -3 6 0M74 70q3 3 6 0"/></g>'
     + sparkle(16, 26, 4.4, '#ffd93d') + sparkle(88, 26, 3.4, '#ff8fc7')
     + sparkle(10, 74, 3, '#b28fff')))

# ---- Coral the seahorse --------------------------------------------------
add('coral', 'Coral', 'You float right through those words!',
    grad('coral-b', '#ffd2e8', '#f07ab5'),
    ('<path d="M52 44C56 60 50 68 44 74C38 80 40 88 48 88C54 88 58 84 56 79" '
     'fill="none" stroke="#d9569b" stroke-width="19" stroke-linecap="round"/>'
     '<path d="M52 44C56 60 50 68 44 74C38 80 40 88 48 88C54 88 58 84 56 79" '
     'fill="none" stroke="url(#coral-b)" stroke-width="14" stroke-linecap="round"/>'
     '<g fill="#ffb0d0" stroke="#d9569b" stroke-width="1.8" stroke-linejoin="round">'
     '<path d="M62 52C72 50 74 58 68 60ZM62 64C72 64 72 72 66 72ZM54 78C62 80 60 88 54 86Z"/></g>'
     '<g fill="none" stroke="#c9407f" stroke-width="1.8" stroke-linecap="round" opacity=".7">'
     '<path d="M45 52h11M43 62h11M40 72h9"/></g>'
     '<path d="M36 40C24 34 20 42 26 48C30 52 36 50 38 46Z" fill="#ffb0d0" stroke="#d9569b" '
     'stroke-width="2" stroke-linejoin="round"/>'
     '<path d="M46 16C60 16 70 24 70 34C70 44 60 50 48 50C36 50 28 44 28 34C28 24 32 16 46 16Z" '
     'fill="url(#coral-b)" stroke="#d9569b" stroke-width="2.4"/>'
     '<path d="M66 30C78 30 86 34 86 38C86 42 78 44 66 42C63 41 62 31 66 30Z" '
     'fill="#ffc2de" stroke="#d9569b" stroke-width="2.2" stroke-linejoin="round"/>'
     '<g fill="#ff9ecb" stroke="#d9569b" stroke-width="1.8" stroke-linejoin="round">'
     '<path d="M40 14C36 4 44 2 46 12ZM50 12C48 0 58 0 56 12ZM60 16C60 6 68 6 66 18Z"/></g>'
     + eyes(31, 8, cx=46, rx=4.2, ry=5) + blush(39, 14, cx=46)
     + smile(40, cx=46, w=3.6, c='#c9407f')
     + '<g fill="#8fd3ff" opacity=".75"><circle cx="18" cy="62" r="3.6"/>'
       '<circle cx="12" cy="74" r="2.6"/><circle cx="20" cy="84" r="2.1"/></g>'
     + sparkle(88, 62, 4, '#ffd93d') + sparkle(84, 14, 3.2, '#b28fff')))

# ---- Jelly the jellyfish -------------------------------------------------
add('jelly', 'Jelly', 'You made my whole bell glow!',
    rgrad('jelly-b', '#f0e2ff', '#b28fff'),
    ('<g fill="none" stroke="#b28fff" stroke-width="4" stroke-linecap="round" opacity=".9">'
     '<path d="M32 60q-4 12 2 20t-2 14"/><path d="M42 62q-3 14 1 22t-1 10"/>'
     '<path d="M58 62q3 14 -1 22t1 10"/><path d="M68 60q4 12 -2 20t2 14"/>'
     '<path d="M50 63q0 16 0 22t0 9"/></g>'
     '<g fill="none" stroke="#ff8fc7" stroke-width="2.6" stroke-linecap="round" opacity=".85">'
     '<path d="M37 62q-3 12 1 20"/><path d="M63 62q3 12 -1 20"/></g>'
     '<path d="M50 16C70 16 84 32 84 50C84 58 80 62 72 62H28C20 62 16 58 16 50C16 32 30 16 50 16Z" '
     'fill="url(#jelly-b)" stroke="#8a68e0" stroke-width="2.4" stroke-linejoin="round"/>'
     '<g fill="#fff" opacity=".55"><ellipse cx="36" cy="32" rx="9" ry="6" '
     'transform="rotate(-28 36 32)"/><circle cx="27" cy="44" r="3.4"/></g>'
     '<g fill="#e2d2ff"><circle cx="30" cy="58" r="4"/><circle cx="42" cy="59" r="4"/>'
     '<circle cx="58" cy="59" r="4"/><circle cx="70" cy="58" r="4"/></g>'
     + eyes(44, 9, rx=4.6, ry=5.4) + blush(52, 17)
     + smile(52, w=4.4, c='#8a68e0')
     + sparkle(14, 22, 4.2, '#ffd93d') + sparkle(88, 26, 3.4, '#7fe3c4')
     + sparkle(90, 74, 3, '#ff8fc7')))

# ---- Pinch the crab ------------------------------------------------------
add('pinch', 'Pinch', 'Two claws up for that!',
    grad('pinch-b', '#ff9f7a', '#ef6a48'),
    ('<g fill="none" stroke="#c94d33" stroke-width="4" stroke-linecap="round">'
     '<path d="M28 72q-10 4 -14 12M30 80q-9 6 -11 14M70 72q10 4 14 12M70 80q9 6 11 14"/></g>'
     '<g fill="#ff8f6a" stroke="#c94d33" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M22 56C10 50 4 58 8 66C12 74 22 72 24 64ZM8 58l-4 -8 10 4Z"/>'
     '<path d="M78 56C90 50 96 58 92 66C88 74 78 72 76 64ZM92 58l4 -8 -10 4Z"/></g>'
     '<path d="M50 38C70 38 84 50 84 64C84 78 70 86 50 86C30 86 16 78 16 64C16 50 30 38 50 38Z" '
     'fill="url(#pinch-b)" stroke="#c94d33" stroke-width="2.4"/>'
     '<path d="M50 60C64 60 76 64 78 70C74 78 62 82 50 82C38 82 26 78 22 70C24 64 36 60 50 60Z" '
     'fill="#ffd9c9"/>'
     '<g fill="none" stroke="#c94d33" stroke-width="2.4" stroke-linecap="round">'
     '<path d="M40 40v-10M60 40v-10"/></g>'
     '<g fill="#ffd9c9" stroke="#c94d33" stroke-width="2"><circle cx="40" cy="27" r="6.5"/>'
     '<circle cx="60" cy="27" r="6.5"/></g>'
     '<g fill="#4b3357"><circle cx="40" cy="27" r="3.2"/><circle cx="60" cy="27" r="3.2"/></g>'
     '<g fill="#fff"><circle cx="38.6" cy="25.6" r="1.3"/><circle cx="58.6" cy="25.6" r="1.3"/></g>'
     + blush(62, 22, c='#e0578e')
     + smile(62, w=5.5, c='#c94d33', sw=2.4)
     + sparkle(14, 30, 3.6, '#ffd93d') + sparkle(88, 34, 3, '#8fd3ff')))

# ---- Axie the axolotl ----------------------------------------------------
add('axie', 'Axie', 'You always make me smile!',
    grad('axie-b', '#ffd9ea', '#ff9ecb'),
    ('<path d="M64 74C80 76 92 68 92 58" fill="none" stroke="#e07aad" stroke-width="12" '
     'stroke-linecap="round"/>'
     '<path d="M64 74C80 76 92 68 92 58" fill="none" stroke="#ffc2de" stroke-width="7" '
     'stroke-linecap="round"/>'
     '<g fill="#ff7fb8" stroke="#e07aad" stroke-width="2" stroke-linejoin="round">'
     '<path d="M28 34C18 26 10 30 12 38C14 44 22 44 26 40Z"/>'
     '<path d="M26 46C14 44 8 52 12 58C16 63 24 60 27 54Z"/>'
     '<path d="M30 26C24 14 14 16 14 24C14 30 22 34 27 32Z"/>'
     '<path d="M72 34C82 26 90 30 88 38C86 44 78 44 74 40Z"/>'
     '<path d="M74 46C86 44 92 52 88 58C84 63 76 60 73 54Z"/>'
     '<path d="M70 26C76 14 86 16 86 24C86 30 78 34 73 32Z"/></g>'
     '<path d="M34 62C42 56 58 56 66 62C74 68 72 82 62 86C54 89 46 89 38 86C28 82 26 68 34 62Z" '
     'fill="url(#axie-b)" stroke="#e07aad" stroke-width="2.2"/>'
     '<circle cx="50" cy="40" r="22" fill="url(#axie-b)" stroke="#e07aad" stroke-width="2.2"/>'
     + eyes(38, 9.4, rx=4.6, ry=5.4) + blush(47, 17.5, c='#ff5f9e', op='.4')
     + smile(48, w=6, c='#e07aad', sw=2.4)
     + '<g fill="#fff" opacity=".6"><ellipse cx="40" cy="30" rx="7" ry="4.6" '
       'transform="rotate(-25 40 30)"/></g>'
     + sparkle(14, 66, 4, '#ffd93d') + sparkle(88, 82, 3.2, '#b28fff')))

# ---- Sandy the starfish --------------------------------------------------
add('sandy', 'Sandy', 'You are a star of the sea!',
    rgrad('sandy-b', '#ffe6a8', '#f0a93f'),
    ('<path d="M50 8L62 38L94 40L68 60L78 92L50 73L22 92L32 60L6 40L38 38Z" '
     'fill="url(#sandy-b)" stroke="#d98914" stroke-width="2.6" stroke-linejoin="round"/>'
     '<g fill="#fff3d4" opacity=".8"><circle cx="50" cy="30" r="2.6"/>'
     '<circle cx="70" cy="48" r="2.4"/><circle cx="32" cy="50" r="2.4"/>'
     '<circle cx="42" cy="70" r="2.2"/><circle cx="60" cy="70" r="2.2"/>'
     '<circle cx="50" cy="55" r="2.6"/></g>'
     + eyes(48, 9.5, rx=4.8, ry=5.6) + blush(57, 17.5)
     + smile(57, w=5, c='#c9770f', sw=2.4)
     + sparkle(14, 74, 4, '#8fd3ff') + sparkle(88, 16, 3.4, '#ff8fc7')))

# ---- Buzz the bumblebee --------------------------------------------------
add('buzz', 'Buzz', 'Your reading is the bee\'s knees!',
    grad('buzz-b', '#ffe07a', '#f0b62e'),
    ('<g fill="#dff4ff" stroke="#8fd3ff" stroke-width="2" opacity=".92">'
     '<ellipse cx="26" cy="38" rx="15" ry="10" transform="rotate(-28 26 38)"/>'
     '<ellipse cx="74" cy="38" rx="15" ry="10" transform="rotate(28 74 38)"/>'
     '<ellipse cx="30" cy="52" rx="12" ry="8" transform="rotate(-14 30 52)"/>'
     '<ellipse cx="70" cy="52" rx="12" ry="8" transform="rotate(14 70 52)"/></g>'
     '<g fill="none" stroke="#3f2b57" stroke-width="2.4" stroke-linecap="round">'
     '<path d="M42 22q-4 -8 -10 -10M58 22q4 -8 10 -10"/></g>'
     '<g fill="#ffd93d"><circle cx="31" cy="11" r="3.4"/><circle cx="69" cy="11" r="3.4"/></g>'
     '<ellipse cx="50" cy="60" rx="26" ry="28" fill="url(#buzz-b)" stroke="#c99612" '
     'stroke-width="2.4"/>'
     '<g fill="#3f2b57"><path d="M27 68q23 8 46 0v7q-23 8 -46 0Z"/>'
     '<path d="M31 80q19 7 38 0q-4 6 -19 7q-15 -1 -19 -7Z"/></g>'
     + eyes(52, 9.6, rx=4.8, ry=5.6) + blush(61, 18)
     + smile(61, w=4.6, c='#8a6a10', sw=2.3)
     + sparkle(14, 74, 4, '#ffd93d') + sparkle(88, 78, 3.2, '#ff8fc7')))

# ---- Glim the firefly ----------------------------------------------------
add('glim', 'Glim', 'You lit up the whole page!',
    (rgrad('glim-glow', '#fff6c4', '#ffd93d')
     + grad('glim-b', '#b7e6d6', '#6cc4a8')),
    ('<circle cx="50" cy="74" r="26" fill="#ffe98f" opacity=".35"/>'
     '<circle cx="50" cy="74" r="17" fill="#fff3b8" opacity=".55"/>'
     '<g fill="#dff4ff" stroke="#8fd3ff" stroke-width="2" opacity=".9">'
     '<ellipse cx="26" cy="42" rx="14" ry="9" transform="rotate(-30 26 42)"/>'
     '<ellipse cx="74" cy="42" rx="14" ry="9" transform="rotate(30 74 42)"/></g>'
     '<g fill="none" stroke="#3f6b5c" stroke-width="2.2" stroke-linecap="round">'
     '<path d="M43 20q-5 -8 -11 -9M57 20q5 -8 11 -9"/></g>'
     '<g fill="#ffd93d"><circle cx="31" cy="10" r="3"/><circle cx="69" cy="10" r="3"/></g>'
     '<ellipse cx="50" cy="72" rx="18.5" ry="16" fill="url(#glim-glow)" stroke="#e0a900" '
     'stroke-width="2.2"/>'
     '<ellipse cx="50" cy="48" rx="23" ry="24" fill="url(#glim-b)" stroke="#4f9c84" '
     'stroke-width="2.2"/>'
     + eyes(44, 9.4, rx=4.8, ry=5.6) + blush(53, 17.5)
     + smile(53, w=4.6, c='#3f6b5c', sw=2.3)
     + sparkle(15, 66, 4.2, '#ffd93d') + sparkle(86, 62, 3.6, '#fff3b8')
     + sparkle(80, 20, 3, '#b28fff')))

# ---- Zip the dragonfly ---------------------------------------------------
add('zip', 'Zip', 'You zipped through that!',
    grad('zip-b', '#a9e8ff', '#4fa8dd'),
    ('<g fill="#e8f6ff" stroke="#8fd3ff" stroke-width="2" opacity=".92">'
     '<ellipse cx="24" cy="40" rx="20" ry="8" transform="rotate(-18 24 40)"/>'
     '<ellipse cx="76" cy="40" rx="20" ry="8" transform="rotate(18 76 40)"/>'
     '<ellipse cx="26" cy="54" rx="18" ry="7" transform="rotate(12 26 54)"/>'
     '<ellipse cx="74" cy="54" rx="18" ry="7" transform="rotate(-12 74 54)"/></g>'
     '<g fill="none" stroke="#3f2b57" stroke-width="2.2" stroke-linecap="round">'
     '<path d="M44 18q-4 -7 -9 -9M56 18q4 -7 9 -9"/></g>'
     '<g fill="#ff8fc7"><circle cx="34" cy="8" r="3"/><circle cx="66" cy="8" r="3"/></g>'
     '<path d="M50 56q9 0 9 8v16q0 8 -9 12q-9 -4 -9 -12v-16q0 -8 9 -8Z" fill="url(#zip-b)" '
     'stroke="#2f80b4" stroke-width="2.2" stroke-linejoin="round"/>'
     '<g fill="#2f80b4" opacity=".45"><path d="M42 66h16v3h-16ZM42 74h16v3h-16ZM43 82h14v3h-14Z"/></g>'
     '<circle cx="50" cy="38" r="20" fill="url(#zip-b)" stroke="#2f80b4" stroke-width="2.2"/>'
     + eyes(35, 9, rx=5.2, ry=6) + blush(45, 16.5)
     + smile(45, w=4.4, c='#2f80b4', sw=2.3)
     + sparkle(13, 74, 4, '#ffd93d') + sparkle(88, 78, 3.2, '#7fe3c4')))

# ---- Shelly the snail ----------------------------------------------------
add('shelly', 'Shelly', 'Steady reading wins the day!',
    rgrad('shelly-b', '#ffe0b8', '#e88f4f'),
    ('<path d="M18 84C14 84 10 80 12 74C16 66 30 62 42 64C52 66 58 72 58 78C58 82 54 86 48 86Z" '
     'fill="#c8f0d8" stroke="#63b489" stroke-width="2.2" stroke-linejoin="round"/>'
     '<g fill="none" stroke="#63b489" stroke-width="2.4" stroke-linecap="round">'
     '<path d="M66 56q4 -10 2 -16M78 58q8 -8 8 -16"/></g>'
     '<g fill="#ffd93d"><circle cx="68" cy="38" r="3.4"/><circle cx="86" cy="40" r="3.4"/></g>'
     '<path d="M52 82C46 82 42 78 42 72C42 62 52 54 64 54C76 54 86 62 86 74C86 82 79 86 72 86Z" '
     'fill="#c8f0d8" stroke="#63b489" stroke-width="2.2" stroke-linejoin="round"/>'
     '<circle cx="46" cy="52" r="26" fill="url(#shelly-b)" stroke="#c9772f" stroke-width="2.4"/>'
     '<path d="M46 52m0 -18a18 18 0 1 1 -12 31a13 13 0 1 0 9 -22a8 8 0 1 0 5 13" fill="none" '
     'stroke="#c9772f" stroke-width="2.6" stroke-linecap="round"/>'
     + eyes(70, 8, cx=66, rx=4.2, ry=5) + blush(78, 14, cx=66)
     + smile(78, cx=66, w=4, c='#63b489')
     + sparkle(16, 26, 4, '#ff8fc7') + sparkle(88, 76, 3.2, '#ffd93d')))

# ---- Skye the pegasus ----------------------------------------------------
add('skye', 'Skye', 'Let\'s fly through another page!',
    (grad('skye-b', '#ffffff', '#e6efff')
     + grad('skye-w', '#ffffff', '#d9e9ff')),
    ('<g fill="url(#skye-w)" stroke="#9db8e0" stroke-width="2.2" stroke-linejoin="round">'
     '<path d="M30 52C16 40 6 42 6 54C6 64 14 72 24 74C22 66 24 58 30 52Z"/>'
     '<path d="M70 52C84 40 94 42 94 54C94 64 86 72 76 74C78 66 76 58 70 52Z"/></g>'
     '<g fill="none" stroke="#9db8e0" stroke-width="1.8">'
     '<path d="M10 50q6 6 10 16M16 46q6 8 9 20M70 60q6 -8 12 -12M74 66q6 -8 12 -12"/></g>'
     + critter('skye', '#fbfdff', '#e6efff', '#9db8e0', '#f2f7ff',
               behind=('<g fill="none" stroke-linecap="round">'
                       '<path d="M46 15C28 20 19 34 21 52" stroke="#ff8fc7" stroke-width="8"/>'
                       '<path d="M48 14C32 19 24 33 26 50" stroke="#b28fff" stroke-width="6"/>'
                       '<path d="M50 13C36 18 29 32 31 48" stroke="#8fd3ff" stroke-width="4.5"/>'
                       '</g>'),
               ears=('<g fill="#fbfdff" stroke="#9db8e0" stroke-width="2.2" stroke-linejoin="round">'
                     '<path d="M35 20C32 10 36 8 40 12C43 15 45 18 46 21Z"/>'
                     '<path d="M65 20C68 10 64 8 60 12C57 15 55 18 54 21Z"/></g>'
                     '<path d="M50 15C46 9 47 3 50 0.5C53 3 54 9 50 15Z" fill="#ffd066" '
                     'stroke="#e0a900" stroke-width="1.8" stroke-linejoin="round"/>'),
               front=('<ellipse cx="50" cy="46" rx="12" ry="9" fill="#f2f7ff"/>'
                      + eyes(34, 9) + blush(43, 18)
                      + '<g fill="#9db8e0"><ellipse cx="46.4" cy="44.6" rx="1.9" ry="1.4"/>'
                        '<ellipse cx="53.6" cy="44.6" rx="1.9" ry="1.4"/></g>'
                      + smile(49, w=4, c='#9db8e0')))
     + sparkle(14, 18, 4.2, '#ffd93d') + sparkle(88, 14, 3.4, '#ff8fc7')))

# ---- Pearl the mermaid ---------------------------------------------------
add('pearl', 'Pearl', 'You sing the words so sweetly!',
    (grad('pearl-t', '#8fe8d8', '#3fb5a4')
     + grad('pearl-h', '#ffcf6f', '#e8a02e')),
    ('<path d="M50 58C58 58 64 66 62 76C60 84 56 88 52 92C60 96 68 92 72 86C74 94 62 100 50 96'
     'C38 100 26 94 28 86C32 92 40 96 48 92C44 88 40 84 38 76C36 66 42 58 50 58Z" '
     'fill="url(#pearl-t)" stroke="#2f8f80" stroke-width="2.2" stroke-linejoin="round"/>'
     '<g fill="#c8f5ec" opacity=".7"><circle cx="50" cy="68" r="4"/><circle cx="45" cy="78" r="3.4"/>'
     '<circle cx="55" cy="78" r="3.4"/></g>'
     '<path d="M50 40C58 40 63 46 63 54C63 60 57 62 50 62C43 62 37 60 37 54C37 46 42 40 50 40Z" '
     'fill="#ffd9ea" stroke="#e07aad" stroke-width="2.2" stroke-linejoin="round"/>'
     '<g fill="#ff8fc7" stroke="#e07aad" stroke-width="1.8"><circle cx="43" cy="53" r="5"/>'
     '<circle cx="57" cy="53" r="5"/></g>'
     '<path d="M26 32C22 46 24 60 30 68C24 70 18 62 18 50C18 36 24 24 34 20Z" '
     'fill="url(#pearl-h)" stroke="#c9820f" stroke-width="2" stroke-linejoin="round"/>'
     '<path d="M74 32C78 46 76 60 70 68C76 70 82 62 82 50C82 36 76 24 66 20Z" '
     'fill="url(#pearl-h)" stroke="#c9820f" stroke-width="2" stroke-linejoin="round"/>'
     '<circle cx="50" cy="30" r="19" fill="#ffe4cf" stroke="#e0a97f" stroke-width="2"/>'
     '<path d="M50 9C64 9 72 18 72 28C72 22 64 20 50 20C36 20 28 22 28 28C28 18 36 9 50 9Z" '
     'fill="url(#pearl-h)" stroke="#c9820f" stroke-width="2" stroke-linejoin="round"/>'
     + eyes(29, 8, rx=4.2, ry=5)
     + blush(37, 14, c='#ff6fa5', op='.38')
     + smile(38, w=3.6, c='#d9787a')
     + '<path d="M50 14C44 14 42 10 44 8C46 6 48 8 50 10C52 8 54 6 56 8C58 10 56 14 50 14Z" '
       'fill="#ff8fc7"/>'
     + sparkle(15, 74, 4.2, '#ffd93d') + sparkle(86, 70, 3.4, '#8fd3ff')))

# ---- Petal the flower fairy ---------------------------------------------
add('petal', 'Petal', 'Every word you read makes me bloom!',
    (grad('petal-b', '#ffe1f0', '#ff9ecb')
     + grad('petal-w', '#ffffff', '#e8dcff')),
    ('<g fill="url(#petal-w)" stroke="#b28fff" stroke-width="2" opacity=".92">'
     '<ellipse cx="24" cy="44" rx="16" ry="20" transform="rotate(-22 24 44)"/>'
     '<ellipse cx="76" cy="44" rx="16" ry="20" transform="rotate(22 76 44)"/>'
     '<ellipse cx="28" cy="66" rx="11" ry="14" transform="rotate(-14 28 66)"/>'
     '<ellipse cx="72" cy="66" rx="11" ry="14" transform="rotate(14 72 66)"/></g>'
     '<path d="M50 50C60 50 66 60 64 72C62 84 56 90 50 90C44 90 38 84 36 72C34 60 40 50 50 50Z" '
     'fill="url(#petal-b)" stroke="#e07aad" stroke-width="2.2" stroke-linejoin="round"/>'
     '<g fill="#fff" opacity=".55"><ellipse cx="50" cy="66" rx="9" ry="12"/></g>'
     '<circle cx="50" cy="34" r="20" fill="#ffe8d4" stroke="#e0a97f" stroke-width="2"/>'
     '<g fill="#ffd93d" stroke="#e0a900" stroke-width="1.8" stroke-linejoin="round">'
     '<path d="M50 14C42 14 38 8 42 4C45 1 48 5 50 9C52 5 55 1 58 4C62 8 58 14 50 14Z"/></g>'
     '<g fill="#ff8fc7"><circle cx="34" cy="20" r="4.4"/><circle cx="29" cy="26" r="4.4"/>'
     '<circle cx="33" cy="32" r="4.4"/><circle cx="40" cy="30" r="4.4"/>'
     '<circle cx="40" cy="22" r="4.4"/></g>'
     '<circle cx="35.2" cy="26" r="3" fill="#ffd93d"/>'
     + eyes(33, 8.2, rx=4.4, ry=5.2)
     + blush(41, 14.5, c='#ff6fa5', op='.38')
     + smile(42, w=3.8, c='#d9787a')
     + sparkle(14, 76, 4.2, '#ffd93d') + sparkle(88, 20, 3.4, '#7fe3c4')
     + sparkle(84, 84, 3, '#b28fff')))

# ---- Luna the moon -------------------------------------------------------
add('luna', 'Luna', 'I stayed up just to hear you read!',
    rgrad('luna-b', '#fff8d8', '#ffd76a'),
    ('<path d="M62 8C36 8 16 28 16 54C16 80 36 96 62 96C70 96 78 94 84 90C64 86 48 72 48 52'
     'C48 32 64 16 84 12C78 9 70 8 62 8Z" fill="url(#luna-b)" stroke="#e0a900" '
     'stroke-width="2.6" stroke-linejoin="round"/>'
     '<g fill="#f2c95a" opacity=".55"><circle cx="34" cy="30" r="5"/><circle cx="26" cy="58" r="6.5"/>'
     '<circle cx="40" cy="80" r="4.4"/></g>'
     + eyes(50, 9, cx=42, rx=4.6, ry=5.4)
     + blush(59, 17, cx=42, c='#ff6fa5')
     + smile(59, cx=42, w=4.6, c='#c9770f', sw=2.4)
     + '<g fill="none" stroke="#c9770f" stroke-width="2" stroke-linecap="round" opacity=".7">'
       '<path d="M31 42q3 -3 6 0M47 42q3 -3 6 0"/></g>'
     + sparkle(84, 24, 5, '#fff3b8') + sparkle(90, 48, 3.6, '#8fd3ff')
     + sparkle(78, 72, 4, '#b28fff') + sparkle(12, 16, 3, '#ff8fc7')))

# ---- Puff the cloud ------------------------------------------------------
add('puff', 'Puff', 'Your words float right up to me!',
    grad('puff-b', '#ffffff', '#dce9ff'),
    ('<g fill="url(#puff-b)" stroke="#a8c2e8" stroke-width="2.4" stroke-linejoin="round">'
     '<circle cx="30" cy="52" r="18"/><circle cx="52" cy="42" r="22"/>'
     '<circle cx="72" cy="54" r="17"/>'
     '<path d="M14 56h74a14 14 0 0 1 0 22H14a14 14 0 0 1 0 -22Z"/></g>'
     '<g fill="url(#puff-b)"><circle cx="30" cy="52" r="15"/><circle cx="52" cy="42" r="19"/>'
     '<circle cx="72" cy="54" r="14"/><rect x="16" y="56" width="70" height="18" rx="9"/></g>'
     + eyes(52, 11, rx=5, ry=5.8)
     + blush(62, 20, c='#8fd3ff', op='.5')
     + smile(62, w=5, c='#7ea6d6', sw=2.4)
     + '<g fill="none" stroke="#8fd3ff" stroke-width="3" stroke-linecap="round" opacity=".8">'
       '<path d="M34 84v6M50 86v7M66 84v6"/></g>'
     + sparkle(14, 24, 4.2, '#ffd93d') + sparkle(88, 22, 3.4, '#ff8fc7')))

# ---- Ruby the gem --------------------------------------------------------
add('ruby', 'Ruby', 'You are a real treasure!',
    (grad('ruby-b', '#ff9ecb', '#e0407f')
     + grad('ruby-t', '#ffd9ea', '#ff7fb0')),
    ('<path d="M28 30h44l18 22L50 92L10 52Z" fill="url(#ruby-b)" stroke="#b82f66" '
     'stroke-width="2.6" stroke-linejoin="round"/>'
     '<path d="M28 30h44l18 22H10Z" fill="url(#ruby-t)" stroke="#b82f66" stroke-width="2.4" '
     'stroke-linejoin="round"/>'
     '<g fill="none" stroke="#b82f66" stroke-width="2" opacity=".8">'
     '<path d="M28 30l6 22M72 30l-6 22M34 52L50 92M66 52L50 92"/></g>'
     '<g fill="#fff" opacity=".55"><path d="M32 34h10l-3 14h-10Z"/></g>'
     + eyes(62, 9, rx=4.4, ry=5.2)
     + blush(70, 16, c='#ffffff', op='.45')
     + smile(70, w=4.4, c='#b82f66', sw=2.3)
     + sparkle(16, 24, 4.6, '#ffd93d') + sparkle(86, 20, 3.6, '#8fd3ff')
     + sparkle(88, 72, 3.2, '#fff3b8')))

# ---- Frost the snowflake -------------------------------------------------
add('frost', 'Frost', 'You warmed me right up!',
    rgrad('frost-b', '#f2fbff', '#a8ddf5'),
    ('<g stroke="#7fc4e8" stroke-width="4.5" stroke-linecap="round" fill="none">'
     '<path d="M50 6v88M12 28l76 44M88 28L12 72"/>'
     '<path d="M50 20l-9 -9M50 20l9 -9M50 80l-9 9M50 80l9 9"/>'
     '<path d="M28 40l-12 1M28 40l-2 -12M72 60l12 -1M72 60l2 12"/>'
     '<path d="M72 40l12 1M72 40l2 -12M28 60l-12 -1M28 60l-2 12"/></g>'
     '<circle cx="50" cy="50" r="21" fill="url(#frost-b)" stroke="#7fc4e8" stroke-width="2.4"/>'
     + eyes(47, 8.4, rx=4.4, ry=5.2)
     + blush(56, 15, c='#8fd3ff', op='.55')
     + smile(56, w=4.2, c="#4f9cc4", sw=2.3)
     + sparkle(18, 16, 4, '#ffffff') + sparkle(84, 84, 3.4, '#ffffff')
     + sparkle(86, 14, 3, '#b28fff')))

# ---- Button the mushroom ------------------------------------------------
add('button', 'Button', 'You popped up a brand new word!',
    (rgrad('button-c', '#ff9ab0', '#e0405f')
     + grad('button-s', '#fff8ec', '#ecdcc4')),
    ('<path d="M36 56h28v26a14 10 0 0 1 -28 0Z" fill="url(#button-s)" stroke="#c9a97f" '
     'stroke-width="2.4" stroke-linejoin="round"/>'
     '<path d="M50 12C26 12 10 30 10 46C10 54 16 58 26 58h48c10 0 16 -4 16 -12C90 30 74 12 50 12Z" '
     'fill="url(#button-c)" stroke="#b8304f" stroke-width="2.6" stroke-linejoin="round"/>'
     '<g fill="#fff6f2" opacity=".9"><ellipse cx="30" cy="34" rx="7" ry="5.6"/>'
     '<ellipse cx="52" cy="26" rx="8" ry="6"/><ellipse cx="72" cy="38" rx="6.4" ry="5"/>'
     '<ellipse cx="42" cy="46" rx="5" ry="4"/><ellipse cx="64" cy="50" rx="4.6" ry="3.6"/></g>'
     + eyes(70, 7.4, rx=4, ry=4.8)
     + blush(77, 13, c='#ff6fa5')
     + smile(77, w=3.6, c='#b08a63')
     + '<g fill="#7fe3c4" stroke="#4fae8f" stroke-width="1.8" stroke-linejoin="round">'
       '<path d="M74 88q10 -2 14 -10q-12 -2 -16 6ZM26 90q-10 -2 -13 -9q11 -2 15 5Z"/></g>'
     + sparkle(14, 20, 4, '#ffd93d') + sparkle(88, 22, 3.2, '#b28fff')))

# ---- Arc the rainbow -----------------------------------------------------
add('arc', 'Arc', 'You brought out all my colours!',
    grad('arc-b', '#ffffff', '#eef4ff'),
    ('<g fill="none" stroke-linecap="round">'
     '<path d="M8 82a42 42 0 0 1 84 0" stroke="#ff6fa5" stroke-width="9"/>'
     '<path d="M17 82a33 33 0 0 1 66 0" stroke="#ffb03d" stroke-width="9"/>'
     '<path d="M26 82a24 24 0 0 1 48 0" stroke="#ffd93d" stroke-width="9"/>'
     '<path d="M35 82a15 15 0 0 1 30 0" stroke="#7fe3c4" stroke-width="9"/>'
     '<path d="M44 82a6 6 0 0 1 12 0" stroke="#8fd3ff" stroke-width="9"/></g>'
     '<g fill="url(#arc-b)" stroke="#a8c2e8" stroke-width="2.2">'
     '<circle cx="18" cy="84" r="12"/><circle cx="30" cy="88" r="9"/>'
     '<circle cx="82" cy="84" r="12"/><circle cx="70" cy="88" r="9"/></g>'
     '<circle cx="50" cy="46" r="17" fill="url(#arc-b)" stroke="#a8c2e8" stroke-width="2.2"/>'
     + eyes(44, 7.6, rx=4.2, ry=5)
     + blush(52, 13.5, c='#ff6fa5')
     + smile(52, w=4, c='#7ea6d6')
     + sparkle(14, 26, 4.2, '#ffd93d') + sparkle(86, 26, 3.4, '#ff8fc7')
     + sparkle(50, 12, 3.6, '#b28fff')))
