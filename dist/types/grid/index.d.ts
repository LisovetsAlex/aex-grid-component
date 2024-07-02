import React from "react";
import { PGrid } from "./Types/PGrid";
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
declare function Grid(props: PGrid): React.JSX.Element;
export { Grid };
