import { ReactElement } from "react";
import { GridItem } from "../GridItem";

type PGrid = {
    numberOfColumns: number;
    itemWidth: number;
    itemHeight: number;
    itemClassName: string;
    gap: number;
    children: ReactElement<typeof GridItem>[];
};

export type { PGrid };
