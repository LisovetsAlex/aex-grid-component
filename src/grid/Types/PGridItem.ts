import { ReactElement } from "react";

type PGridItem = {
    spanCols: number;
    spanRows: number;
    content: ReactElement;
    thumbnail: ReactElement;
};

export type { PGridItem };
