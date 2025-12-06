import { state } from "./state.js";
import { transpose, reverseRows, cloneMatrix } from "../utils/matrix.js";
import { moveRowLeft } from "../utils/moveRow.js";

const STORAGE_KEY = "game-2048-state";

export function initGame() {
    const saved = loadState();

    if (saved) {
        state.grid = saved.grid;
        state.score = saved.score ?? 0;
        state.best = saved.best ?? 0;
        const hasWinningTile = contains2048(saved.grid);
        state.status = saved.status || (hasWinningTile ? "won" : "playing");
        state.animations = [];
        state.lastAdded = null;
        return;
    }

    newGame();
}

export function newGame() {
    state.grid = Array(4).fill(null).map(() => Array(4).fill(0));
    state.score = 0;
    state.status = "playing";
    state.animations = [];
    state.lastAdded = null;

    addRandomTile();
    addRandomTile();
    saveState();
}

export function addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (state.grid[r][c] === 0) {
                empty.push({ r, c });
            }
        }
    }

    if (empty.length === 0) return;

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    state.grid[r][c] = value;
    state.lastAdded = { r, c, value };
}

export function move(direction) {
    if (state.status !== "playing") return false;

    const oldGrid = cloneMatrix(state.grid);
    const { grid: movedGrid, scoreGain, hasWin, animations } = moveGrid(direction, oldGrid);

    const changed = JSON.stringify(oldGrid) !== JSON.stringify(movedGrid);
    if (!changed) {
        state.animations = [];
        state.lastAdded = null;
        return false;
    }

    state.grid = movedGrid;
    state.score += scoreGain;
    if (state.score > state.best) state.best = state.score;
    state.animations = animations;

    if (hasWin) {
        state.status = "won";
        state.lastAdded = null;
    } else {
        addRandomTile();
        if (isGameOver(state.grid)) {
            state.status = "over";
        }
    }

    saveState();
    return true;
}

function moveGrid(direction, grid) {
    let tempGrid = cloneMatrix(grid);
    let totalGain = 0;
    let hasWin = false;
    let animations = [];

    const applyLeft = (rowIndexMapper) => {
        const newMatrix = [];
        tempGrid.forEach((row, r) => {
            const { row: newRow, scoreGain, mergedTo2048, moves } = moveRowLeft(row);
            newMatrix.push(newRow);
            totalGain += scoreGain;
            if (mergedTo2048) hasWin = true;
            moves.forEach(m => animations.push(rowIndexMapper(r, m)));
        });
        tempGrid = newMatrix;
    };

    if (direction === "left") {
        applyLeft((r, m) => ({
            from: { r, c: m.from },
            to: { r, c: m.to },
            value: m.value,
            merged: m.merged
        }));
    }

    if (direction === "right") {
        tempGrid = reverseRows(tempGrid);
        applyLeft((r, m) => ({
            from: { r, c: 3 - m.from },
            to: { r, c: 3 - m.to },
            value: m.value,
            merged: m.merged
        }));
        tempGrid = reverseRows(tempGrid);
    }

    if (direction === "up") {
        tempGrid = transpose(tempGrid);
        applyLeft((r, m) => ({
            from: { r: m.from, c: r },
            to: { r: m.to, c: r },
            value: m.value,
            merged: m.merged
        }));
        tempGrid = transpose(tempGrid);
    }

    if (direction === "down") {
        tempGrid = transpose(tempGrid);
        tempGrid = reverseRows(tempGrid);
        applyLeft((r, m) => ({
            from: { r: 3 - m.from, c: r },
            to: { r: 3 - m.to, c: r },
            value: m.value,
            merged: m.merged
        }));
        tempGrid = reverseRows(tempGrid);
        tempGrid = transpose(tempGrid);
    }

    return { grid: tempGrid, scoreGain: totalGain, hasWin, animations };
}

function isGameOver(grid) {
    const hasEmpty = grid.some(row => row.some(v => v === 0));
    if (hasEmpty) return false;

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const current = grid[r][c];
            const right = c < 3 ? grid[r][c + 1] : null;
            const down = r < 3 ? grid[r + 1][c] : null;
            if (current === right || current === down) return false;
        }
    }

    return true;
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            grid: state.grid,
            score: state.score,
            best: state.best,
            status: state.status
        }));
    } catch (e) {
        console.warn("Cannot save game state", e);
    }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);

        const validGrid = Array.isArray(parsed.grid)
            && parsed.grid.length === 4
            && parsed.grid.every(row => Array.isArray(row) && row.length === 4);
        if (!validGrid) return null;

        return {
            grid: parsed.grid,
            score: Number(parsed.score) || 0,
            best: Number(parsed.best) || 0,
            status: parsed.status || "playing"
        };
    } catch (e) {
        console.warn("Cannot load game state", e);
        return null;
    }
}

function contains2048(grid) {
    return grid.some(row => row.some(value => value === 2048));
}
