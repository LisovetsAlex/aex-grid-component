import { Cell } from "./Types/Cell";
import { PGrid } from "./Types/PGrid";
/**
 * Generates a grid layout based on the provided props and provides functions to resize and manipulate the grid.
 * Is only used in the `Grid` component.
 */
declare function useGrid(props: PGrid): {
    cells: Cell[];
    resize: (index: number, sizeX: number, sizeY: number) => void;
    selectedCell: number;
    setSelectedCell: import("react").Dispatch<import("react").SetStateAction<number>>;
    marginLeft: number;
    gridHeight: number;
    isGridSmall: boolean;
};
export { useGrid };
