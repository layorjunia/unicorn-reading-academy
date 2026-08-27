// Heart words, fluency passages, creatures, and phoneme fallback map.

// NOTE: there is deliberately no "spell the sound as English letters" fallback
// map here any more. Respellings like b -> 'b' or a -> 'ah' were read aloud as
// letter NAMES ("bee", "ay"), which is the exact mistake this app must never
// make. Letter sounds come only from the IPA phoneme clips in audio/ph/, and
// tools/gen_audio.py fails the build if any of them is missing.

// ── Heart Words ──
// 100 high-frequency words in 20 sets. `heart` = 0-based positions of the
// letters that break the rules (learned "by heart"); [] = a flash word that
// is decodable but must be read instantly.
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
  ]},
  { set: 9, words: [
    { w: 'from', heart: [] }, { w: 'have', heart: [3] }, { w: 'live', heart: [3] },
    { w: 'give', heart: [3] }, { w: 'love', heart: [1, 3] }
  ]},
  { set: 10, words: [
    { w: 'down', heart: [] }, { w: 'out', heart: [] }, { w: 'about', heart: [1] },
    { w: 'around', heart: [1] }, { w: 'house', heart: [] }
  ]},
  { set: 11, words: [
    { w: 'away', heart: [0] }, { w: 'today', heart: [1] }, { w: 'very', heart: [1] },
    { w: 'every', heart: [1, 2] }, { w: 'never', heart: [1] }
  ]},
  { set: 12, words: [
    { w: 'pretty', heart: [2] }, { w: 'busy', heart: [1] }, { w: 'buy', heart: [1, 2] },
    { w: 'sure', heart: [0, 1] }, { w: 'sugar', heart: [0, 1] }
  ]},
  { set: 13, words: [
    { w: 'mother', heart: [1] }, { w: 'father', heart: [1] }, { w: 'brother', heart: [2] },
    { w: 'sister', heart: [] }, { w: 'family', heart: [1] }
  ]},
  { set: 14, words: [
    { w: 'little', heart: [] }, { w: 'over', heart: [] }, { w: 'under', heart: [] },
    { w: 'after', heart: [] }, { w: 'before', heart: [3] }
  ]},
  { set: 15, words: [
    { w: 'school', heart: [2, 3] }, { w: 'teacher', heart: [3, 4] }, { w: 'read', heart: [] },
    { w: 'write', heart: [0] }, { w: 'learn', heart: [2, 3] }
  ]},
  { set: 16, words: [
    { w: 'work', heart: [1] }, { w: 'word', heart: [1] }, { w: 'world', heart: [1] },
    { w: 'warm', heart: [1] }, { w: 'watch', heart: [1] }
  ]},
  { set: 17, words: [
    { w: 'eye', heart: [0, 1, 2] }, { w: 'eight', heart: [1, 2, 3] }, { w: 'head', heart: [2] },
    { w: 'bread', heart: [3] }, { w: 'ready', heart: [2] }
  ]},
  { set: 18, words: [
    { w: 'goes', heart: [2] }, { w: 'gone', heart: [3] }, { w: 'great', heart: [2, 3] },
    { w: 'break', heart: [2, 3] }, { w: 'heart', heart: [2, 3] }
  ]},
  { set: 19, words: [
    { w: 'young', heart: [1, 2] }, { w: 'touch', heart: [1, 2] }, { w: 'enough', heart: [4, 5] },
    { w: 'though', heart: [3, 4, 5] }, { w: 'through', heart: [3, 4, 5, 6] }
  ]},
  { set: 20, words: [
    { w: 'animal', heart: [] }, { w: 'different', heart: [4] }, { w: 'important', heart: [] },
    { w: 'together', heart: [2] }, { w: 'favorite', heart: [2, 5] }
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
    id: 'F3', title: 'The Lost Sock', emoji: '🧦', level: 1,
    text: 'Dot lost her best red sock. She looked in the box. No sock. She looked under the bed. No sock. She looked in the tub. No sock! Then Dot saw her dog, Rex. Rex had the red sock on his back leg. He did a little dance in it. Dot had to laugh. "You can keep it," she said. "It fits you best!" Rex wagged his tail and ran off with the sock.'
  },
  {
    id: 'F4', title: 'The Big Wind', emoji: '🍃', level: 1,
    text: 'The wind was big and fast that day. It sent hats up in the sky. It sent leaves down the path. Pip held on to her hat with both hands. Then the wind took her list! The list had all her jobs on it. Bun ran and got it just in time. "Thank you!" said Pip. "You are so fast!" They went home and had hot milk. The wind can huff and puff, but friends help friends.'
  },
  {
    id: 'F5', title: 'The Rainbow Gate', emoji: '🌈', level: 2,
    text: 'Pip the unicorn found a gate at the end of the lane. The gate was made of gold and it would not open. Then Pip saw a note. It said, "Sing a sweet song to open the gate." Pip sang her best song. The gate began to shake and shine. It opened wide! Inside was a garden full of roses and rainbows. Pip smiled. She would keep this place safe and show it to all her friends.'
  },
  {
    id: 'F6', title: 'The Night Boat', emoji: '⛵', level: 2,
    text: 'Dot the dragon has a small green boat. At night she sails under the moon and stars. The waves rock the boat up and down. One night, Dot saw a light far away. It was low and bright. She sailed close to see it. It was a lighthouse on a hill! The keeper waved to Dot. "Thank you for coming by," he said. "It gets lonely out here at night." Now Dot visits him each week, and they watch the sea together.'
  },
  {
    id: 'F7', title: 'The Mail Snail', emoji: '🐌', level: 2,
    text: 'A snail named Gail brings the mail in Rainbow Forest. She is not fast, but she never fails. Rain or shine, Gail stays on the trail. One day the rain turned the path to mud. The mail bag was too heavy to drag. Did Gail quit? No way! She waited under a leaf until the rain went away. Then she hauled that mail up the hill. The whole town cheered for Gail. Slow and steady wins the day!'
  },
  {
    id: 'F8', title: 'The Star Farm', emoji: '⭐', level: 2,
    text: 'Far past the barn there is a farm where stars grow. Each star starts as a small spark in the dark soil. Mimi helps the farmer water them with moonlight. By March, the stars are bright and sharp. Then comes the best part. The farmer puts each star in a cart and takes them to the sky! He sets them in their spots, one by one. On a clear night, look up. You just might see a star that Mimi helped grow.'
  },
  {
    id: 'F9', title: 'The Green Team', emoji: '🌱', level: 2,
    text: 'Bun had a dream to clean up the beach. She needed a team. Mimi said, "Count me in!" Pip and Dot agreed too. At the beach, they picked up each can and wrapper they could see. Dot found a boot. Pip found a wheel! They filled three big bags by noon. Then they ate peaches under a palm tree. The clean sand gleamed in the sun. "A beach this sweet is worth keeping neat," said Bun. The green team meets each week now.'
  },
  {
    id: 'F10', title: 'The Sleepy Pony', emoji: '🐴', level: 3,
    text: 'Once there was a sleepy little pony named Poppy. Every morning she would yawn and stretch and go right back to sleep. One sunny day, her friends planned a picnic party. They packed muffins, apples, and berry juice. But where was Poppy? Sleeping, of course! The friends tiptoed to her side and sang a gentle wake-up song. Poppy opened one eye, then the other. When she heard the word "muffins," she jumped up quickly! Nobody sleeps through a picnic.'
  },
  {
    id: 'F11', title: 'The Bravest Little Star', emoji: '🌟', level: 3,
    text: 'High above Crystal Castle lived a little star named Nova. She was the smallest star in the sky, but she had the biggest dream. She wanted to make a wish come true for someone below. One cloudy night, a lost kitten looked up and wished for a way home. Nova shined with all her might. Her light cut through the clouds like a silver ribbon. The kitten followed the bright path all the way to her doorstep. Nova twinkled joyfully. Small stars can do mighty things.'
  },
  {
    id: 'F12', title: 'The Pancake Contest', emoji: '🥞', level: 3,
    text: 'The weekend pancake contest was the biggest event in town. Pip entered with her famous rainbow pancakes. Dot made dragon pancakes with a little smoke on top. Mimi flipped hers so high it stuck to the ceiling! Everyone giggled. When the judges tasted each plate, they could not pick a winner. The pancakes were all wonderful in different ways. So the judges gave every baker a purple ribbon. Then the whole town sat down together and ate every last bite.'
  },
  {
    id: 'F13', title: 'The Secret Garden Door', emoji: '🚪', level: 3,
    text: 'Behind the castle wall, under a curtain of ivy, there is a tiny wooden door. Most people walk right past it. But if you knock three times and say "sparkle," it swings open. Inside is a garden where flowers hum soft music and butterflies glow like lanterns. A gentle turtle named Sheldon keeps the garden tidy. He waters the humming roses every morning. Visitors must follow one rule: leave the garden kinder than you found it. Everyone who visits agrees it is easy to do.'
  },
  {
    id: 'F14', title: 'The Upside-Down Day', emoji: '🙃', level: 3,
    text: 'One silly morning, everything in Sparkle Meadow went upside down. The birds walked and the bunnies flew. Breakfast was served at bedtime, and pajamas were worn to lunch. Dot the dragon laughed so hard she hiccuped tiny clouds. "We should fix this," said Pip, but she was giggling too. The friends decided to enjoy the strange day instead. They ate dessert first and told bedtime stories at noon. By sunset, everything flipped back to normal. Almost everything. Rex the dog still sleeps upside down.'
  },
  {
    id: 'F15', title: 'The Kindness Machine', emoji: '⚙️', level: 3,
    text: 'The royal inventor built a machine that could make anything. The king asked for gold, and out came gold. The queen asked for roses, and out came roses. Then a small girl asked for kindness. The machine buzzed and clicked and stopped. It could not make kindness at all! The girl smiled and shared her sandwich with the sad inventor. The machine printed a little note: "Kindness cannot be made by machines. It is made by people, and it is free." The king framed that note above his throne.'
  },
  {
    id: 'F16', title: 'The Moon Picnic', emoji: '🌙', level: 3,
    text: 'On the first warm night of summer, the four friends packed a midnight picnic. They spread a purple blanket on the tallest hill and waited for the moon to rise. It came up huge and golden, so close they felt they could touch it. Mimi poured moonberry juice while Bun passed out star-shaped cookies. Dot told a story about a dragon who sneezed comets. Pip made a wish that this night would never end. The moon, being an excellent listener, rose extra slowly just for them.'
  },
  {
    id: 'F17', title: 'The Library Dragon', emoji: '📚', level: 3,
    text: 'A young dragon named Ember loved books more than treasure. While other dragons guarded gold, she guarded the town library. Every evening she read adventure stories by the light of her own gentle flame. One winter, a storm knocked out all the lights in town. The people could not read at night! Ember opened the library doors wide and lit the reading room with her warm glow. All winter long, the town gathered there each evening. Ember finally had what she always wanted: a whole town of reading friends.'
  },
  {
    id: 'F18', title: 'The Champion of Trying', emoji: '🏅', level: 3,
    text: 'Nobody expected the little turtle to enter the great race. The rabbits stretched, the foxes bragged, and the deer pranced at the starting line. The turtle simply smiled and said, "I am here to try my best." The race began with a flash. Runners zoomed past the turtle in a blur of dust. She kept going anyway, step after steady step. Hours later, she crossed the finish line dead last. But the crowd cheered loudest of all for her. Trying your hardest, they knew, is its own kind of winning.'
  }
];

