import { getModuleClasses, getModuleComponent } from "./utils";

export interface MenuItemInnerItem {
    id: string;
    sections: any[];
    beta: boolean;
    builtIn: boolean;
    warning: boolean;
}

export interface MenuItemProp {
    beta: boolean;
    selected: boolean;
    warning: boolean;
    item: MenuItemInnerItem;
    onSelect: any;
    suffix: string;
}

export const MenuItem = getModuleComponent<MenuItemProp>(
    "game-ui/menu/components/options-screen/options-screen.tsx",
    "MenuItem"
);

export const menuItemClasses = getModuleClasses(
    "game-ui/menu/components/options-screen/options-screen.module.scss"
);
