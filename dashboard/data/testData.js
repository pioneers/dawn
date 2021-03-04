class Peripheral {
    constructor(key, uid, device_name) {
        this.key = key;
        this.uid = uid;
        this.device_name = device_name;
    }
}

export class Motor extends Peripheral {
    constructor(key, uid, device_name, velocity, dc) {
        super(key, uid, device_name);
        this.params = {
            'Velocity': velocity,
            'DC': dc,
        }    
    }
}

export class Sensor extends Peripheral {
    constructor(key, uid, device_name, distance) {
        super(key, uid, device_name);
        this.params = {
            'Distance': distance,
        }    
    }
}