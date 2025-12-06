import { move, newGame } from "./game.js";
import { render } from "./render.js";

export function initInput() {
    const keyMap = {
        arrowup: "up",
        w: "up",

        arrowdown: "down",
        s: "down",

        arrowleft: "left",
        a: "left",

        arrowright: "right",
        d: "right",
    };

    window.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        if (keyMap[key]) {
            e.preventDefault();
            move(keyMap[key]);
            render();
        }
    });

    const restartBtn = document.getElementById("restart");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            newGame();
            render();
        });
    }

    initTouchControls();
}

function initTouchControls() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const zone = document.getElementById("game");

    zone.addEventListener("touchstart", (e) => {
        const t = e.changedTouches[0];
        startX = t.clientX;
        startY = t.clientY;
    });

    zone.addEventListener("touchmove", (e) => {
        e.preventDefault();
    }, { passive: false });

    zone.addEventListener("touchend", (e) => {
        const t = e.changedTouches[0];
        endX = t.clientX;
        endY = t.clientY;
        handleSwipe();
    });

    function handleSwipe() {
        const dx = endX - startX;
        const dy = endY - startY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 40) { move("right"); render(); }
            if (dx < -40) { move("left"); render(); }
        } else {
            if (dy > 40) { move("down"); render(); }
            if (dy < -40) { move("up"); render(); }
        }
    }
}
