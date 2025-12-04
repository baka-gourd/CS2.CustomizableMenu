import { bindValue, useValue } from "cs2/api";
import { CustomData } from "models/CustomData";
// import embedData from "models/embedDatas.json";
import { removeCustomData, setCustomData } from "utils";
import mod from "mod.json";
import { useEffect } from "react";

const activateEmbedRules$ = bindValue<boolean>(mod.id, "activateEmbedRules");
const customData$ = bindValue<string>(mod.id, "customData");

export const InitDataHook = () => {
    const activate = useValue(activateEmbedRules$);
    const data = useValue(customData$);
    const embedData = JSON.parse(data || "{}").data;
    const initializeEmbedData = () => {
        if (!embedData) return;

        Object.entries(embedData).forEach(([id, customData]) => {
            setCustomData(id, customData as CustomData, false);
        });
    };

    useEffect(() => {
        if (activate) {
            initializeEmbedData();
        } else {
            Object.entries(embedData).forEach(([id]) => {
                removeCustomData(id);
            });
        }
    }, []);

    return <></>;
};
