import { bindValue, useValue } from "cs2/api";
import { CustomData } from "models/CustomData";
import embedData from "models/embedDatas.json";
import { removeCustomData, setCustomData } from "utils";
import mod from "mod.json";
import { useEffect } from "react";

const activateEmbedRules$ = bindValue<boolean>(mod.id, "activateEmbedRules");

export const InitDataHook = () => {
    const initializeEmbedData = () => {
        if (!embedData) return;

        Object.entries(embedData).forEach(([id, customData]) => {
            setCustomData(id, customData as CustomData, false);
        });
    };

    const activate = useValue(activateEmbedRules$);

    useEffect(() => {
        if (activate) {
            initializeEmbedData();
        } else {
            Object.entries(embedData).forEach(([id]) => {
                removeCustomData(id);
            });
        }
    }, [activate]);

    return <></>;
};
