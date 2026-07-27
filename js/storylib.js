// Story Library — bonus decodable books beyond the island stories.
// `level` matches curriculum level; stories use patterns from that level
// and below, plus introduced heart words.

const STORY_LIB = [
  {
    id: 'S1', title: 'Nell and the Last Egg', emoji: '🐔', level: 1,
    pages: [
      'Nell the red hen sat on six eggs and sang to them. "Come out, chicks," said Nell. "All six of you."',
      'Then the eggs went crack, crack, crack! Wet chicks got out and ran to Nell. But one egg did not crack.',
      '"Come run with us, Mom!" said the chicks. "Not yet," said Nell. "I can sit and sit and sit."',
      'At last that egg went crack! The last chick fell out. "All six!" said Nell. "Come on. I can run with you."'
    ],
    questions: [
      { q: 'Why did Nell say "Not yet" when the chicks asked her to come run?', choices: ['One egg still had not cracked', 'She was too sleepy to get up', 'She did not want the chicks to run'], answer: 0 },
      { q: 'How many chicks did Nell have at the end?', choices: ['Six', 'Five', 'One'], answer: 0 }
    ]
  },
  {
    id: 'S2', title: 'Chip Wants a Nap', emoji: '😴', level: 1,
    pages: [
      'Chip the dog was ready to nap. He sat on his mat, but the hot sun was on his back.',
      'Chip got up and went in the shed. It was damp and dim, and a bug ran up his leg.',
      'Chip went in the house, but Tess hit a pot with a stick. Bang! Bang! "Tess, I want to nap!" said Chip.',
      'Tess set the pot down. "Nap on this rug," she said. Chip did, and Tess did not bang a thing.'
    ],
    questions: [
      { q: 'Why could Chip not nap on his mat?', choices: ['The mat was damp.', 'The hot sun was on his back.', 'A bug ran up his leg.'], answer: 1 },
      { q: 'What did Tess do to help Chip?', choices: ['She put his mat in the shed.', 'She hit the pot with a stick.', 'She set the pot down and let him nap on the rug.'], answer: 2 }
    ]
  },
  {
    id: 'S3', title: 'The Pink Punch Stand', emoji: '🥤', level: 1,
    pages: [
      'Pip sat at the pink punch stand, but not one kid went past. "Will I sell a thing?" she said.',
      'Then Skip the skunk ran up. "I want punch, but I do not have cash," he said.',
      '"Help me sell it, and you can have a cup," said Pip. Skip got a pan and a stick. Bang, bang, bang!',
      '"Fresh pink punch!" Skip sang, and ten kids ran up. All the cups went fast but one. "Drink up, Skip!" said Pip.'
    ],
    questions: [
      { q: 'Why did Skip say he could not have punch?', choices: ['He did not want punch', 'He had no cash', 'Pip had no cups left'], answer: 1 },
      { q: 'What did Pip do with the last cup?', choices: ['She sold it to a kid', 'She let Skip have it', 'She drank it'], answer: 1 }
    ]
  },
  {
    id: 'S4', title: 'Dot and the White Stone', emoji: '🏞️', level: 2,
    pages: [
      'It was Jane\'s big day, and Dot had no gift. She ran to the cave by the lake to look.',
      'Deep in the cave she found a white stone, smooth as glass. "Jane will love this," said Dot.',
      'But when she went to pick it up, five small bugs ran out. "Oh no, this is their home," said Dot.',
      'Dot set the stone back and ran home to get Jane. "Come see the cave," she said. "It is your gift!"'
    ],
    questions: [
      { q: 'Why did Dot go to the cave?', choices: ['To find a gift for Jane', 'To swim in the lake with Jane', 'To look for five small bugs'], answer: 0 },
      { q: 'Why did Dot set the white stone back?', choices: ['It was too big for her to lift', 'Bugs made their home under it', 'Jane said she did not like white stones'], answer: 1 }
    ]
  },
  {
    id: 'S5', title: 'The Coat That Was Too Big', emoji: '🐐', level: 2,
    pages: [
      'Goat was cold. He found a big coat on the road, but when he had it on, he fell on his nose.',
      '"I can not take one step in this coat," said Goat. So he gave it to Toad, who was cold too.',
      'The coat was too big for Toad as well, so he gave it to Snail. The coat made a tent over her.',
      'Then rain came down, so Goat and Toad ran under the tent with Snail. "Now the coat is just right," said Goat.'
    ],
    questions: [
      { q: 'Why did Goat give the coat to Toad?', choices: ['It was too small for him', 'It was so big that he could not take one step', 'Toad was the one who found it'], answer: 1 },
      { q: 'Why did Goat say the coat was just right at the end?', choices: ['The rain had made it smaller', 'All three of them could fit under it', 'Snail had cut it down to fit Goat'], answer: 1 }
    ]
  },
  {
    id: 'S6', title: 'Fern and the Pearl', emoji: '🦪', level: 2,
    pages: [
      'Fern found a shell on the beach. A pearl sat deep in it, white and round as the moon.',
      '"I will keep it," said Fern. Just then a mermaid with a green fish tail came up out of the waves.',
      '"Wait!" said the mermaid. "That pearl is my lamp. Down deep the sea is so dark, and I need it to see."',
      '"Take it," said Fern. "I have the sun." The mermaid went down, and one small light led her home.'
    ],
    questions: [
      { q: 'Where did Fern find the pearl?', choices: ['Deep in a shell on the beach', 'In the sand by the waves', 'The mermaid gave it to her'], answer: 0 },
      { q: 'Why did Fern give the pearl away?', choices: ['The pearl was too big to carry home', 'The mermaid needed its light to see in the dark sea', 'Fern did not like the way it looked'], answer: 1 }
    ]
  },
  {
    id: 'S7', title: 'Tink and the Music Box', emoji: '🤖', level: 3,
    pages: [
      'Tink was a little robot who lived in a dusty attic. No one ever came up there, and Tink was lonely.',
      'Under a big hat he found a music box. He lifted the lid, but the box did not make a sound.',
      'He looked inside and found a tiny spring, bent flat. "If I fix this, the music will bring someone up," said Tink.',
      'He bent the spring back, and the box began to play. A girl ran up the steps, and Tink had a friend at last.'
    ],
    questions: [
      { q: 'Why did the music box make no sound?', choices: ['a tiny spring inside was bent flat', 'the lid was stuck shut', 'Tink had lost the key'], answer: 0 },
      { q: 'Why did Tink want to fix the music box?', choices: ['so the music would bring someone up to him', 'so he could sell it at a shop', 'so the attic would be less dusty'], answer: 0 }
    ]
  },
  {
    id: 'S8', title: 'The Picnic They Redid', emoji: '🧺', level: 3,
    pages: [
      'It was Mom\'s birthday, so Pip and Jess made her a picnic. They hiked up the hill with her and unpacked it.',
      'A gust of wind flipped the blanket, and the buns fell in the dirt. "Let\'s redo it by the pond," said Jess.',
      'At the pond they unpacked the basket, but ants got in the jam and then it rained. "Not again!" said Pip.',
      'Pip had a plan. They ran home, redid the picnic on the rug, and Mom said it was her best birthday yet.'
    ],
    questions: [
      { q: 'Why did Pip and Jess make a picnic?', choices: ['It was Mom\'s birthday.', 'They wanted to see the pond.', 'Mom asked them to pack the basket.'], answer: 0 },
      { q: 'Where did they eat in the end?', choices: ['Up on the hill', 'By the pond', 'On the rug at home'], answer: 2 }
    ]
  },
  {
    id: 'S9', title: 'The Biggest Pumpkins in Town', emoji: '🌻', level: 3,
    pages: [
      'Gus was the tallest man in town. His pumpkins were as big as bathtubs, but he ate them all by himself.',
      'Gus waved at the kids, but they ran off. "They think I am a monster," he said. "I just want a friend."',
      'That night Gus filled his wheelbarrow. He left a pumpkin at every gate with a note that said, "For you. From Gus."',
      'The next day the kids came to his farmhouse. "You are not a monster," said a little girl. "Come eat with us."'
    ],
    questions: [
      { q: 'Why did the kids run away when Gus waved?', choices: ['They did not like pumpkins', 'They thought he was a monster', 'He forgot to wave back at them'], answer: 1 },
      { q: 'How did the kids know the pumpkins came from Gus?', choices: ['Gus knocked on every door', 'Each pumpkin had a note from Gus', 'Gus told them at school'], answer: 1 }
    ]
  },
  {
    id: 'S10', title: 'The Knot at the Castle Gate', emoji: '🧩', level: 3,
    pages: [
      'Gem\'s mother was stuck outside the castle gate. A huge knot held it shut, and ten men could not get it open.',
      '"Let me try," said Gem, but the men shook their heads. "This knot needs strong arms," one of them said.',
      'Gem knelt at the edge of the gate. She traced the rope with one finger until she found a loose end.',
      'Gently, she wriggled the loose end free until the knot came undone. The gate swung open, and Gem hugged her mother tight.'
    ],
    questions: [
      { q: 'Why did Gem want the gate open?', choices: ['Her mother was stuck outside', 'She wanted to meet the king', 'She wanted to hide from the men'], answer: 0 },
      { q: 'How did Gem get the knot open?', choices: ['She tugged it as hard as she could', 'She cut it with a big knife', 'She wriggled the loose end free, gently'], answer: 2 }
    ]
  }
];
