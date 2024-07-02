import React from "react";
import { PGridItem } from "../Types/PGridItem";
/**
 * Dummy Component that is used to transfer data between Grid and GridItem.
 *
 * @param spanCols: number;
 * @param spanRows: number;
 * @param content: ReactElement;
 * @param thumbnail: ReactElement;
 */
declare function GridItem(props: PGridItem): React.JSX.Element;
export { GridItem };
