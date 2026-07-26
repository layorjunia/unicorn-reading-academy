// Illustrated scenes for story mode.
//
// Each is a full picture-book spread drawn as SVG (16:9), so a page is
// something to look at rather than a line of text on a card. Characters from
// js/characters.js are dropped into the scene at runtime, so the same Pip and
// Mimi she collects are the ones in her stories.
//
// viewBox is 0 0 320 180. Character slots are declared per scene as
// {key, x, y, w, flip} in scene coordinates.

const SCENES = {

  meadow: {
    name: 'Sparkle Meadow',
    groundY: 132,
    sky: ['#ffe3f1', '#ffd6e8'],
    svg: `<g>
      <circle cx="272" cy="34" r="19" fill="#ffe89b"/><circle cx="272" cy="34" r="26" fill="#ffe89b" opacity=".35"/>
      <g fill="#fff" opacity=".9">
        <ellipse cx="58" cy="36" rx="22" ry="11"/><ellipse cx="74" cy="31" rx="16" ry="12"/>
        <ellipse cx="212" cy="26" rx="18" ry="9"/><ellipse cx="224" cy="22" rx="13" ry="10"/>
      </g>
      <path d="M0 120q40-16 80-8t80 6 80-10 80 4v68H0z" fill="#a8e6a3"/>
      <path d="M0 138q50-12 90-4t90 2 70-8 70 6v46H0z" fill="#8ed88a"/>
      <g fill="#ffffff" opacity=".55">
        <circle cx="30" cy="150" r="3"/><circle cx="96" cy="162" r="2.4"/><circle cx="180" cy="152" r="3"/>
        <circle cx="250" cy="164" r="2.6"/><circle cx="300" cy="146" r="2.4"/></g>
      <g>
        <path d="M40 148v-14" stroke="#5fb45c" stroke-width="2"/><circle cx="40" cy="130" r="6" fill="#ff8fc7"/><circle cx="40" cy="130" r="2.4" fill="#ffd93d"/>
        <path d="M286 152v-12" stroke="#5fb45c" stroke-width="2"/><circle cx="286" cy="136" r="5.5" fill="#b28fff"/><circle cx="286" cy="136" r="2.2" fill="#ffd93d"/>
        <path d="M150 158v-11" stroke="#5fb45c" stroke-width="2"/><circle cx="150" cy="143" r="5" fill="#ffd93d"/>
      </g>
      <g fill="#ffd93d" opacity=".9">
        <path d="M96 44l1.6 4 4 1.6-4 1.6L96 55l-1.6-3.8-4-1.6 4-1.6z"/>
        <path d="M186 58l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z"/></g>
    </g>`
  },

  forest: {
    name: 'Rainbow Forest',
    groundY: 150,
    sky: ['#e8dbff', '#d6ecff'],
    svg: `<g>
      <g opacity=".55" fill="none" stroke-width="9">
        <path d="M-10 150a180 180 0 0 1 340 0" stroke="#ff8fc7"/>
        <path d="M-10 162a170 170 0 0 1 340 0" stroke="#ffd93d"/>
        <path d="M-10 174a160 160 0 0 1 340 0" stroke="#7fe3c4"/>
      </g>
      <g>
        <rect x="44" y="92" width="11" height="52" rx="4" fill="#a9743f"/>
        <circle cx="50" cy="86" r="26" fill="#7fd48f"/><circle cx="32" cy="96" r="17" fill="#8ee39c"/><circle cx="68" cy="96" r="17" fill="#6cc57e"/>
        <rect x="262" y="100" width="10" height="46" rx="4" fill="#a9743f"/>
        <circle cx="267" cy="94" r="22" fill="#7fd48f"/><circle cx="251" cy="104" r="14" fill="#8ee39c"/><circle cx="283" cy="104" r="14" fill="#6cc57e"/>
      </g>
      <path d="M0 140q60-10 110-2t100-4 110 6v50H0z" fill="#9ae0a6"/>
      <path d="M0 156q60-8 110 0t100-2 110 4v32H0z" fill="#7fd48f"/>
      <g fill="#fff" opacity=".8"><circle cx="120" cy="40" r="2.4"/><circle cx="196" cy="30" r="2"/><circle cx="240" cy="52" r="2.2"/></g>
      <g fill="#ffd93d"><path d="M150 36l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/></g>
    </g>`
  },

  castle: {
    name: 'Crystal Castle',
    groundY: 146,
    sky: ['#e5e0ff', '#ffd6e8'],
    svg: `<g>
      <g fill="#cbb8ff">
        <rect x="120" y="70" width="80" height="70" rx="4"/>
        <rect x="96" y="88" width="30" height="52" rx="3"/><rect x="194" y="88" width="30" height="52" rx="3"/>
      </g>
      <g fill="#b9a2ff">
        <path d="M96 88l15-24 15 24zM194 88l15-24 15 24zM120 70l40-30 40 30z"/></g>
      <g fill="#ff8fc7"><path d="M111 64v-12l10 5zM209 64v-12l10 5zM160 40V26l10 5z"/></g>
      <g fill="#fff6fb"><rect x="152" y="100" width="16" height="40" rx="8"/></g>
      <g fill="#8fd3ff" opacity=".85">
        <rect x="104" y="100" width="12" height="14" rx="5"/><rect x="204" y="100" width="12" height="14" rx="5"/>
        <rect x="132" y="86" width="12" height="14" rx="5"/><rect x="176" y="86" width="12" height="14" rx="5"/></g>
      <path d="M0 140h320v44H0z" fill="#c9b6f0"/>
      <path d="M0 140q80-8 160 0t160 0v10H0z" fill="#dccdfa"/>
      <g fill="#ffd93d">
        <path d="M56 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
        <path d="M268 36l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/></g>
      <g fill="#fff" opacity=".7"><circle cx="40" cy="70" r="2.2"/><circle cx="290" cy="76" r="2"/></g>
    </g>`
  },

  cove: {
    name: 'Creature Cove',
    groundY: 126,
    sky: ['#cfeeff', '#ffe3f1'],
    svg: `<g>
      <circle cx="52" cy="38" r="16" fill="#ffe89b"/>
      <path d="M0 118q40-10 80-4t80 2 80-6 80 4v70H0z" fill="#ffe9b8"/>
      <path d="M0 132q60 8 120 2t120-4 80 4v50H0z" fill="#ffd98f"/>
      <path d="M0 104q30-8 60 0t60 4 60-6 60 2 80 2v14q-40-8-80-2t-60 6-60-4-60-4-60 6z" fill="#8fd3ff"/>
      <g fill="#bfe6ff" opacity=".8">
        <path d="M10 112q14-6 28 0t28 0M180 108q14-6 28 0t28 0"/></g>
      <g fill="#7fd48f"><ellipse cx="286" cy="118" rx="26" ry="8"/><rect x="282" y="76" width="7" height="44" rx="3" fill="#a9743f"/>
        <path d="M285 74q-22-6-26-18 18-4 28 12zM287 74q22-8 24-20-18-2-26 14z" fill="#6cc57e"/></g>
      <g fill="#fff" opacity=".85"><circle cx="150" cy="30" r="10"/><circle cx="162" cy="26" r="8"/><circle cx="138" cy="28" r="7"/></g>
    </g>`
  }
};

