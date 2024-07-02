type Cell = {
    row: number; // cell position in grid (row / col)
    col: number;
    x: number; // cell position on screen in px
    y: number;
    sizeX: number; // cell width in px
    sizeY: number; // cell height in px
    index: number; // unique index of cell
};

function buildCell(cell?: Partial<Cell>) {
    return {
        x: 0,
        y: 0,
        sizeX: 0,
        sizeY: 0,
        index: -1,
        row: 0,
        col: 0,
        ...cell,
    };
}

export { buildCell };
export type { Cell };
