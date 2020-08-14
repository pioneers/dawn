export interface PeripheralState {
    peripheralList: {[uid: number]: Peripheral};
    batterySafety: boolean;
    batteryLevel: number;
    runtimeVersion: string;
}

export interface Peripheral {
    name: string;
    uid: string;
    type: number;
    params: Param[];
}

export interface Param {
    name: string;
    val: Val;
}

export interface Val {
    fval?: number;
    ival?: number;
    bval?: boolean;
}