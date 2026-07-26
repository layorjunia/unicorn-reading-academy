// Story Library — bonus decodable books beyond the island stories.
// `level` matches curriculum level; stories use patterns from that level
// and below, plus introduced heart words.

const STORY_LIB = [
  {
    id: 'S1', title: 'The Red Hen', emoji: '🐔', level: 1,
    pages: [
      'A red hen sat on a log. She had six eggs.',
      'Tap, tap, tap! The eggs went crack.',
      'Six chicks! The chicks ran in the mud.',
      'The red hen got the chicks in bed. Hush, hush. The end of a big day.'
    ],
    questions: [
      { q: 'How many eggs did the hen have?', choices: ['six', 'ten', 'two'], answer: 0 },
      { q: 'Where did the chicks run?', choices: ['in the mud', 'up a hill', 'to the pond'], answer: 0 }
    ]
  },
  {
    id: 'S2', title: 'The Bad Nap', emoji: '😴', level: 1,
    pages: [
      'Rex the dog had a nap in the sun.',
      'A bug sat on his leg. Buzz! Rex got up.',
      'He had a nap in the shed. Drip! The shed had a wet spot.',
      'At last Rex sat in his soft bed. Best nap yet!'
    ],
    questions: [
      { q: 'What sat on the leg of Rex?', choices: ['a bug', 'a cat', 'a hat'], answer: 0 },
      { q: 'Where was the best nap?', choices: ['in his soft bed', 'in the sun', 'in the shed'], answer: 0 }
    ]
  },
  {
    id: 'S3', title: 'The Pink Drink', emoji: '🥤', level: 1,
    pages: [
      'Pip had a stand with a big sign: PINK DRINK.',
      'Bun got a cup. "Yum! It is the best!"',
      'Then a skunk came to the stand. The skunk had no cash.',
      '"You can have a drink for free," said Pip. The skunk gave a big grin. Wink, wink!'
    ],
    questions: [
      { q: 'What did the sign say?', choices: ['PINK DRINK', 'HOT DOGS', 'FRESH FISH'], answer: 0 },
      { q: 'What did Pip give the skunk?', choices: ['a free drink', 'a hat', 'cash'], answer: 0 }
    ]
  },
  {
    id: 'S4', title: 'The Cave by the Lake', emoji: '🏞️', level: 2,
    pages: [
      'Dot found a cave by the lake. It was dark inside.',
      'She made a small flame to light the way.',
      'The walls had shapes of stars and waves. So fine!',
      'Dot did not take a thing. Some places are best left the same. She went home with a smile.'
    ],
    questions: [
      { q: 'What did Dot find?', choices: ['a cave', 'a cake', 'a boat'], answer: 0 },
      { q: 'What did Dot take home?', choices: ['nothing at all', 'a stone', 'a star'], answer: 0 }
    ]
  },
  {
    id: 'S5', title: 'The Goat in a Coat', emoji: '🐐', level: 2,
    pages: [
      'A goat got a coat in the mail. It was too big!',
      'The goat gave it to the toad. It was still too big.',
      'The toad gave it to the snail on the trail.',
      'The snail wore the coat like a tent. "A perfect fit!" she said with joy.'
    ],
    questions: [
      { q: 'What came in the mail?', choices: ['a coat', 'a boat', 'a goat'], answer: 0 },
      { q: 'Who did the coat fit best?', choices: ['the snail', 'the goat', 'the toad'], answer: 0 }
    ]
  },
  {
    id: 'S6', title: 'The Girl and the Pearl', emoji: '🦪', level: 2,
    pages: [
      'A girl with curls sat on the shore. She found a shell.',
      'Inside the shell was a pearl! It had a soft glow.',
      'A mermaid rose from the surf. "That pearl is my light for the dark sea."',
      'The girl gave it back. The mermaid gave her a starfish charm. Fair trade, sweet friends.'
    ],
    questions: [
      { q: 'What was inside the shell?', choices: ['a pearl', 'a crab', 'a coin'], answer: 0 },
      { q: 'What did the mermaid give the girl?', choices: ['a starfish charm', 'a crown', 'a boat'], answer: 0 }
    ]
  },
  {
    id: 'S7', title: 'The Little Robot', emoji: '🤖', level: 3,
    pages: [
      'A little robot lived in a basket in the attic.',
      'His job was to fix broken things. He fixed a candle. He fixed a ribbon.',
      'One day he found a broken music box. He worked all night.',
      'In the morning, the music box played a gentle tune. The whole family danced. The little robot beeped with joy.'
    ],
    questions: [
      { q: 'Where did the robot live?', choices: ['in a basket in the attic', 'in a rocket', 'under the bed'], answer: 0 },
      { q: 'What did he fix at the end?', choices: ['a music box', 'a mitten', 'a pumpkin'], answer: 0 }
    ]
  },
  {
    id: 'S8', title: 'The Unlucky Picnic', emoji: '🧺', level: 3,
    pages: [
      'The friends planned a picnic, but everything went wrong.',
      'The muffins were unbaked. The blanket was unpacked. The juice was undrinkable!',
      '"Let\'s redo this," said Pip. They rebaked, repacked, and refilled.',
      'The redone picnic was unforgettable. Sometimes you just need a restart!'
    ],
    questions: [
      { q: 'What does "redo" mean?', choices: ['do it again', 'never do it', 'do it wrong'], answer: 0 },
      { q: 'How was the redone picnic?', choices: ['unforgettable', 'unlucky', 'unpacked'], answer: 0 }
    ]
  },
  {
    id: 'S9', title: 'The Gentle Giant\'s Garden', emoji: '🌻', level: 3,
    pages: [
      'A gentle giant kept a garden in the center of the city.',
      'His flowers were huge. His carrots were larger than wagons!',
      'The giant shared his giant vegetables with everyone.',
      'The city gave him a golden pencil, since he loved to write about plants. He wrote a thankful note in giant letters: THANK YOU, NICE CITY.'
    ],
    questions: [
      { q: 'Where was the garden?', choices: ['in the center of the city', 'on the moon', 'by the sea'], answer: 0 },
      { q: 'What gift did the city give?', choices: ['a golden pencil', 'a giant wagon', 'a race car'], answer: 0 }
    ]
  },
  {
    id: 'S10', title: 'The Knight\'s Puzzle', emoji: '🧩', level: 3,
    pages: [
      'The knight found a puzzle at the castle gate. It had a knot no one could untie.',
      'The strongest knights pulled and pulled. The knot would not budge.',
      'A small child looked closely. "It is not a real knot. It is a bow!"',
      'She pulled one loose end, and it unwrapped itself. Wisdom can be stronger than strength.'
    ],
    questions: [
      { q: 'What was the puzzle?', choices: ['a knot no one could untie', 'a riddle on the wall', 'a locked door'], answer: 0 },
      { q: 'Who solved it?', choices: ['a small child', 'the strongest knight', 'the king'], answer: 0 }
    ]
  }
];