// Which scene backs each story, and where its characters stand.
const STORY_SCENES = {
  'L1-1': { scene: 'meadow', cast: [{ key: 'mimi', x: 70, y: 74, w: 60 }, { key: 'sparkle', x: 196, y: 84, w: 50 }] },
  'L1-2': { scene: 'meadow', cast: [{ key: 'dot', x: 60, y: 72, w: 62 }, { key: 'dottie', x: 208, y: 96, w: 40 }] },
  'L1-3': { scene: 'cove', cast: [{ key: 'mimi', x: 62, y: 66, w: 58 }, { key: 'peep', x: 198, y: 74, w: 50 }] },
  'L1-4': { scene: 'meadow', cast: [{ key: 'pip', x: 58, y: 62, w: 66 }, { key: 'rexy', x: 206, y: 88, w: 48 }] },
  'L1-5': { scene: 'forest', cast: [{ key: 'bun', x: 66, y: 70, w: 60 }, { key: 'sage', x: 204, y: 78, w: 46 }] },
  'L1-6': { scene: 'castle', cast: [{ key: 'pip', x: 52, y: 78, w: 58 }, { key: 'grace', x: 234, y: 86, w: 48 }] },
  'L2-1': { scene: 'meadow', cast: [{ key: 'pip', x: 58, y: 64, w: 64 }, { key: 'clover', x: 208, y: 84, w: 48 }] },
  'L2-2': { scene: 'forest', cast: [{ key: 'dot', x: 62, y: 70, w: 60 }, { key: 'snuggles', x: 206, y: 80, w: 48 }] },
  'L2-3': { scene: 'meadow', cast: [{ key: 'mimi', x: 60, y: 70, w: 60 }, { key: 'stretch', x: 204, y: 66, w: 52 }] },
  'L2-4': { scene: 'forest', cast: [{ key: 'bun', x: 60, y: 70, w: 60 }, { key: 'flutter', x: 208, y: 72, w: 46 }] },
  'L2-5': { scene: 'meadow', cast: [{ key: 'pip', x: 56, y: 64, w: 64 }, { key: 'sheldon', x: 210, y: 94, w: 46 }] },
  'L2-6': { scene: 'forest', cast: [{ key: 'mimi', x: 62, y: 68, w: 58 }, { key: 'nutmeg', x: 206, y: 80, w: 46 }] },
  'L2-7': { scene: 'cove', cast: [{ key: 'dot', x: 58, y: 62, w: 62 }, { key: 'splash', x: 204, y: 82, w: 54 }] },
  'L2-8': { scene: 'cove', cast: [{ key: 'bun', x: 60, y: 66, w: 58 }, { key: 'inky', x: 208, y: 80, w: 48 }] },
  'L3-1': { scene: 'meadow', cast: [{ key: 'pip', x: 56, y: 62, w: 64 }, { key: 'biscuit', x: 208, y: 84, w: 48 }] },
  'L3-2': { scene: 'forest', cast: [{ key: 'bun', x: 60, y: 68, w: 60 }, { key: 'whiskers', x: 206, y: 80, w: 48 }] },
  'L3-3': { scene: 'meadow', cast: [{ key: 'mimi', x: 58, y: 66, w: 60 }, { key: 'ember', x: 206, y: 84, w: 48 }] },
  'L3-4': { scene: 'castle', cast: [{ key: 'dot', x: 50, y: 76, w: 60 }, { key: 'sheldon', x: 240, y: 96, w: 44 }] },
  'L3-5': { scene: 'cove', cast: [{ key: 'pip', x: 56, y: 62, w: 64 }, { key: 'blaze', x: 208, y: 76, w: 50 }] },
  'L3-6': { scene: 'castle', cast: [{ key: 'mimi', x: 50, y: 74, w: 60 }, { key: 'waddle', x: 238, y: 88, w: 44 }] },
  'L3-7': { scene: 'castle', cast: [{ key: 'dot', x: 48, y: 74, w: 60 }, { key: 'marina', x: 238, y: 86, w: 46 }] }
};

