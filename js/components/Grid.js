export function renderGrid() {
    return Array(16).fill(0).map(() => `<div class="cell"></div>`).join('');
}
