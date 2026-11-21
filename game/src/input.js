// input.js — mouse and keyboard for Lantern Hunt. Clicks land on
// either panel; keys are the shortcuts the footer lists.
export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  return { x, y };
}

export function attachPanelClicks(leftCanvas, rightCanvas, onSpot) {
  leftCanvas.addEventListener('click', (event) => {
    onSpot(0, panelPoint(leftCanvas, event));
  });
  rightCanvas.addEventListener('click', (event) => {
    onSpot(1, panelPoint(rightCanvas, event));
  });
}

export function attachKeys(onKey) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') onKey('hint');
    else if (key === 'r') onKey('restart');
    else if (key === 'n') onKey('next');
    else if (key === 'm') onKey('mute');
    else if (key === 'escape') onKey('title');
    else if (key === '1' || key === '2' || key === '3') onKey('level' + key);
    else if (key === 'enter' || key === ' ') onKey('confirm');
  });
}
