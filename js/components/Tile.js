export function renderTile(value) {
    if (value === 0) return "";
    const className = value <= 2048 ? `tile-${value}` : `tile-super`;

    return `<div class="tile ${className}">${value}</div>`;
}
