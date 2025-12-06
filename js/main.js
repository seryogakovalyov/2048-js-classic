import { initGame } from "./core/game.js";
import { render } from "./core/render.js";
import { initInput } from "./core/input.js";

function start() {
    initGame();
    render();
    initInput();
}

start();
