// Heart words, fluency passages, creatures, and phoneme pronunciation map.

// ── How graphemes are spoken aloud by TTS (pure-sound approximations) ──
const PHONEME_SPEAK = {
  a: 'ah', e: 'eh', i: 'ih', o: 'aw', u: 'uh',
  b: 'b', c: 'k', d: 'd', f: 'ff', g: 'g', h: 'h', j: 'j', k: 'k',
  l: 'l', m: 'mm', n: 'nn', p: 'p', q: 'kw', r: 'rr', s: 'ss', t: 't',
  v: 'vv', w: 'wuh', x: 'ks', y: 'yuh', z: 'zz',
  sh: 'shh', ch: 'ch', th: 'th', wh: 'wh', ck: 'k',
  ar: 'ar', or: 'or', er: 'er', ir: 'er', ur: 'er',
  ai: 'ay', ay: 'ay', ee: 'ee', ea: 'ee', ey: 'ee',
  oa: 'oh', igh: 'eye', oi: 'oy', oy: 'oy', ou: 'ow', oo: 'oo',
  ing: 'ing', ank: 'ank', ink: 'ink', all: 'all', ang: 'ang',
  'a_e': 'ay', 'i_e': 'eye', 'o_e': 'oh', 'u_e': 'you',
  ow_o: 'oh', ow_ou: 'ow', y_i: 'eye', gi: 'jih', ce: 'ss',
  eye: 'eye', kn: 'nn', wr: 'rr', ge: 'j'
};

// ── Heart Words ──
// Irregular high-frequency words. `heart` = 0-based letter positions that
// don't follow the rules (learned "by heart"). Sets unlock with L1/L2/L3
// islands in order, one set per island milestone.
const HEART_WORDS = [
  { set: 1, words: [
    { w: 'the', heart: [2] }, { w: 'a', heart: [0] }, { w: 'I', heart: [0] },
    { w: 'is', heart: [1] }, { w: 'to', heart: [1] }
  ]},
  { set: 2, words: [
    { w: 'said', heart: [1, 2] }, { w: 'you', heart: [1, 2] }, { w: 'was', heart: [1, 2] },
    { w: 'of', heart: [0, 1] }, { w: 'do', heart: [1] }
  ]},
  { set: 3, words: [
    { w: 'what', heart: [2] }, { w: 'want', heart: [1] }, { w: 'who', heart: [1, 2] },
    { w: 'where', heart: [2, 3, 4] }, { w: 'there', heart: [2, 3, 4] }
  ]},
  { set: 4, words: [
    { w: 'come', heart: [1, 3] }, { w: 'some', heart: [1, 3] }, { w: 'done', heart: [1, 3] },
    { w: 'does', heart: [1, 2, 3] }, { w: 'one', heart: [0, 1, 2] }
  ]},
  { set: 5, words: [
    { w: 'they', heart: [2, 3] }, { w: 'their', heart: [2, 3, 4] }, { w: 'were', heart: [1, 2, 3] },
    { w: 'are', heart: [1, 2] }, { w: 'your', heart: [1, 2] }
  ]},
  { set: 6, words: [
    { w: 'could', heart: [1, 2, 3] }, { w: 'would', heart: [1, 2, 3] }, { w: 'should', heart: [2, 3, 4] },
    { w: 'two', heart: [1, 2] }, { w: 'once', heart: [0] }
  ]},
  { set: 7, words: [
    { w: 'many', heart: [1] }, { w: 'any', heart: [0] }, { w: 'again', heart: [2, 3] },
    { w: 'friend', heart: [2] }, { w: 'people', heart: [2, 3] }
  ]},
  { set: 8, words: [
    { w: 'because', heart: [4, 5, 6] }, { w: 'laugh', heart: [2, 3] }, { w: 'water', heart: [1] },
    { w: 'other', heart: [0] }, { w: 'thought', heart: [2, 3, 4, 5] }
  ]}
];

// ── Fluency passages (repeated reading + parent WCPM check) ──
// 2nd grade benchmarks (words correct per minute):
// fall ≈ 51, winter ≈ 72, spring ≈ 89
const FLUENCY_BENCHMARKS = { fall: 51, winter: 72, spring: 89 };

