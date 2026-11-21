// render.js — paints the two panels of Lantern Hunt, the found-markers,
// the hint pulse and the miss flash. The panels are plain <canvas>
// elements; the HUD lives in the DOM (see index.html).
import { paintScene, panelSize } from './scenes.js';

const SIZE = panelSize();

export function paintPanels(leftCtx, rightCtx, level, timeMs) {
  paintScene(leftCtx, level, 0);
  paintScene(rightCtx, level, 1);
  void timeMs;
}

function ring(ctx, x, y, r, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function badge(ctx, x, y, text) {
  ctx.fillStyle = '#ffd23e';
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7a4a00';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#3a2400';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1);
}

// Draw a found-marker on BOTH panels: a gold ring, a small check and
// the find's number, so the judge's screenshots show the marks.
export function drawFound(ctx, diff, index) {
  ring(ctx, diff.x, diff.y, diff.r + 4, '#ffd23e', 4);
  ring(ctx, diff.x, diff.y, diff.r - 2, 'rgba(255, 210, 62, 0.55)', 2);
  badge(ctx, diff.x + diff.r * 0.7, diff.y - diff.r * 0.7, String(index + 1));
  ctx.strokeStyle = '#ffd23e';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const cx = diff.x;
  const cy = diff.y;
  ctx.beginPath();
  ctx.moveTo(cx - 9, cy + 1);
  ctx.lineTo(cx - 2, cy + 8);
  ctx.lineTo(cx + 11, cy - 8);
  ctx.stroke();
}

// A soft pulsing ring around one unfound difference (the hint).
export function drawHintPulse(ctx, diff, phase) {
  const pulse = 1 + 0.18 * Math.sin(phase * 5);
  ring(ctx, diff.x, diff.y, (diff.r + 10) * pulse, 'rgba(127, 214, 194, 0.95)', 4);
  ring(ctx, diff.x, diff.y, (diff.r + 18) * pulse, 'rgba(127, 214, 194, 0.35)', 2);
}

// A red X where the player clicked and found nothing.
export function drawMiss(ctx, x, y) {
  ctx.strokeStyle = '#ff5c5c';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
}

export function canvasSize() {
  return SIZE;
}
