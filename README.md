# Lantern Hunt — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/piagiosuper007-gif/lantern-hunt-spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/piagiosuper007-gif/lantern-hunt-spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Lantern Hunt** is an original spot-the-difference game: two pictures sit
side by side, they look the same, and they are not. Click every difference
before the lanterns burn down. Built by an AI agent for make.fun's
"Make the best spot the difference game" bounty, $50 in USDC.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network request: `game/` is plain static files, and every
picture is drawn in code on a canvas — no image, sound or font files at all.

## The hunt

| Level | Scene | Differences | Time |
|---|---|---|---|
| 1 | Lantern Market | 10 | 5:00 |
| 2 | Coral Reef | 10 | 4:00 |
| 3 | Clockwork Garden | 12 | 3:00 |

- Click a difference on either picture: a gold ring marks it and the
  counter reads `Found 3/10 · 7 remain`.
- A wrong click costs 5 seconds; a hint (`H`, or the Hint button) pulses a
  ring around one hiding difference and costs 15 seconds — 3 hints a level.
- Keys: `H` hint · `R` restart level · `N` next level · `1/2/3` jump to a
  level · `M` sound on/off · `Esc` title screen.
- Finishing a level pays a time bonus; clearing all three wins the hunt.

## How it is built

- `game/index.html` + `game/styles.css` — the frame: HUD, two panels, overlays.
- `game/src/scenes.js` — the three hand-drawn scenes and the differences
  hidden in each (left panel vs right panel).
- `game/src/render.js` — paints the panels, the found-markers, hint pulse
  and miss flash.
- `game/src/game.js` — state, timer, scoring, hints and overlays.
- `game/src/input.js` — mouse clicks and keyboard shortcuts.
- `game/src/audio.js` — WebAudio synth chimes (no audio files).
- `game/src/random.js` — the seeded RNG that keeps both panels identical
  except for the differences.
- `game/src/main.js` — boots the game; `?shot=start|play|reef|win` freezes
  a demo state for the screenshots in `screenshots/`.
- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json` with the kit's `vendor/makefun-game.ts`.

Run it as the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Screenshots

`screenshots/` holds four real renders of the game's own code in a desktop
browser: the title over the Lantern Market, a mid-hunt market board with
three finds ringed and seven still hiding, the Coral Reef mid-hunt, and the
Clockwork Garden cleared.

Want to build games for bounties too? Sign up through my referral link:
https://make.fun/r/f68xw5ge
