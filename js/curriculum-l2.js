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
        intro: 'Magic e is silent — but it has REAL magic! It hops onto the end and makes the vowel say its NAME. cap becomes cape. bit becomes bite.',
        narration: [
          { say: 'Get ready, because this is the most magical trick in reading.' },
          { say: 'One quiet letter loves to hide at the very end of words.' },
          { say: 'It is the letter' },
          { ltr: 'e' },
          { say: 'It stays completely silent. It never makes any sound!' },
          { say: 'But it has real magic. It reaches back and makes the vowel say its own name.' },
          { say: 'Listen. Without the magic, this word is' },
          { word: 'cap' },
          { say: 'The vowel is saying' },
          { ph: 'a' },
          { say: 'Now the silent letter hops on the end, and the word turns into' },
          { word: 'cape' },
          { say: 'Hear that? Now the vowel says' },
          { ph: 'a_e' },
          { say: 'Let\'s try one more. This word is' },
          { word: 'bit' },
          { say: 'The vowel is saying' },
          { ph: 'i' },
          { say: 'Sprinkle the magic on the end, and the word becomes' },
          { word: 'bite' },
          { say: 'Now the vowel says' },
          { ph: 'i_e' },
          { say: 'So when you spot that silent helper at the end, let the vowel say its name.' },
          { say: 'Come make some magic with me!' }
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
        intro: 'Here comes magic e! It works on o and u too. Hop becomes hope. Cub becomes cube. The vowel says its own name!',
        narration: [
          { say: 'Here comes magic' },
          { ltr: 'e' },
          { say: 'It works on two more vowels too. Listen to their names.' },
          { ltr: 'o' },
          { ltr: 'u' },
          { say: 'Listen to this word.' },
          { word: 'hop' },
          { say: 'The vowel in the middle says' },
          { ph: 'o' },
          { say: 'Now add the silent helper on the end.' },
          { word: 'hope' },
          { say: 'That vowel changed! Now it says' },
          { ph: 'o_e' },
          { say: 'That is its own name. Here is one more word.' },
          { word: 'cub' },
          { say: 'The vowel in the middle says' },
          { ph: 'u' },
          { say: 'Now add the silent helper on the end.' },
          { word: 'cube' },
          { say: 'That vowel changed! Now it says' },
          { ph: 'u_e' },
          { say: 'The vowel says its own name every time. Let\'s go try it!' }
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
        intro: 'Mimi here! Get ready to meet the bossiest letter of all: r! When r stands right after a vowel, it gets BOSSY — the vowel does not get to say its own sound anymore. The team ar says /ar/, like star. That same bossy r teams up with another vowel to make or, which says /or/, like corn. Now listen for the bossy sounds in barn and fork. Let\'s read some bossy words together!',
        narration: [
          { say: 'Mimi here! Get ready to meet the bossiest letter of all.' },
          { say: 'Listen to the sound it makes.' },
          { ph: 'r' },
          { say: 'When that letter stands right after any vowel, it gets bossy.' },
          { say: 'The vowel does not get to say its own sound anymore.' },
          { say: 'The two of them team up and say' },
          { ph: 'ar' },
          { say: 'like in' },
          { word: 'star' },
          { say: 'That same bossy letter teams up with another vowel too.' },
          { say: 'Then they say' },
          { ph: 'or' },
          { say: 'like in' },
          { word: 'corn' },
          { say: 'Now listen for the bossy sounds in' },
          { word: 'barn' },
          { say: 'and in' },
          { word: 'fork' },
          { say: 'Let\'s read some bossy words together!' }
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
        intro: 'Bun here, with one big secret about bossy letters! er, ir, and ur ALL make the same sound: er. You can hear it in her, bird, and purr — the same bossy sound hides in every one. Mimi the cat makes that sound when she\'s happy: purr!',
        narration: [
          { say: 'Bun here, with one big secret about bossy letters!' },
          { say: 'Three teams of letters all hide the very same sound. Listen closely.' },
          { say: 'The first team is' },
          { ltr: 'e' },
          { ltr: 'r' },
          { say: 'and it says' },
          { ph: 'er' },
          { say: 'The next team is' },
          { ltr: 'i' },
          { ltr: 'r' },
          { say: 'and it says' },
          { ph: 'ir' },
          { say: 'The last team is' },
          { ltr: 'u' },
          { ltr: 'r' },
          { say: 'and it says' },
          { ph: 'ur' },
          { say: 'Did you hear that? All three teams made the same sound.' },
          { say: 'That\'s because every team ends with the same bossy letter.' },
          { say: 'You can hear it in' },
          { word: 'her' },
          { say: 'and in' },
          { word: 'bird' },
          { say: 'and in' },
          { word: 'purr' },
          { say: 'Every one of those words has that same sound inside.' },
          { say: 'Mimi the cat makes that sound when she\'s happy.' },
          { word: 'purr' },
          { say: 'Hop along and listen for it. You\'ve got this!' }
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
        intro: 'Vowel teams are best friends who hold hands and make ONE sound! The team ai hides in the middle of words, like rain. The team ay loves the end of words, like play!',
        narration: [
          { say: 'Vowel teams are best friends who hold hands and make just one sound!' },
          { say: 'Today we meet two teams, and they both say the same sound.' },
          { say: 'The first team hides in the middle of words. Together they say' },
          { ph: 'ai' },
          { say: 'like in' },
          { word: 'rain' },
          { say: 'The second team loves the end of words. Together they say' },
          { ph: 'ay' },
          { say: 'like in' },
          { word: 'play' },
          { say: 'Two teams, one happy sound. Let\'s go find them!' }
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
        intro: 'Three teams of letters all say ee! You hear it in bee, in leaf, and in key — three ways to spell one happy sound!',
        narration: [
          { say: 'Three teams of letters are hiding on this island. Every single one of them says' },
          { ph: 'ee' },
          { say: 'You hear it in the word' },
          { word: 'bee' },
          { say: 'You hear it again in' },
          { word: 'leaf' },
          { say: 'And one more time in' },
          { word: 'key' },
          { say: 'Each of those three words spells the sound in its own way. But they all say the very same happy sound.' },
          { ph: 'ee' },
          { say: 'Let\'s go hunt for all three teams together!' }
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
        intro: 'More letter teams! oa says the long o sound, like in boat. ow can say that same sound, like in snow. igh says the long i sound, like in night — the g and h are silent ninjas! And y at the end of a short word can say it too, like in fly.',
        narration: [
          { say: 'More letter teams! The first team is' },
          { ltr: 'o' },
          { ltr: 'a' },
          { say: 'Together they say' },
          { ph: 'oa' },
          { say: 'like in' },
          { word: 'boat' },
          { say: 'The next team is' },
          { ltr: 'o' },
          { ltr: 'w' },
          { say: 'It can say that very same sound,' },
          { ph: 'ow_o' },
          { say: 'like in' },
          { word: 'snow' },
          { say: 'Now three letters team up.' },
          { ltr: 'i' },
          { ltr: 'g' },
          { ltr: 'h' },
          { say: 'All three together say' },
          { ph: 'igh' },
          { say: 'like in' },
          { word: 'night' },
          { say: 'Two of them are silent ninjas.' },
          { ltr: 'g' },
          { ltr: 'h' },
          { say: 'They sneak along and make no sound at all!' },
          { say: 'One more letter likes to hide at the end of short words. Its name is' },
          { ltr: 'y' },
          { say: 'There it can say' },
          { ph: 'y_i' },
          { say: 'like in' },
          { word: 'fly' },
          { say: 'Three teams and one sneaky letter. They make just two sounds. You\'ve got this!' }
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
        intro: 'These sounds wiggle in your mouth! Two letter teams — “ou” and “ow” — both say /ow/. Ouch! That sound is loud. You can hear it in cow and in cloud. Two more teams — “oi” and “oy” — both say /oy/, like in coin and toy. The team “oo” says /oo/, like in moon. That same team has another sound too — listen for it in book. Can you hear how those two words are different? Hop along and read them with me!',
        narration: [
          { say: 'These sounds wiggle in your mouth!' },
          { say: 'These two letter teams both say' },
          { ph: 'ou' },
          { say: 'Ouch! That sound is loud.' },
          { say: 'You can hear it in' },
          { word: 'cow' },
          { say: 'and in' },
          { word: 'cloud' },
          { say: 'Two more letter teams both say' },
          { ph: 'oi' },
          { say: 'like in' },
          { word: 'coin' },
          { say: 'and like in' },
          { word: 'toy' },
          { say: 'One more letter team says' },
          { ph: 'oo' },
          { say: 'like in' },
          { word: 'moon' },
          { say: 'That same team has another sound too.' },
          { say: 'Listen for it in' },
          { word: 'book' },
          { say: 'Can you hear how those two words are different?' },
          { say: 'Hop along and read them with me!' }
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
