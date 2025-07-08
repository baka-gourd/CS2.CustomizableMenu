import { getModule } from "cs2/modding";
import { Icon, Button } from "cs2/ui";
import React, { forwardRef, ComponentType } from "react";
export { Icon, Button };

type Component<Props = any> = ComponentType<Props>;
export const getModuleComponent = <Props = any>(
    modulePath: string,
    exportName: string
) => getModule(modulePath, exportName) as Component<Props>;

type Classes<T = any> = T;
export const getModuleClasses = <T = any>(modulePath: string) =>
    getModule(modulePath, "classes") as Classes<T>;

export const getModuleComponentWithRef = <Props = any, Ref = any>(
    modulePath: string,
    exportName: string
) => {
    const OriginalComponent = getModule(modulePath, exportName) as any;

    const ComponentWithRef = forwardRef<Ref, Props>((props, ref) => {
        return React.createElement(OriginalComponent, { ...props, ref });
    });

    ComponentWithRef.displayName = `${exportName}WithRef`;

    return ComponentWithRef;
};
