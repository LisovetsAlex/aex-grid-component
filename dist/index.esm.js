import React, { useRef, useCallback, useState, useEffect } from 'react';

/**
 * Is a grid item that is used in Grid component. It can expand and shrink as the user clicks on it.
 *
 * @param {PGridCell} props - The props for the grid item component.
 * @return {JSX.Element} The rendered grid item component.
 */
function GridCell(props) {
    var positionX = props.isGridSmall
        ? props.data.col === 0
            ? props.gridData.gap / 2
            : window.innerWidth * 0.5 -
                getScrollbarWidth() / 2 +
                props.gridData.gap / 2
        : props.data.x;
    var positionY = props.data.y;
    var width = props.isGridSmall
        ? "calc(".concat(window.innerWidth * 0.5, "px - ").concat(getScrollbarWidth() / 2 + props.gridData.gap, "px)")
        : props.data.sizeX;
    var height = props.data.sizeY;
    return (React.createElement("div", { className: props.gridData.itemClassName, style: {
            position: "absolute",
            cursor: "pointer",
            zIndex: 100000,
            transform: "translate(".concat(positionX, "px, ").concat(positionY, "px)"),
            animationDelay: "".concat(props.id * 0.03, "s"),
            transition: "all 0.2s ease",
            width: props.isSelected
                ? props.gridItemData.spanCols > 1 && props.isGridSmall
                    ? "calc(".concat(window.innerWidth, "px - ").concat(getScrollbarWidth() + props.gridData.gap, "px)")
                    : width
                : width,
            height: height,
        }, onMouseDown: function () {
            props.onClick();
        } }, props.isSelected
        ? props.gridItemData.content
        : props.gridItemData.thumbnail));
}
function getScrollbarWidth() {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "-9999px";
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflow = "scroll";
    document.body.appendChild(div);
    var scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return scrollbarWidth;
}

/**
 * Dummy Component that is used to transfer data between Grid and GridItem.
 *
 * @param spanCols: number;
 * @param spanRows: number;
 * @param content: ReactElement;
 * @param thumbnail: ReactElement;
 */
