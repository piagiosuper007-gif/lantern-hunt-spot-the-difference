// game.js — state, timer, scoring, hints and overlays for Lantern Hunt.
// One game is three levels; each level is won by finding every
// difference between its two panels before the timer runs out.
import { LEVELS } from './scenes.js';
import { paintPanels, drawFound, drawHintPulse, drawMiss } from './render.js';
import { attachPanelClicks, attachKeys } from './input.js';
import {
  playFind, playMiss, playHint, playLevelWin, playGameWin, playTick,
  setMuted, isMuted,
} from './audio.js';

const $ = (id) => document.getElementById(id);

export function createGame(options) {
  const opts = options || {};
  const left = $('leftPanel');
  const right = $('rightPanel');
  const lctx = left.getContext('2d');
  const rctx = right.getContext('2d');

  const state = {
    screen: 'title', // title | playing | levelDone | gameOver | allDone
    levelIndex: 0,
    found: new Set(),
    score: 0,
    hintsLeft: 3,
    timeLeft: 0,
    hint: null, // { diff, until }
    miss: null, // { x, y, panel, until }
    muted: false,
    lastTickSecond: -1,
    frozen: !!opts.frozen,
  };

  let timerId = null;

  function level() {
    return LEVELS[state.levelIndex];
  }

  function foundCount() {
    return state.found.size;
  }

  function remainingCount() {
    return level().diffs.length - foundCount();
  }

  function fmtTime(sec) {
    const s = Math.max(0, Math.ceil(sec));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function paint() {
    paintPanels(lctx, rctx, level(), 0);
    level().diffs.forEach((d, i) => {
      if (state.found.has(i)) {
        drawFound(lctx, d, i);
        drawFound(rctx, d, i);
      }
    });
    const now = performance.now();
    if (state.hint && now < state.hint.until) {
      drawHintPulse(lctx, state.hint.diff, now / 1000);
      drawHintPulse(rctx, state.hint.diff, now / 1000);
    } else if (state.hint) {
      state.hint = null;
    }
    if (state.miss && now < state.miss.until) {
      const ctx = state.miss.panel === 0 ? lctx : rctx;
      drawMiss(ctx, state.miss.x, state.miss.y);
    } else if (state.miss) {
      state.miss = null;
    }
  }

  function refreshHud() {
    $('levelName').textContent = 'Level ' + (state.levelIndex + 1) + ' · ' + level().name;
    $('counter').textContent =
      'Found ' + foundCount() + '/' + level().diffs.length + ' · ' + remainingCount() + ' remain';
    $('timerText').textContent = fmtTime(state.timeLeft);
    const frac = Math.max(0, state.timeLeft / level().timeLimit);
    $('timerFill').style.width = (frac * 100).toFixed(1) + '%';
    $('timerFill').classList.toggle('low', frac < 0.2);
    $('score').textContent = 'Score ' + state.score;
    $('hints').textContent = 'Hints ' + state.hintsLeft;
    $('hintBtn').disabled = state.hintsLeft <= 0 || state.screen !== 'playing';
    for (let i = 0; i < 3; i++) {
      const dot = $('dot' + (i + 1));
      dot.classList.toggle('done', i < state.levelIndex || (i === state.levelIndex && state.screen === 'levelDone'));
      dot.classList.toggle('current', i === state.levelIndex && state.screen !== 'levelDone');
    }
    $('muteBtn').textContent = state.muted ? 'Sound off (M)' : 'Sound on (M)';
  }

  function showOverlay(id) {
    for (const name of ['titleOverlay', 'levelOverlay', 'overOverlay', 'winOverlay']) {
      $(name).classList.toggle('hidden', name !== id);
    }
    if (!id) {
      for (const name of ['titleOverlay', 'levelOverlay', 'overOverlay', 'winOverlay']) {
        $(name).classList.add('hidden');
      }
    }
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (state.frozen) return;
    state.lastTickSecond = Math.ceil(state.timeLeft);
    timerId = setInterval(() => {
      if (state.screen !== 'playing') return;
      state.timeLeft -= 0.25;
      const whole = Math.ceil(state.timeLeft);
      if (whole !== state.lastTickSecond) {
        state.lastTickSecond = whole;
        if (whole <= 10 && whole > 0) playTick();
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        refreshHud();
        endLevel(false);
        return;
      }
      refreshHud();
    }, 250);
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.hintsLeft = 3;
    state.timeLeft = level().timeLimit;
    state.hint = null;
    state.miss = null;
    state.screen = 'playing';
    $('levelIntro').textContent = level().intro;
    showOverlay(null);
    paint();
    refreshHud();
    startTimer();
  }

  function endLevel(won) {
    stopTimer();
    if (won) {
      const timeBonus = Math.round(state.timeLeft) * 10;
      state.score += timeBonus;
      playLevelWin();
      refreshHud();
      if (state.levelIndex === LEVELS.length - 1) {
        state.screen = 'allDone';
        $('winScore').textContent = 'Final score: ' + state.score;
        $('winTime').textContent = 'You cleared all three hunts — Lantern Market, Coral Reef and Clockwork Garden.';
        showOverlay('winOverlay');
        playGameWin();
      } else {
        state.screen = 'levelDone';
        const stars = state.timeLeft > level().timeLimit * 0.5 ? 3 : state.timeLeft > level().timeLimit * 0.2 ? 2 : 1;
        $('levelStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        $('levelResult').textContent =
          level().name + ' cleared! All ' + level().diffs.length + ' differences found. Time bonus +' + timeBonus + '.';
        showOverlay('levelOverlay');
      }
    } else {
      state.screen = 'gameOver';
      $('overText').textContent =
        'Time ran out on ' + level().name + ' with ' + remainingCount() + ' differences still hiding.';
      showOverlay('overOverlay');
      playMiss();
    }
  }

  function useHint() {
    if (state.screen !== 'playing' || state.hintsLeft <= 0) return;
    const unfound = level().diffs.filter((d, i) => !state.found.has(i));
    if (unfound.length === 0) return;
    const diff = unfound[Math.floor(Math.random() * unfound.length)];
    state.hintsLeft -= 1;
    state.timeLeft = Math.max(1, state.timeLeft - 15);
    state.hint = { diff, until: performance.now() + 2200 };
    playHint();
    paint();
    refreshHud();
    setTimeout(paint, 2300);
  }

  function onSpot(panel, point) {
    if (state.screen !== 'playing') return;
    for (let i = 0; i < level().diffs.length; i++) {
      if (state.found.has(i)) continue;
      const d = level().diffs[i];
      const dx = point.x - d.x;
      const dy = point.y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found.add(i);
        state.score += 100 + Math.round(state.timeLeft);
        playFind();
        paint();
        refreshHud();
        if (foundCount() === level().diffs.length) endLevel(true);
        return;
      }
    }
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    state.miss = { x: point.x, y: point.y, panel, until: performance.now() + 700 };
    playMiss();
    paint();
    refreshHud();
    setTimeout(paint, 750);
    if (state.timeLeft <= 0) endLevel(false);
  }

  function onKey(action) {
    if (action === 'hint') useHint();
    else if (action === 'restart') startLevel(state.levelIndex);
    else if (action === 'mute') {
      state.muted = !state.muted;
      setMuted(state.muted);
      refreshHud();
    } else if (action === 'title') {
      stopTimer();
      state.screen = 'title';
      state.levelIndex = 0;
      state.found = new Set();
      state.timeLeft = level().timeLimit;
      state.hintsLeft = 3;
      paint();
      refreshHud();
      showOverlay('titleOverlay');
    } else if (action === 'next') {
      if (state.screen === 'levelDone') startLevel(state.levelIndex + 1);
      else if (state.screen === 'allDone' || state.screen === 'gameOver') startLevel(0);
    } else if (action === 'confirm') {
      if (state.screen === 'title') startLevel(0);
      else if (state.screen === 'levelDone') startLevel(state.levelIndex + 1);
      else if (state.screen === 'gameOver' || state.screen === 'allDone') startLevel(0);
    } else if (action.startsWith('level')) {
      const n = Number(action.slice(5)) - 1;
      if (n >= 0 && n < LEVELS.length) startLevel(n);
    }
  }

  attachPanelClicks(left, right, onSpot);
  attachKeys(onKey);
  $('hintBtn').addEventListener('click', useHint);
  $('restartBtn').addEventListener('click', () => startLevel(state.levelIndex));
  $('muteBtn').addEventListener('click', () => onKey('mute'));
  $('playBtn').addEventListener('click', () => startLevel(0));
  $('nextBtn').addEventListener('click', () => startLevel(state.levelIndex + 1));
  $('retryBtn').addEventListener('click', () => startLevel(state.levelIndex));
  $('againBtn').addEventListener('click', () => startLevel(0));
  for (let i = 0; i < 3; i++) {
    $('dot' + (i + 1)).addEventListener('click', () => startLevel(i));
  }

  // Title screen shows level 1's scene behind the overlay.
  state.timeLeft = level().timeLimit;
  paint();
  refreshHud();
  showOverlay('titleOverlay');

  const api = {
    state,
    startLevel,
    useHint,
    onSpot,
    paint,
    refreshHud,
    level,
    foundCount,
    remainingCount,
  };
  window.LANTERN = api;
  return api;
}
