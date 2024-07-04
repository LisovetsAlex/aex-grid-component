import React from "react";
import { PGridCell } from "../Types/PGridCell";

/**
 * Is a grid item that is used in Grid component. It can expand and shrink as the user clicks on it.
 *
 * @param {PGridCell} props - The props for the grid item component.
 * @return {JSX.Element} The rendered grid item component.
 */
function GridCell(props: PGridCell) {
    const positionX = props.isGridSmall
        ? props.data.col === 0
            ? props.gridData.gap / 2
            : window.innerWidth * 0.5 -
              getScrollbarWidth() / 2 +
              props.gridData.gap / 2
        : props.data.x;
    const positionY = props.data.y;
    const width = props.isGridSmall
        ? `calc(${window.innerWidth * 0.5}px - ${
              getScrollbarWidth() / 2 + props.gridData.gap
          }px)`
        : props.data.sizeX;
    const height = props.data.sizeY;

    return (
        <div
            className={props.gridData.itemClassName}
            style={{
                position: "absolute",
                transform: `translate(${positionX}px, ${positionY}px)`,
                width: props.isSelected
                    ? props.gridItemData.spanCols > 1 && props.isGridSmall
                        ? `calc(${window.innerWidth}px - ${
                              getScrollbarWidth() + props.gridData.gap
                          }px)`
                        : width
                    : width,
                height: height,
            }}
            onMouseDown={() => {
                props.onClick();
            }}
        >
            {props.isSelected
                ? props.gridItemData.content
                : props.gridItemData.thumbnail}
        </div>
    );
}

function getScrollbarWidth() {
    const div = document.createElement("div");

    div.style.position = "absolute";
    div.style.top = "-9999px";
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflow = "scroll";

    document.body.appendChild(div);
    const scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return scrollbarWidth;
}

export { GridCell };
