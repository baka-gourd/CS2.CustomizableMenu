import { CustomData } from "models/CustomData";

class DataMapSingleton {
    private static instance: DataMapSingleton;
    private mapInstance: Map<string, CustomData>;

    private constructor() {
        this.mapInstance = new Map<string, CustomData>();
    }

    public static getInstance(): DataMapSingleton {
        if (!DataMapSingleton.instance) {
            DataMapSingleton.instance = new DataMapSingleton();
        }
        return DataMapSingleton.instance;
    }

    public getMap(): Map<string, CustomData> {
        return this.mapInstance;
    }
}

export const dataMap = DataMapSingleton.getInstance().getMap();

export function setCustomData(
    id: string,
    data: CustomData,
    overwrite: boolean = false
) {
    if (!overwrite && dataMap.has(id)) {
        return false;
    }

    dataMap.set(id, data);
    return true;
}

export function getCustomData(id: string): CustomData | undefined {
    return dataMap.get(id);
}

export function hasCustomData(id: string): boolean {
    return dataMap.has(id);
}

export function removeCustomData(id: string): boolean {
    return dataMap.delete(id);
}
