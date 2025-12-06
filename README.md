# 2048 in Vanilla JS

A classic 2048 clone built with plain HTML, CSS, and JavaScript. Progress is saved to `localStorage`, movement is animated, and both keyboard and touch controls are supported.

## How to run
- Open `index.html` directly or serve the folder with any static server:  
  `npx serve .` or `python -m http.server 8000` then visit `http://localhost:8000`.
- Fully client-side: no build step or dependencies required.

## Controls
- Keyboard: arrow keys or `WASD`.
- Touch: swipe on the board.
- **Restart** button starts a new game.

## Project structure
- `index.html` — layout for the board, HUD, and module entry.
- `css/styles.css` — grid, tile, and status styling.
- `js/main.js` — app bootstrap.
- `js/core/*` — game logic: state, moves, render, input.
- `js/components/*` — small render helpers for grid and tiles.
- `js/utils/*` — matrix helpers and row shifting.

## Implementation notes
- Move logic lives in pure helpers (`moveRowLeft`, `transpose`, `reverseRows`) to keep behavior easy to test and tweak.
- Tile animations use absolute positioning and CSS variables to smoothly transition from old to new coordinates.
- Game state (score, best, grid, status) persists between sessions.

## Ideas to extend
- Add a button/hotkey to reset the best score.
- Show move history or an undo action.
