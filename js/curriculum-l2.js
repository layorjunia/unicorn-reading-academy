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
        title: 'A Bite for the Snake',
        emoji: '🎂🌊',
        pages: [
          'Kate made a cake with her mom. She took it down to the lake to eat by the water.',
          'A snake slid out of the tall grass, and Kate froze. She did not like snakes one bit.',
          '"That cake smells so good," said the snake. "I have not had one bite all day. Can I have some, please?"',
          'He said please, so Kate cut him a bite. Her hands shook, but she sat down and they ate side by side.'
        ],
        questions: [
          { q: 'What did the snake want?', choices: ['A ride on her bike', 'A bite of the cake', 'A swim in the lake'], answer: 1 },
          { q: 'Kate did not like snakes. Why did she give this one a bite?', choices: ['Her mom told her to', 'He took the cake from her', 'He said please'], answer: 2 }
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
        title: 'The Mole and the Flute',
        emoji: '🦫🏠',
        pages: [
          'Dot sat on a stone and made up a tune on her flute. It went fast and loud, and she was proud of it.',
          'A mole shot up out of a hole, with dirt on his nose. "Stop! Your flute woke me up!" he said.',
          '"Oh no! I did not mean to wake you," said Dot. "Let me play a slow one. It will help you sleep."',
          'The mole shut his eyes till the tune was done. "Come back at noon," he said, "and play me that fast tune!"'
        ],
        questions: [
          { q: 'Why did the mole come up out of his hole?', choices: ['He was out to find a snack.', 'Dot\'s loud tune woke him up.', 'He fell down in the grass.'], answer: 1 },
          { q: 'What did the mole ask Dot to do at noon?', choices: ['Come back and play the fast tune for him.', 'Dig him a new hole.', 'Put her flute away for good.'], answer: 0 }
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
        title: 'Mimi and the Storm',
        emoji: '⛈️🚜',
        pages: [
          'Dark clouds came fast over the farm. "Look at that storm!" said Mimi. "I have to get Star in the barn."',
          'Rain came down hard and the wind was loud. Star stood in the yard. He shook all over and would not go.',
          'Mimi took off her coat and held it over his eyes. "Now you can not see the storm," she said. "Come with me."',
          'Star went with her, step by step, to the barn. Rain hit the roof, but Star did not shake at all.'
        ],
        questions: [
          { q: 'Why would Star not go with Mimi?', choices: ['He was scared of the storm', 'He wanted to eat more grass', 'He liked to stand in the rain'], answer: 0 },
          { q: 'What did Mimi do to get Star to come?', choices: ['She gave him a snack', 'She held her coat over his eyes', 'She ran off to get help'], answer: 1 }
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
        title: 'The Bird Under the Fern',
        emoji: '🐦🌿',
        pages: [
          'A soft chirp came from under the fern. Bert bent down and found a little bird with a hurt wing.',
          'Bert held out his hand, but the bird gave a sharp chirp and hid. "I will not hurt you," he said.',
          'Bert sat still as a stone. At last she let him lift her, and he made her a bed in a box.',
          'Her wing got strong, and one day she went up over the trees. She still comes back to chirp for Bert.'
        ],
        questions: [
          { q: 'What did Bert find under the fern?', choices: ['A nest of eggs', 'A little bird with a hurt wing', 'A little cat'], answer: 1 },
          { q: 'What does the bird do now that her wing is strong?', choices: ['She still comes back to chirp for Bert', 'She sleeps in the box all day', 'She hides under the fern'], answer: 0 }
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
        title: 'Pip and the Snail',
        emoji: '🌧️🐌',
        pages: [
          'Pip had a plan to play ball in the sun all day. Then the rain came down, and she felt sad.',
          'A snail slid up the wet porch step. "The rain got in the way of my plan," Pip said to him.',
          '"Rain? Rain is the best," said the snail. "On hot days I must hide. Come and play with me."',
          'Pip got her rain hat and ran out. "Rain is the best," she said, and they went down the path all day.'
        ],
        questions: [
          { q: 'What made Pip sad?', choices: ['The rain came and got in the way of her plan.', 'The snail went away from her.', 'She lost her rain hat.'], answer: 0 },
          { q: 'Why did Pip go out in the rain?', choices: ['The rain went away.', 'The snail said rain is the best day to play.', 'She lost her ball in the grass.'], answer: 1 }
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
        title: 'The Queen Bee\'s Lost Key',
        emoji: '🐝🔑',
        pages: [
          'Queen Bee kept the key to her tree on a green string. At night she felt for it, and the key was gone.',
          '"My bees need to get in and sleep!" said Queen Bee. Mimi said, "Where did you go today?"',
          '"The peach tree!" said Queen Bee. They ran there and dug in the leaves. "Hey! I see the green string!" said Mimi.',
          'Mimi gave it a tug, and up came the key. Queen Bee let all the bees in and said, "Thank you, Mimi!"'
        ],
        questions: [
          { q: 'Why did Queen Bee need the key?', choices: ['To let her bees in to sleep', 'To dig up a weed', 'To pick a peach'], answer: 0 },
          { q: 'How did Mimi find the key?', choices: ['She saw the green string in the leaves', 'She saw it up in the peach tree', 'It was on Queen Bee\'s neck the whole time'], answer: 0 }
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
          { g: 'ow', sk: 'ow_o', say: 'oh', ex: 'snow' },
          { g: 'igh', say: 'eye', ex: 'night' },
          { g: 'y', sk: 'y_i', say: 'eye', ex: 'fly' }
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
        title: 'Glow Lights the Way',
        emoji: '⛵🌙',
        pages: [
          'Dot took her boat out at night to see the stars. But clouds hid the sky, and soon she was lost.',
          'Then a small cry came from the waves. "Help! I am Glow, and I am too wet to fly," said a bug.',
          'Dot held out her hand, and Glow got on. Soon he was dry, and he lit up bright as a star.',
          'Glow went up high, and his light led the boat home. "I did not see the stars," said Dot, "but I found you."'
        ],
        questions: [
          { q: 'Why could the bug not fly?', choices: ['He was too wet', 'He was too small', 'It was too dark'], answer: 0 },
          { q: 'What did Glow do after Dot got him out of the waves?', choices: ['He went to sleep on her hand', 'He hid in the boat', 'He went up high and lit the way home'], answer: 2 }
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
          { g: 'ow', sk: 'ow_ou', say: 'ow', ex: 'cow' },
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
        title: 'Hoot Finds a Moon',
        emoji: '🦉🪙',
        pages: [
          'Each night Hoot the owl sat on the roof to see the moon. But this night, thick clouds hid it.',
          '"I miss the moon," said Hoot. So he went down and found a round, bright coin. "You can be my moon!"',
          'Then a boy came down the road. "I lost my coin!" he said. Hoot did not want to give up his moon.',
          'But he gave the coin back. "You found it! Thank you!" said the boy. Then the moon came out, big and round.'
        ],
        questions: [
          { q: 'Why did Hoot want to keep the coin?', choices: ['It was round and bright, like the moon the clouds hid', 'He wanted to give it to the boy', 'He wanted to get some food with it'], answer: 0 },
          { q: 'What did Hoot do when the boy said he lost his coin?', choices: ['He kept it and went back up to the roof', 'He gave the coin back to the boy', 'He hid the coin under his wing'], answer: 1 }
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
