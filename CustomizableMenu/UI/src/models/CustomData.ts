import { CSSProperties } from "react";

export interface CustomData {
    badge?: boolean;
    srcs?: string[];
    style?: CSSProperties;
    item?: { builtIn?: boolean };
    beta?: boolean;
    warning?: boolean;
}
