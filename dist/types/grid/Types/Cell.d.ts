type Cell = {
    row: number;
    col: number;
    x: number;
    y: number;
    sizeX: number;
    sizeY: number;
    index: number;
};
declare function buildCell(cell?: Partial<Cell>): {
    row: number;
    col: number;
    x: number;
    y: number;
    sizeX: number;
    sizeY: number;
    index: number;
};
export { buildCell };
export type { Cell };
