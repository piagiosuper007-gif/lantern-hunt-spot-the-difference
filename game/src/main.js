// main.js — boots Lantern Hunt and sets up the deterministic demo
// states the screenshots are taken from (?shot=start|play|reef|win).
// A shot state is a real state of the real game: the same canvases,
// the same markers, the same counter — only the timer is frozen so
// the picture does not change while it is captured.
import { createGame } from './game.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot') || '';
const frozen = shot !== '';

const game = createGame({ frozen });
const state = game.state;

function applyShot() {
  if (shot === 'start') {
    // Title screen over level 1, untouched.
    return;
  }
  if (shot === 'play') {
    game.startLevel(0);
    state.found = new Set([0, 2, 5]);
    state.timeLeft = 252;
    state.score = 480;
    state.hintsLeft = 2;
  } else if (shot === 'reef') {
    game.startLevel(1);
    state.found = new Set([0, 1, 4, 6, 8]);
    state.timeLeft = 131;
    state.score = 1250;
    state.hintsLeft = 1;
  } else if (shot === 'win') {
    game.startLevel(2);
    state.found = new Set(game.level().diffs.map((d, i) => i));
    state.timeLeft = 64;
    state.score = 2840;
    state.hintsLeft = 3;
    state.screen = 'allDone';
    document.getElementById('winScore').textContent = 'Final score: 2840';
    document.getElementById('winTime').textContent =
      'You cleared all three hunts — Lantern Market, Coral Reef and Clockwork Garden.';
    for (const name of ['titleOverlay', 'levelOverlay', 'overOverlay']) {
      document.getElementById(name).classList.add('hidden');
    }
    document.getElementById('winOverlay').classList.remove('hidden');
  } else {
    return;
  }
  game.paint();
  game.refreshHud();
}

applyShot();

window.addEventListener('load', () => {
  setTimeout(() => {
    window.__shotReady = true;
  }, 300);
});
setTimeout(() => {
  window.__shotReady = true;
}, 1200);