// Library books reuse the same scenery.
const LIB_SCENES = {
  S1: { scene: 'meadow', cast: [{ key: 'peep', x: 70, y: 78, w: 52 }, { key: 'clover', x: 206, y: 84, w: 46 }] },
  S2: { scene: 'meadow', cast: [{ key: 'biscuit', x: 66, y: 74, w: 56 }, { key: 'nutmeg', x: 208, y: 82, w: 44 }] },
  S3: { scene: 'cove', cast: [{ key: 'pip', x: 58, y: 62, w: 64 }, { key: 'bun', x: 206, y: 70, w: 56 }] },
  S4: { scene: 'forest', cast: [{ key: 'dot', x: 60, y: 68, w: 62 }, { key: 'sage', x: 208, y: 78, w: 46 }] },
  S5: { scene: 'meadow', cast: [{ key: 'stretch', x: 62, y: 56, w: 56 }, { key: 'sheldon', x: 210, y: 92, w: 46 }] },
  S6: { scene: 'cove', cast: [{ key: 'marina', x: 62, y: 66, w: 56 }, { key: 'splash', x: 204, y: 82, w: 54 }] },
  S7: { scene: 'castle', cast: [{ key: 'dot', x: 50, y: 76, w: 58 }, { key: 'nova', x: 240, y: 76, w: 44 }] },
  S8: { scene: 'meadow', cast: [{ key: 'pip', x: 56, y: 62, w: 64 }, { key: 'bamboo', x: 208, y: 82, w: 48 }] },
  S9: { scene: 'forest', cast: [{ key: 'snuggles', x: 62, y: 68, w: 58 }, { key: 'flutter', x: 208, y: 72, w: 46 }] },
  S10: { scene: 'castle', cast: [{ key: 'grace', x: 52, y: 74, w: 56 }, { key: 'twinkle', x: 238, y: 78, w: 46 }] }
};
