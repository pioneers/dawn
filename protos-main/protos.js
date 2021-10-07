/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Param = $root.Param = (() => {

    /**
     * Properties of a Param.
     * @exports IParam
     * @interface IParam
     * @property {string|null} [name] Param name
     * @property {number|null} [fval] Param fval
     * @property {number|null} [ival] Param ival
     * @property {boolean|null} [bval] Param bval
     * @property {boolean|null} [readonly] Param readonly
     */

    /**
     * Constructs a new Param.
     * @exports Param
     * @classdesc Represents a Param.
     * @implements IParam
     * @constructor
     * @param {IParam=} [properties] Properties to set
     */
    function Param(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Param name.
     * @member {string} name
     * @memberof Param
     * @instance
     */
    Param.prototype.name = "";

    /**
     * Param fval.
     * @member {number} fval
     * @memberof Param
     * @instance
     */
    Param.prototype.fval = 0;

    /**
     * Param ival.
     * @member {number} ival
     * @memberof Param
     * @instance
     */
    Param.prototype.ival = 0;

    /**
     * Param bval.
     * @member {boolean} bval
     * @memberof Param
     * @instance
     */
    Param.prototype.bval = false;

    /**
     * Param readonly.
     * @member {boolean} readonly
     * @memberof Param
     * @instance
     */
    Param.prototype.readonly = false;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Param val.
     * @member {"fval"|"ival"|"bval"|undefined} val
     * @memberof Param
     * @instance
     */
    Object.defineProperty(Param.prototype, "val", {
        get: $util.oneOfGetter($oneOfFields = ["fval", "ival", "bval"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Param instance using the specified properties.
     * @function create
     * @memberof Param
     * @static
     * @param {IParam=} [properties] Properties to set
     * @returns {Param} Param instance
     */
    Param.create = function create(properties) {
        return new Param(properties);
    };

    /**
     * Encodes the specified Param message. Does not implicitly {@link Param.verify|verify} messages.
     * @function encode
     * @memberof Param
     * @static
     * @param {Param} message Param message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Param.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.fval != null && Object.hasOwnProperty.call(message, "fval"))
            writer.uint32(/* id 2, wireType 5 =*/21).float(message.fval);
        if (message.ival != null && Object.hasOwnProperty.call(message, "ival"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.ival);
        if (message.bval != null && Object.hasOwnProperty.call(message, "bval"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.bval);
        if (message.readonly != null && Object.hasOwnProperty.call(message, "readonly"))
            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.readonly);
        return writer;
    };

    /**
     * Encodes the specified Param message, length delimited. Does not implicitly {@link Param.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Param
     * @static
     * @param {Param} message Param message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Param.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Param message from the specified reader or buffer.
     * @function decode
     * @memberof Param
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Param} Param
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Param.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Param();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.fval = reader.float();
                break;
            case 3:
                message.ival = reader.int32();
                break;
            case 4:
                message.bval = reader.bool();
                break;
            case 5:
                message.readonly = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Param message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Param
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Param} Param
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Param.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Param message.
     * @function verify
     * @memberof Param
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Param.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.fval != null && message.hasOwnProperty("fval")) {
            properties.val = 1;
            if (typeof message.fval !== "number")
                return "fval: number expected";
        }
        if (message.ival != null && message.hasOwnProperty("ival")) {
            if (properties.val === 1)
                return "val: multiple values";
            properties.val = 1;
            if (!$util.isInteger(message.ival))
                return "ival: integer expected";
        }
        if (message.bval != null && message.hasOwnProperty("bval")) {
            if (properties.val === 1)
                return "val: multiple values";
            properties.val = 1;
            if (typeof message.bval !== "boolean")
                return "bval: boolean expected";
        }
        if (message.readonly != null && message.hasOwnProperty("readonly"))
            if (typeof message.readonly !== "boolean")
                return "readonly: boolean expected";
        return null;
    };

    /**
     * Creates a Param message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Param
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Param} Param
     */
    Param.fromObject = function fromObject(object) {
        if (object instanceof $root.Param)
            return object;
        let message = new $root.Param();
        if (object.name != null)
            message.name = String(object.name);
        if (object.fval != null)
            message.fval = Number(object.fval);
        if (object.ival != null)
            message.ival = object.ival | 0;
        if (object.bval != null)
            message.bval = Boolean(object.bval);
        if (object.readonly != null)
            message.readonly = Boolean(object.readonly);
        return message;
    };

    /**
     * Creates a plain object from a Param message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Param
     * @static
     * @param {Param} message Param
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Param.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.name = "";
            object.readonly = false;
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.fval != null && message.hasOwnProperty("fval")) {
            object.fval = options.json && !isFinite(message.fval) ? String(message.fval) : message.fval;
            if (options.oneofs)
                object.val = "fval";
        }
        if (message.ival != null && message.hasOwnProperty("ival")) {
            object.ival = message.ival;
            if (options.oneofs)
                object.val = "ival";
        }
        if (message.bval != null && message.hasOwnProperty("bval")) {
            object.bval = message.bval;
            if (options.oneofs)
                object.val = "bval";
        }
        if (message.readonly != null && message.hasOwnProperty("readonly"))
            object.readonly = message.readonly;
        return object;
    };

    /**
     * Converts this Param to JSON.
     * @function toJSON
     * @memberof Param
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Param.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Param;
})();

export const Device = $root.Device = (() => {

    /**
     * Properties of a Device.
     * @exports IDevice
     * @interface IDevice
     * @property {string|null} [name] Device name
     * @property {number|Long|null} [uid] Device uid
     * @property {number|null} [type] Device type
     * @property {Array.<Param>|null} [params] Device params
     */

    /**
     * Constructs a new Device.
     * @exports Device
     * @classdesc Represents a Device.
     * @implements IDevice
     * @constructor
     * @param {IDevice=} [properties] Properties to set
     */
    function Device(properties) {
        this.params = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Device name.
     * @member {string} name
     * @memberof Device
     * @instance
     */
    Device.prototype.name = "";

    /**
     * Device uid.
     * @member {number|Long} uid
     * @memberof Device
     * @instance
     */
    Device.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Device type.
     * @member {number} type
     * @memberof Device
     * @instance
     */
    Device.prototype.type = 0;

    /**
     * Device params.
     * @member {Array.<Param>} params
     * @memberof Device
     * @instance
     */
    Device.prototype.params = $util.emptyArray;

    /**
     * Creates a new Device instance using the specified properties.
     * @function create
     * @memberof Device
     * @static
     * @param {IDevice=} [properties] Properties to set
     * @returns {Device} Device instance
     */
    Device.create = function create(properties) {
        return new Device(properties);
    };

    /**
     * Encodes the specified Device message. Does not implicitly {@link Device.verify|verify} messages.
     * @function encode
     * @memberof Device
     * @static
     * @param {Device} message Device message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Device.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.uid);
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.type);
        if (message.params != null && message.params.length)
            for (let i = 0; i < message.params.length; ++i)
                $root.Param.encode(message.params[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Device message, length delimited. Does not implicitly {@link Device.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Device
     * @static
     * @param {Device} message Device message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Device.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Device message from the specified reader or buffer.
     * @function decode
     * @memberof Device
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Device} Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Device.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Device();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.uid = reader.uint64();
                break;
            case 3:
                message.type = reader.uint32();
                break;
            case 4:
                if (!(message.params && message.params.length))
                    message.params = [];
                message.params.push($root.Param.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Device message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Device
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Device} Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Device.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Device message.
     * @function verify
     * @memberof Device
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Device.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.uid != null && message.hasOwnProperty("uid"))
            if (!$util.isInteger(message.uid) && !(message.uid && $util.isInteger(message.uid.low) && $util.isInteger(message.uid.high)))
                return "uid: integer|Long expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isInteger(message.type))
                return "type: integer expected";
        if (message.params != null && message.hasOwnProperty("params")) {
            if (!Array.isArray(message.params))
                return "params: array expected";
            for (let i = 0; i < message.params.length; ++i) {
                let error = $root.Param.verify(message.params[i]);
                if (error)
                    return "params." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Device message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Device
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Device} Device
     */
    Device.fromObject = function fromObject(object) {
        if (object instanceof $root.Device)
            return object;
        let message = new $root.Device();
        if (object.name != null)
            message.name = String(object.name);
        if (object.uid != null)
            if ($util.Long)
                (message.uid = $util.Long.fromValue(object.uid)).unsigned = true;
            else if (typeof object.uid === "string")
                message.uid = parseInt(object.uid, 10);
            else if (typeof object.uid === "number")
                message.uid = object.uid;
            else if (typeof object.uid === "object")
                message.uid = new $util.LongBits(object.uid.low >>> 0, object.uid.high >>> 0).toNumber(true);
        if (object.type != null)
            message.type = object.type >>> 0;
        if (object.params) {
            if (!Array.isArray(object.params))
                throw TypeError(".Device.params: array expected");
            message.params = [];
            for (let i = 0; i < object.params.length; ++i) {
                if (typeof object.params[i] !== "object")
                    throw TypeError(".Device.params: object expected");
                message.params[i] = $root.Param.fromObject(object.params[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Device message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Device
     * @static
     * @param {Device} message Device
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Device.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.params = [];
        if (options.defaults) {
            object.name = "";
            if ($util.Long) {
                let long = new $util.Long(0, 0, true);
                object.uid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.uid = options.longs === String ? "0" : 0;
            object.type = 0;
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.uid != null && message.hasOwnProperty("uid"))
            if (typeof message.uid === "number")
                object.uid = options.longs === String ? String(message.uid) : message.uid;
            else
                object.uid = options.longs === String ? $util.Long.prototype.toString.call(message.uid) : options.longs === Number ? new $util.LongBits(message.uid.low >>> 0, message.uid.high >>> 0).toNumber(true) : message.uid;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.params && message.params.length) {
            object.params = [];
            for (let j = 0; j < message.params.length; ++j)
                object.params[j] = $root.Param.toObject(message.params[j], options);
        }
        return object;
    };

    /**
     * Converts this Device to JSON.
     * @function toJSON
     * @memberof Device
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Device.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Device;
})();

export const DevData = $root.DevData = (() => {

    /**
     * Properties of a DevData.
     * @exports IDevData
     * @interface IDevData
     * @property {Array.<Device>|null} [devices] DevData devices
     */

    /**
     * Constructs a new DevData.
     * @exports DevData
     * @classdesc Represents a DevData.
     * @implements IDevData
     * @constructor
     * @param {IDevData=} [properties] Properties to set
     */
    function DevData(properties) {
        this.devices = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DevData devices.
     * @member {Array.<Device>} devices
     * @memberof DevData
     * @instance
     */
    DevData.prototype.devices = $util.emptyArray;

    /**
     * Creates a new DevData instance using the specified properties.
     * @function create
     * @memberof DevData
     * @static
     * @param {IDevData=} [properties] Properties to set
     * @returns {DevData} DevData instance
     */
    DevData.create = function create(properties) {
        return new DevData(properties);
    };

    /**
     * Encodes the specified DevData message. Does not implicitly {@link DevData.verify|verify} messages.
     * @function encode
     * @memberof DevData
     * @static
     * @param {DevData} message DevData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DevData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.devices != null && message.devices.length)
            for (let i = 0; i < message.devices.length; ++i)
                $root.Device.encode(message.devices[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified DevData message, length delimited. Does not implicitly {@link DevData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DevData
     * @static
     * @param {DevData} message DevData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DevData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DevData message from the specified reader or buffer.
     * @function decode
     * @memberof DevData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DevData} DevData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DevData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.DevData();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.devices && message.devices.length))
                    message.devices = [];
                message.devices.push($root.Device.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DevData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DevData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DevData} DevData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DevData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DevData message.
     * @function verify
     * @memberof DevData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DevData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.devices != null && message.hasOwnProperty("devices")) {
            if (!Array.isArray(message.devices))
                return "devices: array expected";
            for (let i = 0; i < message.devices.length; ++i) {
                let error = $root.Device.verify(message.devices[i]);
                if (error)
                    return "devices." + error;
            }
        }
        return null;
    };

    /**
     * Creates a DevData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DevData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DevData} DevData
     */
    DevData.fromObject = function fromObject(object) {
        if (object instanceof $root.DevData)
            return object;
        let message = new $root.DevData();
        if (object.devices) {
            if (!Array.isArray(object.devices))
                throw TypeError(".DevData.devices: array expected");
            message.devices = [];
            for (let i = 0; i < object.devices.length; ++i) {
                if (typeof object.devices[i] !== "object")
                    throw TypeError(".DevData.devices: object expected");
                message.devices[i] = $root.Device.fromObject(object.devices[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a DevData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DevData
     * @static
     * @param {DevData} message DevData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DevData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.devices = [];
        if (message.devices && message.devices.length) {
            object.devices = [];
            for (let j = 0; j < message.devices.length; ++j)
                object.devices[j] = $root.Device.toObject(message.devices[j], options);
        }
        return object;
    };

    /**
     * Converts this DevData to JSON.
     * @function toJSON
     * @memberof DevData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DevData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DevData;
})();

/**
 * State enum.
 * @exports State
 * @enum {number}
 * @property {number} POISON_IVY=0 POISON_IVY value
 * @property {number} DEHYDRATION=1 DEHYDRATION value
 * @property {number} HYPOTHERMIA_START=2 HYPOTHERMIA_START value
 * @property {number} HYPOTHERMIA_END=3 HYPOTHERMIA_END value
 */
export const State = $root.State = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "POISON_IVY"] = 0;
    values[valuesById[1] = "DEHYDRATION"] = 1;
    values[valuesById[2] = "HYPOTHERMIA_START"] = 2;
    values[valuesById[3] = "HYPOTHERMIA_END"] = 3;
    return values;
})();

export const GameState = $root.GameState = (() => {

    /**
     * Properties of a GameState.
     * @exports IGameState
     * @interface IGameState
     * @property {State|null} [state] GameState state
     */

    /**
     * Constructs a new GameState.
     * @exports GameState
     * @classdesc Represents a GameState.
     * @implements IGameState
     * @constructor
     * @param {IGameState=} [properties] Properties to set
     */
    function GameState(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameState state.
     * @member {State} state
     * @memberof GameState
     * @instance
     */
    GameState.prototype.state = 0;

    /**
     * Creates a new GameState instance using the specified properties.
     * @function create
     * @memberof GameState
     * @static
     * @param {IGameState=} [properties] Properties to set
     * @returns {GameState} GameState instance
     */
    GameState.create = function create(properties) {
        return new GameState(properties);
    };

    /**
     * Encodes the specified GameState message. Does not implicitly {@link GameState.verify|verify} messages.
     * @function encode
     * @memberof GameState
     * @static
     * @param {GameState} message GameState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.state != null && Object.hasOwnProperty.call(message, "state"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.state);
        return writer;
    };

    /**
     * Encodes the specified GameState message, length delimited. Does not implicitly {@link GameState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GameState
     * @static
     * @param {GameState} message GameState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameState message from the specified reader or buffer.
     * @function decode
     * @memberof GameState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GameState} GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameState();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.state = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GameState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GameState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GameState} GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameState message.
     * @function verify
     * @memberof GameState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.state != null && message.hasOwnProperty("state"))
            switch (message.state) {
            default:
                return "state: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        return null;
    };

    /**
     * Creates a GameState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GameState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GameState} GameState
     */
    GameState.fromObject = function fromObject(object) {
        if (object instanceof $root.GameState)
            return object;
        let message = new $root.GameState();
        switch (object.state) {
        case "POISON_IVY":
        case 0:
            message.state = 0;
            break;
        case "DEHYDRATION":
        case 1:
            message.state = 1;
            break;
        case "HYPOTHERMIA_START":
        case 2:
            message.state = 2;
            break;
        case "HYPOTHERMIA_END":
        case 3:
            message.state = 3;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a GameState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GameState
     * @static
     * @param {GameState} message GameState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.state = options.enums === String ? "POISON_IVY" : 0;
        if (message.state != null && message.hasOwnProperty("state"))
            object.state = options.enums === String ? $root.State[message.state] : message.state;
        return object;
    };

    /**
     * Converts this GameState to JSON.
     * @function toJSON
     * @memberof GameState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GameState;
})();

/**
 * Source enum.
 * @exports Source
 * @enum {number}
 * @property {number} GAMEPAD=0 GAMEPAD value
 * @property {number} KEYBOARD=1 KEYBOARD value
 */
export const Source = $root.Source = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "GAMEPAD"] = 0;
    values[valuesById[1] = "KEYBOARD"] = 1;
    return values;
})();

export const Input = $root.Input = (() => {

    /**
     * Properties of an Input.
     * @exports IInput
     * @interface IInput
     * @property {boolean|null} [connected] Input connected
     * @property {number|Long|null} [buttons] Input buttons
     * @property {Array.<number>|null} [axes] Input axes
     * @property {Source|null} [source] Input source
     */

    /**
     * Constructs a new Input.
     * @exports Input
     * @classdesc Represents an Input.
     * @implements IInput
     * @constructor
     * @param {IInput=} [properties] Properties to set
     */
    function Input(properties) {
        this.axes = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Input connected.
     * @member {boolean} connected
     * @memberof Input
     * @instance
     */
    Input.prototype.connected = false;

    /**
     * Input buttons.
     * @member {number|Long} buttons
     * @memberof Input
     * @instance
     */
    Input.prototype.buttons = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Input axes.
     * @member {Array.<number>} axes
     * @memberof Input
     * @instance
     */
    Input.prototype.axes = $util.emptyArray;

    /**
     * Input source.
     * @member {Source} source
     * @memberof Input
     * @instance
     */
    Input.prototype.source = 0;

    /**
     * Creates a new Input instance using the specified properties.
     * @function create
     * @memberof Input
     * @static
     * @param {IInput=} [properties] Properties to set
     * @returns {Input} Input instance
     */
    Input.create = function create(properties) {
        return new Input(properties);
    };

    /**
     * Encodes the specified Input message. Does not implicitly {@link Input.verify|verify} messages.
     * @function encode
     * @memberof Input
     * @static
     * @param {Input} message Input message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Input.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.connected != null && Object.hasOwnProperty.call(message, "connected"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.connected);
        if (message.buttons != null && Object.hasOwnProperty.call(message, "buttons"))
            writer.uint32(/* id 2, wireType 1 =*/17).fixed64(message.buttons);
        if (message.axes != null && message.axes.length) {
            writer.uint32(/* id 3, wireType 2 =*/26).fork();
            for (let i = 0; i < message.axes.length; ++i)
                writer.float(message.axes[i]);
            writer.ldelim();
        }
        if (message.source != null && Object.hasOwnProperty.call(message, "source"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.source);
        return writer;
    };

    /**
     * Encodes the specified Input message, length delimited. Does not implicitly {@link Input.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Input
     * @static
     * @param {Input} message Input message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Input.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Input message from the specified reader or buffer.
     * @function decode
     * @memberof Input
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Input} Input
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Input.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Input();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.connected = reader.bool();
                break;
            case 2:
                message.buttons = reader.fixed64();
                break;
            case 3:
                if (!(message.axes && message.axes.length))
                    message.axes = [];
                if ((tag & 7) === 2) {
                    let end2 = reader.uint32() + reader.pos;
                    while (reader.pos < end2)
                        message.axes.push(reader.float());
                } else
                    message.axes.push(reader.float());
                break;
            case 4:
                message.source = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Input message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Input
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Input} Input
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Input.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Input message.
     * @function verify
     * @memberof Input
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Input.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.connected != null && message.hasOwnProperty("connected"))
            if (typeof message.connected !== "boolean")
                return "connected: boolean expected";
        if (message.buttons != null && message.hasOwnProperty("buttons"))
            if (!$util.isInteger(message.buttons) && !(message.buttons && $util.isInteger(message.buttons.low) && $util.isInteger(message.buttons.high)))
                return "buttons: integer|Long expected";
        if (message.axes != null && message.hasOwnProperty("axes")) {
            if (!Array.isArray(message.axes))
                return "axes: array expected";
            for (let i = 0; i < message.axes.length; ++i)
                if (typeof message.axes[i] !== "number")
                    return "axes: number[] expected";
        }
        if (message.source != null && message.hasOwnProperty("source"))
            switch (message.source) {
            default:
                return "source: enum value expected";
            case 0:
            case 1:
                break;
            }
        return null;
    };

    /**
     * Creates an Input message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Input
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Input} Input
     */
    Input.fromObject = function fromObject(object) {
        if (object instanceof $root.Input)
            return object;
        let message = new $root.Input();
        if (object.connected != null)
            message.connected = Boolean(object.connected);
        if (object.buttons != null)
            if ($util.Long)
                (message.buttons = $util.Long.fromValue(object.buttons)).unsigned = false;
            else if (typeof object.buttons === "string")
                message.buttons = parseInt(object.buttons, 10);
            else if (typeof object.buttons === "number")
                message.buttons = object.buttons;
            else if (typeof object.buttons === "object")
                message.buttons = new $util.LongBits(object.buttons.low >>> 0, object.buttons.high >>> 0).toNumber();
        if (object.axes) {
            if (!Array.isArray(object.axes))
                throw TypeError(".Input.axes: array expected");
            message.axes = [];
            for (let i = 0; i < object.axes.length; ++i)
                message.axes[i] = Number(object.axes[i]);
        }
        switch (object.source) {
        case "GAMEPAD":
        case 0:
            message.source = 0;
            break;
        case "KEYBOARD":
        case 1:
            message.source = 1;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from an Input message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Input
     * @static
     * @param {Input} message Input
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Input.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.axes = [];
        if (options.defaults) {
            object.connected = false;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.buttons = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.buttons = options.longs === String ? "0" : 0;
            object.source = options.enums === String ? "GAMEPAD" : 0;
        }
        if (message.connected != null && message.hasOwnProperty("connected"))
            object.connected = message.connected;
        if (message.buttons != null && message.hasOwnProperty("buttons"))
            if (typeof message.buttons === "number")
                object.buttons = options.longs === String ? String(message.buttons) : message.buttons;
            else
                object.buttons = options.longs === String ? $util.Long.prototype.toString.call(message.buttons) : options.longs === Number ? new $util.LongBits(message.buttons.low >>> 0, message.buttons.high >>> 0).toNumber() : message.buttons;
        if (message.axes && message.axes.length) {
            object.axes = [];
            for (let j = 0; j < message.axes.length; ++j)
                object.axes[j] = options.json && !isFinite(message.axes[j]) ? String(message.axes[j]) : message.axes[j];
        }
        if (message.source != null && message.hasOwnProperty("source"))
            object.source = options.enums === String ? $root.Source[message.source] : message.source;
        return object;
    };

    /**
     * Converts this Input to JSON.
     * @function toJSON
     * @memberof Input
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Input.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Input;
})();

export const UserInputs = $root.UserInputs = (() => {

    /**
     * Properties of a UserInputs.
     * @exports IUserInputs
     * @interface IUserInputs
     * @property {Array.<Input>|null} [inputs] UserInputs inputs
     */

    /**
     * Constructs a new UserInputs.
     * @exports UserInputs
     * @classdesc Represents a UserInputs.
     * @implements IUserInputs
     * @constructor
     * @param {IUserInputs=} [properties] Properties to set
     */
    function UserInputs(properties) {
        this.inputs = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserInputs inputs.
     * @member {Array.<Input>} inputs
     * @memberof UserInputs
     * @instance
     */
    UserInputs.prototype.inputs = $util.emptyArray;

    /**
     * Creates a new UserInputs instance using the specified properties.
     * @function create
     * @memberof UserInputs
     * @static
     * @param {IUserInputs=} [properties] Properties to set
     * @returns {UserInputs} UserInputs instance
     */
    UserInputs.create = function create(properties) {
        return new UserInputs(properties);
    };

    /**
     * Encodes the specified UserInputs message. Does not implicitly {@link UserInputs.verify|verify} messages.
     * @function encode
     * @memberof UserInputs
     * @static
     * @param {UserInputs} message UserInputs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserInputs.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.inputs != null && message.inputs.length)
            for (let i = 0; i < message.inputs.length; ++i)
                $root.Input.encode(message.inputs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified UserInputs message, length delimited. Does not implicitly {@link UserInputs.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserInputs
     * @static
     * @param {UserInputs} message UserInputs message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserInputs.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserInputs message from the specified reader or buffer.
     * @function decode
     * @memberof UserInputs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserInputs} UserInputs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserInputs.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserInputs();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.inputs && message.inputs.length))
                    message.inputs = [];
                message.inputs.push($root.Input.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a UserInputs message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserInputs
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserInputs} UserInputs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserInputs.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserInputs message.
     * @function verify
     * @memberof UserInputs
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserInputs.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.inputs != null && message.hasOwnProperty("inputs")) {
            if (!Array.isArray(message.inputs))
                return "inputs: array expected";
            for (let i = 0; i < message.inputs.length; ++i) {
                let error = $root.Input.verify(message.inputs[i]);
                if (error)
                    return "inputs." + error;
            }
        }
        return null;
    };

    /**
     * Creates a UserInputs message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserInputs
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserInputs} UserInputs
     */
    UserInputs.fromObject = function fromObject(object) {
        if (object instanceof $root.UserInputs)
            return object;
        let message = new $root.UserInputs();
        if (object.inputs) {
            if (!Array.isArray(object.inputs))
                throw TypeError(".UserInputs.inputs: array expected");
            message.inputs = [];
            for (let i = 0; i < object.inputs.length; ++i) {
                if (typeof object.inputs[i] !== "object")
                    throw TypeError(".UserInputs.inputs: object expected");
                message.inputs[i] = $root.Input.fromObject(object.inputs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a UserInputs message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserInputs
     * @static
     * @param {UserInputs} message UserInputs
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserInputs.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.inputs = [];
        if (message.inputs && message.inputs.length) {
            object.inputs = [];
            for (let j = 0; j < message.inputs.length; ++j)
                object.inputs[j] = $root.Input.toObject(message.inputs[j], options);
        }
        return object;
    };

    /**
     * Converts this UserInputs to JSON.
     * @function toJSON
     * @memberof UserInputs
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserInputs.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UserInputs;
})();

/**
 * Mode enum.
 * @exports Mode
 * @enum {number}
 * @property {number} IDLE=0 IDLE value
 * @property {number} AUTO=1 AUTO value
 * @property {number} TELEOP=2 TELEOP value
 * @property {number} ESTOP=3 ESTOP value
 */
export const Mode = $root.Mode = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "IDLE"] = 0;
    values[valuesById[1] = "AUTO"] = 1;
    values[valuesById[2] = "TELEOP"] = 2;
    values[valuesById[3] = "ESTOP"] = 3;
    return values;
})();

export const RunMode = $root.RunMode = (() => {

    /**
     * Properties of a RunMode.
     * @exports IRunMode
     * @interface IRunMode
     * @property {Mode|null} [mode] RunMode mode
     */

    /**
     * Constructs a new RunMode.
     * @exports RunMode
     * @classdesc Represents a RunMode.
     * @implements IRunMode
     * @constructor
     * @param {IRunMode=} [properties] Properties to set
     */
    function RunMode(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RunMode mode.
     * @member {Mode} mode
     * @memberof RunMode
     * @instance
     */
    RunMode.prototype.mode = 0;

    /**
     * Creates a new RunMode instance using the specified properties.
     * @function create
     * @memberof RunMode
     * @static
     * @param {IRunMode=} [properties] Properties to set
     * @returns {RunMode} RunMode instance
     */
    RunMode.create = function create(properties) {
        return new RunMode(properties);
    };

    /**
     * Encodes the specified RunMode message. Does not implicitly {@link RunMode.verify|verify} messages.
     * @function encode
     * @memberof RunMode
     * @static
     * @param {RunMode} message RunMode message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RunMode.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.mode);
        return writer;
    };

    /**
     * Encodes the specified RunMode message, length delimited. Does not implicitly {@link RunMode.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RunMode
     * @static
     * @param {RunMode} message RunMode message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RunMode.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RunMode message from the specified reader or buffer.
     * @function decode
     * @memberof RunMode
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RunMode} RunMode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RunMode.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.RunMode();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.mode = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RunMode message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RunMode
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RunMode} RunMode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RunMode.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RunMode message.
     * @function verify
     * @memberof RunMode
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RunMode.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.mode != null && message.hasOwnProperty("mode"))
            switch (message.mode) {
            default:
                return "mode: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        return null;
    };

    /**
     * Creates a RunMode message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RunMode
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RunMode} RunMode
     */
    RunMode.fromObject = function fromObject(object) {
        if (object instanceof $root.RunMode)
            return object;
        let message = new $root.RunMode();
        switch (object.mode) {
        case "IDLE":
        case 0:
            message.mode = 0;
            break;
        case "AUTO":
        case 1:
            message.mode = 1;
            break;
        case "TELEOP":
        case 2:
            message.mode = 2;
            break;
        case "ESTOP":
        case 3:
            message.mode = 3;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a RunMode message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RunMode
     * @static
     * @param {RunMode} message RunMode
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RunMode.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.mode = options.enums === String ? "IDLE" : 0;
        if (message.mode != null && message.hasOwnProperty("mode"))
            object.mode = options.enums === String ? $root.Mode[message.mode] : message.mode;
        return object;
    };

    /**
     * Converts this RunMode to JSON.
     * @function toJSON
     * @memberof RunMode
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RunMode.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RunMode;
})();

export const RuntimeStatus = $root.RuntimeStatus = (() => {

    /**
     * Properties of a RuntimeStatus.
     * @exports IRuntimeStatus
     * @interface IRuntimeStatus
     * @property {boolean|null} [shepConnected] RuntimeStatus shepConnected
     * @property {boolean|null} [dawnConnected] RuntimeStatus dawnConnected
     * @property {Mode|null} [mode] RuntimeStatus mode
     * @property {number|null} [battery] RuntimeStatus battery
     * @property {string|null} [version] RuntimeStatus version
     */

    /**
     * Constructs a new RuntimeStatus.
     * @exports RuntimeStatus
     * @classdesc Represents a RuntimeStatus.
     * @implements IRuntimeStatus
     * @constructor
     * @param {IRuntimeStatus=} [properties] Properties to set
     */
    function RuntimeStatus(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RuntimeStatus shepConnected.
     * @member {boolean} shepConnected
     * @memberof RuntimeStatus
     * @instance
     */
    RuntimeStatus.prototype.shepConnected = false;

    /**
     * RuntimeStatus dawnConnected.
     * @member {boolean} dawnConnected
     * @memberof RuntimeStatus
     * @instance
     */
    RuntimeStatus.prototype.dawnConnected = false;

    /**
     * RuntimeStatus mode.
     * @member {Mode} mode
     * @memberof RuntimeStatus
     * @instance
     */
    RuntimeStatus.prototype.mode = 0;

    /**
     * RuntimeStatus battery.
     * @member {number} battery
     * @memberof RuntimeStatus
     * @instance
     */
    RuntimeStatus.prototype.battery = 0;

    /**
     * RuntimeStatus version.
     * @member {string} version
     * @memberof RuntimeStatus
     * @instance
     */
    RuntimeStatus.prototype.version = "";

    /**
     * Creates a new RuntimeStatus instance using the specified properties.
     * @function create
     * @memberof RuntimeStatus
     * @static
     * @param {IRuntimeStatus=} [properties] Properties to set
     * @returns {RuntimeStatus} RuntimeStatus instance
     */
    RuntimeStatus.create = function create(properties) {
        return new RuntimeStatus(properties);
    };

    /**
     * Encodes the specified RuntimeStatus message. Does not implicitly {@link RuntimeStatus.verify|verify} messages.
     * @function encode
     * @memberof RuntimeStatus
     * @static
     * @param {RuntimeStatus} message RuntimeStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RuntimeStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.shepConnected != null && Object.hasOwnProperty.call(message, "shepConnected"))
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.shepConnected);
        if (message.dawnConnected != null && Object.hasOwnProperty.call(message, "dawnConnected"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.dawnConnected);
        if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.mode);
        if (message.battery != null && Object.hasOwnProperty.call(message, "battery"))
            writer.uint32(/* id 4, wireType 5 =*/37).float(message.battery);
        if (message.version != null && Object.hasOwnProperty.call(message, "version"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.version);
        return writer;
    };

    /**
     * Encodes the specified RuntimeStatus message, length delimited. Does not implicitly {@link RuntimeStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RuntimeStatus
     * @static
     * @param {RuntimeStatus} message RuntimeStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RuntimeStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RuntimeStatus message from the specified reader or buffer.
     * @function decode
     * @memberof RuntimeStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RuntimeStatus} RuntimeStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RuntimeStatus.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.RuntimeStatus();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.shepConnected = reader.bool();
                break;
            case 2:
                message.dawnConnected = reader.bool();
                break;
            case 3:
                message.mode = reader.int32();
                break;
            case 4:
                message.battery = reader.float();
                break;
            case 5:
                message.version = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RuntimeStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RuntimeStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RuntimeStatus} RuntimeStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RuntimeStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RuntimeStatus message.
     * @function verify
     * @memberof RuntimeStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RuntimeStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.shepConnected != null && message.hasOwnProperty("shepConnected"))
            if (typeof message.shepConnected !== "boolean")
                return "shepConnected: boolean expected";
        if (message.dawnConnected != null && message.hasOwnProperty("dawnConnected"))
            if (typeof message.dawnConnected !== "boolean")
                return "dawnConnected: boolean expected";
        if (message.mode != null && message.hasOwnProperty("mode"))
            switch (message.mode) {
            default:
                return "mode: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.battery != null && message.hasOwnProperty("battery"))
            if (typeof message.battery !== "number")
                return "battery: number expected";
        if (message.version != null && message.hasOwnProperty("version"))
            if (!$util.isString(message.version))
                return "version: string expected";
        return null;
    };

    /**
     * Creates a RuntimeStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RuntimeStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RuntimeStatus} RuntimeStatus
     */
    RuntimeStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.RuntimeStatus)
            return object;
        let message = new $root.RuntimeStatus();
        if (object.shepConnected != null)
            message.shepConnected = Boolean(object.shepConnected);
        if (object.dawnConnected != null)
            message.dawnConnected = Boolean(object.dawnConnected);
        switch (object.mode) {
        case "IDLE":
        case 0:
            message.mode = 0;
            break;
        case "AUTO":
        case 1:
            message.mode = 1;
            break;
        case "TELEOP":
        case 2:
            message.mode = 2;
            break;
        case "ESTOP":
        case 3:
            message.mode = 3;
            break;
        }
        if (object.battery != null)
            message.battery = Number(object.battery);
        if (object.version != null)
            message.version = String(object.version);
        return message;
    };

    /**
     * Creates a plain object from a RuntimeStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RuntimeStatus
     * @static
     * @param {RuntimeStatus} message RuntimeStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RuntimeStatus.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.shepConnected = false;
            object.dawnConnected = false;
            object.mode = options.enums === String ? "IDLE" : 0;
            object.battery = 0;
            object.version = "";
        }
        if (message.shepConnected != null && message.hasOwnProperty("shepConnected"))
            object.shepConnected = message.shepConnected;
        if (message.dawnConnected != null && message.hasOwnProperty("dawnConnected"))
            object.dawnConnected = message.dawnConnected;
        if (message.mode != null && message.hasOwnProperty("mode"))
            object.mode = options.enums === String ? $root.Mode[message.mode] : message.mode;
        if (message.battery != null && message.hasOwnProperty("battery"))
            object.battery = options.json && !isFinite(message.battery) ? String(message.battery) : message.battery;
        if (message.version != null && message.hasOwnProperty("version"))
            object.version = message.version;
        return object;
    };

    /**
     * Converts this RuntimeStatus to JSON.
     * @function toJSON
     * @memberof RuntimeStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RuntimeStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RuntimeStatus;
})();

/**
 * Pos enum.
 * @exports Pos
 * @enum {number}
 * @property {number} LEFT=0 LEFT value
 * @property {number} RIGHT=1 RIGHT value
 */
export const Pos = $root.Pos = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "LEFT"] = 0;
    values[valuesById[1] = "RIGHT"] = 1;
    return values;
})();

export const StartPos = $root.StartPos = (() => {

    /**
     * Properties of a StartPos.
     * @exports IStartPos
     * @interface IStartPos
     * @property {Pos|null} [pos] StartPos pos
     */

    /**
     * Constructs a new StartPos.
     * @exports StartPos
     * @classdesc Represents a StartPos.
     * @implements IStartPos
     * @constructor
     * @param {IStartPos=} [properties] Properties to set
     */
    function StartPos(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * StartPos pos.
     * @member {Pos} pos
     * @memberof StartPos
     * @instance
     */
    StartPos.prototype.pos = 0;

    /**
     * Creates a new StartPos instance using the specified properties.
     * @function create
     * @memberof StartPos
     * @static
     * @param {IStartPos=} [properties] Properties to set
     * @returns {StartPos} StartPos instance
     */
    StartPos.create = function create(properties) {
        return new StartPos(properties);
    };

    /**
     * Encodes the specified StartPos message. Does not implicitly {@link StartPos.verify|verify} messages.
     * @function encode
     * @memberof StartPos
     * @static
     * @param {StartPos} message StartPos message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StartPos.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pos);
        return writer;
    };

    /**
     * Encodes the specified StartPos message, length delimited. Does not implicitly {@link StartPos.verify|verify} messages.
     * @function encodeDelimited
     * @memberof StartPos
     * @static
     * @param {StartPos} message StartPos message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StartPos.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a StartPos message from the specified reader or buffer.
     * @function decode
     * @memberof StartPos
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {StartPos} StartPos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StartPos.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.StartPos();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.pos = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a StartPos message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof StartPos
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {StartPos} StartPos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StartPos.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a StartPos message.
     * @function verify
     * @memberof StartPos
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    StartPos.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.pos != null && message.hasOwnProperty("pos"))
            switch (message.pos) {
            default:
                return "pos: enum value expected";
            case 0:
            case 1:
                break;
            }
        return null;
    };

    /**
     * Creates a StartPos message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StartPos
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {StartPos} StartPos
     */
    StartPos.fromObject = function fromObject(object) {
        if (object instanceof $root.StartPos)
            return object;
        let message = new $root.StartPos();
        switch (object.pos) {
        case "LEFT":
        case 0:
            message.pos = 0;
            break;
        case "RIGHT":
        case 1:
            message.pos = 1;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a StartPos message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StartPos
     * @static
     * @param {StartPos} message StartPos
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StartPos.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.pos = options.enums === String ? "LEFT" : 0;
        if (message.pos != null && message.hasOwnProperty("pos"))
            object.pos = options.enums === String ? $root.Pos[message.pos] : message.pos;
        return object;
    };

    /**
     * Converts this StartPos to JSON.
     * @function toJSON
     * @memberof StartPos
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StartPos.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StartPos;
})();

export const Text = $root.Text = (() => {

    /**
     * Properties of a Text.
     * @exports IText
     * @interface IText
     * @property {Array.<string>|null} [payload] Text payload
     */

    /**
     * Constructs a new Text.
     * @exports Text
     * @classdesc Represents a Text.
     * @implements IText
     * @constructor
     * @param {IText=} [properties] Properties to set
     */
    function Text(properties) {
        this.payload = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Text payload.
     * @member {Array.<string>} payload
     * @memberof Text
     * @instance
     */
    Text.prototype.payload = $util.emptyArray;

    /**
     * Creates a new Text instance using the specified properties.
     * @function create
     * @memberof Text
     * @static
     * @param {IText=} [properties] Properties to set
     * @returns {Text} Text instance
     */
    Text.create = function create(properties) {
        return new Text(properties);
    };

    /**
     * Encodes the specified Text message. Does not implicitly {@link Text.verify|verify} messages.
     * @function encode
     * @memberof Text
     * @static
     * @param {Text} message Text message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Text.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.payload != null && message.payload.length)
            for (let i = 0; i < message.payload.length; ++i)
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.payload[i]);
        return writer;
    };

    /**
     * Encodes the specified Text message, length delimited. Does not implicitly {@link Text.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Text
     * @static
     * @param {Text} message Text message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Text.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Text message from the specified reader or buffer.
     * @function decode
     * @memberof Text
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Text} Text
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Text.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Text();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.payload && message.payload.length))
                    message.payload = [];
                message.payload.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Text message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Text
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Text} Text
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Text.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Text message.
     * @function verify
     * @memberof Text
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Text.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.payload != null && message.hasOwnProperty("payload")) {
            if (!Array.isArray(message.payload))
                return "payload: array expected";
            for (let i = 0; i < message.payload.length; ++i)
                if (!$util.isString(message.payload[i]))
                    return "payload: string[] expected";
        }
        return null;
    };

    /**
     * Creates a Text message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Text
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Text} Text
     */
    Text.fromObject = function fromObject(object) {
        if (object instanceof $root.Text)
            return object;
        let message = new $root.Text();
        if (object.payload) {
            if (!Array.isArray(object.payload))
                throw TypeError(".Text.payload: array expected");
            message.payload = [];
            for (let i = 0; i < object.payload.length; ++i)
                message.payload[i] = String(object.payload[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a Text message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Text
     * @static
     * @param {Text} message Text
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Text.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.payload = [];
        if (message.payload && message.payload.length) {
            object.payload = [];
            for (let j = 0; j < message.payload.length; ++j)
                object.payload[j] = message.payload[j];
        }
        return object;
    };

    /**
     * Converts this Text to JSON.
     * @function toJSON
     * @memberof Text
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Text.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Text;
})();

export const TimeStamps = $root.TimeStamps = (() => {

    /**
     * Properties of a TimeStamps.
     * @exports ITimeStamps
     * @interface ITimeStamps
     * @property {number|Long|null} [dawnTimestamp] TimeStamps dawnTimestamp
     * @property {number|Long|null} [runtimeTimestamp] TimeStamps runtimeTimestamp
     */

    /**
     * Constructs a new TimeStamps.
     * @exports TimeStamps
     * @classdesc Represents a TimeStamps.
     * @implements ITimeStamps
     * @constructor
     * @param {ITimeStamps=} [properties] Properties to set
     */
    function TimeStamps(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TimeStamps dawnTimestamp.
     * @member {number|Long} dawnTimestamp
     * @memberof TimeStamps
     * @instance
     */
    TimeStamps.prototype.dawnTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * TimeStamps runtimeTimestamp.
     * @member {number|Long} runtimeTimestamp
     * @memberof TimeStamps
     * @instance
     */
    TimeStamps.prototype.runtimeTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new TimeStamps instance using the specified properties.
     * @function create
     * @memberof TimeStamps
     * @static
     * @param {ITimeStamps=} [properties] Properties to set
     * @returns {TimeStamps} TimeStamps instance
     */
    TimeStamps.create = function create(properties) {
        return new TimeStamps(properties);
    };

    /**
     * Encodes the specified TimeStamps message. Does not implicitly {@link TimeStamps.verify|verify} messages.
     * @function encode
     * @memberof TimeStamps
     * @static
     * @param {TimeStamps} message TimeStamps message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TimeStamps.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.dawnTimestamp != null && Object.hasOwnProperty.call(message, "dawnTimestamp"))
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.dawnTimestamp);
        if (message.runtimeTimestamp != null && Object.hasOwnProperty.call(message, "runtimeTimestamp"))
            writer.uint32(/* id 2, wireType 1 =*/17).fixed64(message.runtimeTimestamp);
        return writer;
    };

    /**
     * Encodes the specified TimeStamps message, length delimited. Does not implicitly {@link TimeStamps.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TimeStamps
     * @static
     * @param {TimeStamps} message TimeStamps message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TimeStamps.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TimeStamps message from the specified reader or buffer.
     * @function decode
     * @memberof TimeStamps
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TimeStamps} TimeStamps
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TimeStamps.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.TimeStamps();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.dawnTimestamp = reader.fixed64();
                break;
            case 2:
                message.runtimeTimestamp = reader.fixed64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TimeStamps message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TimeStamps
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TimeStamps} TimeStamps
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TimeStamps.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TimeStamps message.
     * @function verify
     * @memberof TimeStamps
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TimeStamps.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.dawnTimestamp != null && message.hasOwnProperty("dawnTimestamp"))
            if (!$util.isInteger(message.dawnTimestamp) && !(message.dawnTimestamp && $util.isInteger(message.dawnTimestamp.low) && $util.isInteger(message.dawnTimestamp.high)))
                return "dawnTimestamp: integer|Long expected";
        if (message.runtimeTimestamp != null && message.hasOwnProperty("runtimeTimestamp"))
            if (!$util.isInteger(message.runtimeTimestamp) && !(message.runtimeTimestamp && $util.isInteger(message.runtimeTimestamp.low) && $util.isInteger(message.runtimeTimestamp.high)))
                return "runtimeTimestamp: integer|Long expected";
        return null;
    };

    /**
     * Creates a TimeStamps message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TimeStamps
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TimeStamps} TimeStamps
     */
    TimeStamps.fromObject = function fromObject(object) {
        if (object instanceof $root.TimeStamps)
            return object;
        let message = new $root.TimeStamps();
        if (object.dawnTimestamp != null)
            if ($util.Long)
                (message.dawnTimestamp = $util.Long.fromValue(object.dawnTimestamp)).unsigned = false;
            else if (typeof object.dawnTimestamp === "string")
                message.dawnTimestamp = parseInt(object.dawnTimestamp, 10);
            else if (typeof object.dawnTimestamp === "number")
                message.dawnTimestamp = object.dawnTimestamp;
            else if (typeof object.dawnTimestamp === "object")
                message.dawnTimestamp = new $util.LongBits(object.dawnTimestamp.low >>> 0, object.dawnTimestamp.high >>> 0).toNumber();
        if (object.runtimeTimestamp != null)
            if ($util.Long)
                (message.runtimeTimestamp = $util.Long.fromValue(object.runtimeTimestamp)).unsigned = false;
            else if (typeof object.runtimeTimestamp === "string")
                message.runtimeTimestamp = parseInt(object.runtimeTimestamp, 10);
            else if (typeof object.runtimeTimestamp === "number")
                message.runtimeTimestamp = object.runtimeTimestamp;
            else if (typeof object.runtimeTimestamp === "object")
                message.runtimeTimestamp = new $util.LongBits(object.runtimeTimestamp.low >>> 0, object.runtimeTimestamp.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a TimeStamps message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TimeStamps
     * @static
     * @param {TimeStamps} message TimeStamps
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TimeStamps.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.dawnTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.dawnTimestamp = options.longs === String ? "0" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.runtimeTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.runtimeTimestamp = options.longs === String ? "0" : 0;
        }
        if (message.dawnTimestamp != null && message.hasOwnProperty("dawnTimestamp"))
            if (typeof message.dawnTimestamp === "number")
                object.dawnTimestamp = options.longs === String ? String(message.dawnTimestamp) : message.dawnTimestamp;
            else
                object.dawnTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.dawnTimestamp) : options.longs === Number ? new $util.LongBits(message.dawnTimestamp.low >>> 0, message.dawnTimestamp.high >>> 0).toNumber() : message.dawnTimestamp;
        if (message.runtimeTimestamp != null && message.hasOwnProperty("runtimeTimestamp"))
            if (typeof message.runtimeTimestamp === "number")
                object.runtimeTimestamp = options.longs === String ? String(message.runtimeTimestamp) : message.runtimeTimestamp;
            else
                object.runtimeTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.runtimeTimestamp) : options.longs === Number ? new $util.LongBits(message.runtimeTimestamp.low >>> 0, message.runtimeTimestamp.high >>> 0).toNumber() : message.runtimeTimestamp;
        return object;
    };

    /**
     * Converts this TimeStamps to JSON.
     * @function toJSON
     * @memberof TimeStamps
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TimeStamps.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TimeStamps;
})();

export { $root as default };
