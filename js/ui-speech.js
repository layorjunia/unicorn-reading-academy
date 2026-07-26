// Every line the app speaks that is not curriculum content.
//
// This list exists so tools/gen_audio.py can guarantee a recording for each
// one. If a spoken string is not here (or in the curriculum data), it has no
// clip and would fall back to the browser voice — which is exactly the bug
// this app is built to avoid. Add the string here when you add a spoken line.
//
// Rules for anything in this file:
//   * no single letters as standalone words (a voice reads "a" as "uh")
//   * no grapheme spellings ("sh", "a_e", "igh")
//   * no emoji or symbols
//   * no runtime interpolation — a template like `Hi ${name}` can never have
//     a clip, so greetings stay generic

const UI_PHRASES = [
  // praise / encouragement
  'Great job!', 'You did it!', 'Super sparkle!', 'Amazing!', 'Wow, fantastic!',
  'You are a reading star!',
  'Almost! Try again!', 'Good try! Listen again!', 'You can do it!',
  'So close! One more try!',

  // profiles & onboarding
  'Hi! Ready to read?', 'Welcome! Let the reading adventure begin!',
  'Welcome back!', 'Type your name first!', 'Tap your four secret pictures!',
  'A unicorn!', 'Good pick!',
  'Hmm, that is not right!', 'Hmm, that did not match. Ask a grown-up to help!',
  'Your cloud backpack is ready!', 'Synced!',

  // map & islands
  'Finish the island before this one to unlock it!',
  'Island complete! You earned five stars! Amazing reading!',
  "So close! Let's try one more time. Practice makes sparkle!",
  'Daily quest complete! Five bonus stars!',

  // activity prompts
  'Robot talk! Tap the robot, listen to the sounds, and tap the word you hear!',
  'Build the word! Tap the tiles in order. Tap the speaker to hear it again!',
  'Which team does this word belong to? Tap the word to hear it, then tap its team!',
  'Story time! Read it out loud. Tap any word if you need help.',
  'Sparkle Quiz! Listen to the word and tap it!',
  'Tap the robot, listen to the sounds, tap the word!',
  'Listen and tap the word!', 'Build the word!',
  'Build the word', 'It was', 'It is spelled', 'You built it!', 'like',

  // stories
  'You read the whole story!', 'You read the whole story! Now for the sparkle quiz!',

  // heart words
  'The pink letters are the tricky part. Learn them by heart!',
  'Your garden is watered! Three stars for you!',

  // fluency
  'Ready, set, read!',
  'Great reading! Reading it again makes your brain even stronger!',
  'Three reads! You are super fluent!',

  // practice
  'Practice time!', 'Practice complete! Three stars!',

  // creature cove
  'Keep reading to meet this friend!', 'Hello!'
];
