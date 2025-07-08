import {
    ButtonSounds,
    ButtonTheme,
    FocusKey,
    InputAction,
    InputActionRequest,
    UISound,
} from "cs2/ui";
import { getModuleComponentWithRef } from "./utils";
import { ReactNode } from "react";

export interface ButtonProp {
    focusKey?: FocusKey;
    debugName?: string;
    selected?: boolean;
    theme?: Partial<ButtonTheme>;
    sounds?: ButtonSounds | null;
    selectAction?: InputAction;
    selectSound?: UISound | string | null;
    tooltipLabel?: ReactNode;
    disableHint?: boolean;
    onSelect?: () => void;
    as?: "button" | "div";
    hintAction?: InputAction;
    actionContext?: string;
    forceHint?: boolean;
    shortcut?: InputAction | InputActionRequest;
    allowFocusableChildren?: boolean;
    item?: any;
    children?: ReactNode;
}

type ExtendedButtonProp<T = {}> = ButtonProp & T;

export const Button = getModuleComponentWithRef<ExtendedButtonProp<any>>(
    "game-ui/common/input/button/button.tsx",
    "Button"
);
