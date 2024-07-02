import React, { ReactElement } from "react";
import { PGridItem } from "../Types/PGridItem";

/**
 * Dummy Component that is used to transfer data between Grid and GridItem.
 *
 * @param spanCols: number;
 * @param spanRows: number;
 * @param content: ReactElement;
 * @param thumbnail: ReactElement;
 */
function GridItem(props: PGridItem) {
    return (
        <div>
            {props.content}
            {props.thumbnail}
        </div>
    );
}

export { GridItem };
