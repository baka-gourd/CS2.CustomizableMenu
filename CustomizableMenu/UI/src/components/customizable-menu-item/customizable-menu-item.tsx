import { useLocalization } from "cs2/l10n";
import { menuItemClasses, MenuItemProp } from "../vanilla/MenuItem";
import { useCallback, useMemo, memo, ReactElement } from "react";
import { CustomData } from "models/CustomData";
import { CustomPill } from "components/custom-pill/custom-pill";
import { getCustomData, hasCustomData } from "utils";
import { itemRight } from "./customizable-menu-item.module.scss";
import { bindValue, useValue } from "cs2/api";
import mod from "mod.json";
import { Button } from "components/vanilla/Button";

const shouldTweak = (id: string, protectVanilla: boolean) => {
    if (protectVanilla) {
        switch (id) {
            case "General":
            case "Graphics":
            case "Gameplay":
            case "Interface":
            case "Input":
            case "Modding":
            case "About":
                return false;
            default:
                return hasCustomData(id);
        }
    }

    return hasCustomData(id);
};

const isCustomized = (src?: string) => {
    switch (src) {
        case "ALPHA":
        case "RC":
        case "EXP":
        case "BROKEN":
        case "OBS":
        case "BETA":
            return false;
        default:
            return true;
    }
};

const enabled$ = bindValue<boolean>(mod.id, "enabled");
const protectVanillaMenu$ = bindValue<boolean>(mod.id, "protectVanillaMenu");

const CustomMenuItemContent = memo<{
    prop: MenuItemProp;
    customData?: CustomData;
    onSelect: () => void;
    translate: (id: string, fallback?: string | null) => string | null;
}>(({ prop: props, customData: data, onSelect, translate }) => {
    const translationKey = useMemo(
        () => `Options.SECTION[${props.item.id}]`,
        [props.item.id]
    );

    const shouldShowRight = useMemo(
        () =>
            props.beta ||
            props.warning ||
            data?.beta ||
            data?.warning ||
            data?.badge,
        [props.beta, props.warning, data?.badge, data?.warning, data?.beta]
    );

    const shouldShowBeta = useMemo(() => {
        if (data?.beta === undefined) {
            return props.beta;
        }

        return data.beta;
    }, [props.beta, data?.beta]);

    const shouldShowWarning = useMemo(() => {
        if (data?.warning === undefined) {
            return props.warning;
        }

        return data.warning;
    }, [props.warning, data?.warning]);

    const itemKey = useMemo(() => {
        switch (props.item.id) {
            case "General":
            case "Graphics":
            case "Gameplay":
            case "Interface":
            case "Input":
            case "Modding":
            case "About":
                return props.item.id;
            default:
                return `${props.item.id}mod`;
        }
    }, [props.item.id]);

    return (
        <Button
            key={itemKey}
            className={`${menuItemClasses.item} ${menuItemClasses.primary}`}
            onSelect={onSelect}
            selected={props.selected}
            focusKey={props.item.id}
            theme={{ button: "", hint: "" }}
            as="button"
            allowFocusableChildren={false}
            item={props.item}>
            <div className={menuItemClasses.menuItemLeft}>
                <span>{translate(translationKey)}</span>
                {props.suffix && <span>{props.suffix}</span>}
            </div>
            {shouldShowRight && (
                <div
                    className={`${menuItemClasses.menuItemRight} ${itemRight}`}>
                    {shouldShowBeta && (
                        <CustomPill type="BETA">
                            {translate("Menu.BETA_LABEL")}
                        </CustomPill>
                    )}
                    {data?.badge &&
                        data.srcs?.map((m, index) => {
                            return (
                                <CustomPill
                                    key={`${m}-${index}`}
                                    type={isCustomized(m) ? "" : m}
                                    src={isCustomized(m) ? m : ""}
                                    customStyle={data.style}>
                                    {translate(`CustomizableMenu.${m}`)}
                                </CustomPill>
                            );
                        })}
                    {shouldShowWarning && (
                        <img
                            src="Media/Misc/Warning.svg"
                            alt="warning"
                            className={menuItemClasses.warningIcon}></img>
                    )}
                </div>
            )}
        </Button>
    );
});

CustomMenuItemContent.displayName = "CustomMenuItemContent";

const createMemoizedComponent = (Component: any) => {
    return memo((props: any) => {
        const enabled = useValue(enabled$);
        const protectVanillaMenu = useValue(protectVanillaMenu$);
        const { children, ...otherProps } = props || {};
        const typedProps = otherProps as MenuItemProp;

        const shouldTweakItem = useMemo(
            () => shouldTweak(typedProps.item.id, protectVanillaMenu),
            [typedProps.item.id, protectVanillaMenu]
        );

        const { translate } = useLocalization();

        const selectCallback = useCallback(
            () => typedProps.onSelect(typedProps.item.id),
            [typedProps.item.id, typedProps.onSelect]
        );

        const data = useMemo(
            () => getCustomData(typedProps.item.id),
            [typedProps.item.id]
        );

        const modifiedProps = useMemo(() => {
            if (data?.item?.builtIn !== undefined)
                props.item.builtIn = data.item.builtIn;
            return props;
        }, [props, data]);

        if (!(enabled && shouldTweakItem)) {
            return <Component {...props}>{children}</Component>;
        }

        return (
            <CustomMenuItemContent
                prop={modifiedProps}
                customData={data}
                onSelect={selectCallback}
                translate={translate}
            />
        );
    });
};

export const CustomizableMenuItem = (Component: any) => {
    const MemoizedComponent = createMemoizedComponent(Component);

    return (props: any): ReactElement => {
        return <MemoizedComponent {...props} />;
    };
};
