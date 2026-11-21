// scenes.js — the three hand-drawn scenes of Lantern Hunt and the
// differences hidden in each one. Every scene is painted twice, once
// per panel, from the same seed: the base picture is identical, and
// only the level's differences change between the left and right side.
// A difference is { x, y, r, name, left(ctx), right(ctx) } — what the
// left panel shows versus what the right panel shows.
import { mulberry32, range, rangeInt } from './random.js';

function sky(ctx, top, mid, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 600);
  g.addColorStop(0, top);
  g.addColorStop(0.55, mid);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 600);
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function lantern(ctx, x, y, color, scale) {
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = '#3a2415';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(0, -34);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 220, 130, 0.85)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(-9, -24, 18, 5);
  ctx.fillRect(-9, 19, 18, 5);
  ctx.restore();
}

function fish(ctx, x, y, color, scale, flip) {
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip ? -s : s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(-32, -10);
  ctx.lineTo(-32, 10);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 10, -3, 3, '#10222e');
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(10, -3, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function gear(ctx, x, y, r, teeth, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth;
    const rr = i % 2 === 0 ? r : r * 0.78;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  circle(ctx, 0, 0, r * 0.34, '#2c2118');
  circle(ctx, 0, 0, r * 0.16, '#e8d9b0');
  ctx.restore();
}

function flower(ctx, x, y, petal, center, scale) {
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = petal;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 9, Math.sin(a) * 9, 8, 5, a, 0, Math.PI * 2);
    ctx.fill();
  }
  circle(ctx, 0, 0, 6, center);
  ctx.restore();
}

function butterfly(ctx, x, y, color, scale) {
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(-7, -5, 9, 6, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7, -5, 9, 6, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-6, 6, 8, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(6, 6, 8, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2c2118';
  ctx.fillRect(-1.5, -10, 3, 20);
  ctx.restore();
}

// ---- Level 1: Lantern Market at dusk ---------------------------------
function paintMarket(ctx, rng) {
  sky(ctx, '#241a4d', '#7a3d6e', '#e07856');
  for (let i = 0; i < 40; i++) {
    star(ctx, range(rng, 10, 590), range(rng, 8, 240), range(rng, 1.2, 2.6), 'rgba(255,244,200,0.9)');
  }
  // Moon (its crater is a difference, drawn later).
  circle(ctx, 500, 80, 34, '#ffeec2');
  circle(ctx, 500, 80, 28, '#fff6d8');
  // Distant rooftops.
  ctx.fillStyle = '#3a2350';
  ctx.beginPath();
  ctx.moveTo(0, 380);
  ctx.lineTo(0, 320);
  ctx.lineTo(70, 290);
  ctx.lineTo(140, 320);
  ctx.lineTo(210, 285);
  ctx.lineTo(280, 320);
  ctx.lineTo(360, 295);
  ctx.lineTo(430, 320);
  ctx.lineTo(510, 288);
  ctx.lineTo(600, 320);
  ctx.lineTo(600, 380);
  ctx.closePath();
  ctx.fill();
  // Chimney with smoke (smoke itself is a difference).
  ctx.fillStyle = '#2c1a40';
  ctx.fillRect(80, 272, 22, 48);
  // Lit windows on the rooftops (one window is a difference).
  ctx.fillStyle = '#ffd873';
  ctx.fillRect(160, 305, 14, 18);
  ctx.fillRect(380, 308, 14, 18);
  ctx.fillStyle = '#4a3566';
  ctx.fillRect(470, 305, 14, 18);
  // Cobble street.
  ctx.fillStyle = '#5a3d52';
  ctx.fillRect(0, 380, 600, 220);
  ctx.fillStyle = '#6b4a5e';
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.ellipse(range(rng, 10, 590), range(rng, 395, 585), range(rng, 8, 16), range(rng, 4, 7), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Market stalls with striped awnings.
  const stalls = [
    { x: 30, awn: ['#c94f43', '#f2e3c6'] },
    { x: 225, awn: ['#3f7d6b', '#f2e3c6'] },
    { x: 420, awn: ['#c98a2e', '#f2e3c6'] },
  ];
  for (const st of stalls) {
    ctx.fillStyle = '#4a2e22';
    ctx.fillRect(st.x, 300, 150, 90);
    ctx.fillStyle = '#6b4a2e';
    ctx.fillRect(st.x + 6, 330, 138, 8);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = st.awn[i % 2];
      ctx.fillRect(st.x + i * 30, 268, 30, 34);
    }
    ctx.fillStyle = '#2c1a12';
    ctx.fillRect(st.x - 4, 390, 158, 10);
  }
  // Goods on the stalls: pots, fruit, cloth.
  circle(ctx, 70, 350, 12, '#b5533c');
  circle(ctx, 110, 352, 10, '#d9a441');
  circle(ctx, 150, 350, 11, '#7d9b4a');
  circle(ctx, 270, 350, 12, '#4a7d9b');
  circle(ctx, 310, 352, 10, '#c94f43');
  ctx.fillStyle = '#e8b7d4';
  ctx.fillRect(440, 340, 60, 22);
  ctx.fillStyle = '#9b6bb5';
  ctx.fillRect(500, 340, 40, 22);
  // String lights across the top.
  ctx.strokeStyle = '#2c1a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.quadraticCurveTo(300, 175, 600, 115);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = 20 + t * 560;
    const y = 120 + Math.sin(t * Math.PI) * 42;
    circle(ctx, x, y + 8, 6, ['#ffd873', '#ff9a7a', '#8fd6c2', '#e8b7d4'][i % 4]);
  }
  // Hanging lanterns.
  lantern(ctx, 120, 180, '#e0533d', 1);
  lantern(ctx, 200, 205, '#e0533d', 0.85);
  lantern(ctx, 400, 195, '#e0533d', 0.9);
  lantern(ctx, 480, 180, '#e0533d', 1);
  // Bunting flags.
  const flagColors = ['#ffd873', '#ff9a7a', '#8fd6c2', '#e8b7d4', '#9b6bb5'];
  for (let i = 0; i < 10; i++) {
    const x = 30 + i * 58;
    const y = 215 + Math.sin((i / 9) * Math.PI) * 18;
    ctx.fillStyle = flagColors[i % 5];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 24, y);
    ctx.lineTo(x + 12, y + 20);
    ctx.closePath();
    ctx.fill();
  }
  // Crates at the bottom and a cat on one (the cat is a difference).
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(140, 500, 80, 60);
  ctx.fillRect(150, 510, 60, 8);
  ctx.fillRect(450, 520, 70, 50);
  ctx.fillStyle = '#8a5f38';
  ctx.fillRect(60, 530, 70, 46);
}

