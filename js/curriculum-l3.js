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
        intro: 'Hi! I\'m Pip the unicorn. Let\'s read some words together. Listen: Sunset. Cupcake. Rainbow. Bedtime. Popcorn. Starfish. Now it is your turn!',
        narration: [
          { say: 'Hi! I\'m Pip the unicorn.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'sunset' },
          { word: 'cupcake' },
          { word: 'rainbow' },
          { word: 'bedtime' },
          { word: 'popcorn' },
          { word: 'starfish' },
          { say: 'Now it is your turn!' }
        ],
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
          'It was Mom\'s birthday, so Pip made a rainbow cupcake for the sunset picnic. The frosting was pink, green, and yellow.',
          'Pip and her brother took it up the hilltop in her lunchbox. Then she tripped, and the cupcake landed upside down.',
          'The frosting was smashed flat, and Pip felt like crying. But her brother said, "Wait. I know what to do."',
          'They picked blackberries and set them on top in rows. At sunset Mom took a bite and said, "My best birthday yet."'
        ],
        questions: [
          { q: 'Why did Pip make the rainbow cupcake?', choices: ['It was Mom\'s birthday.', 'She wanted to eat it herself.', 'Her brother asked her to.'], answer: 0 },
          { q: 'How did Pip and her brother fix the smashed cupcake?', choices: ['They baked a new one at home.', 'They set blackberries on top.', 'They hid it in the lunchbox.'], answer: 1 }
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
        intro: 'I\'m Bun the bunny. Let\'s read some words together. Listen: Rabbit. Napkin. Muffin. Picnic. Kitten. Basket. Now it is your turn!',
        narration: [
          { say: 'I\'m Bun the bunny.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'rabbit' },
          { word: 'napkin' },
          { word: 'muffin' },
          { word: 'picnic' },
          { word: 'kitten' },
          { word: 'basket' },
          { say: 'Now it is your turn!' }
        ],
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
        title: 'The Missing Muffin',
        emoji: '🧺🐰',
        pages: [
          'Pip and Bun set six muffins on the picnic blanket. "Three for you and three for me," said Pip.',
          'Bun went to fill the water cup. When she got back, just five muffins sat on the blanket.',
          '"You ate it!" said Bun. "Not me," said Pip, pointing at a trail of muffin bits in the grass.',
          'The trail stopped at a chipmunk with fat, stuffed cheeks. "Sorry I blamed you," said Bun, "but he can keep it."'
        ],
        questions: [
          { q: 'Who took the missing muffin?', choices: ['A chipmunk', 'Pip', 'Bun'], answer: 0 },
          { q: 'Why did Bun say sorry?', choices: ['She blamed Pip when Pip did not take it', 'She ate the last muffin', 'She spilled the water cup'], answer: 0 }
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
        intro: 'I\'m Bun the bunny. Let\'s read some words together. Listen: Rabbit. Napkin. Muffin. Picnic. Kitten. Basket. Now it is your turn!',
        narration: [
          { say: 'I\'m Bun the bunny.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'rabbit' },
          { word: 'napkin' },
          { word: 'muffin' },
          { word: 'picnic' },
          { word: 'kitten' },
          { word: 'basket' },
          { say: 'Now it is your turn!' }
        ],
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
        title: 'Poppy and the Baby Bunny',
        emoji: '🐴🐰',
        pages: [
          'Poppy the pony found a tiny baby bunny crying in the tall grass. "Are you lost?" she asked.',
          '"Yes," said the bunny. "My family lives under the big oak tree." "Then hop on my back," said Poppy.',
          '"But you are so big! I can not get up," said the bunny. Poppy lay down flat, and the bunny hopped on.',
          'Poppy went slowly up the muddy path to the oak tree. "My baby!" cried the mother bunny. "Thank you, Poppy!"'
        ],
        questions: [
          { q: 'Why did Poppy lie down flat?', choices: ['So she could take a nap', 'So the tiny bunny could hop on her back', 'So she could eat the tall grass'], answer: 1 },
          { q: 'Where does the baby bunny\'s family live?', choices: ['In the tall grass where Poppy found it', 'On the muddy path', 'Under the big oak tree'], answer: 2 }
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
        intro: 'Mimi here! Let\'s read some words together. Listen: Baby. Pony. Happy. Tiny. Silly. Candy. Now it is your turn!',
        narration: [
          { say: 'Mimi here!' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'baby' },
          { word: 'pony' },
          { word: 'happy' },
          { word: 'tiny' },
          { word: 'silly' },
          { word: 'candy' },
          { say: 'Now it is your turn!' }
        ],
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
        title: 'Nell\'s Purple Shell',
        emoji: '💜🐢',
        pages: [
          'Nell was a little purple turtle. "Kip has spots on his shell," she said to her brother Gus. "I want spots too!"',
          'Then Nell stuck pebbles on her shell with mud. They made her wobble, and the mud hid every bit of purple.',
          '"Nell! Where are you?" Gus called from the tall grass. Nell jumped in a puddle and rubbed off all the mud.',
          '"There you are!" Gus yelled and hugged her tight. "I can spot purple from way off!" Nell left the pebbles in the puddle.'
        ],
        questions: [
          { q: 'Why did Nell stick pebbles on her shell?', choices: ['She wanted spots like Kip has', 'She wanted to hide from Gus', 'She wanted her shell to be hard'], answer: 0 },
          { q: 'What did Nell do so Gus could find her?', choices: ['She stuck on more pebbles', 'She rubbed the mud off her purple shell', 'She ran to the tall grass'], answer: 1 }
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
        intro: 'I\'m Dot the dragon. Let\'s read some words together. Listen: Unhappy. Unlock. Redo. Replay. Retell. Preheat. Now it is your turn!',
        narration: [
          { say: 'I\'m Dot the dragon.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'unhappy' },
          { word: 'unlock' },
          { word: 'redo' },
          { word: 'replay' },
          { word: 'retell' },
          { word: 'preheat' },
          { say: 'Now it is your turn!' }
        ],
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
        title: 'Dot Remakes the Fort',
        emoji: '🐉😢',
        pages: [
          'Dot dug all morning to make the biggest sand fort on the beach. Then a big wave rushed in and undid it.',
          '"All that work is undone!" said Dot. "Let\'s remake it up by the rocks," said Bun. "Waves never reach that far."',
          'So they remade the fort up by the rocks. Dot packed the walls thick and tall, and Bun dug a deep moat.',
          'The next wave rushed up the beach and stopped at the moat. "We were prepared this time!" said Dot, and Bun grinned.'
        ],
        questions: [
          { q: 'What happened to Dot\'s first sand fort?', choices: ['Bun stepped on it', 'A wave rushed in and undid it', 'Dot dug it up herself'], answer: 1 },
          { q: 'Why did Dot and Bun remake the fort up by the rocks?', choices: ['The sand was drier there', 'Waves never reach that far', 'It was closer to their house'], answer: 1 }
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
        intro: 'Hi! I\'m Pip the unicorn. Let\'s read some words together. Listen: Joyful. Helpful. Fearless. Quickly. Softly. Bravest. Now it is your turn!',
        narration: [
          { say: 'Hi! I\'m Pip the unicorn.' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'joyful' },
          { word: 'helpful' },
          { word: 'fearless' },
          { word: 'quickly' },
          { word: 'softly' },
          { word: 'bravest' },
          { say: 'Now it is your turn!' }
        ],
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
        title: 'Kit and the Thin Wall',
        emoji: '🏅🐱',
        pages: [
          'Kit was the smallest kitten on the farm. "You are too little to be helpful," said her big sisters.',
          'Then Bud the puppy yelped. He had run up the hay pile onto the tallest wall, and he was too afraid to move.',
          '"The wall is too thin for us. It is hopeless," said her sisters. But Kit was the lightest, so up she went.',
          '"Look at me, Bud," said Kit, and slowly she led him back to the hay. "You were helpful after all," said her sisters.'
        ],
        questions: [
          { q: 'Why did Kit go up on the wall instead of her big sisters?', choices: ['She had the longest legs.', 'She was the lightest cat.', 'She could jump the highest.'], answer: 1 },
          { q: 'How did Bud get down off the wall?', choices: ['He jumped down all by himself.', 'The big sisters lifted him down.', 'Kit led him back to the hay pile.'], answer: 2 }
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
        intro: 'Mimi here! Let\'s read some words together. Listen: City. Ice. Giant. Magic. Knee. Write. Now it is your turn!',
        narration: [
          { say: 'Mimi here!' },
          { say: 'Let\'s read some words together.' },
          { say: 'Listen.' },
          { word: 'city' },
          { word: 'ice' },
          { word: 'giant' },
          { word: 'magic' },
          { word: 'knee' },
          { word: 'write' },
          { say: 'Now it is your turn!' }
        ],
        patterns: [
          { g: 'ce/ci', sk: 'ce', say: 'sss', ex: 'city' },
          { g: 'ge/gi', sk: 'ge', say: 'j', ex: 'giant' },
          { g: 'kn', say: 'n', ex: 'knee' },
          { g: 'wr', say: 'r', ex: 'write' }
        ],
        examples: ['city', 'ice', 'giant', 'magic', 'knee', 'write']
      },
      soundIt: [
        { word: 'ice', sounds: ['eye', 's'], choices: ['ice', 'eyes', 'ace'] },
        { word: 'knee', sounds: ['n', 'ee'], choices: ['need', 'knee', 'key'] },
        { word: 'wrap', sounds: ['r', 'a', 'p'], choices: ['warp', 'rap', 'wrap'] },
        { word: 'giant', choices: ['grant', 'giant', 'gently'] }
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
        title: 'Wren the Knight Writes a Note',
        emoji: '⚔️✍️',
        pages: [
          'Every night a giant stomped past the town. The beds shook, the cups danced on the shelf, and no one could sleep.',
          'Wren the knight was too small to fight a giant. "But I can write," she said. So she wrote a huge note.',
          'She left it on his path. The note said, "Giant, your steps shake our beds. Can you stomp on the soft grass?"',
          'The giant read it. "Oh no! I did not know," he said. Now he stomps on the grass, and the town sleeps.'
        ],
        questions: [
          { q: 'Why could no one in the town sleep?', choices: ['A giant stomped past every night', 'The beds were much too small', 'A big storm shook the town'], answer: 0 },
          { q: 'How did Wren get the giant to stop shaking the beds?', choices: ['She yelled at him all night', 'She wrote him a huge note', 'She hid under her bed'], answer: 1 }
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
