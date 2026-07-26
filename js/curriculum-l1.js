// Level 1 — Sparkle Meadow 🌸
// Review & solidify: short vowels (CVC), digraphs, blends, glued sounds.
// Stories are decodable: they use only patterns taught so far in the sequence
// plus heart words from sets already introduced (see extras.js).

const LEVEL1 = {
  id: 'L1',
  name: 'Sparkle Meadow',
  emoji: '🌸',
  color: '#ff8fc7',
  islands: [

    // ─────────────────────────────────────────────
    {
      id: 'L1-1',
      title: 'Short a & i',
      sub: 'cat • sit',
      emoji: '🐱',
      guide: 'Pip',
      teach: {
        intro: 'Hi! I\'m Pip the unicorn! Let\'s learn two short vowel sounds. Tap each letter, then tap each word to hear it!',
        narration: [
          { say: 'Hi! I\'m Pip the unicorn!' },
          { say: 'Let\'s learn two short vowel sounds.' },
          { say: 'The letter' },
          { ltr: 'a' },
          { say: 'can say' },
          { ph: 'a' },
          { say: 'like in' },
          { word: 'cat' },
          { say: 'And the letter' },
          { ltr: 'i' },
          { say: 'can say' },
          { ph: 'i' },
          { say: 'like in' },
          { word: 'sit' },
          { say: 'Tap each letter, then tap each word to hear it!' }
        ],
        patterns: [
          { g: 'a', say: 'ah', ex: 'cat' },
          { g: 'i', say: 'ih', ex: 'sit' }
        ],
        examples: ['cat', 'hat', 'map', 'pig', 'sit', 'wig']
      },
      soundIt: [
        { word: 'cat', sounds: ['c', 'a', 't'], choices: ['cat', 'cot', 'cap'] },
        { word: 'pig', sounds: ['p', 'i', 'g'], choices: ['pit', 'pig', 'peg'] },
        { word: 'ham', sounds: ['h', 'a', 'm'], choices: ['him', 'hat', 'ham'] },
        { word: 'lip', sounds: ['l', 'i', 'p'], choices: ['lap', 'lip', 'lit'] }
      ],
      buildIt: [
        { word: 'hat', tiles: ['h', 'a', 't'], extra: ['i', 's'] },
        { word: 'pin', tiles: ['p', 'i', 'n'], extra: ['a', 'm'] },
        { word: 'bag', tiles: ['b', 'a', 'g'], extra: ['i', 'd'] },
        { word: 'six', tiles: ['s', 'i', 'x'], extra: ['a', 't'] }
      ],
      sortIt: {
        a: { label: 'short a 🍎', ex: 'cat' },
        b: { label: 'short i 🐷', ex: 'sit' },
        words: [
          { w: 'map', cat: 'a' }, { w: 'win', cat: 'b' },
          { w: 'jam', cat: 'a' }, { w: 'fix', cat: 'b' },
          { w: 'nap', cat: 'a' }, { w: 'dig', cat: 'b' },
          { w: 'rag', cat: 'a' }, { w: 'zip', cat: 'b' }
        ]
      },
      readIt: {
        title: 'Mimi and the Pig',
        emoji: '🐱🐷',
        pages: [
          'Mimi is a cat. Mimi sat on a mat.',
          'A pig ran in! The pig is big.',
          'The pig sat on the mat. The mat is flat!',
          'Mimi and the pig nap on the mat.'
        ],
        questions: [
          { q: 'Who is Mimi?', choices: ['a cat', 'a pig', 'a hat'], answer: 0 },
          { q: 'What did the pig do to the mat?', choices: ['bit it', 'sat on it and made it flat', 'hid it'], answer: 1 }
        ]
      },
      mastery: [
        { word: 'cat', choices: ['cat', 'cot', 'cut', 'kit'] },
        { word: 'sit', choices: ['sat', 'set', 'sit', 'sip'] },
        { word: 'map', choices: ['mop', 'map', 'mip', 'nap'] },
        { word: 'wig', choices: ['wag', 'wig', 'win', 'dig'] },
        { word: 'jam', choices: ['jam', 'jim', 'ham', 'jab'] },
        { word: 'fin', choices: ['fan', 'fit', 'fin', 'pin'] },
        { word: 'rat', choices: ['rat', 'rot', 'rip', 'mat'] },
        { word: 'lid', choices: ['lad', 'lid', 'lip', 'hid'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L1-2',
      title: 'Short o, u & e',
      sub: 'hop • bug • red',
      emoji: '🐸',
      guide: 'Dot',
      teach: {
        intro: 'I\'m Dot the dragon! Here come three more short vowel sounds. Listen for the vowel in hop, in bug, and in red. Tap each letter to hear its sound!',
        narration: [
          { say: 'I\'m Dot the dragon! Here come three more short vowel sounds.' },
          { say: 'This letter says' },
          { ph: 'o' },
          { say: 'like in' },
          { word: 'hop' },
          { say: 'This next letter says' },
          { ph: 'u' },
          { say: 'like in' },
          { word: 'bug' },
          { say: 'And this last letter says' },
          { ph: 'e' },
          { say: 'like in' },
          { word: 'red' },
          { say: 'Tap each letter to hear its sound!' }
        ],
        patterns: [
          { g: 'o', say: 'aw', ex: 'hop' },
          { g: 'u', say: 'uh', ex: 'bug' },
          { g: 'e', say: 'eh', ex: 'red' }
        ],
        examples: ['hop', 'dog', 'bug', 'sun', 'red', 'pet']
      },
      soundIt: [
        { word: 'dog', sounds: ['d', 'o', 'g'], choices: ['dig', 'dog', 'dug'] },
        { word: 'sun', sounds: ['s', 'u', 'n'], choices: ['sun', 'son', 'sit'] },
        { word: 'bed', sounds: ['b', 'e', 'd'], choices: ['bad', 'bud', 'bed'] },
        { word: 'mud', sounds: ['m', 'u', 'd'], choices: ['mad', 'mud', 'mod'] }
      ],
      buildIt: [
        { word: 'log', tiles: ['l', 'o', 'g'], extra: ['u', 'e'] },
        { word: 'bug', tiles: ['b', 'u', 'g'], extra: ['o', 'd'] },
        { word: 'pet', tiles: ['p', 'e', 't'], extra: ['u', 'g'] },
        { word: 'pot', tiles: ['p', 'o', 't'], extra: ['e', 'n'] }
      ],
      sortIt: {
        a: { label: 'short o 🐙', ex: 'hop' },
        b: { label: 'short u 🌞', ex: 'bug' },
        words: [
          { w: 'top', cat: 'a' }, { w: 'cup', cat: 'b' },
          { w: 'box', cat: 'a' }, { w: 'run', cat: 'b' },
          { w: 'mop', cat: 'a' }, { w: 'tub', cat: 'b' },
          { w: 'job', cat: 'a' }, { w: 'hug', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Bug in the Mud',
        emoji: '🐞🥁',
        pages: [
          'Dot the dragon sat on a log.',
          'A bug hops in the mud. Hop, hop, hop!',
          'The bug is wet. The bug is sad.',
          'Dot got the bug. The bug sat in the sun. The bug is not sad now!'
        ],
        questions: [
          { q: 'Where did the bug hop?', choices: ['in the mud', 'on a bed', 'in a cup'], answer: 0 },
          { q: 'How did Dot help?', choices: ['She hid the bug', 'She got the bug out and it sat in the sun', 'She ran away'], answer: 1 }
        ]
      },
      mastery: [
        { word: 'hop', choices: ['hip', 'hop', 'hup', 'top'] },
        { word: 'bug', choices: ['bug', 'bog', 'beg', 'big'] },
        { word: 'red', choices: ['rid', 'rod', 'red', 'bed'] },
        { word: 'cup', choices: ['cap', 'cup', 'cop', 'pup'] },
        { word: 'net', choices: ['not', 'nut', 'net', 'met'] },
        { word: 'fox', choices: ['fix', 'fox', 'fun', 'box'] },
        { word: 'ten', choices: ['tan', 'ton', 'ten', 'hen'] },
        { word: 'jog', choices: ['jog', 'jug', 'jig', 'log'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L1-3',
      title: 'Digraphs',
      sub: 'sh • ch • th • wh • ck',
      emoji: '🦆',
      guide: 'Mimi',
      teach: {
        intro: 'Mimi here! Two letters can hold paws and make ONE sound! Listen to each team: sh in ship, ch in chick, th in thin, wh in when, ck in duck. Two letters, one sound every time. Now let\'s read them!',
        narration: [
          { say: 'Mimi here!' },
          { say: 'Two letters can hold paws and make one sound!' },
          { say: 'Listen to each team.' },
          { ltr: 's' },
          { ltr: 'h' },
          { say: 'together they say' },
          { ph: 'sh' },
          { say: 'like in' },
          { word: 'ship' },
          { ltr: 'c' },
          { ltr: 'h' },
          { say: 'together they say' },
          { ph: 'ch' },
          { say: 'like in' },
          { word: 'chick' },
          { ltr: 't' },
          { ltr: 'h' },
          { say: 'together they say' },
          { ph: 'th' },
          { say: 'like in' },
          { word: 'thin' },
          { ltr: 'w' },
          { ltr: 'h' },
          { say: 'together they say' },
          { ph: 'wh' },
          { say: 'like in' },
          { word: 'when' },
          { ltr: 'c' },
          { ltr: 'k' },
          { say: 'together they say' },
          { ph: 'ck' },
          { say: 'like in' },
          { word: 'duck' },
          { say: 'Two letters, one sound every time. Now let\'s read them!' }
        ],
        patterns: [
          { g: 'sh', say: 'shh', ex: 'ship' },
          { g: 'ch', say: 'chuh', ex: 'chick' },
          { g: 'th', say: 'thh', ex: 'thin' },
          { g: 'wh', say: 'wh', ex: 'whip' },
          { g: 'ck', say: 'k', ex: 'duck' }
        ],
        examples: ['ship', 'chick', 'thin', 'when', 'duck', 'wish']
      },
      soundIt: [
        { word: 'ship', sounds: ['sh', 'i', 'p'], choices: ['shop', 'ship', 'chip'] },
        { word: 'chin', sounds: ['ch', 'i', 'n'], choices: ['chin', 'thin', 'shin'] },
        { word: 'duck', sounds: ['d', 'u', 'ck'], choices: ['dock', 'duck', 'tuck'] },
        { word: 'math', sounds: ['m', 'a', 'th'], choices: ['mash', 'match', 'math'] }
      ],
      buildIt: [
        { word: 'shop', tiles: ['sh', 'o', 'p'], extra: ['ch', 't'] },
        { word: 'chat', tiles: ['ch', 'a', 't'], extra: ['sh', 'p'] },
        { word: 'sock', tiles: ['s', 'o', 'ck'], extra: ['sh', 'e'] },
        { word: 'whiz', tiles: ['wh', 'i', 'z'], extra: ['th', 'o'] }
      ],
      sortIt: {
        a: { label: 'sh 🚢', ex: 'ship' },
        b: { label: 'ch 🐣', ex: 'chick' },
        words: [
          { w: 'fish', cat: 'a' }, { w: 'much', cat: 'b' },
          { w: 'shut', cat: 'a' }, { w: 'chop', cat: 'b' },
          { w: 'wish', cat: 'a' }, { w: 'rich', cat: 'b' },
          { w: 'shed', cat: 'a' }, { w: 'chum', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Chick and the Duck',
        emoji: '🐣🦆',
        pages: [
          'A chick and a duck sat in the shed.',
          '"I wish I had a ship," said the chick.',
          'The duck got a box. Chop, chop! The box is a ship!',
          'The chick and the duck sat in the ship. What fun!'
        ],
        questions: [
          { q: 'What did the chick wish for?', choices: ['a fish', 'a ship', 'a sock'], answer: 1 },
          { q: 'What did the duck make the ship from?', choices: ['a box', 'a shell', 'mud'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'ship', choices: ['ship', 'chip', 'shop', 'sip'] },
        { word: 'chick', choices: ['check', 'chick', 'thick', 'click'] },
        { word: 'when', choices: ['when', 'then', 'hen', 'wet'] },
        { word: 'duck', choices: ['dock', 'tuck', 'duck', 'luck'] },
        { word: 'wish', choices: ['wash', 'witch', 'wish', 'fish'] },
        { word: 'chop', choices: ['chop', 'shop', 'chip', 'hop'] },
        { word: 'them', choices: ['them', 'then', 'hem', 'stem'] },
        { word: 'shell', choices: ['shall', 'sell', 'shell', 'smell'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L1-4',
      title: 'Starting Blends',
      sub: 'st • sl • fr • pl • gr',
      emoji: '⭐',
      guide: 'Pip',
      teach: {
        intro: 'Blends are two letters that slide together fast — but you can still hear BOTH sounds! s + t → star. p + l → plum. g + r → grin. Listen for blends in sled, frog, and stop too!',
        narration: [
          { say: 'Some words begin with two letters that slide together really fast.' },
          { say: 'But listen closely, because you can still hear both sounds.' },
          { say: 'Listen to this one.' },
          { ph: 's' },
          { ph: 't' },
          { say: 'Slide those two sounds together and you get' },
          { word: 'star' },
          { say: 'Both sounds are still in that word. Here is another.' },
          { ph: 'p' },
          { ph: 'l' },
          { say: 'Slide them together and you get' },
          { word: 'plum' },
          { say: 'One more time. Listen.' },
          { ph: 'g' },
          { ph: 'r' },
          { say: 'Slide them together and you get' },
          { word: 'grin' },
          { say: 'That is called blending. Two sounds hold hands and zoom into the word.' },
          { say: 'You can hear blends at the start of these words too.' },
          { word: 'sled' },
          { word: 'frog' },
          { word: 'stop' },
          { say: 'Your turn to blend. Ready?' }
        ],
        patterns: [
          { g: 'st', say: 'st', ex: 'star' },
          { g: 'sl', say: 'sl', ex: 'sled' },
          { g: 'fr', say: 'fr', ex: 'frog' },
          { g: 'pl', say: 'pl', ex: 'plum' },
          { g: 'gr', say: 'gr', ex: 'grin' }
        ],
        examples: ['star', 'sled', 'frog', 'plum', 'grin', 'stop']
      },
      soundIt: [
        { word: 'frog', sounds: ['f', 'r', 'o', 'g'], choices: ['from', 'frog', 'fog'] },
        { word: 'sled', sounds: ['s', 'l', 'e', 'd'], choices: ['sled', 'shed', 'led'] },
        { word: 'plan', sounds: ['p', 'l', 'a', 'n'], choices: ['pan', 'plum', 'plan'] },
        { word: 'grin', sounds: ['g', 'r', 'i', 'n'], choices: ['grin', 'grab', 'gin'] }
      ],
      buildIt: [
        { word: 'stop', tiles: ['s', 't', 'o', 'p'], extra: ['l', 'e'] },
        { word: 'flag', tiles: ['f', 'l', 'a', 'g'], extra: ['r', 'o'] },
        { word: 'drum', tiles: ['d', 'r', 'u', 'm'], extra: ['g', 'a'] },
        { word: 'slip', tiles: ['s', 'l', 'i', 'p'], extra: ['t', 'e'] }
      ],
      sortIt: {
        a: { label: 'starts with s-blend ⭐', ex: 'star' },
        b: { label: 'starts with r-blend 🐸', ex: 'frog' },
        words: [
          { w: 'spin', cat: 'a' }, { w: 'grab', cat: 'b' },
          { w: 'step', cat: 'a' }, { w: 'trip', cat: 'b' },
          { w: 'swim', cat: 'a' }, { w: 'drop', cat: 'b' },
          { w: 'snap', cat: 'a' }, { w: 'crab', cat: 'b' }
        ]
      },
      readIt: {
        title: 'Pip and the Frog',
        emoji: '🦄🐸',
        pages: [
          'Pip the unicorn ran to the pond. Splish, splash!',
          'A frog sat on a rock. "I am stuck!" said the frog.',
          'Pip did not stop. Pip swam to the rock.',
          'The frog got on Pip. They swam back. The frog did a big grin!'
        ],
        questions: [
          { q: 'Who was stuck on the rock?', choices: ['Pip', 'a frog', 'a crab'], answer: 1 },
          { q: 'How did Pip help the frog?', choices: ['She swam to the rock and carried it back', 'She got a net', 'She called Mimi'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'stop', choices: ['stop', 'step', 'shop', 'top'] },
        { word: 'frog', choices: ['from', 'frog', 'fog', 'flag'] },
        { word: 'plum', choices: ['plan', 'plus', 'plum', 'drum'] },
        { word: 'grin', choices: ['grin', 'grab', 'green', 'gran'] },
        { word: 'sled', choices: ['slid', 'sled', 'shed', 'slap'] },
        { word: 'swim', choices: ['swam', 'swim', 'slim', 'spin'] },
        { word: 'crab', choices: ['crab', 'grab', 'cab', 'crib'] },
        { word: 'star', choices: ['stir', 'scar', 'star', 'spar'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L1-5',
      title: 'Ending Blends',
      sub: 'st • nd • mp • nt • lk',
      emoji: '🏕️',
      guide: 'Bun',
      teach: {
        intro: 'I\'m Bun the bunny! Blends can hop onto the END of words too — and you still hear BOTH sounds! -nd like in sand. -mp like in jump. -st like in nest.',
        narration: [
          { say: 'Hi! I\'m Bun the bunny!' },
          { say: 'Blends can hop onto the end of words too!' },
          { say: 'You can still hear both sounds. Listen.' },
          { say: 'This ending says' },
          { ph: 'n' },
          { ph: 'd' },
          { say: 'like in' },
          { word: 'sand' },
          { say: 'This ending says' },
          { ph: 'm' },
          { ph: 'p' },
          { say: 'like in' },
          { word: 'jump' },
          { say: 'And this ending says' },
          { ph: 's' },
          { ph: 't' },
          { say: 'like in' },
          { word: 'nest' },
          { say: 'Hop through the words and listen to every ending!' }
        ],
        patterns: [
          { g: 'nd', say: 'nd', ex: 'sand' },
          { g: 'mp', say: 'mp', ex: 'jump' },
          { g: 'st', say: 'st', ex: 'nest' },
          { g: 'nt', say: 'nt', ex: 'tent' },
          { g: 'lk', say: 'lk', ex: 'milk' }
        ],
        examples: ['sand', 'jump', 'nest', 'tent', 'milk', 'lamp']
      },
      soundIt: [
        { word: 'jump', sounds: ['j', 'u', 'm', 'p'], choices: ['jam', 'jump', 'bump'] },
        { word: 'nest', sounds: ['n', 'e', 's', 't'], choices: ['net', 'rest', 'nest'] },
        { word: 'sand', sounds: ['s', 'a', 'n', 'd'], choices: ['sand', 'send', 'stand'] },
        { word: 'milk', sounds: ['m', 'i', 'l', 'k'], choices: ['silk', 'milk', 'mill'] }
      ],
      buildIt: [
        { word: 'tent', tiles: ['t', 'e', 'n', 't'], extra: ['s', 'a'] },
        { word: 'lamp', tiles: ['l', 'a', 'm', 'p'], extra: ['n', 'i'] },
        { word: 'hand', tiles: ['h', 'a', 'n', 'd'], extra: ['m', 't'] },
        { word: 'fast', tiles: ['f', 'a', 's', 't'], extra: ['n', 'e'] }
      ],
      sortIt: {
        a: { label: 'ends with -mp 🦘', ex: 'jump' },
        b: { label: 'ends with -st 🪺', ex: 'nest' },
        words: [
          { w: 'camp', cat: 'a' }, { w: 'best', cat: 'b' },
          { w: 'bump', cat: 'a' }, { w: 'rest', cat: 'b' },
          { w: 'lamp', cat: 'a' }, { w: 'fist', cat: 'b' },
          { w: 'limp', cat: 'a' }, { w: 'last', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Best Nest',
        emoji: '🪺🏕️',
        pages: [
          'Bun and Mimi went to camp. They set up a tent in the sand.',
          'A bird had a nest by the tent. The wind sent the nest — plop! — into the sand.',
          '"We must help!" said Bun. They got the nest.',
          'Mimi put the nest back. The bird sang. It was the best camp!'
        ],
        questions: [
          { q: 'What fell into the sand?', choices: ['the tent', 'the nest', 'the milk'], answer: 1 },
          { q: 'Who put the nest back?', choices: ['Mimi', 'the wind', 'the bird'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'jump', choices: ['jump', 'bump', 'pump', 'just'] },
        { word: 'nest', choices: ['best', 'nest', 'net', 'rest'] },
        { word: 'hand', choices: ['band', 'sand', 'hand', 'had'] },
        { word: 'tent', choices: ['tent', 'sent', 'ten', 'bent'] },
        { word: 'milk', choices: ['mill', 'silk', 'milk', 'melt'] },
        { word: 'lamp', choices: ['lamp', 'limp', 'camp', 'lap'] },
        { word: 'wind', choices: ['wand', 'wind', 'win', 'mind'] },
        { word: 'soft', choices: ['sort', 'sift', 'soft', 'lost'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L1-6',
      title: 'Glued Sounds',
      sub: 'ing • ank • ink • all',
      emoji: '👑',
      guide: 'Dot',
      teach: {
        intro: 'Some letters get glued together like sparkle glue! -ing says /ing/ like in ring. -ank says /ank/ like in bank. -ink says /ink/ like in pink. -all says /all/ like in ball! Glued endings never come apart. Say each ending in one quick whoosh!',
        narration: [
          { say: 'Some letters get glued together like sparkle glue!' },
          { say: 'This ending says' },
          { ph: 'ing' },
          { say: 'like in' },
          { word: 'ring' },
          { say: 'This next ending says' },
          { ph: 'ank' },
          { say: 'like in' },
          { word: 'bank' },
          { say: 'This one says' },
          { ph: 'ink' },
          { say: 'like in' },
          { word: 'pink' },
          { say: 'And the last ending says' },
          { ph: 'all' },
          { say: 'like in' },
          { word: 'ball' },
          { say: 'Glued endings never come apart. Say each ending in one quick whoosh!' }
        ],
        patterns: [
          { g: 'ing', say: 'ing', ex: 'ring' },
          { g: 'ank', say: 'ank', ex: 'bank' },
          { g: 'ink', say: 'ink', ex: 'pink' },
          { g: 'all', say: 'all', ex: 'ball' }
        ],
        examples: ['ring', 'king', 'pink', 'wink', 'ball', 'tall']
      },
      soundIt: [
        { word: 'ring', sounds: ['r', 'ing'], choices: ['rang', 'ring', 'wing'] },
        { word: 'pink', sounds: ['p', 'ink'], choices: ['pink', 'sink', 'pin'] },
        { word: 'ball', sounds: ['b', 'all'], choices: ['bell', 'tall', 'ball'] },
        { word: 'sang', sounds: ['s', 'ang'], choices: ['sing', 'sang', 'song'] }
      ],
      buildIt: [
        { word: 'king', tiles: ['k', 'ing'], extra: ['ink', 's'] },
        { word: 'wink', tiles: ['w', 'ink'], extra: ['ing', 'b'] },
        { word: 'tall', tiles: ['t', 'all'], extra: ['ell', 'f'] },
        { word: 'thank', tiles: ['th', 'ank'], extra: ['ink', 'sh'] }
      ],
      sortIt: {
        a: { label: '-ing 💍', ex: 'ring' },
        b: { label: '-ink 🎀', ex: 'pink' },
        words: [
          { w: 'sing', cat: 'a' }, { w: 'sink', cat: 'b' },
          { w: 'wing', cat: 'a' }, { w: 'mink', cat: 'b' },
          { w: 'sting', cat: 'a' }, { w: 'blink', cat: 'b' },
          { w: 'bring', cat: 'a' }, { w: 'drink', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The King of Sparkle Meadow',
        emoji: '👑🦄',
        pages: [
          'The king lost his ring! "It is pink and small," said the king.',
          'Pip, Mimi, Bun and Dot all went to help.',
          'Bun went to the tall grass. Wink, wink! What is that?',
          'The pink ring! The king said, "Thank you all!" And they all sang a song.'
        ],
        questions: [
          { q: 'What did the king lose?', choices: ['his crown', 'his pink ring', 'his song'], answer: 1 },
          { q: 'Where was the ring?', choices: ['in the tall grass', 'in the sink', 'in a box'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'ring', choices: ['ring', 'rang', 'wing', 'rink'] },
        { word: 'pink', choices: ['pine', 'pink', 'wink', 'ping'] },
        { word: 'ball', choices: ['bell', 'ball', 'tall', 'bull'] },
        { word: 'king', choices: ['kind', 'king', 'kick', 'sing'] },
        { word: 'drink', choices: ['drink', 'drank', 'dring', 'blink'] },
        { word: 'small', choices: ['smell', 'small', 'spill', 'stall'] },
        { word: 'thing', choices: ['think', 'thing', 'thin', 'sting'] },
        { word: 'bank', choices: ['bank', 'bunk', 'tank', 'band'] }
      ]
    }
  ]
};
