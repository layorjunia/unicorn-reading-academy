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
        intro: 'Hi! I\'m Pip the unicorn. Let\'s read some words together. Listen: Cat. Hat. Map. Pig. Sit. Wig. Now it is your turn!',
        narration: [
          { say: 'Hi! I\'m Pip the unicorn.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'cat' },
          { word: 'hat' },
          { word: 'map' },
          { word: 'pig' },
          { word: 'sit' },
          { word: 'wig' },
          { say: 'Now it is your turn!' }
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
        title: 'The Mat That Was Not Big Enough',
        emoji: '🐱🐷',
        pages: [
          'Mimi the cat had a red mat. It sat in the sun, and it was the best spot in the house to nap.',
          'Then Pat the pig sat down on it with a plop. "Hop off, Pat!" said Mimi. "I nap on that mat."',
          '"But it is soft," said Pat. Mimi sat back to back with him, but the mat was not big enough, and Mimi slid off.',
          'Then Mimi had a plan. Mimi got up and sat on top of Pat. "You are soft, Pat!" And the two had a nap.'
        ],
        questions: [
          { q: 'Why did Pat want to sit on the mat?', choices: ['The mat was wet', 'The mat was soft', 'The mat was big'], answer: 1 },
          { q: 'How did Mimi and Pat get a nap in the end?', choices: ['They got a bigger mat', 'Pat ran off and left the mat', 'Mimi sat on top of Pat'], answer: 2 }
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
        intro: 'I\'m Dot the dragon. Let\'s read some words together. Listen: Hop. Dog. Bug. Sun. Red. Pet. Now it is your turn!',
        narration: [
          { say: 'I\'m Dot the dragon.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'hop' },
          { word: 'dog' },
          { word: 'bug' },
          { word: 'sun' },
          { word: 'red' },
          { word: 'pet' },
          { say: 'Now it is your turn!' }
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
        title: 'Dot and the Bug in the Mud',
        emoji: '🐞🥁',
        pages: [
          'Dot sat on a log at the pond. "Help! Help!" A little bug was stuck down in the wet mud.',
          'Dot ran to help, but the mud was soft and wet. "If I get in, I will sink as well," she said.',
          'Dot did not want to give up. She got a big stick and held it down in the mud.',
          'The bug ran up the stick and sat in the sun. "Thank you, Dot," he said. "You did not give up on me."'
        ],
        questions: [
          { q: 'Dot did not get in the mud. What did she tell the bug?', choices: ['She said she would sink in the mud as well.', 'She said she did not want to help.', 'She said the mud was not wet.'], answer: 0 },
          { q: 'What did Dot get to help the bug get out?', choices: ['She got a big rock and set it in the pond.', 'She got a big stick and held it down in the mud.', 'She got in the mud and dug the bug up.'], answer: 1 }
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
        intro: 'I\'m Dot the dragon. Let\'s read some words together. Listen: Hop. Dog. Bug. Sun. Red. Pet. Now it is your turn!',
        narration: [
          { say: 'I\'m Dot the dragon.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'hop' },
          { word: 'dog' },
          { word: 'bug' },
          { word: 'sun' },
          { word: 'red' },
          { word: 'pet' },
          { say: 'Now it is your turn!' }
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
        title: 'The Tin Tub Ship',
        emoji: '🐣🦆',
        pages: [
          '"Ducks can swim on the pond, but chicks can not," said Chick. "I wish I had a ship."',
          'Duck ran to the shed and got a big tin tub. When Duck set it in the pond, it did not sink.',
          'Chick got in, and then a gust of wind sent the tub out on the pond. "Duck, help! I can not stop!"',
          'Duck swam out and got the tub back to the bank. "Thanks, Duck!" said Chick. "When can I do that again?"'
        ],
        questions: [
          { q: 'Why did Chick want a ship?', choices: ['Chicks can not swim', 'Chicks do not like ducks', 'The pond was too hot'], answer: 0 },
          { q: 'How did the tub get back to the bank?', choices: ['The wind sent it back', 'Chick swam with it', 'Duck swam out and got it'], answer: 2 }
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
        intro: 'Mimi here! Let\'s read some words together. Listen: Ship. Chick. Thin. When. Duck. Wish. Now it is your turn!',
        narration: [
          { say: 'Mimi here!' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'ship' },
          { word: 'chick' },
          { word: 'thin' },
          { word: 'when' },
          { word: 'duck' },
          { word: 'wish' },
          { say: 'Now it is your turn!' }
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
        title: 'Pip and the Stuck Frog',
        emoji: '🦄🐸',
        pages: [
          'Pip sat at the pond. On a flat rock, a small frog was stuck in the hot sun. "Help!" said the frog.',
          '"This rock is wet and slick," he said. "When I jump, I slip. I want to get back in the pond!"',
          'Pip got a big stick. He set it from the rock down to the pond. "Step on it," he said.',
          'The frog got a grip on the stick and slid down. Plop! "Thank you, Pip!" said the frog. "Come swim with me!"'
        ],
        questions: [
          { q: 'Why can the frog not jump back into the pond?', choices: ['He is full from lunch and wants a nap', 'The rock is wet and slick, so he slips', 'He does not know how to swim'], answer: 1 },
          { q: 'How does Pip help the frog?', choices: ['He splashes water on the hot rock', 'He picks the frog up in his hands', 'He sets a stick from the rock down to the pond'], answer: 2 }
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
        intro: 'Hi! I\'m Pip the unicorn. Let\'s read some words together. Listen: Sand. Jump. Nest. Tent. Milk. Lamp. Now it is your turn!',
        narration: [
          { say: 'Hi! I\'m Pip the unicorn.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'sand' },
          { word: 'jump' },
          { word: 'nest' },
          { word: 'tent' },
          { word: 'milk' },
          { word: 'lamp' },
          { say: 'Now it is your turn!' }
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
        title: 'The Nest in the Wind',
        emoji: '🪺🏕️',
        pages: [
          'Pip and Dad set up camp under a tall elm. "A nest with eggs!" said Pip. "I want to watch them hatch."',
          'Then a big wind bent the elm. The nest fell in the grass with a bump, but the eggs did not crack.',
          '"Will the mom finch come back?" said Pip. "Not down in the grass," said Dad. "But I can lift you up."',
          'Dad held Pip up, and Pip set the nest back in the elm. At last the mom finch went back to the eggs.'
        ],
        questions: [
          { q: 'Why did the nest have to go back up in the elm?', choices: ['The mom finch will not land down in the grass', 'The eggs did not crack', 'The tent was in the grass'], answer: 0 },
          { q: 'How did the nest get back up in the elm?', choices: ['Pip went up the elm', 'The wind put it back', 'Dad held Pip up so Pip could set it back'], answer: 2 }
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
        intro: 'I\'m Bun the bunny. Let\'s read some words together. Listen: Ring. King. Pink. Wink. Ball. Tall. Now it is your turn!',
        narration: [
          { say: 'I\'m Bun the bunny.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'ring' },
          { word: 'king' },
          { word: 'pink' },
          { word: 'wink' },
          { word: 'ball' },
          { word: 'tall' },
          { say: 'Now it is your turn!' }
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
        title: 'The King\'s Lost Ring',
        emoji: '👑🦄',
        pages: [
          'The king had a nap in the tall grass. When the king sat up, his ring was gone.',
          '"That ring was a gift from Mother," said the king. "I must get it back!" Pip, Bun and Dot ran to help.',
          'The grass was up to Bun\'s chin. "Do not stomp!" said Dot. "The ring will sink down. Hunt with your hands."',
          'Then Bun felt a lump in the grass. It was the ring! "Thank you all!" said the king.'
        ],
        questions: [
          { q: 'What did the king tell them about the ring?', choices: ['It was a gift from Mother', 'It was pink and small', 'It was lost in the sand'], answer: 0 },
          { q: 'What did Dot tell them to do?', choices: ['Stomp in the grass', 'Hunt with their hands', 'Nap in the tall grass'], answer: 1 }
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
