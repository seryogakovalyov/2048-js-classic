import { state } from "./state.js";
import { renderGrid } from "../components/Grid.js";
import { renderTile } from "../components/Tile.js";

export function render() {
    const gridDiv = document.getElementById("grid");
    gridDiv.innerHTML = renderGrid();

    const tilesLayer = document.createElement("div");
    tilesLayer.className = "tiles";
    gridDiv.appendChild(tilesLayer);

    const metrics = getGridMetrics(gridDiv);
    const animations = state.animations || [];
    const usedMoves = new Set();
    const animatedTiles = [];

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const value = state.grid[r][c];
            if (value === 0) continue;

            const move = findMove(animations, usedMoves, r, c, value);
            const isNew = state.lastAdded
                && state.lastAdded.r === r
                && state.lastAdded.c === c
                && state.lastAdded.value === value;

            const from = move ? move.from : { r, c };
            const to = { r, c };

            const tileWrapper = document.createElement("div");
            tileWrapper.innerHTML = renderTile(value);
            const tileEl = tileWrapper.firstElementChild;

            if (move?.merged) tileEl.classList.add("merge");
            if (isNew) tileEl.classList.add("new");

            tileEl.style.width = `${metrics.cell}px`;
            tileEl.style.height = `${metrics.cell}px`;
            tileEl.style.lineHeight = `${metrics.cell}px`;

            const fromPos = positionForCell(from, metrics);
            tileEl.style.setProperty("--x", `${fromPos.x}px`);
            tileEl.style.setProperty("--y", `${fromPos.y}px`);
            tilesLayer.appendChild(tileEl);
            animatedTiles.push({ el: tileEl, to });
        }
    }

    gridDiv.getBoundingClientRect();

    requestAnimationFrame(() => {
        animatedTiles.forEach(({ el, to }) => {
            const toPos = positionForCell(to, metrics);
            el.style.setProperty("--x", `${toPos.x}px`);
            el.style.setProperty("--y", `${toPos.y}px`);
        });
    });

    state.lastAdded = null;

    document.getElementById("score").textContent = state.score;
    document.getElementById("best").textContent = state.best;

    const message = document.getElementById("message");
    if (state.status === "won") {
        message.textContent = "You made 2048! Press Restart to play again.";
        message.classList.add("show");
    } else if (state.status === "over") {
        message.textContent = "No moves left. Press Restart for a new game.";
        message.classList.add("show");
    } else {
        message.textContent = "";
        message.classList.remove("show");
    }
}

function positionForCell(pos, metrics) {
    const x = metrics.paddingLeft + pos.c * (metrics.cell + metrics.gap);
    const y = metrics.paddingTop + pos.r * (metrics.cell + metrics.gap);
    return { x, y };
}

function findMove(moves, usedMoves, r, c, value) {
    for (let i = 0; i < moves.length; i++) {
        if (usedMoves.has(i)) continue;
        const m = moves[i];
        if (m.to.r === r && m.to.c === c && m.value === value) {
            usedMoves.add(i);
            return m;
        }
    }
    return null;
}

function getGridMetrics(gridEl) {
    const style = getComputedStyle(gridEl);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    const paddingLeft = parseFloat(style.paddingLeft || "0") || 0;
    const paddingRight = parseFloat(style.paddingRight || "0") || 0;
    const paddingTop = parseFloat(style.paddingTop || "0") || 0;
    const paddingBottom = parseFloat(style.paddingBottom || "0") || 0;
    const clientWidth = gridEl.clientWidth;
    const clientHeight = gridEl.clientHeight;

    const cellWidth = (clientWidth - paddingLeft - paddingRight - gap * 3) / 4;
    const cellHeight = (clientHeight - paddingTop - paddingBottom - gap * 3) / 4;
    const cell = Math.min(cellWidth, cellHeight);

    return { gap, paddingLeft, paddingTop, cell };
}
