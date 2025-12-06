export function cloneMatrix(matrix) {
    return matrix.map(row => [...row]);
}

export function transpose(matrix) {
    return matrix[0].map((_, colIndex) =>
        matrix.map(row => row[colIndex])
    );
}

export function reverseRows(matrix) {
    return matrix.map(row => [...row].reverse());
}
