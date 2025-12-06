export function moveRowLeft(row) {
    let nonZero = row
        .map((value, index) => ({ value, index }))
        .filter(({ value }) => value !== 0);

    let result = [];
    let scoreGain = 0;
    let mergedTo2048 = false;
    let moves = [];

    for (let i = 0; i < nonZero.length; i++) {
        const current = nonZero[i];
        const next = nonZero[i + 1];

        if (next && current.value === next.value) {
            const merged = current.value * 2;
            const toCol = result.length;
            const fromCol = next.index;

            result.push(merged);
            scoreGain += merged;
            if (merged === 2048) mergedTo2048 = true;

            moves.push({
                from: fromCol,
                to: toCol,
                value: merged,
                merged: true
            });
            i++;
        } else {
            result.push(current.value);
            moves.push({
                from: current.index,
                to: result.length - 1,
                value: current.value,
                merged: false
            });
        }
    }

    while (result.length < 4) result.push(0);

    return { row: result, scoreGain, mergedTo2048, moves };
}