function GridItem(props) {
    return (React.createElement("div", null,
        props.content,
        props.thumbnail));
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function buildCell(cell) {
    return __assign({ x: 0, y: 0, sizeX: 0, sizeY: 0, index: -1, row: 0, col: 0 }, cell);
}

/**
 * Generates a grid layout based on the provided props and provides functions to resize and manipulate the grid.
 * Is only used in the `Grid` component.
 */
function useGrid(props) {
    var grid = useRef([]);
    var initItems = useRef([]); // initial sizes and positions of items
    var numberOfItems = props.children.length;
    var numberOfColumns = props.numberOfColumns; // number of max cols
    var numberOfRows = numberOfItems * numberOfColumns; // number of potential rows
    var gap = props.gap;
    var itemWidth = props.itemWidth;
    var itemHeight = props.itemHeight;
    /**
     * Iterates over each cell in the grid and executes the provided callback function.
     *
     * @param {(row: number, col: number) => boolean | void} forEach - The callback function to be executed for each cell.
     *                                                                 return true to stop the loop.
     */
    var loopInGrid = useCallback(function (forEach) {
        for (var row = 0; row < grid.current.length; row++) {
            for (var col = 0; col < grid.current[row].length; col++) {
                if (forEach(row, col))
                    return;
            }
        }
    }, [grid]);
    /**
     * Paints with given cell on the given area.
     *
     * @param {Cell} cell - The cell that will be painted.
     * @param {number[][]} area - The area in the grid to be painted.
     */
    var paintCellOnArea = function (cell, area) {
        var firstTime = true;
        var _loop_1 = function (row) {
            var newItem = getUpdatedCell(cell, area[row][0], area[row][1], cell.sizeX, cell.sizeY);
            grid.current[area[row][0]][area[row][1]] = newItem;
            if (firstTime) {
                setCells(function (prevPositions) {
                    var updatedPositions = __spreadArray([], prevPositions, true);
                    updatedPositions[cell.index - 1] = newItem;
                    return updatedPositions;
                });
                firstTime = false;
            }
        };
        for (var row = 0; row < area.length; row++) {
            _loop_1(row);
        }
    };
    /**
     * Clears the grid.
     *
     */
    var clearGrid = useCallback(function () {
        loopInGrid(function (row, col) {
            grid.current[row][col] = buildCell();
        });
    }, [loopInGrid]);
    /**
     * Clears the grid except for the specified cell.
     *
     * @param {Cell} cell - The cell to exclude from clearing the grid.
     */
    var clearGridExcept = function (cell) {
        loopInGrid(function (row, col) {
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
    var getUpdatedCell = useCallback(function (cell, row, col, sizeX, sizeY) {
        if (sizeX === void 0) { sizeX = 1; }
        if (sizeY === void 0) { sizeY = 1; }
        var newCell = __assign(__assign({}, cell), { row: row, col: col, sizeX: itemWidth * sizeX + gap * (sizeX - 1), sizeY: itemHeight * sizeY + gap * (sizeY - 1), x: col * itemWidth + col * gap, y: row * itemHeight + row * gap });
        return newCell;
    }, [gap, itemHeight, itemWidth]);
    /**
     * Paints the cell on the first free space.
     *
     * @param {Cell} cell - The cell to paint on the grid.
     */
    var paintCellOnFreeSpace = useCallback(function (cell) {
        loopInGrid(function (row, col) {
            if (grid.current[row][col].index !== -1)
                return false;
            var newItem = getUpdatedCell(cell, row, col);
            grid.current[row][col] = newItem;
            setCells(function (prevPositions) {
                var updatedPositions = __spreadArray([], prevPositions, true);
                updatedPositions[cell.index - 1] = newItem;
                return updatedPositions;
            });
            return true;
        });
    }, [getUpdatedCell, loopInGrid]);
    /**
     * Concatenates two arrays of cells and returns the result.
     *
     * @param {Cell[]} cells1 - The first array of cells.
     * @param {Cell[]} cells2 - The second array of cells.
     * @return {Cell[]} The concatenated array of cells.
     */
    var joinCells = function (cells1, cells2) {
        return cells1.concat(cells2);
    };
    /**
     * Retrieves a cell from the grid based on its index.
     *
     * @param {number} index - The index of the cell to retrieve.
     * @return {Cell} The cell with the specified index, or a empty cell if not found.
     */
    var getCell = function (index) {
        for (var rows = 0; rows < numberOfRows; rows++) {
            for (var cols = 0; cols < currentNumberOfColumns; cols++) {
                if (grid.current[rows][cols].index === index) {
                    return grid.current[rows][cols];
                }
            }
        }
        throw new Error("getCell: No Cell with index: ".concat(index, " found."));
    };
    /**
     * Returns the grid position (row and column) of a cell with the given index.
     *
     * @param {number} index - The index of the cell to find.
     * @return {{ row: number, col: number }} - An object with the row and column indices of the cell.
     */
    var getItemGridPosition = function (index) {
        for (var rows = 0; rows < numberOfRows; rows++) {
            for (var cols = 0; cols < currentNumberOfColumns; cols++) {
                if (grid.current[rows][cols].index === index) {
                    return {
                        row: rows,
                        col: cols,
                    };
                }
            }
        }
        throw new Error("getItemGridPosition: No Cell with index: ".concat(index, " found."));
    };
    /**
     * Returns an array of all cells in the grid.
     *
     * @return {Cell[]} An array of cells.
     */
    var getAllCells = function () {
        return grid.current.flat().filter(function (cell) { return cell.index !== -1; });
    };
    /**
     * Returns an array of all cells in the grid, excluding the cell with the specified index.
     *
     * @param {number} specificIndex - The index of the cell to exclude.
     * @return {Cell[]} An array of cells excluding the specified cell.
     */
    var getAllCellsExcept = function (specificIndex) {
        return grid.current
            .flat()
            .filter(function (cell) { return cell.index !== specificIndex && cell.index !== -1; });
    };
    /**
     * Sorts an array of cells in ascending order based on their `index` property.
     *
     * @param {Cell[]} array - The array of `Cell` objects to be sorted.
     * @return {Cell[]} The sorted array of `Cell` objects.
     */
    var getSortedCells = function (array) {
        return array.sort(function (a, b) { return a.index - b.index; });
    };
    /**
     * Returns column position where a cell would need to be painted in order to fit the grid.
     *
     * @param {number} index - The index of the cell.
     * @param {number} sizeX - The desired width of the cell in columns.
     * @return {{ row: number, col: number }} - The adjusted position of the cell.
     */
    var getAdjustedCellPosition = function (index, sizeX) {
        var newPosition = getItemGridPosition(index);
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
    var getOverlappedCells = function (cell) {
        var items = [];
        for (var rows = cell.row; rows < cell.row + cell.sizeY; rows++) {
            for (var cols = cell.col; cols < cell.col + cell.sizeX; cols++) {
                if (grid.current[rows][cols].index !== -1 &&
                    grid.current[rows][cols].index !== cell.index) {
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
    var getOccupiedArea = function (cell) {
        var items = [];
        for (var rows = cell.row; rows < cell.row + cell.sizeY; rows++) {
            for (var cols = cell.col; cols < cell.col + cell.sizeX; cols++) {
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
    var resize = function (index, sizeX, sizeY) {
        var startPosition = getItemGridPosition(index);
        var occupiedArea = [];
        var overlappedCells = [];
        var cellWidth = clamp(sizeX, 1, currentNumberOfColumns);
        var cellHeight = sizeY + (sizeX - cellWidth);
        var selectedCell = __assign(__assign(__assign({}, getCell(index)), startPosition), { sizeX: cellWidth, sizeY: cellHeight });
        // adjust start position in case cell is too wide
        startPosition = getAdjustedCellPosition(selectedCell.index, cellWidth);
        overlappedCells = getOverlappedCells(__assign(__assign({}, selectedCell), { row: startPosition.row, col: startPosition.col }));
        // get area where to paint the selected cell
        occupiedArea = getOccupiedArea(__assign(__assign({}, selectedCell), { row: startPosition.row, col: startPosition.col }));
        // resize the selected cell
        paintCellOnArea(selectedCell, occupiedArea);
        overlappedCells = joinCells(overlappedCells, getAllCellsExcept(index));
        overlappedCells = getSortedCells(overlappedCells);
        // clear grid except selected cell
        clearGridExcept(selectedCell);
        // find new positions for overlapped items
        for (var _i = 0, overlappedCells_1 = overlappedCells; _i < overlappedCells_1.length; _i++) {
            var item = overlappedCells_1[_i];
            paintCellOnFreeSpace(item);
        }
        setGridHeight(getGridHeight());
    };
    /**
     * Clamps a value between a minimum and maximum value.
     */
    var clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };
    /**
     * Return amount of columns that can fit into the window
     *
     * @return {boolean} Whether the window width is less than the grid width.
     */
    var getColumnsFitOnScreen = useCallback(function () {
        var totalWidthAvailable = window.innerWidth;
        var columnWidth = itemWidth + gap;
        var columns = Math.floor(totalWidthAvailable / columnWidth);
        return clamp(columns, 2, numberOfColumns);
    }, [gap, itemWidth, numberOfColumns]);
    var _a = useState(getColumnsFitOnScreen()), currentNumberOfColumns = _a[0], setCurrentNumberOfColumns = _a[1];
    /**
     * Returns the total width of the grid in px.
     *
     * @return {number} The total width of the grid.
     */
    var getGridWidth = useCallback(function () {
        return (currentNumberOfColumns * itemWidth +
            (currentNumberOfColumns - 1) * gap);
    }, [gap, itemWidth, currentNumberOfColumns]);
    /**
     * Calculates the margin left value based on the window width and the grid width.
     * Used to center the grid in the window.
     *
     * @return {number} The calculated margin left value in px.
     */
    var getMarginLeft = useCallback(function () {
        return (window.innerWidth - getGridWidth()) / 2;
    }, [getGridWidth]);
    /**
     * Returns height of the grid in px.
     *
     * @return {number} The calculated height of the grid.
     */
    var getGridHeight = useCallback(function () {
        var actualRows = getGridRows();
        return actualRows * itemHeight + (actualRows - 1) * gap;
    }, [gap, itemHeight]);
    /**
     * Returns the number of actual rows in the grid.
     *
     * @return {number} The number of actual rows in the grid.
     */
    var getGridRows = function () {
        var actualRows = 0;
        for (var _i = 0, _a = grid.current; _i < _a.length; _i++) {
            var row = _a[_i];
            if (row.some(function (cell) { return cell.index !== -1; })) {
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
    var createGrid = useCallback(function () {
        for (var rows = 0; rows < numberOfRows; rows++) {
            grid.current[rows] = [];
            for (var cols = 0; cols < currentNumberOfColumns; cols++) {
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
    var registerGridItem = useCallback(function (index) {
        loopInGrid(function (rows, cols) {
            if (grid.current[rows][cols].index === -1) {
                var cell = {
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
    }, [gap, grid, itemHeight, itemWidth, loopInGrid]);
    /**
     * Registers all grid items.
     *
     * @return {void}
     */
    var registerGridItems = useCallback(function () {
        initItems.current = [];
        for (var i = 1; i <= numberOfItems; i++) {
            registerGridItem(i);
        }
    }, [numberOfItems, registerGridItem]);
    createGrid();
    registerGridItems();
    var _b = useState(initItems.current), cells = _b[0], setCells = _b[1];
    var _c = useState(getMarginLeft()), marginLeft = _c[0], setMarginLeft = _c[1];
    var _d = useState(getGridHeight()), gridHeight = _d[0], setGridHeight = _d[1];
    var _e = useState(false), triggerReset = _e[0], setTriggerReset = _e[1];
    var _f = useState(-1), selectedCell = _f[0], setSelectedCell = _f[1];
    var _g = useState(getColumnsFitOnScreen() == 2), isGridSmall = _g[0], setIsGridSmall = _g[1];
    useEffect(function () {
        var handleResize = function () {
            var resizeGrid = function () {
                var newNumberOfCols = getColumnsFitOnScreen();
                if (newNumberOfCols === currentNumberOfColumns)
                    return;
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
        return function () {
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
    useEffect(function () {
        var cells = getAllCells();
        clearGrid();
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            paintCellOnFreeSpace(cell);
        }
        setGridHeight(getGridHeight());
    }, [clearGrid, getGridHeight, paintCellOnFreeSpace, triggerReset]);
    return {
        cells: cells,
        resize: resize,
        selectedCell: selectedCell,
        setSelectedCell: setSelectedCell,
        marginLeft: marginLeft,
        gridHeight: gridHeight,
        isGridSmall: isGridSmall,
    };
}

/**
 * Based on the given props, it creates a grid of given GridItems as children that can expand and shrink whenever clicked.
 *
 * @param props.numberOfColumns: number;
 * @param props.itemWidth: number;
 * @param props.itemHeight: number;
 * @param props.itemClassName: string;
 * @param props.gap: number;
 * @param props.children: ReactElement<typeof GridItem>[];
 */
function Grid(props) {
    checkGridProps(props);
    var _a = useGrid(props), cells = _a.cells, resize = _a.resize, selectedCell = _a.selectedCell, setSelectedCell = _a.setSelectedCell, marginLeft = _a.marginLeft, gridHeight = _a.gridHeight, isGridSmall = _a.isGridSmall;
    return (React.createElement("div", { className: "", style: {
            height: gridHeight,
            paddingLeft: isGridSmall ? 0 : marginLeft,
        } }, props.children.map(function (child, index) {
        var cp = child.props;
        checkItemProps(cp);
        return (React.createElement(GridCell, { key: index + 1, id: index, isGridSmall: isGridSmall, gridItemData: cp, gridData: props, data: cells[index], isSelected: selectedCell === index, onClick: function () {
                setSelectedCell(index);
                resize(index + 1, cp.spanCols, cp.spanRows);
            } }));
    })));
}
function checkGridProps(props) {
    if (props.gap < 0)
        throw new Error("Gap in a Grid must be minimum 0.");
    if (props.numberOfColumns < 3)
        throw new Error("Number of columns in a grid must be minimum 3.");
    for (var _i = 0, _a = props.children; _i < _a.length; _i++) {
        var child = _a[_i];
        if (child.type === GridItem)
            continue;
        throw new Error(child.type +
            " is not of type GridItem. Grid component can only accept GridItem components as children.");
    }
}
function checkItemProps(props) {
    if (props.spanCols < 1 || props.spanRows < 1)
        throw new Error("Span of a GridItem must be minimum 1");
}

export { Grid, GridItem };
//# sourceMappingURL=index.esm.js.map