function drawCat(ctx, x, y) {
  ctx.fillStyle = '#2e2a33';
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 26, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x + 20, y - 6, 11, '#2e2a33');
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 14);
  ctx.lineTo(x + 15, y - 24);
  ctx.lineTo(x + 20, y - 14);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 22, y - 15);
  ctx.lineTo(x + 27, y - 24);
  ctx.lineTo(x + 30, y - 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e2a33';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 6);
  ctx.quadraticCurveTo(x - 38, y - 6, x - 30, y - 16);
  ctx.stroke();
  ctx.fillStyle = '#ffd873';
  circle(ctx, x + 23, y - 8, 2, '#ffd873');
}

const marketDiffs = [
  {
    x: 300, y: 150, r: 26, name: 'extra lantern',
    left() {}, right(ctx) { lantern(ctx, 300, 150, '#2e9b8a', 1); },
  },
  {
    x: 120, y: 180, r: 24, name: 'lantern colour',
    left(ctx) { lantern(ctx, 120, 180, '#e0533d', 1); },
    right(ctx) { lantern(ctx, 120, 180, '#2e9b8a', 1); },
  },
  {
    x: 500, y: 500, r: 30, name: 'cat on the crate',
    left(ctx) { drawCat(ctx, 500, 500); },
    right() {},
  },
  {
    x: 300, y: 285, r: 24, name: 'awning stripe',
    left(ctx) { ctx.fillStyle = '#3f7d6b'; ctx.fillRect(285, 268, 30, 34); },
    right(ctx) { ctx.fillStyle = '#c94f43'; ctx.fillRect(285, 268, 30, 34); },
  },
  {
    x: 500, y: 80, r: 26, name: 'moon crater',
    left(ctx) {
      circle(ctx, 490, 72, 6, '#e8d9a8');
      circle(ctx, 512, 90, 4, '#e8d9a8');
      circle(ctx, 505, 66, 3, '#e8d9a8');
    },
    right() {},
  },
  {
    x: 90, y: 70, r: 20, name: 'extra star',
    left() {}, right(ctx) { star(ctx, 90, 70, 9, '#fff4c8'); },
  },
  {
    x: 180, y: 520, r: 22, name: 'apple on the crate',
    left(ctx) { circle(ctx, 180, 516, 9, '#c94f43'); ctx.strokeStyle = '#3a5a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180, 508); ctx.lineTo(184, 500); ctx.stroke(); },
    right() {},
  },
  {
    x: 430, y: 165, r: 22, name: 'flag colour',
    left(ctx) { ctx.fillStyle = '#ffd873'; ctx.beginPath(); ctx.moveTo(418, 152); ctx.lineTo(442, 152); ctx.lineTo(430, 172); ctx.closePath(); ctx.fill(); },
    right(ctx) { ctx.fillStyle = '#4a7d9b'; ctx.beginPath(); ctx.moveTo(418, 152); ctx.lineTo(442, 152); ctx.lineTo(430, 172); ctx.closePath(); ctx.fill(); },
  },
  {
    x: 260, y: 330, r: 22, name: 'window light',
    left(ctx) { ctx.fillStyle = '#ffd873'; ctx.fillRect(253, 322, 14, 18); },
    right(ctx) { ctx.fillStyle = '#2c1a40'; ctx.fillRect(253, 322, 14, 18); },
  },
  {
    x: 90, y: 250, r: 24, name: 'chimney smoke',
    left(ctx) {
      ctx.fillStyle = 'rgba(230,220,240,0.85)';
      circle(ctx, 91, 258, 9, 'rgba(230,220,240,0.85)');
      circle(ctx, 86, 244, 12, 'rgba(230,220,240,0.7)');
      circle(ctx, 94, 228, 8, 'rgba(230,220,240,0.55)');
    },
    right() {},
  },
];

// ---- Level 2: Coral Reef -----------------------------------------------
function paintReef(ctx, rng) {
  sky(ctx, '#1d7d8c', '#14607e', '#0a2e4d');
  // Sun rays from the surface.
  ctx.fillStyle = 'rgba(255, 244, 190, 0.14)';
  for (let i = 0; i < 5; i++) {
    const x = 60 + i * 120;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 50, 0);
    ctx.lineTo(x + 130, 420);
    ctx.lineTo(x + 40, 420);
    ctx.closePath();
    ctx.fill();
  }
  // Sandy floor.
  ctx.fillStyle = '#d9c08a';
  ctx.beginPath();
  ctx.moveTo(0, 520);
  ctx.quadraticCurveTo(300, 495, 600, 520);
  ctx.lineTo(600, 600);
  ctx.lineTo(0, 600);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c2a76c';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.ellipse(range(rng, 10, 590), range(rng, 530, 590), range(rng, 3, 7), range(rng, 2, 4), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Corals.
  function coral(x, y, color, h) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    for (const [dx, dy] of [[-14, -h * 0.5], [0, -h], [14, -h * 0.6], [-6, -h * 0.8], [8, -h * 0.9]]) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + dx * 0.4, y - h * 0.5, x + dx, y + dy);
      ctx.stroke();
    }
  }
  coral(90, 520, '#ff7a9e', 90);
  coral(150, 525, '#ff9a5c', 70);
  coral(520, 520, '#c98ae0', 80);
  coral(560, 525, '#ff7a9e', 60);
  // Seaweed.
  ctx.strokeStyle = '#2e8b57';
  ctx.lineWidth = 6;
  for (const [x, h] of [[30, 90], [55, 70], [200, 80]]) {
    ctx.beginPath();
    ctx.moveTo(x, 525);
    ctx.quadraticCurveTo(x + 12, 525 - h * 0.6, x - 4, 525 - h);
    ctx.stroke();
  }
  // The tall frond at x=560 is a difference (drawn shorter on the right).
  // Anchor with rope (rope is a difference).
  ctx.strokeStyle = '#8a6a3b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(60, 505, 14, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = '#6b5a4a';
  ctx.fillRect(54, 500, 12, 34);
  ctx.beginPath();
  ctx.moveTo(48, 534);
  ctx.lineTo(72, 534);
  ctx.lineTo(60, 552);
  ctx.closePath();
  ctx.fill();
  // Turtle.
  ctx.fillStyle = '#4a7d5a';
  ctx.beginPath();
  ctx.ellipse(420, 330, 46, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6b9b6b';
  ctx.beginPath();
  ctx.ellipse(420, 330, 34, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 468, 322, 13, '#4a7d5a');
  ctx.fillStyle = '#4a7d5a';
  ctx.beginPath();
  ctx.ellipse(384, 322, 14, 7, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(384, 340, 14, 7, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(452, 322, 14, 7, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(452, 340, 14, 7, -0.5, 0, Math.PI * 2);
  ctx.fill();
  // Shell on the sand (colour is a difference).
  ctx.fillStyle = '#f2a0b5';
  ctx.beginPath();
  ctx.arc(250, 545, 18, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  // Starfish (missing on the right is a difference).
  ctx.fillStyle = '#ff9a5c';
  star(ctx, 480, 545, 20, '#ff9a5c');
  // Fish that are the same on both sides.
  fish(ctx, 250, 160, '#ffd23e', 1, false);
  fish(ctx, 330, 210, '#7ad6c2', 0.9, true);
  fish(ctx, 480, 140, '#e08ae0', 0.8, false);
  fish(ctx, 90, 300, '#ffd23e', 0.85, true);
  fish(ctx, 520, 420, '#7ad6c2', 0.9, false);
  // Bubbles.
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  for (const [x, y, r] of [[330, 90, 6], [340, 70, 4], [322, 55, 5], [500, 250, 5], [510, 230, 4]]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

const reefDiffs = [
  {
    x: 150, y: 200, r: 26, name: 'fish colour',
    left(ctx) { fish(ctx, 150, 200, '#ff7a3c', 1, false); },
    right(ctx) { fish(ctx, 150, 200, '#8a5ce0', 1, false); },
  },
  {
    x: 480, y: 545, r: 28, name: 'starfish',
    left(ctx) { star(ctx, 480, 545, 20, '#ff9a5c'); },
    right() {},
  },
  {
    x: 350, y: 150, r: 24, name: 'extra bubbles',
    left() {},
    right(ctx) {
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      for (const [x, y, r] of [[350, 150, 7], [362, 132, 5], [340, 128, 4]]) {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      }
    },
  },
  {
    x: 90, y: 430, r: 26, name: 'coral branch',
    left(ctx) {
      ctx.strokeStyle = '#ff7a9e';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(90, 520);
      ctx.quadraticCurveTo(96, 480, 104, 452);
      ctx.stroke();
    },
    right() {},
  },
  {
    x: 470, y: 320, r: 24, name: 'turtle eye',
    left(ctx) { circle(ctx, 472, 318, 3, '#10222e'); },
    right(ctx) {
      ctx.strokeStyle = '#10222e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(472, 320, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    },
  },
  {
    x: 250, y: 545, r: 24, name: 'shell colour',
    left(ctx) { ctx.fillStyle = '#f2a0b5'; ctx.beginPath(); ctx.arc(250, 545, 18, Math.PI, 0); ctx.closePath(); ctx.fill(); },
    right(ctx) { ctx.fillStyle = '#5c9be0'; ctx.beginPath(); ctx.arc(250, 545, 18, Math.PI, 0); ctx.closePath(); ctx.fill(); },
  },
  {
    x: 560, y: 440, r: 26, name: 'seaweed height',
    left(ctx) {
      ctx.strokeStyle = '#2e8b57'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(560, 525); ctx.quadraticCurveTo(572, 470, 556, 430); ctx.stroke();
    },
    right(ctx) {
      ctx.strokeStyle = '#2e8b57'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(560, 525); ctx.quadraticCurveTo(566, 500, 558, 478); ctx.stroke();
    },
  },
  {
    x: 300, y: 320, r: 24, name: 'extra fish',
    left() {}, right(ctx) { fish(ctx, 300, 320, '#ff5c8a', 0.8, true); },
  },
  {
    x: 60, y: 490, r: 26, name: 'anchor rope',
    left(ctx) {
      ctx.strokeStyle = '#d9c08a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(60, 492); ctx.quadraticCurveTo(74, 470, 60, 452); ctx.stroke();
    },
    right() {},
  },
  {
    x: 200, y: 90, r: 24, name: 'sun ray',
    left(ctx) {
      ctx.fillStyle = 'rgba(255, 244, 190, 0.14)';
      ctx.beginPath();
      ctx.moveTo(180, 0); ctx.lineTo(230, 0); ctx.lineTo(310, 420); ctx.lineTo(220, 420);
      ctx.closePath(); ctx.fill();
    },
    right() {},
  },
];

// ---- Level 3: Clockwork Garden -----------------------------------------
function paintGarden(ctx, rng) {
  sky(ctx, '#8ec9e8', '#cfeec9', '#f2e3a0');
  circle(ctx, 90, 90, 30, '#fff3b0');
  circle(ctx, 90, 90, 24, '#ffedb0');
  // Hedge.
  ctx.fillStyle = '#3d7a44';
  ctx.fillRect(0, 380, 600, 40);
  ctx.fillStyle = '#4a8b52';
  for (let i = 0; i < 24; i++) {
    circle(ctx, 12 + i * 25, 382, 16, '#4a8b52');
  }
  // Lawn and path.
  ctx.fillStyle = '#7dbb6a';
  ctx.fillRect(0, 420, 600, 180);
  ctx.fillStyle = '#d9c8a0';
  ctx.beginPath();
  ctx.moveTo(270, 420);
  ctx.lineTo(330, 420);
  ctx.lineTo(350, 600);
  ctx.lineTo(250, 600);
  ctx.closePath();
  ctx.fill();
  // Clock tower.
  ctx.fillStyle = '#b08a5c';
  ctx.fillRect(262, 120, 76, 300);
  ctx.fillStyle = '#8a6a42';
  ctx.beginPath();
  ctx.moveTo(252, 122);
  ctx.lineTo(300, 60);
  ctx.lineTo(348, 122);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 300, 150, 30, '#fff6d8');
  ctx.strokeStyle = '#5c4630';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(300, 150, 30, 0, Math.PI * 2);
  ctx.stroke();
  // Clock hands are a difference (drawn per side below).
  // Tower window is a difference too.
  // Gears on the lawn.
  gear(ctx, 130, 180, 34, 8, '#8a7a5c');
  gear(ctx, 470, 180, 30, 10, '#6b7d8a');
  gear(ctx, 470, 340, 26, 8, '#8a7a5c');
  // Flower beds.
  for (let i = 0; i < 8; i++) {
    flower(ctx, 60 + i * 26, 470 + (i % 2) * 26, ['#e0533d', '#ffd23e', '#e08ae0'][i % 3], '#ffd873', 1);
    flower(ctx, 400 + i * 24, 480 + (i % 2) * 24, ['#e08ae0', '#e0533d', '#ffd23e'][i % 3], '#ffd873', 0.9);
  }
  // Topiary (shape is a difference).
  ctx.fillStyle = '#2e6b34';
  // Fountain.
  ctx.fillStyle = '#9bb8c2';
  ctx.beginPath();
  ctx.ellipse(300, 430, 70, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6b93a3';
  ctx.fillRect(294, 380, 12, 50);
  ctx.fillStyle = '#7fb3d9';
  ctx.beginPath();
  ctx.ellipse(300, 428, 58, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Butterflies.
  butterfly(ctx, 200, 260, '#e08ae0', 1);
  butterfly(ctx, 380, 300, '#ffd23e', 0.9);
  // Snail spot is a difference (right side only).
  // Random pebbles on the path.
  ctx.fillStyle = '#b8a888';
  for (let i = 0; i < 12; i++) {
    circle(ctx, range(rng, 265, 335), range(rng, 440, 590), range(rng, 2, 4), '#b8a888');
  }
}

const gardenDiffs = [
  {
    x: 130, y: 180, r: 30, name: 'gear teeth',
    left(ctx) { gear(ctx, 130, 180, 34, 8, '#8a7a5c'); },
    right(ctx) { gear(ctx, 130, 180, 34, 12, '#8a7a5c'); },
  },
  {
    x: 300, y: 150, r: 28, name: 'clock hands',
    left(ctx) {
      ctx.strokeStyle = '#2c2118'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(300, 150); ctx.lineTo(300, 130); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(300, 150); ctx.lineTo(318, 150); ctx.stroke();
      circle(ctx, 300, 150, 3, '#2c2118');
    },
    right(ctx) {
      ctx.strokeStyle = '#2c2118'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(300, 150); ctx.lineTo(288, 164); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(300, 150); ctx.lineTo(300, 172); ctx.stroke();
      circle(ctx, 300, 150, 3, '#2c2118');
    },
  },
  {
    x: 480, y: 200, r: 24, name: 'butterfly',
    left(ctx) { butterfly(ctx, 480, 200, '#7ad6c2', 1); },
    right() {},
  },
  {
    x: 180, y: 480, r: 24, name: 'flower colour',
    left(ctx) { flower(ctx, 180, 480, '#e0533d', '#ffd873', 1); },
    right(ctx) { flower(ctx, 180, 480, '#ffd23e', '#ffd873', 1); },
  },
  {
    x: 300, y: 400, r: 26, name: 'fountain drops',
    left(ctx) {
      ctx.fillStyle = '#7fb3d9';
      circle(ctx, 288, 392, 4, '#7fb3d9');
      circle(ctx, 300, 384, 4, '#7fb3d9');
      circle(ctx, 312, 392, 4, '#7fb3d9');
    },
    right(ctx) { circle(ctx, 300, 388, 4, '#7fb3d9'); },
  },
  {
    x: 90, y: 350, r: 28, name: 'topiary shape',
    left(ctx) { ctx.fillStyle = '#2e6b34'; circle(ctx, 90, 350, 30, '#2e6b34'); ctx.fillRect(86, 378, 8, 30); },
    right(ctx) {
      ctx.fillStyle = '#2e6b34';
      ctx.beginPath(); ctx.moveTo(90, 318); ctx.lineTo(118, 380); ctx.lineTo(62, 380); ctx.closePath(); ctx.fill();
      ctx.fillRect(86, 378, 8, 30);
    },
  },
  {
    x: 500, y: 420, r: 26, name: 'extra gear',
    left() {}, right(ctx) { gear(ctx, 500, 420, 22, 8, '#6b7d8a'); },
  },
  {
    x: 330, y: 540, r: 22, name: 'path stone',
    left(ctx) { ctx.fillStyle = '#8a7a68'; ctx.beginPath(); ctx.ellipse(330, 540, 16, 9, 0, 0, Math.PI * 2); ctx.fill(); },
    right() {},
  },
  {
    x: 300, y: 240, r: 22, name: 'tower window',
    left(ctx) { ctx.fillStyle = '#ffd873'; ctx.fillRect(290, 230, 20, 26); },
    right(ctx) { ctx.fillStyle = '#5c4630'; ctx.fillRect(290, 230, 20, 26); },
  },
  {
    x: 420, y: 300, r: 24, name: 'extra bee',
    left() {},
    right(ctx) {
      ctx.fillStyle = '#2c2118';
      ctx.beginPath(); ctx.ellipse(420, 300, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd23e';
      ctx.fillRect(416, 295, 3, 10);
      ctx.fillRect(421, 295, 3, 10);
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(418, 292, 5, 3, -0.5, 0, Math.PI * 2); ctx.stroke();
    },
  },
  {
    x: 300, y: 80, r: 24, name: 'tower flag',
    left(ctx) {
      ctx.strokeStyle = '#5c4630'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(300, 62); ctx.lineTo(300, 44); ctx.stroke();
      ctx.fillStyle = '#e0533d';
      ctx.beginPath(); ctx.moveTo(300, 44); ctx.lineTo(322, 50); ctx.lineTo(300, 57); ctx.closePath(); ctx.fill();
    },
    right() {},
  },
  {
    x: 220, y: 560, r: 24, name: 'snail',
    left() {},
    right(ctx) {
      ctx.fillStyle = '#8a5a3b';
      ctx.beginPath(); ctx.arc(220, 556, 10, Math.PI, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#d9a441';
      ctx.beginPath(); ctx.ellipse(222, 566, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    },
  },
];

// ---- Level catalogue -----------------------------------------------------
export const LEVELS = [
  {
    id: 'market', name: 'Lantern Market', seed: 20261121, timeLimit: 300,
    intro: 'Dusk over the night market. Ten lanterns, stalls and secrets — ten things changed on the right.',
    paint: paintMarket, diffs: marketDiffs,
  },
  {
    id: 'reef', name: 'Coral Reef', seed: 71023, timeLimit: 240,
    intro: 'Down on the reef the fish are hiding something. Ten differences swim between the two panels.',
    paint: paintReef, diffs: reefDiffs,
  },
  {
    id: 'garden', name: 'Clockwork Garden', seed: 99173, timeLimit: 180,
    intro: 'The garden ticks. Twelve clockwork differences — the hardest hunt of the three.',
    paint: paintGarden, diffs: gardenDiffs,
  },
];

export function paintScene(ctx, level, variant) {
  const rng = mulberry32(level.seed);
  level.paint(ctx, rng);
  for (const d of level.diffs) {
    if (variant === 0) d.left(ctx);
    else d.right(ctx);
  }
}

export function panelSize() {
  return 600;
}