// ── Creature Cove: collectible friends, unlocked by stars ──
// `key` selects the drawn character in js/characters.js. The emoji is only a
// fallback for the brief moment before that file loads.
const CREATURES = [
  { key: 'sparkle', emoji: '🦄', name: 'Sparkle' }, { key: 'whiskers', emoji: '🐱', name: 'Whiskers' },
  { key: 'clover', emoji: '🐰', name: 'Clover' }, { key: 'biscuit', emoji: '🐶', name: 'Biscuit' },
  { key: 'ember', emoji: '🦊', name: 'Ember' }, { key: 'bamboo', emoji: '🐼', name: 'Bamboo' },
  { key: 'flutter', emoji: '🦋', name: 'Flutter' }, { key: 'splash', emoji: '🐬', name: 'Splash' },
  { key: 'pinky', emoji: '🦩', name: 'Pinky' }, { key: 'sheldon', emoji: '🐢', name: 'Sheldon' },
  { key: 'inky', emoji: '🐙', name: 'Inky' }, { key: 'sage', emoji: '🦉', name: 'Sage' },
  { key: 'peep', emoji: '🐣', name: 'Peep' }, { key: 'marina', emoji: '🧜‍♀️', name: 'Marina' },
  { key: 'twinkle', emoji: '🧚', name: 'Twinkle' }, { key: 'blaze', emoji: '🐉', name: 'Blaze' },
  { key: 'rexy', emoji: '🦖', name: 'Rexy' }, { key: 'nutmeg', emoji: '🐿️', name: 'Nutmeg' },
  { key: 'grace', emoji: '🦢', name: 'Grace' }, { key: 'dottie', emoji: '🐞', name: 'Dottie' },
  { key: 'stretch', emoji: '🦒', name: 'Stretch' }, { key: 'waddle', emoji: '🐧', name: 'Waddle' },
  { key: 'snuggles', emoji: '🐨', name: 'Snuggles' }, { key: 'nova', emoji: '🌟', name: 'Nova' }
];
const STARS_PER_CREATURE = 12;

// Emoji options for the picture password
const PW_EMOJI = ['🦄', '🐱', '🌈', '⭐', '🍓', '🌸', '🦋', '👑', '🧁'];
