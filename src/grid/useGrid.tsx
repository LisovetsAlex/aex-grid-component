import { useCallback, useEffect, useRef, useState } from "react";
import { Cell, buildCell } from "./Types/Cell";
import { PGrid } from "./Types/PGrid";

/**
 * Generates a grid layout based on the provided props and provides functions to resize and manipulate the grid.
 * Is only used in the `Grid` component.
 */
function useGrid(props: PGrid) {
    const grid = useRef<Cell[][]>([]);
    const initItems = useRef<Cell[]>([]); // initial sizes and positions of items
    const numberOfItems = props.children.length;
    const numberOfColumns = props.numberOfColumns; // number of max cols
    const numberOfRows = numberOfItems * numberOfColumns; // number of potential rows
    const gap = props.gap;
    const itemWidth = props.itemWidth;
    const itemHeight = props.itemHeight;

    /**
     * Iterates over each cell in the grid and executes the provided callback function.
     *
     * @param {(row: number, col: number) => boolean | void} forEach - The callback function to be executed for each cell.
     *                                                                 return true to stop the loop.
     */
    const loopInGrid = useCallback(
        (forEach: (row: number, col: number) => boolean | void) => {
            for (let row = 0; row < grid.current.length; row++) {
                for (let col = 0; col < grid.current[row].length; col++) {
                    if (forEach(row, col)) return;
                }
            }
        },
        [grid]
    );

    /**
     * Paints with given cell on the given area.
     *
     * @param {Cell} cell - The cell that will be painted.
     * @param {number[][]} area - The area in the grid to be painted.
     */
    const paintCellOnArea = (cell: Cell, area: number[][]) => {
        let firstTime = true;
        for (let row = 0; row < area.length; row++) {
            const newItem = getUpdatedCell(
                cell,
                area[row][0],
                area[row][1],
                cell.sizeX,
                cell.sizeY
            );

            grid.current[area[row][0]][area[row][1]] = newItem;
            if (firstTime) {
                setCells((prevPositions) => {
                    const updatedPositions = [...prevPositions];
                    updatedPositions[cell.index - 1] = newItem;
                    return updatedPositions;
                });
                firstTime = false;
            }
        }
    };

    /**
     * Clears the grid.
     *
     */
    const clearGrid = useCallback(() => {
        loopInGrid((row, col) => {
            grid.current[row][col] = buildCell();
        });
    }, [loopInGrid]);

    /**
     * Clears the grid except for the specified cell.
     *
     * @param {Cell} cell - The cell to exclude from clearing the grid.
     */
    const clearGridExcept = (cell: Cell) => {
        loopInGrid((row, col) => {
            if (grid.current[row][col].index !== cell.index) {
                grid.current[row][col] = buildCell();
            }
        });
    };

    /**
     * Returns given cell with updated position (x and y) and size, based on the given props.
     *
     * @param {Cell} cell - The cell object to update.
     * @param {number} row - The row index of the new cell.
     * @param {number} col - The column index of the new cell.
     * @param {number} [sizeX=1] - How many columns the new cell should span.
     * @param {number} [sizeY=1] - How many rows the new cell should span.
     * @return {Cell} The updated cell object.
     */
    const getUpdatedCell = useCallback(
        (cell: Cell, row: number, col: number, sizeX = 1, sizeY = 1) => {
            const newCell = {
                ...cell,
                row: row,
                col: col,
                sizeX: itemWidth * sizeX + gap * (sizeX - 1),
                sizeY: itemHeight * sizeY + gap * (sizeY - 1),
                x: col * itemWidth + col * gap,
                y: row * itemHeight + row * gap,
            };
            return newCell;
        },
        [gap, itemHeight, itemWidth]
    );

    /**
     * Paints the cell on the first free space.
     *
     * @param {Cell} cell - The cell to paint on the grid.
     */
    const paintCellOnFreeSpace = useCallback(
        (cell: Cell) => {
            loopInGrid((row, col) => {
                if (grid.current[row][col].index !== -1) return false;

                const newItem = getUpdatedCell(cell, row, col);
                grid.current[row][col] = newItem;
                setCells((prevPositions) => {
                    const updatedPositions = [...prevPositions];
                    updatedPositions[cell.index - 1] = newItem;
                    return updatedPositions;
                });

                return true;
            });
        },
        [getUpdatedCell, loopInGrid]
    );

    /**
     * Concatenates two arrays of cells and returns the result.
     *
     * @param {Cell[]} cells1 - The first array of cells.
     * @param {Cell[]} cells2 - The second array of cells.
     * @return {Cell[]} The concatenated array of cells.
     */
    const joinCells = (cells1: Cell[], cells2: Cell[]) => {
        return cells1.concat(cells2);
    };

    /**
     * Retrieves a cell from the grid based on its index.
     *
     * @param {number} index - The index of the cell to retrieve.
     * @return {Cell} The cell with the specified index, or a empty cell if not found.
     */
    const getCell = (index: number): Cell => {
        for (let rows = 0; rows < numberOfRows; rows++) {
            for (let cols = 0; cols < currentNumberOfColumns; cols++) {
                if (grid.current[rows][cols].index === index) {
                    return grid.current[rows][cols];
                }
            }
        }

        throw new Error(`getCell: No Cell with index: ${index} found.`);
    };

    /**
     * Returns the grid position (row and column) of a cell with the given index.
     *
     * @param {number} index - The index of the cell to find.
     * @return {{ row: number, col: number }} - An object with the row and column indices of the cell.
     */
    const getItemGridPosition = (index: number) => {
        for (let rows = 0; rows < numberOfRows; rows++) {
            for (let cols = 0; cols < currentNumberOfColumns; cols++) {
                if (grid.current[rows][cols].index === index) {
                    return {
                        row: rows,
                        col: cols,
                    };
                }
            }
        }
        throw new Error(
            `getItemGridPosition: No Cell with index: ${index} found.`
        );
    };

    /**
     * Returns an array of all cells in the grid.
     *
     * @return {Cell[]} An array of cells.
     */
    const getAllCells = (): Cell[] => {
        return grid.current.flat().filter((cell) => cell.index !== -1);
    };

    /**
     * Returns an array of all cells in the grid, excluding the cell with the specified index.
     *
     * @param {number} specificIndex - The index of the cell to exclude.
     * @return {Cell[]} An array of cells excluding the specified cell.
     */
    const getAllCellsExcept = (specificIndex: number): Cell[] => {
        return grid.current
            .flat()
            .filter(
                (cell) => cell.index !== specificIndex && cell.index !== -1
            );
    };

    /**
     * Sorts an array of cells in ascending order based on their `index` property.
     *
     * @param {Cell[]} array - The array of `Cell` objects to be sorted.
     * @return {Cell[]} The sorted array of `Cell` objects.
     */
    const getSortedCells = (array: Cell[]): Cell[] => {
        return array.sort((a, b) => a.index - b.index);
    };

    /**
     * Returns column position where a cell would need to be painted in order to fit the grid.
     *
     * @param {number} index - The index of the cell.
     * @param {number} sizeX - The desired width of the cell in columns.
     * @return {{ row: number, col: number }} - The adjusted position of the cell.
     */
    const getAdjustedCellPosition = (index: number, sizeX: number) => {
        const newPosition = getItemGridPosition(index);
        if (newPosition.col + sizeX >= currentNumberOfColumns) {
            newPosition.col =
                newPosition.col -
                (newPosition.col + sizeX - currentNumberOfColumns);
        }
        return newPosition;
    };

    /**
     * Returns all cells that would overlap with the given cell.
     *
     * @param {Cell} cell - The cell.
     * @return {Array} An array of overlapped items.
     */
    const getOverlappedCells = (cell: Cell) => {
        const items = [];
        for (let rows = cell.row; rows < cell.row + cell.sizeY; rows++) {
            for (let cols = cell.col; cols < cell.col + cell.sizeX; cols++) {
                if (
                    grid.current[rows][cols].index !== -1 &&
                    grid.current[rows][cols].index !== cell.index
                ) {
                    items.push(grid.current[rows][cols]);
                }
            }
        }
        return items;
    };

    /**
     * Returns the occupied area based on the cells size and position.
     *
     * @param {Cell} cell - The cell.
     * @return {Array} An array representing the occupied area.
     */
    const getOccupiedArea = (cell: Cell) => {
        const items = [];
        for (let rows = cell.row; rows < cell.row + cell.sizeY; rows++) {
            for (let cols = cell.col; cols < cell.col + cell.sizeX; cols++) {
                items.push([rows, cols]);
            }
        }
        return items;
    };

    /**
     * Resizes a cell in the grid and adjusts the positions of overlapping cells accordingly.
     *
     * @param {number} index - The index of the cell to resize.
     * @param {number} sizeX - The new width of the cell.
     * @param {number} sizeY - The new height of the cell.
     */
    const resize = (index: number, sizeX: number, sizeY: number) => {
        let startPosition = getItemGridPosition(index);
        let occupiedArea: number[][] = [];
        let overlappedCells: Cell[] = [];
        const cellWidth = clamp(sizeX, 1, currentNumberOfColumns);
        const cellHeight = sizeY + (sizeX - cellWidth);
        const selectedCell = {
            ...getCell(index),
            ...startPosition,
            sizeX: cellWidth,
            sizeY: cellHeight,
        };

        // adjust start position in case cell is too wide
        startPosition = getAdjustedCellPosition(selectedCell.index, cellWidth);

        overlappedCells = getOverlappedCells({
            ...selectedCell,
            row: startPosition.row,
            col: startPosition.col,
        });

        // get area where to paint the selected cell
        occupiedArea = getOccupiedArea({
            ...selectedCell,
            row: startPosition.row,
            col: startPosition.col,
        });

        // resize the selected cell
        paintCellOnArea(selectedCell, occupiedArea);

        overlappedCells = joinCells(overlappedCells, getAllCellsExcept(index));
        overlappedCells = getSortedCells(overlappedCells);

        // clear grid except selected cell
        clearGridExcept(selectedCell);

        // find new positions for overlapped items
        for (const item of overlappedCells) {
            paintCellOnFreeSpace(item);
        }

        setGridHeight(getGridHeight());
    };

    /**
     * Clamps a value between a minimum and maximum value.
     */
    const clamp = (value: number, min: number, max: number): number => {
        return Math.min(Math.max(value, min), max);
    };

    /**
     * Return amount of columns that can fit into the window
     *
     * @return {boolean} Whether the window width is less than the grid width.
     */
    const getColumnsFitOnScreen = useCallback(() => {
        const totalWidthAvailable = window.innerWidth;
        const columnWidth = itemWidth + gap;
        const columns = Math.floor(totalWidthAvailable / columnWidth);
        return clamp(columns, 2, numberOfColumns);
    }, [gap, itemWidth, numberOfColumns]);

    const [currentNumberOfColumns, setCurrentNumberOfColumns] =
        useState<number>(getColumnsFitOnScreen());

    /**
     * Returns the total width of the grid in px.
     *
     * @return {number} The total width of the grid.
     */
    const getGridWidth = useCallback(() => {
        return (
            currentNumberOfColumns * itemWidth +
            (currentNumberOfColumns - 1) * gap
        );
    }, [gap, itemWidth, currentNumberOfColumns]);

    /**
     * Calculates the margin left value based on the window width and the grid width.
     * Used to center the grid in the window.
     *
     * @return {number} The calculated margin left value in px.
     */
    const getMarginLeft = useCallback(() => {
        return (window.innerWidth - getGridWidth()) / 2;
    }, [getGridWidth]);

    /**
     * Returns height of the grid in px.
     *
     * @return {number} The calculated height of the grid.
     */
    const getGridHeight = useCallback(() => {
        const actualRows = getGridRows();
        return actualRows * itemHeight + (actualRows - 1) * gap;
    }, [gap, itemHeight]);

    /**
     * Returns the number of actual rows in the grid.
     *
     * @return {number} The number of actual rows in the grid.
     */
    const getGridRows = () => {
        let actualRows = 0;
        for (const row of grid.current) {
            if (row.some((cell) => cell.index !== -1)) {
                actualRows++;
            }
        }
        return actualRows;
    };

    /**
     * Initializes a 2D grid with with empty cells.
     *
     * @return {void}
     */
    const createGrid = useCallback(() => {
        for (let rows = 0; rows < numberOfRows; rows++) {
            grid.current[rows] = [];
            for (let cols = 0; cols < currentNumberOfColumns; cols++) {
                grid.current[rows][cols] = buildCell();
            }
        }
    }, [currentNumberOfColumns, grid, numberOfRows]);

    /**
     * Registers a grid item and gives this item unique index.
     *
     * @param {number} index - The unique index of the item to be registered.
     * @return {void}
     */
    const registerGridItem = useCallback(
        (index: number) => {
            loopInGrid((rows, cols) => {
                if (grid.current[rows][cols].index === -1) {
                    const cell: Cell = {
                        row: rows,
                        col: cols,
                        x: cols * itemWidth + cols * gap,
                        y: rows * itemHeight + rows * gap,
                        sizeX: itemWidth,
                        sizeY: itemHeight,
                        index: index,
                    };
                    grid.current[rows][cols] = cell;
                    initItems.current.push(cell);
                    return true;
                }
            });
        },
        [gap, grid, itemHeight, itemWidth, loopInGrid]
    );

    /**
     * Registers all grid items.
     *
     * @return {void}
     */
    const registerGridItems = useCallback(() => {
        initItems.current = [];
        for (let i = 1; i <= numberOfItems; i++) {
            registerGridItem(i);
        }
    }, [numberOfItems, registerGridItem]);

    createGrid();
    registerGridItems();

    const [cells, setCells] = useState<Array<Cell>>(initItems.current);
    const [marginLeft, setMarginLeft] = useState(getMarginLeft());
    const [gridHeight, setGridHeight] = useState(getGridHeight());
    const [triggerReset, setTriggerReset] = useState(false);
    const [selectedCell, setSelectedCell] = useState<number>(-1);
    const [isGridSmall, setIsGridSmall] = useState<boolean>(
        getColumnsFitOnScreen() == 2
    );

    useEffect(() => {
        const handleResize = () => {
            const resizeGrid = () => {
                const newNumberOfCols = getColumnsFitOnScreen();
                if (newNumberOfCols === currentNumberOfColumns) return;
                setSelectedCell(-1);
                setCurrentNumberOfColumns(newNumberOfCols);
                setIsGridSmall(newNumberOfCols == 2);
                createGrid();
                registerGridItems();
                setTriggerReset(!triggerReset);
            };

            setMarginLeft(getMarginLeft());
            resizeGrid();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [
        getMarginLeft,
        createGrid,
        registerGridItems,
        clearGrid,
        paintCellOnFreeSpace,
        numberOfColumns,
        getColumnsFitOnScreen,
        getGridWidth,
        currentNumberOfColumns,
        triggerReset,
        getGridHeight,
    ]);

    useEffect(() => {
        const cells = getAllCells();
        clearGrid();
        for (const cell of cells) {
            paintCellOnFreeSpace(cell);
        }
        setGridHeight(getGridHeight());
    }, [clearGrid, getGridHeight, paintCellOnFreeSpace, triggerReset]);

    return {
        cells,
        resize,
        selectedCell,
        setSelectedCell,
        marginLeft,
        gridHeight,
        isGridSmall,
    };
}

export { useGrid };
