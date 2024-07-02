import { Cell } from "./Cell";
import { PGrid } from "./PGrid";
import { PGridItem } from "./PGridItem";

type PGridCell = {
    id: number;
    data: Cell;
    gridItemData: PGridItem;
    gridData: PGrid;
    isGridSmall: boolean;
    isSelected: boolean;
    onClick: () => void;
};

export type { PGridCell };
