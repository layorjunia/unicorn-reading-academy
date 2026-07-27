// Level 2 — Rainbow Forest 🦄
// The heart of 2nd grade: silent-e, r-controlled vowels, vowel teams, diphthongs.

const LEVEL2 = {
  id: 'L2',
  name: 'Rainbow Forest',
  emoji: '🦄',
  color: '#b28fff',
  islands: [

    // ─────────────────────────────────────────────
    {
      id: 'L2-1',
      title: 'Magic e: a_e & i_e',
      sub: 'cake • ride',
      emoji: '🎂',
      guide: 'Pip',
      teach: {
        intro: 'Hi! I\'m Pip the unicorn. Let\'s read some words together. Listen: Cake. Gate. Wave. Ride. Kite. Smile. Now it is your turn!',
        narration: [
          { say: 'Hi! I\'m Pip the unicorn.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'cake' },
          { word: 'gate' },
          { word: 'wave' },
          { word: 'ride' },
          { word: 'kite' },
          { word: 'smile' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'a_e', say: 'ay', ex: 'cake' },
          { g: 'i_e', say: 'eye', ex: 'ride' }
        ],
        examples: ['cake', 'gate', 'wave', 'ride', 'kite', 'smile']
      },
      soundIt: [
        { word: 'cake', sounds: ['c', 'a_e', 'k'], choices: ['cake', 'lake', 'cape'] },
        { word: 'kite', sounds: ['k', 'i_e', 't'], choices: ['kit', 'kite', 'bite'] },
        { word: 'gate', sounds: ['g', 'a_e', 't'], choices: ['get', 'gate', 'game'] },
        { word: 'five', sounds: ['f', 'i_e', 'v'], choices: ['five', 'hive', 'fin'] }
      ],
      buildIt: [
        { word: 'lake', tiles: ['l', 'a', 'k', 'e'], extra: ['i', 't'] },
        { word: 'bike', tiles: ['b', 'i', 'k', 'e'], extra: ['a', 'd'] },
        { word: 'name', tiles: ['n', 'a', 'm', 'e'], extra: ['i', 'p'] },
        { word: 'time', tiles: ['t', 'i', 'm', 'e'], extra: ['a', 'k'] }
      ],
      sortIt: {
        a: { label: 'short a — no magic 🎩', ex: 'cap' },
        b: { label: 'magic e — a says its name ✨', ex: 'cape' },
        words: [
          { w: 'tap', cat: 'a' }, { w: 'tape', cat: 'b' },
          { w: 'mad', cat: 'a' }, { w: 'made', cat: 'b' },
          { w: 'plan', cat: 'a' }, { w: 'plane', cat: 'b' },
          { w: 'can', cat: 'a' }, { w: 'cane', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Cake by the Lake',
        emoji: '🎂🌊',
        pages: [
          'Pip made a cake to take to the lake.',
          'Mimi came on a bike. Bun came on skates!',
          'A snake slid up. "I like cake," said the snake with a smile.',
          'They gave the snake a slice. It was a fine time at the lake!'
        ],
        questions: [
          { q: 'What did Pip make?', choices: ['a kite', 'a cake', 'a gate'], answer: 1 },
          { q: 'How did Mimi get to the lake?', choices: ['on a bike', 'on a plane', 'she swam'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'cake', choices: ['cake', 'lake', 'cap', 'coke'] },
        { word: 'ride', choices: ['rid', 'ride', 'rude', 'hide'] },
        { word: 'gate', choices: ['get', 'gate', 'late', 'gaze'] },
        { word: 'smile', choices: ['small', 'smile', 'slime', 'mile'] },
        { word: 'plane', choices: ['plan', 'plane', 'plate', 'lane'] },
        { word: 'bike', choices: ['bake', 'bike', 'back', 'hike'] },
        { word: 'wave', choices: ['wave', 'wove', 'gave', 'wage'] },
        { word: 'shine', choices: ['shin', 'shine', 'spine', 'shone'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L2-2',
      title: 'Magic e: o_e & u_e',
      sub: 'bone • cute',
      emoji: '🦴',
      guide: 'Dot',
      teach: {
        intro: 'I\'m Dot the dragon. Let\'s read some words together. Listen: Bone. Home. Rose. Cute. Mule. Tune. Now it is your turn!',
        narration: [
          { say: 'I\'m Dot the dragon.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'bone' },
          { word: 'home' },
          { word: 'rose' },
          { word: 'cute' },
          { word: 'mule' },
          { word: 'tune' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'o_e', say: 'oh', ex: 'bone' },
          { g: 'u_e', say: 'you', ex: 'cute' }
        ],
        examples: ['bone', 'home', 'rose', 'cute', 'mule', 'tune']
      },
      soundIt: [
        { word: 'bone', sounds: ['b', 'o_e', 'n'], choices: ['bun', 'bone', 'cone'] },
        { word: 'cute', sounds: ['c', 'u_e', 't'], choices: ['cute', 'cut', 'cube'] },
        { word: 'rope', sounds: ['r', 'o_e', 'p'], choices: ['rip', 'robe', 'rope'] },
        { word: 'home', sounds: ['h', 'o_e', 'm'], choices: ['home', 'hum', 'dome'] }
      ],
      buildIt: [
        { word: 'nose', tiles: ['n', 'o', 's', 'e'], extra: ['u', 'm'] },
        { word: 'cube', tiles: ['c', 'u', 'b', 'e'], extra: ['o', 't'] },
        { word: 'stone', tiles: ['s', 't', 'o', 'n', 'e'], extra: ['u', 'm'] },
        { word: 'flute', tiles: ['f', 'l', 'u', 't', 'e'], extra: ['o', 'n'] }
      ],
      sortIt: {
        a: { label: 'short o — no magic 🐸', ex: 'hop' },
        b: { label: 'magic e — o says its name ✨', ex: 'hope' },
        words: [
          { w: 'not', cat: 'a' }, { w: 'note', cat: 'b' },
          { w: 'rob', cat: 'a' }, { w: 'robe', cat: 'b' },
          { w: 'cod', cat: 'a' }, { w: 'code', cat: 'b' },
          { w: 'glob', cat: 'a' }, { w: 'globe', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Mole at Home',
        emoji: '🦫🏠',
        pages: [
          'A mole made a home under a stone.',
          'Dot came with a flute. She played a cute tune.',
          'The mole woke up! "I love that tune," said the mole.',
          'The mole gave Dot a rose. Dot rode home with a smile.'
        ],
        questions: [
          { q: 'Where was the mole\'s home?', choices: ['under a stone', 'in a rose', 'up a pole'], answer: 0 },
          { q: 'What did Dot play?', choices: ['a drum', 'a cute tune on her flute', 'a game'], answer: 1 }
        ]
      },
      mastery: [
        { word: 'bone', choices: ['bone', 'bane', 'bun', 'cone'] },
        { word: 'cute', choices: ['cut', 'cute', 'cube', 'kite'] },
        { word: 'home', choices: ['hum', 'dome', 'home', 'hose'] },
        { word: 'rose', choices: ['rose', 'rise', 'nose', 'rope'] },
        { word: 'mule', choices: ['mile', 'mole', 'mule', 'rule'] },
        { word: 'note', choices: ['not', 'note', 'nose', 'vote'] },
        { word: 'globe', choices: ['glob', 'globe', 'glow', 'grab'] },
        { word: 'tune', choices: ['ton', 'tune', 'tone', 'dune'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L2-3',
      title: 'Bossy r: ar & or',
      sub: 'star • corn',
      emoji: '🌽',
      guide: 'Mimi',
      teach: {
        intro: 'I\'m Dot the dragon. Let\'s read some words together. Listen: Bone. Home. Rose. Cute. Mule. Tune. Now it is your turn!',
        narration: [
          { say: 'I\'m Dot the dragon.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'bone' },
          { word: 'home' },
          { word: 'rose' },
          { word: 'cute' },
          { word: 'mule' },
          { word: 'tune' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'ar', say: 'ar', ex: 'star' },
          { g: 'or', say: 'or', ex: 'corn' }
        ],
        examples: ['star', 'car', 'barn', 'corn', 'fork', 'storm']
      },
      soundIt: [
        { word: 'star', sounds: ['s', 't', 'ar'], choices: ['stir', 'star', 'scar'] },
        { word: 'corn', sounds: ['c', 'or', 'n'], choices: ['corn', 'born', 'car'] },
        { word: 'barn', sounds: ['b', 'ar', 'n'], choices: ['born', 'barn', 'bar'] },
        { word: 'fort', sounds: ['f', 'or', 't'], choices: ['fort', 'fart', 'sort'] }
      ],
      buildIt: [
        { word: 'car', tiles: ['c', 'ar'], extra: ['or', 't'] },
        { word: 'fork', tiles: ['f', 'or', 'k'], extra: ['ar', 'n'] },
        { word: 'shark', tiles: ['sh', 'ar', 'k'], extra: ['or', 'ch'] },
        { word: 'storm', tiles: ['s', 't', 'or', 'm'], extra: ['ar', 'p'] }
      ],
      sortIt: {
        a: { label: 'ar ⭐', ex: 'star' },
        b: { label: 'or 🌽', ex: 'corn' },
        words: [
          { w: 'park', cat: 'a' }, { w: 'born', cat: 'b' },
          { w: 'farm', cat: 'a' }, { w: 'horn', cat: 'b' },
          { w: 'dark', cat: 'a' }, { w: 'sport', cat: 'b' },
          { w: 'smart', cat: 'a' }, { w: 'north', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Storm at the Barn',
        emoji: '⛈️🚜',
        pages: [
          'Mimi went to the farm in her car. She had corn for the horse.',
          'A storm came! The dark sky went CRACK!',
          'Mimi ran to the barn. The horse was scared.',
          '"Do not be scared," said Mimi. They shared the corn until the stars came out.'
        ],
        questions: [
          { q: 'What did Mimi bring to the farm?', choices: ['a fork', 'corn for the horse', 'a torch'], answer: 1 },
          { q: 'Where did Mimi go when the storm came?', choices: ['to the barn', 'home', 'to the park'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'star', choices: ['star', 'store', 'stir', 'scar'] },
        { word: 'corn', choices: ['car', 'corn', 'born', 'cord'] },
        { word: 'barn', choices: ['born', 'burn', 'barn', 'bark'] },
        { word: 'fork', choices: ['fork', 'form', 'far', 'pork'] },
        { word: 'shark', choices: ['sharp', 'shark', 'short', 'spark'] },
        { word: 'storm', choices: ['storm', 'store', 'star', 'stork'] },
        { word: 'park', choices: ['pork', 'park', 'part', 'dark'] },
        { word: 'horse', choices: ['house', 'hose', 'horse', 'harsh'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L2-4',
      title: 'Bossy r: er, ir & ur',
      sub: 'her • bird • purr',
      emoji: '🐦',
      guide: 'Bun',
      teach: {
        intro: 'Mimi here! Let\'s read some words together. Listen:  Now it is your turn!',
        narration: [
          { say: 'Mimi here!' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'er', say: 'er', ex: 'her' },
          { g: 'ir', say: 'er', ex: 'bird' },
          { g: 'ur', say: 'er', ex: 'purr' }
        ],
        examples: ['her', 'fern', 'bird', 'girl', 'purr', 'turn']
      },
      soundIt: [
        { word: 'bird', sounds: ['b', 'ir', 'd'], choices: ['bird', 'bard', 'burn'] },
        { word: 'fern', sounds: ['f', 'er', 'n'], choices: ['fern', 'firm', 'far'] },
        { word: 'turn', sounds: ['t', 'ur', 'n'], choices: ['torn', 'turn', 'burn'] },
        { word: 'girl', sounds: ['g', 'ir', 'l'], choices: ['girl', 'gull', 'curl'] }
      ],
      buildIt: [
        { word: 'her', tiles: ['h', 'er'], extra: ['ir', 'd'] },
        { word: 'bird', tiles: ['b', 'ir', 'd'], extra: ['ur', 't'] },
        { word: 'surf', tiles: ['s', 'ur', 'f'], extra: ['er', 'n'] },
        { word: 'twirl', tiles: ['t', 'w', 'ir', 'l'], extra: ['ur', 'p'] }
      ],
      sortIt: {
        a: { label: 'ir 🐦', ex: 'bird' },
        b: { label: 'ur 🐱', ex: 'purr' },
        words: [
          { w: 'girl', cat: 'a' }, { w: 'turn', cat: 'b' },
          { w: 'first', cat: 'a' }, { w: 'hurt', cat: 'b' },
          { w: 'shirt', cat: 'a' }, { w: 'curl', cat: 'b' },
          { w: 'third', cat: 'a' }, { w: 'burst', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Bird and the Fern',
        emoji: '🐦🌿',
        pages: [
          'A little bird hid under a fern. Her wing was hurt.',
          'Mimi found her first. "Purr, purr," said Mimi. "Do not be scared."',
          'Bun got a nurse. The nurse fixed the wing.',
          'The bird gave a twirl in the sky. "Thank you!" she chirped. Mimi purred.'
        ],
        questions: [
          { q: 'What was wrong with the bird?', choices: ['her wing was hurt', 'she was lost', 'she was hungry'], answer: 0 },
          { q: 'Who fixed the wing?', choices: ['Mimi', 'the nurse', 'the fern'], answer: 1 }
        ]
      },
      mastery: [
        { word: 'bird', choices: ['bird', 'bread', 'bard', 'third'] },
        { word: 'her', choices: ['her', 'here', 'hair', 'fur'] },
        { word: 'turn', choices: ['torn', 'turn', 'tern', 'burn'] },
        { word: 'girl', choices: ['grill', 'gull', 'girl', 'curl'] },
        { word: 'first', choices: ['fist', 'first', 'burst', 'frost'] },
        { word: 'purr', choices: ['purr', 'pour', 'per', 'burr'] },
        { word: 'shirt', choices: ['short', 'shirt', 'sheet', 'skirt'] },
        { word: 'fern', choices: ['fern', 'firm', 'fan', 'barn'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L2-5',
      title: 'Teams: ai & ay',
      sub: 'rain • play',
      emoji: '🌧️',
      guide: 'Pip',
      teach: {
        intro: 'I\'m Bun the bunny. Let\'s read some words together. Listen: Rain. Tail. Snail. Play. Day. Stay. Now it is your turn!',
        narration: [
          { say: 'I\'m Bun the bunny.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'rain' },
          { word: 'tail' },
          { word: 'snail' },
          { word: 'play' },
          { word: 'day' },
          { word: 'stay' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'ai', say: 'ay', ex: 'rain' },
          { g: 'ay', say: 'ay', ex: 'play' }
        ],
        examples: ['rain', 'tail', 'snail', 'play', 'day', 'stay']
      },
      soundIt: [
        { word: 'rain', sounds: ['r', 'ai', 'n'], choices: ['ran', 'rain', 'main'] },
        { word: 'play', sounds: ['p', 'l', 'ay'], choices: ['play', 'pay', 'plan'] },
        { word: 'tail', sounds: ['t', 'ai', 'l'], choices: ['tall', 'tale', 'tail'] },
        { word: 'gray', sounds: ['g', 'r', 'ay'], choices: ['gray', 'grain', 'green'] }
      ],
      buildIt: [
        { word: 'mail', tiles: ['m', 'ai', 'l'], extra: ['ay', 'n'] },
        { word: 'day', tiles: ['d', 'ay'], extra: ['ai', 't'] },
        { word: 'snail', tiles: ['s', 'n', 'ai', 'l'], extra: ['ay', 'p'] },
        { word: 'spray', tiles: ['s', 'p', 'r', 'ay'], extra: ['ai', 'l'] }
      ],
      sortIt: {
        a: { label: 'ai — in the middle 🌧️', ex: 'rain' },
        b: { label: 'ay — at the end 🎈', ex: 'play' },
        words: [
          { w: 'paint', cat: 'a' }, { w: 'stay', cat: 'b' },
          { w: 'chain', cat: 'a' }, { w: 'clay', cat: 'b' },
          { w: 'brain', cat: 'a' }, { w: 'tray', cat: 'b' },
          { w: 'wait', cat: 'a' }, { w: 'sway', cat: 'b' }
        ]
      },
      readIt: {
        title: 'A Rainy Day to Play',
        emoji: '🌧️🐌',
        pages: [
          'Rain, rain, rain! Pip could not play all day.',
          'Then Pip saw a snail on the trail. The snail did not mind the rain!',
          '"Wait for me!" said Pip. She got her rain hat.',
          'Pip and the snail played in the rain. It was a great day after all!'
        ],
        questions: [
          { q: 'Why couldn\'t Pip play at first?', choices: ['it was raining', 'she was sick', 'it was dark'], answer: 0 },
          { q: 'Who did Pip play with?', choices: ['a whale', 'a snail', 'the mail'], answer: 1 }
        ]
      },
      mastery: [
        { word: 'rain', choices: ['ran', 'rain', 'rein', 'main'] },
        { word: 'play', choices: ['play', 'pray', 'plan', 'clay'] },
        { word: 'snail', choices: ['small', 'snail', 'nail', 'sail'] },
        { word: 'day', choices: ['day', 'they', 'dry', 'bay'] },
        { word: 'paint', choices: ['pant', 'point', 'paint', 'plant'] },
        { word: 'stay', choices: ['stray', 'stay', 'say', 'sty'] },
        { word: 'mail', choices: ['mail', 'mall', 'meal', 'nail'] },
        { word: 'gray', choices: ['grow', 'gray', 'grain', 'tray'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L2-6',
      title: 'Teams: ee, ea & ey',
      sub: 'bee • leaf • key',
      emoji: '🐝',
      guide: 'Mimi',
      teach: {
        intro: 'Hi! I\'m Pip the unicorn. Let\'s read some words together. Listen: Bee. Tree. Green. Leaf. Beach. Key. Now it is your turn!',
        narration: [
          { say: 'Hi! I\'m Pip the unicorn.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'bee' },
          { word: 'tree' },
          { word: 'green' },
          { word: 'leaf' },
          { word: 'beach' },
          { word: 'key' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'ee', say: 'ee', ex: 'bee' },
          { g: 'ea', say: 'ee', ex: 'leaf' },
          { g: 'ey', say: 'ee', ex: 'key' }
        ],
        examples: ['bee', 'tree', 'green', 'leaf', 'beach', 'key']
      },
      soundIt: [
        { word: 'bee', sounds: ['b', 'ee'], choices: ['bay', 'bee', 'boo'] },
        { word: 'leaf', sounds: ['l', 'ea', 'f'], choices: ['loaf', 'left', 'leaf'] },
        { word: 'seed', sounds: ['s', 'ee', 'd'], choices: ['seed', 'sad', 'said'] },
        { word: 'team', sounds: ['t', 'ea', 'm'], choices: ['tame', 'team', 'time'] }
      ],
      buildIt: [
        { word: 'tree', tiles: ['t', 'r', 'ee'], extra: ['ea', 'm'] },
        { word: 'beach', tiles: ['b', 'ea', 'ch'], extra: ['ee', 'sh'] },
        { word: 'sleep', tiles: ['s', 'l', 'ee', 'p'], extra: ['ea', 't'] },
        { word: 'dream', tiles: ['d', 'r', 'ea', 'm'], extra: ['ee', 'n'] }
      ],
      sortIt: {
        a: { label: 'ee 🐝', ex: 'bee' },
        b: { label: 'ea 🍃', ex: 'leaf' },
        words: [
          { w: 'green', cat: 'a' }, { w: 'read', cat: 'b' },
          { w: 'sweet', cat: 'a' }, { w: 'clean', cat: 'b' },
          { w: 'queen', cat: 'a' }, { w: 'peach', cat: 'b' },
          { w: 'wheel', cat: 'a' }, { w: 'treat', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Queen Bee\'s Key',
        emoji: '🐝🔑',
        pages: [
          'The queen bee lost the key to her tree!',
          'Mimi and Pip went to the beach to seek it. They peeked under each leaf.',
          'A crab had the key! "Please give it back," said Mimi. "It is not a treat to eat!"',
          'The crab agreed. The queen bee was so happy she gave them sweet honey. Yum!'
        ],
        questions: [
          { q: 'What did the queen bee lose?', choices: ['her wings', 'the key to her tree', 'a leaf'], answer: 1 },
          { q: 'Who had the key?', choices: ['a crab', 'a seal', 'Pip'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'bee', choices: ['bay', 'bee', 'be', 'sea'] },
        { word: 'leaf', choices: ['leaf', 'loaf', 'life', 'left'] },
        { word: 'green', choices: ['grin', 'green', 'grain', 'queen'] },
        { word: 'key', choices: ['key', 'k', 'kay', 'hey'] },
        { word: 'beach', choices: ['bench', 'batch', 'beach', 'peach'] },
        { word: 'sleep', choices: ['slip', 'sleep', 'sheep', 'slap'] },
        { word: 'dream', choices: ['dream', 'drum', 'cream', 'dresses'] },
        { word: 'queen', choices: ['queen', 'quilt', 'green', 'quite'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L2-7',
      title: 'Long o & i Teams',
      sub: 'boat • snow • night • fly',
      emoji: '⛵',
      guide: 'Dot',
      teach: {
        intro: 'Mimi here! Let\'s read some words together. Listen: Boat. Coat. Snow. Glow. Night. Fly. Now it is your turn!',
        narration: [
          { say: 'Mimi here!' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'boat' },
          { word: 'coat' },
          { word: 'snow' },
          { word: 'glow' },
          { word: 'night' },
          { word: 'fly' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'oa', say: 'oh', ex: 'boat' },
          { g: 'ow', say: 'oh', ex: 'snow' },
          { g: 'igh', say: 'eye', ex: 'night' },
          { g: 'y', say: 'eye', ex: 'fly' }
        ],
        examples: ['boat', 'coat', 'snow', 'glow', 'night', 'fly']
      },
      soundIt: [
        { word: 'boat', sounds: ['b', 'oa', 't'], choices: ['bat', 'boat', 'boot'] },
        { word: 'snow', sounds: ['s', 'n', 'ow_o'], choices: ['snow', 'now', 'slow'] },
        { word: 'night', sounds: ['n', 'igh', 't'], choices: ['net', 'night', 'light'] },
        { word: 'fly', sounds: ['f', 'l', 'y_i'], choices: ['fly', 'flea', 'flow'] }
      ],
      buildIt: [
        { word: 'coat', tiles: ['c', 'oa', 't'], extra: ['ow', 'l'] },
        { word: 'glow', tiles: ['g', 'l', 'ow_o'], extra: ['oa', 't'] },
        { word: 'light', tiles: ['l', 'igh', 't'], extra: ['oa', 'f'] },
        { word: 'sky', tiles: ['s', 'k', 'y'], extra: ['igh', 'e'] }
      ],
      sortIt: {
        a: { label: 'says long o ⛵', ex: 'boat' },
        b: { label: 'says long i 🌙', ex: 'night' },
        words: [
          { w: 'road', cat: 'a' }, { w: 'bright', cat: 'b' },
          { w: 'grow', cat: 'a' }, { w: 'try', cat: 'b' },
          { w: 'soap', cat: 'a' }, { w: 'high', cat: 'b' },
          { w: 'show', cat: 'a' }, { w: 'shy', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Boat in the Night',
        emoji: '⛵🌙',
        pages: [
          'One night, Dot took her boat out on the sea. The moon was high and bright.',
          'Snow began to fall. Oh no! Dot could not see the coast.',
          'Then a firefly came by. Its light made a bright glow!',
          'The firefly showed Dot the way. "You saved the night!" said Dot with a sigh.'
        ],
        questions: [
          { q: 'When did Dot take her boat out?', choices: ['at night', 'in the morning', 'at lunch'], answer: 0 },
          { q: 'Who helped Dot find the way?', choices: ['a firefly with a bright glow', 'a goat', 'the snow'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'boat', choices: ['boat', 'boot', 'bat', 'goat'] },
        { word: 'snow', choices: ['snow', 'now', 'sun', 'slow'] },
        { word: 'night', choices: ['net', 'night', 'nice', 'light'] },
        { word: 'fly', choices: ['flea', 'flow', 'fly', 'fry'] },
        { word: 'coat', choices: ['cot', 'coat', 'cost', 'goat'] },
        { word: 'bright', choices: ['bright', 'bring', 'brat', 'fright'] },
        { word: 'grow', choices: ['grew', 'grow', 'glow', 'crow'] },
        { word: 'sky', choices: ['ski', 'sky', 'shy', 'spy'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L2-8',
      title: 'Wiggly Sounds',
      sub: 'ou • ow • oi • oy • oo',
      emoji: '🦉',
      guide: 'Bun',
      teach: {
        intro: 'I\'m Dot the dragon. Let\'s read some words together. Listen: Cloud. Cow. Coin. Toy. Moon. Book. Now it is your turn!',
        narration: [
          { say: 'I\'m Dot the dragon.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'cloud' },
          { word: 'cow' },
          { word: 'coin' },
          { word: 'toy' },
          { word: 'moon' },
          { word: 'book' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'ou', say: 'ow', ex: 'cloud' },
          { g: 'ow', say: 'ow', ex: 'cow' },
          { g: 'oi', say: 'oy', ex: 'coin' },
          { g: 'oy', say: 'oy', ex: 'toy' },
          { g: 'oo', say: 'oo', ex: 'moon' }
        ],
        examples: ['cloud', 'cow', 'coin', 'toy', 'moon', 'book']
      },
      soundIt: [
        { word: 'cow', sounds: ['c', 'ow_ou'], choices: ['cow', 'crow', 'car'] },
        { word: 'coin', sounds: ['c', 'oi', 'n'], choices: ['corn', 'coin', 'cone'] },
        { word: 'moon', sounds: ['m', 'oo', 'n'], choices: ['moon', 'mine', 'moan'] },
        { word: 'cloud', sounds: ['c', 'l', 'ou', 'd'], choices: ['clod', 'cloud', 'clown'] }
      ],
      buildIt: [
        { word: 'toy', tiles: ['t', 'oy'], extra: ['oi', 'w'] },
        { word: 'owl', tiles: ['ow_ou', 'l'], extra: ['ou', 't'] },
        { word: 'moon', tiles: ['m', 'oo', 'n'], extra: ['ow', 'p'] },
        { word: 'round', tiles: ['r', 'ou', 'n', 'd'], extra: ['oy', 't'] }
      ],
      sortIt: {
        a: { label: 'says ow 🐮', ex: 'cow' },
        b: { label: 'says oy 🪙', ex: 'toy' },
        words: [
          { w: 'loud', cat: 'a' }, { w: 'joy', cat: 'b' },
          { w: 'down', cat: 'a' }, { w: 'boil', cat: 'b' },
          { w: 'house', cat: 'a' }, { w: 'point', cat: 'b' },
          { w: 'crown', cat: 'a' }, { w: 'enjoy', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Owl and the Moon Coin',
        emoji: '🦉🪙',
        pages: [
          'An owl found a round coin under a cloud of leaves. It looked like the moon!',
          '"Wow!" said Bun. "That is a moon coin. It brings good luck!"',
          'The owl and Bun took the coin to town. A loud crowd came to look.',
          'The owl let each friend hold it. Joy went all around town!'
        ],
        questions: [
          { q: 'What did the owl find?', choices: ['a round coin', 'a book', 'a toy'], answer: 0 },
          { q: 'What did the coin look like?', choices: ['a cloud', 'the moon', 'a crown'], answer: 1 }
        ]
      },
      mastery: [
        { word: 'cow', choices: ['cow', 'coo', 'crow', 'how'] },
        { word: 'coin', choices: ['corn', 'coin', 'cone', 'join'] },
        { word: 'moon', choices: ['moan', 'moon', 'man', 'noon'] },
        { word: 'toy', choices: ['toe', 'toy', 'tie', 'boy'] },
        { word: 'cloud', choices: ['cloud', 'clod', 'clown', 'crowd'] },
        { word: 'book', choices: ['book', 'boot', 'back', 'look'] },
        { word: 'house', choices: ['horse', 'house', 'hose', 'mouse'] },
        { word: 'crown', choices: ['crow', 'crown', 'clown', 'brown'] }
      ]
    }
  ]
};
