// Level 3 — Crystal Castle 👑
// Stretch: multisyllabic words, prefixes/suffixes, soft c/g, silent letters.

const LEVEL3 = {
  id: 'L3',
  name: 'Crystal Castle',
  emoji: '👑',
  color: '#ff6fa5',
  islands: [

    // ─────────────────────────────────────────────
    {
      id: 'L3-1',
      title: 'Word + Word',
      sub: 'sun + set = sunset',
      emoji: '🌇',
      guide: 'Pip',
      teach: {
        intro: "Big words are just small words holding hands! Sun plus set makes sunset. Cup plus cake makes cupcake! Read each part, then glue them together.",
        patterns: [
          { g: 'sunset', say: 'sun set', ex: 'sun + set' },
          { g: 'cupcake', say: 'cup cake', ex: 'cup + cake' },
          { g: 'rainbow', say: 'rain bow', ex: 'rain + bow' }
        ],
        examples: ['sunset', 'cupcake', 'rainbow', 'bedtime', 'popcorn', 'starfish']
      },
      soundIt: [
        { word: 'cupcake', sounds: ['cup', 'cake'], choices: ['cupcake', 'pancake', 'cupboard'] },
        { word: 'rainbow', sounds: ['rain', 'bow'], choices: ['raindrop', 'rainbow', 'window'] },
        { word: 'bedtime', sounds: ['bed', 'time'], choices: ['bedtime', 'bedbug', 'daytime'] },
        { word: 'starfish', sounds: ['star', 'fish'], choices: ['catfish', 'starlight', 'starfish'] }
      ],
      buildIt: [
        { word: 'sunset', tiles: ['sun', 'set'], extra: ['sit', 'moon'] },
        { word: 'popcorn', tiles: ['pop', 'corn'], extra: ['pot', 'car'] },
        { word: 'raindrop', tiles: ['rain', 'drop'], extra: ['ran', 'drip'] },
        { word: 'backpack', tiles: ['back', 'pack'], extra: ['pick', 'bat'] }
      ],
      sortIt: {
        a: { label: 'one word 🌱', ex: 'sun' },
        b: { label: 'word + word 🌈', ex: 'sunset' },
        words: [
          { w: 'jump', cat: 'a' }, { w: 'bathtub', cat: 'b' },
          { w: 'star', cat: 'a' }, { w: 'pancake', cat: 'b' },
          { w: 'coat', cat: 'a' }, { w: 'inside', cat: 'b' },
          { w: 'week', cat: 'a' }, { w: 'weekend', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Rainbow Cupcake',
        emoji: '🌈🧁',
        pages: [
          'It was the weekend! Pip wanted to make something for bedtime snack time.',
          'She made a cupcake with rainbow frosting on top.',
          'Mimi made popcorn. Bun made a fruit cup with starfruit.',
          'They ate outside at sunset. "Teamwork makes the best snacks!" said Pip.'
        ],
        questions: [
          { q: 'What did Pip make?', choices: ['popcorn', 'a rainbow cupcake', 'pancakes'], answer: 1 },
          { q: 'When did they eat their snacks?', choices: ['at sunrise', 'at lunchtime', 'at sunset'], answer: 2 }
        ]
      },
      mastery: [
        { word: 'sunset', choices: ['sunset', 'sunrise', 'subset', 'sandbox'] },
        { word: 'cupcake', choices: ['pancake', 'cupcake', 'cupboard', 'cake'] },
        { word: 'rainbow', choices: ['rainbow', 'raincoat', 'window', 'rain'] },
        { word: 'popcorn', choices: ['popcorn', 'unicorn', 'peacock', 'corncob'] },
        { word: 'bedtime', choices: ['bedtime', 'daytime', 'bedbug', 'bathtime'] },
        { word: 'starfish', choices: ['catfish', 'starfish', 'starlight', 'shellfish'] },
        { word: 'backpack', choices: ['backpack', 'backyard', 'napsack', 'setback'] },
        { word: 'weekend', choices: ['weekday', 'weekend', 'seaweed', 'between'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L3-2',
      title: 'Chop the Word',
      sub: 'rab | bit • nap | kin',
      emoji: '🐰',
      guide: 'Bun',
      teach: {
        intro: "When a big word has two consonants in the middle, chop between them! Rab-bit. Nap-kin. Read each chunk, then blend them together. Chop chop!",
        patterns: [
          { g: 'rabbit', say: 'rab bit', ex: 'rab | bit' },
          { g: 'napkin', say: 'nap kin', ex: 'nap | kin' },
          { g: 'muffin', say: 'muf fin', ex: 'muf | fin' }
        ],
        examples: ['rabbit', 'napkin', 'muffin', 'picnic', 'kitten', 'basket']
      },
      soundIt: [
        { word: 'rabbit', sounds: ['rab', 'bit'], choices: ['rabbit', 'ribbon', 'robin'] },
        { word: 'picnic', sounds: ['pic', 'nic'], choices: ['picture', 'picnic', 'pickle'] },
        { word: 'kitten', sounds: ['kit', 'ten'], choices: ['kitchen', 'mitten', 'kitten'] },
        { word: 'basket', sounds: ['bas', 'ket'], choices: ['basket', 'blanket', 'bucket'] }
      ],
      buildIt: [
        { word: 'muffin', tiles: ['muf', 'fin'], extra: ['mit', 'fun'] },
        { word: 'napkin', tiles: ['nap', 'kin'], extra: ['nip', 'ken'] },
        { word: 'sunfish', tiles: ['sun', 'fish'], extra: ['fun', 'dish'] },
        { word: 'pumpkin', tiles: ['pump', 'kin'], extra: ['jump', 'pin'] }
      ],
      sortIt: {
        a: { label: '1 chunk 🍎', ex: 'cat' },
        b: { label: '2 chunks 🐰', ex: 'rabbit' },
        words: [
          { w: 'lamp', cat: 'a' }, { w: 'mitten', cat: 'b' },
          { w: 'jump', cat: 'a' }, { w: 'ribbon', cat: 'b' },
          { w: 'fish', cat: 'a' }, { w: 'happen', cat: 'b' },
          { w: 'sock', cat: 'a' }, { w: 'velvet', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Picnic Puzzle',
        emoji: '🧺🐰',
        pages: [
          'Bun packed a basket for a picnic: muffins, napkins, and a velvet blanket.',
          'At the picnic, one muffin was missing! "A puzzle!" said Bun.',
          'They found little footprints in the grass. They followed them to a bush.',
          'A tiny kitten had the muffin! They let her keep it and gave her a napkin too.'
        ],
        questions: [
          { q: 'What went missing at the picnic?', choices: ['a napkin', 'a muffin', 'the blanket'], answer: 1 },
          { q: 'Who took it?', choices: ['a tiny kitten', 'a rabbit', 'a puppet'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'rabbit', choices: ['rabbit', 'ribbon', 'robin', 'racket'] },
        { word: 'napkin', choices: ['napkin', 'pumpkin', 'nap', 'kitten'] },
        { word: 'muffin', choices: ['mitten', 'muffin', 'puffin', 'mountain'] },
        { word: 'picnic', choices: ['picnic', 'pickle', 'picture', 'plastic'] },
        { word: 'kitten', choices: ['kitchen', 'kitten', 'mitten', 'button'] },
        { word: 'basket', choices: ['bucket', 'blanket', 'basket', 'biscuit'] },
        { word: 'pumpkin', choices: ['pumpkin', 'napkin', 'pumping', 'punish'] },
        { word: 'velvet', choices: ['velvet', 'violet', 'vivid', 'valet'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L3-3',
      title: 'Open Doors & Sleepy y',
      sub: 'ba | by • po | ny',
      emoji: '🐴',
      guide: 'Mimi',
      teach: {
        intro: "When a chunk ends with a vowel, the door is OPEN and the vowel shouts its name! Ba-by. Po-ny. And a sleepy y at the end of a long word says ee, like happy!",
        patterns: [
          { g: 'baby', say: 'bay bee', ex: 'ba | by' },
          { g: 'pony', say: 'poh nee', ex: 'po | ny' },
          { g: 'happy', say: 'hap pee', ex: 'hap | py' }
        ],
        examples: ['baby', 'pony', 'happy', 'tiny', 'silly', 'candy']
      },
      soundIt: [
        { word: 'pony', sounds: ['po', 'ny'], choices: ['penny', 'pony', 'puppy'] },
        { word: 'baby', sounds: ['ba', 'by'], choices: ['baby', 'bunny', 'berry'] },
        { word: 'tiny', sounds: ['ti', 'ny'], choices: ['tummy', 'teeny', 'tiny'] },
        { word: 'silly', sounds: ['sil', 'ly'], choices: ['silly', 'sally', 'jelly'] }
      ],
      buildIt: [
        { word: 'happy', tiles: ['hap', 'py'], extra: ['hop', 'pe'] },
        { word: 'candy', tiles: ['can', 'dy'], extra: ['con', 'de'] },
        { word: 'bunny', tiles: ['bun', 'ny'], extra: ['ban', 'ne'] },
        { word: 'sunny', tiles: ['sun', 'ny'], extra: ['son', 'my'] }
      ],
      sortIt: {
        a: { label: 'y says eye 🪁', ex: 'fly' },
        b: { label: 'y says ee 😊', ex: 'happy' },
        words: [
          { w: 'sky', cat: 'a' }, { w: 'puppy', cat: 'b' },
          { w: 'try', cat: 'a' }, { w: 'funny', cat: 'b' },
          { w: 'shy', cat: 'a' }, { w: 'windy', cat: 'b' },
          { w: 'dry', cat: 'a' }, { w: 'sleepy', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Pony and the Baby Bunny',
        emoji: '🐴🐰',
        pages: [
          'A tiny baby bunny was lost on a windy day. She was very sleepy.',
          'A kind pony found her. "Do not cry, little lady," said the pony.',
          'The pony carried the bunny over the rocky hill, past the lily pond.',
          'Mommy bunny was so happy! She gave the pony a shiny berry. What a lucky day!'
        ],
        questions: [
          { q: 'Who was lost?', choices: ['the pony', 'a tiny baby bunny', 'a puppy'], answer: 1 },
          { q: 'What did mommy bunny give the pony?', choices: ['a shiny berry', 'candy', 'a lily'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'baby', choices: ['baby', 'bubby', 'berry', 'body'] },
        { word: 'pony', choices: ['penny', 'pony', 'puny', 'puppy'] },
        { word: 'happy', choices: ['happy', 'hippo', 'harpy', 'hoppy'] },
        { word: 'tiny', choices: ['tinny', 'tiny', 'teeny', 'shiny'] },
        { word: 'silly', choices: ['silly', 'sally', 'slyly', 'jelly'] },
        { word: 'candy', choices: ['candy', 'canny', 'windy', 'dandy'] },
        { word: 'sleepy', choices: ['slippy', 'sleepy', 'sloppy', 'creepy'] },
        { word: 'lucky', choices: ['lucky', 'lacy', 'yucky', 'leaky'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L3-4',
      title: 'The -le Ending',
      sub: 'lit | tle • pur | ple',
      emoji: '💜',
      guide: 'Dot',
      teach: {
        intro: "Words that end in a consonant plus l-e get a special chunk: -ble, -tle, -ple! Say it like a little hop at the end: lit-tle, pur-ple, spar-kle!",
        patterns: [
          { g: 'little', say: 'lit tul', ex: 'lit | tle' },
          { g: 'purple', say: 'pur pul', ex: 'pur | ple' },
          { g: 'sparkle', say: 'spar kul', ex: 'spar | kle' }
        ],
        examples: ['little', 'purple', 'sparkle', 'turtle', 'apple', 'giggle']
      },
      soundIt: [
        { word: 'turtle', sounds: ['tur', 'tle'], choices: ['turtle', 'twinkle', 'tumble'] },
        { word: 'apple', sounds: ['ap', 'ple'], choices: ['ample', 'apple', 'April'] },
        { word: 'giggle', sounds: ['gig', 'gle'], choices: ['giggle', 'goggle', 'jungle'] },
        { word: 'candle', sounds: ['can', 'dle'], choices: ['cradle', 'candy', 'candle'] }
      ],
      buildIt: [
        { word: 'purple', tiles: ['pur', 'ple'], extra: ['per', 'pull'] },
        { word: 'little', tiles: ['lit', 'tle'], extra: ['let', 'tel'] },
        { word: 'sparkle', tiles: ['spar', 'kle'], extra: ['spur', 'kel'] },
        { word: 'bubble', tiles: ['bub', 'ble'], extra: ['bob', 'bel'] }
      ],
      sortIt: {
        a: { label: 'ends in -le 💜', ex: 'purple' },
        b: { label: 'no -le 🍇', ex: 'party' },
        words: [
          { w: 'table', cat: 'a' }, { w: 'tiger', cat: 'b' },
          { w: 'middle', cat: 'a' }, { w: 'mitten', cat: 'b' },
          { w: 'jungle', cat: 'a' }, { w: 'jelly', cat: 'b' },
          { w: 'twinkle', cat: 'a' }, { w: 'twenty', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Little Purple Turtle',
        emoji: '💜🐢',
        pages: [
          'A little purple turtle lived by a puddle in the middle of Crystal Castle.',
          'Her shell did not sparkle like the other turtles. She felt simple and small.',
          'Dot gave her a gentle hug. "Your purple shell is special," said Dot.',
          'The sun hit her shell — and it began to sparkle and twinkle! The turtle did a happy giggle.'
        ],
        questions: [
          { q: 'What color was the little turtle?', choices: ['purple', 'green', 'pink'], answer: 0 },
          { q: 'What made her shell sparkle?', choices: ['a magic apple', 'the sun', 'a candle'], answer: 1 }
        ]
      },
      mastery: [
        { word: 'little', choices: ['little', 'letter', 'litter', 'kettle'] },
        { word: 'purple', choices: ['purple', 'people', 'pickle', 'paddle'] },
        { word: 'sparkle', choices: ['sprinkle', 'sparkle', 'speckle', 'spark'] },
        { word: 'turtle', choices: ['turtle', 'tunnel', 'twinkle', 'title'] },
        { word: 'apple', choices: ['ample', 'apple', 'able', 'ankle'] },
        { word: 'giggle', choices: ['goggle', 'jiggle', 'giggle', 'juggle'] },
        { word: 'bubble', choices: ['bubble', 'bumble', 'babble', 'battle'] },
        { word: 'candle', choices: ['candle', 'cradle', 'camel', 'cattle'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L3-5',
      title: 'Prefix Power',
      sub: 'un- • re- • pre-',
      emoji: '🔮',
      guide: 'Pip',
      teach: {
        intro: "A prefix is a magic chunk glued to the FRONT of a word that changes what it means! Un- means NOT: unhappy means not happy. Re- means AGAIN: redo means do it again!",
        patterns: [
          { g: 'un-', say: 'un', ex: 'unhappy = not happy' },
          { g: 're-', say: 'ree', ex: 'redo = do again' },
          { g: 'pre-', say: 'pree', ex: 'preheat = heat before' }
        ],
        examples: ['unhappy', 'unlock', 'redo', 'replay', 'retell', 'preheat']
      },
      soundIt: [
        { word: 'unlock', sounds: ['un', 'lock'], choices: ['unlock', 'unpack', 'undo'] },
        { word: 'replay', sounds: ['re', 'play'], choices: ['replay', 'repay', 'display'] },
        { word: 'unhappy', sounds: ['un', 'hap', 'py'], choices: ['unhappy', 'unzip', 'happily'] },
        { word: 'retell', sounds: ['re', 'tell'], choices: ['retail', 'retell', 'until'] }
      ],
      buildIt: [
        { word: 'undo', tiles: ['un', 'do'], extra: ['re', 'to'] },
        { word: 'redo', tiles: ['re', 'do'], extra: ['un', 'day'] },
        { word: 'unzip', tiles: ['un', 'zip'], extra: ['re', 'zap'] },
        { word: 'remake', tiles: ['re', 'make'], extra: ['pre', 'mike'] }
      ],
      sortIt: {
        a: { label: 'un- means NOT 🚫', ex: 'unhappy' },
        b: { label: 're- means AGAIN 🔁', ex: 'redo' },
        words: [
          { w: 'unkind', cat: 'a' }, { w: 'reread', cat: 'b' },
          { w: 'unsafe', cat: 'a' }, { w: 'rebuild', cat: 'b' },
          { w: 'unfair', cat: 'a' }, { w: 'refill', cat: 'b' },
          { w: 'untie', cat: 'a' }, { w: 'repaint', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Unhappy Dragon',
        emoji: '🐉😢',
        pages: [
          'Dot the dragon was unhappy. Her sandcastle was unmade by the waves!',
          '"Do not worry," said Pip. "We can rebuild it. Let\'s redo it together!"',
          'They remade the walls. They refilled the moat. Bun untied her ribbon for the flag.',
          'The new castle was even better. Dot was unhappy no more — she was overjoyed!'
        ],
        questions: [
          { q: 'Why was Dot unhappy?', choices: ['the waves unmade her sandcastle', 'she lost her toy', 'it was raining'], answer: 0 },
          { q: 'What does "rebuild" mean?', choices: ['build again', 'knock down', 'not build'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'unhappy', choices: ['unhappy', 'happily', 'unzip', 'happen'] },
        { word: 'redo', choices: ['undo', 'redo', 'ready', 'rodeo'] },
        { word: 'unlock', choices: ['unlock', 'unpack', 'relock', 'lucky'] },
        { word: 'replay', choices: ['repay', 'replay', 'display', 'player'] },
        { word: 'untie', choices: ['untie', 'unite', 'retie', 'until'] },
        { word: 'refill', choices: ['refill', 'ruffle', 'unfill', 'rifle'] },
        { word: 'unkind', choices: ['unkind', 'remind', 'unwind', 'kindly'] },
        { word: 'reread', choices: ['ready', 'reread', 'unread', 'thread'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L3-6',
      title: 'Suffix Sparkle',
      sub: '-ful • -less • -ly • -est',
      emoji: '✨',
      guide: 'Mimi',
      teach: {
        intro: "A suffix glues to the END of a word! -ful means FULL OF: joyful means full of joy. -less means WITHOUT: fearless means without fear. -est means THE MOST: bravest!",
        patterns: [
          { g: '-ful', say: 'ful', ex: 'joyful = full of joy' },
          { g: '-less', say: 'less', ex: 'fearless = without fear' },
          { g: '-ly', say: 'lee', ex: 'quickly = in a quick way' },
          { g: '-est', say: 'est', ex: 'bravest = most brave' }
        ],
        examples: ['joyful', 'helpful', 'fearless', 'quickly', 'softly', 'bravest']
      },
      soundIt: [
        { word: 'joyful', sounds: ['joy', 'ful'], choices: ['joyful', 'careful', 'jolly'] },
        { word: 'quickly', sounds: ['quick', 'ly'], choices: ['quietly', 'quickly', 'thickly'] },
        { word: 'fearless', sounds: ['fear', 'less'], choices: ['fearful', 'careless', 'fearless'] },
        { word: 'bravest', sounds: ['brave', 'est'], choices: ['bravest', 'biggest', 'braver'] }
      ],
      buildIt: [
        { word: 'helpful', tiles: ['help', 'ful'], extra: ['less', 'held'] },
        { word: 'softly', tiles: ['soft', 'ly'], extra: ['ful', 'salt'] },
        { word: 'endless', tiles: ['end', 'less'], extra: ['ly', 'and'] },
        { word: 'sweetest', tiles: ['sweet', 'est'], extra: ['ful', 'sweat'] }
      ],
      sortIt: {
        a: { label: '-ful = full of 💖', ex: 'joyful' },
        b: { label: '-less = without 🕳️', ex: 'fearless' },
        words: [
          { w: 'hopeful', cat: 'a' }, { w: 'homeless', cat: 'b' },
          { w: 'playful', cat: 'a' }, { w: 'spotless', cat: 'b' },
          { w: 'thankful', cat: 'a' }, { w: 'harmless', cat: 'b' },
          { w: 'colorful', cat: 'a' }, { w: 'sleepless', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Bravest Kitten',
        emoji: '🏅🐱',
        pages: [
          'Mimi\'s little sister was the smallest kitten in Crystal Castle. But she was fearless!',
          'One day, a playful puppy got stuck on the highest wall. He barked loudly.',
          'The small kitten climbed up quickly and softly. Everyone watched, breathless.',
          'She led the puppy safely down. "You are the bravest of all!" they cheered joyfully.'
        ],
        questions: [
          { q: 'What does "fearless" mean?', choices: ['full of fear', 'without fear', 'a little scared'], answer: 1 },
          { q: 'Who got stuck on the wall?', choices: ['a playful puppy', 'the kitten', 'Mimi'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'joyful', choices: ['joyful', 'joyless', 'jolly', 'careful'] },
        { word: 'fearless', choices: ['fearful', 'fearless', 'careless', 'nearest'] },
        { word: 'quickly', choices: ['quietly', 'quickly', 'thickly', 'quacky'] },
        { word: 'bravest', choices: ['bravest', 'braver', 'biggest', 'brightest'] },
        { word: 'helpful', choices: ['helpless', 'helpful', 'hopeful', 'handful'] },
        { word: 'softly', choices: ['swiftly', 'softly', 'safely', 'sadly'] },
        { word: 'spotless', choices: ['spotless', 'speechless', 'potless', 'topless'] },
        { word: 'sweetest', choices: ['sweetest', 'swiftest', 'wettest', 'sweater'] }
      ]
    },

    // ─────────────────────────────────────────────
    {
      id: 'L3-7',
      title: 'Sneaky Letters',
      sub: 'soft c & g • kn • wr',
      emoji: '🤫',
      guide: 'Dot',
      teach: {
        intro: "Some letters are sneaky! When c meets e, i or y, it whispers sss — like city! When g meets them, it can say j — like giant! And k-n and w-r have SILENT letters: knee says nee, write says rite!",
        patterns: [
          { g: 'ce/ci', say: 'sss', ex: 'city' },
          { g: 'ge/gi', say: 'j', ex: 'giant' },
          { g: 'kn', say: 'n', ex: 'knee' },
          { g: 'wr', say: 'r', ex: 'write' }
        ],
        examples: ['city', 'ice', 'giant', 'magic', 'knee', 'write']
      },
      soundIt: [
        { word: 'ice', sounds: ['eye', 's'], choices: ['ice', 'eyes', 'ace'] },
        { word: 'knee', sounds: ['n', 'ee'], choices: ['need', 'knee', 'key'] },
        { word: 'wrap', sounds: ['r', 'a', 'p'], choices: ['warp', 'rap', 'wrap'] },
        { word: 'giant', sounds: ['gi', 'ant'], choices: ['grant', 'giant', 'gently'] }
      ],
      buildIt: [
        { word: 'mice', tiles: ['m', 'i', 'ce'], extra: ['ke', 'a'] },
        { word: 'knot', tiles: ['kn', 'o', 't'], extra: ['n', 'e'] },
        { word: 'wrist', tiles: ['wr', 'i', 's', 't'], extra: ['r', 'e'] },
        { word: 'stage', tiles: ['s', 't', 'a', 'ge'], extra: ['j', 'ke'] }
      ],
      sortIt: {
        a: { label: 'c says sss 🧊', ex: 'ice' },
        b: { label: 'g says j 🦒', ex: 'giant' },
        words: [
          { w: 'race', cat: 'a' }, { w: 'cage', cat: 'b' },
          { w: 'city', cat: 'a' }, { w: 'magic', cat: 'b' },
          { w: 'pencil', cat: 'a' }, { w: 'gem', cat: 'b' },
          { w: 'dance', cat: 'a' }, { w: 'large', cat: 'b' }
        ]
      },
      readIt: {
        title: 'The Knight Who Could Write',
        emoji: '⚔️✍️',
        pages: [
          'In the center of the city lived a gentle knight. He loved to write!',
          'A giant came to the castle. Everyone hid — but the knight did not budge.',
          'The knight wrote a nice note: "Would you like to dance at our party?"',
          'The giant smiled a huge smile. The giant loved to dance! And that is how the city made a giant friend.'
        ],
        questions: [
          { q: 'What did the gentle knight love to do?', choices: ['fight', 'write', 'race'], answer: 1 },
          { q: 'How did the knight make friends with the giant?', choices: ['he wrote a nice note', 'he built a fence', 'he rang a bell'], answer: 0 }
        ]
      },
      mastery: [
        { word: 'city', choices: ['city', 'kitty', 'sit', 'silly'] },
        { word: 'ice', choices: ['ace', 'ice', 'eyes', 'is'] },
        { word: 'giant', choices: ['grant', 'gently', 'giant', 'gadget'] },
        { word: 'knee', choices: ['knee', 'need', 'key', 'knot'] },
        { word: 'write', choices: ['white', 'write', 'wrote', 'right'] },
        { word: 'magic', choices: ['magic', 'manic', 'magnet', 'music'] },
        { word: 'dance', choices: ['dance', 'dunce', 'darts', 'chance'] },
        { word: 'knight', choices: ['night', 'knight', 'knit', 'light'] }
      ]
    }
  ]
};