const FLUENCY_PASSAGES = [
  {
    id: 'F1', title: 'The Pet Cat', emoji: '🐱', level: 1,
    text: 'Mimi is a cat. She is soft and pink. Mimi likes to nap in the sun. She naps on the rug. She naps on the bed. She naps in a box! One day Mimi could not nap. A bug was in her box. Buzz, buzz! Mimi did not like that. She hit the box with her paw. The bug flew away. Then Mimi got in her box. At last, she had a good nap.'
  },
  {
    id: 'F2', title: 'A Trip to the Pond', emoji: '🐸', level: 1,
    text: 'Bun the bunny went to the pond. She saw a frog on a log. The frog can jump and swim. Bun cannot swim, but she can hop very fast. The frog said, "Let us have a race!" The frog swam and Bun hopped. They got to the end at the same time. It was a tie! The frog and Bun did a happy dance. Then they sat in the grass and had a snack.'
  },
  {
    id: 'F3', title: 'The Rainbow Gate', emoji: '🌈', level: 2,
    text: 'Pip the unicorn found a gate at the end of the lane. The gate was made of gold and it would not open. Then Pip saw a note. It said, "Sing a sweet song to open the gate." Pip sang her best song. The gate began to shake and shine. It opened wide! Inside was a garden full of roses and rainbows. Pip smiled. She would keep this place safe and show it to all her friends.'
  },
  {
    id: 'F4', title: 'The Night Boat', emoji: '⛵', level: 2,
    text: 'Dot the dragon has a small green boat. At night she sails under the moon and stars. The waves rock the boat up and down. One night, Dot saw a light far away. It was low and bright. She sailed close to see it. It was a lighthouse on a hill! The keeper waved to Dot. "Thank you for coming by," he said. "It gets lonely out here at night." Now Dot visits him each week, and they watch the sea together.'
  },
  {
    id: 'F5', title: 'The Sleepy Pony', emoji: '🐴', level: 3,
    text: 'Once there was a sleepy little pony named Poppy. Every morning she would yawn and stretch and go right back to sleep. One sunny day, her friends planned a picnic party. They packed muffins, apples, and berry juice. But where was Poppy? Sleeping, of course! The friends tiptoed to her side and sang a gentle wake-up song. Poppy opened one eye, then the other. When she heard the word "muffins," she jumped up quickly! Nobody sleeps through a picnic.'
  },
  {
    id: 'F6', title: 'The Bravest Little Star', emoji: '⭐', level: 3,
    text: 'High above Crystal Castle lived a little star named Nova. She was the smallest star in the sky, but she had the biggest dream. She wanted to make a wish come true for someone below. One cloudy night, a lost kitten looked up and wished for a way home. Nova shined with all her might. Her light cut through the clouds like a silver ribbon. The kitten followed the bright path all the way to her doorstep. Nova twinkled joyfully. Small stars can do mighty things.'
  }
];

// ── Creature Cove: collectible friends, unlocked by stars ──
const CREATURES = [
  { emoji: '🦄', name: 'Sparkle' }, { emoji: '🐱', name: 'Whiskers' },
  { emoji: '🐰', name: 'Clover' }, { emoji: '🐶', name: 'Biscuit' },
  { emoji: '🦊', name: 'Ember' }, { emoji: '🐼', name: 'Bamboo' },
  { emoji: '🦋', name: 'Flutter' }, { emoji: '🐬', name: 'Splash' },
  { emoji: '🦩', name: 'Pinky' }, { emoji: '🐢', name: 'Sheldon' },
  { emoji: '🐙', name: 'Inky' }, { emoji: '🦉', name: 'Sage' },
  { emoji: '🐣', name: 'Peep' }, { emoji: '🧜‍♀️', name: 'Marina' },
  { emoji: '🧚', name: 'Twinkle' }, { emoji: '🐉', name: 'Blaze' },
  { emoji: '🦖', name: 'Rexy' }, { emoji: '🐿️', name: 'Nutmeg' },
  { emoji: '🦢', name: 'Grace' }, { emoji: '🐞', name: 'Dottie' },
  { emoji: '🦒', name: 'Stretch' }, { emoji: '🐧', name: 'Waddle' },
  { emoji: '🐨', name: 'Snuggles' }, { emoji: '🌟', name: 'Nova' }
];
const STARS_PER_CREATURE = 12;

// Emoji options for the picture password
const PW_EMOJI = ['🦄', '🐱', '🌈', '⭐', '🍓', '🌸', '🦋', '👑', '🧁'];
