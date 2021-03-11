class Peripheral {
    key: number;
    uid: string;
    device_name: string;
    constructor(key: number, uid: string, device_name: string) {
        this.key = key;
        this.uid = uid;
        this.device_name = device_name;
    }
}

export class Motor extends Peripheral {
    params: Object;
    constructor(key: number, uid: string, device_name: string, velocity: number, dc: number) {
        super(key, uid, device_name);
        this.params = {
            'Velocity': velocity,
            'DC': dc,
        }    
    }
}

export class Sensor extends Peripheral {
    params: Object;
    constructor(key: number, uid: string, device_name: string, distance: number) {
        super(key, uid, device_name);
        this.params = {
            'Distance': distance,
        }    
    }
}

export interface PeripheralData {
    key: number,
    uid: string,
    device_name: string,
    params: Object,
}
