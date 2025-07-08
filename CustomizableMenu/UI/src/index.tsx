import { ModRegistrar } from "cs2/modding";
import { CustomizableMenuItem } from "components/customizable-menu-item/customizable-menu-item";
import {
    getCustomData,
    hasCustomData,
    removeCustomData,
    setCustomData,
} from "utils";
import { InitDataHook } from "components/init-data-hook/init-data-hook";

const register: ModRegistrar = (moduleRegistry) => {
    moduleRegistry.append("Menu", InitDataHook);
    moduleRegistry.extend(
        "game-ui/menu/components/options-screen/options-screen.tsx",
        "MenuItem",
        CustomizableMenuItem
    );
    moduleRegistry.add("customizable-menu/utils.ts", {
        getCustomData: getCustomData,
        setCustomData: setCustomData,
        hasCustomData: hasCustomData,
        removeCustomData: removeCustomData,
    } as Record<string, any>);
};

export default register;
