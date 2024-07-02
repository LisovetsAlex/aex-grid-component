import React from "react";
import { GridCell } from "./GridCell";
import { GridItem } from "./GridItem";
import { PGrid } from "./Types/PGrid";
import { PGridItem } from "./Types/PGridItem";
import { useGrid } from "./useGrid";

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
function Grid(props: PGrid) {
    checkGridProps(props);

    const {
        cells,
        resize,
        selectedCell,
        setSelectedCell,
        marginLeft,
        gridHeight,
        isGridSmall,
    } = useGrid(props);

    return (
        <div
            className=""
            style={{
                height: gridHeight,
                paddingLeft: isGridSmall ? 0 : marginLeft,
            }}
        >
            {props.children.map((child, index) => {
                const cp = child.props as unknown as PGridItem;
                checkItemProps(cp);
                return (
                    <GridCell
                        key={index + 1}
                        id={index}
                        isGridSmall={isGridSmall}
                        gridItemData={cp}
                        gridData={props}
                        data={cells[index]}
                        isSelected={selectedCell === index}
                        onClick={() => {
                            setSelectedCell(index);
                            resize(index + 1, cp.spanCols, cp.spanRows);
                        }}
                    />
                );
            })}
        </div>
    );
}

function checkGridProps(props: PGrid) {
    if (props.gap < 0) throw new Error("Gap in a Grid must be minimum 0.");
    if (props.numberOfColumns < 3)
        throw new Error("Number of columns in a grid must be minimum 3.");
    for (const child of props.children) {
        if (child.type === GridItem) continue;
        throw new Error(
            child.type +
                " is not of type GridItem. Grid component can only accept GridItem components as children."
        );
    }
}

function checkItemProps(props: PGridItem) {
    if (props.spanCols < 1 || props.spanRows < 1)
        throw new Error("Span of a GridItem must be minimum 1");
}

export { Grid };
