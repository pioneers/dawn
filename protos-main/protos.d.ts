import * as $protobuf from "protobufjs";
/** Properties of a Param. */
export interface IParam {

    /** Param name */
    name?: (string|null);

    /** Param fval */
    fval?: (number|null);

    /** Param ival */
    ival?: (number|null);

    /** Param bval */
    bval?: (boolean|null);

    /** Param readonly */
    readonly?: (boolean|null);
}

/** Represents a Param. */
export class Param implements IParam {

    /**
     * Constructs a new Param.
     * @param [properties] Properties to set
     */
    constructor(properties?: IParam);

    /** Param name. */
    public name: string;

    /** Param fval. */
    public fval: number;

    /** Param ival. */
    public ival: number;

    /** Param bval. */
    public bval: boolean;

    /** Param readonly. */
    public readonly: boolean;

    /** Param val. */
    public val?: ("fval"|"ival"|"bval");

    /**
     * Creates a new Param instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Param instance
     */
    public static create(properties?: IParam): Param;

    /**
     * Encodes the specified Param message. Does not implicitly {@link Param.verify|verify} messages.
     * @param message Param message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Param, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Param message, length delimited. Does not implicitly {@link Param.verify|verify} messages.
     * @param message Param message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Param, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Param message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Param
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Param;

    /**
     * Decodes a Param message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Param
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Param;

    /**
     * Verifies a Param message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Param message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Param
     */
    public static fromObject(object: { [k: string]: any }): Param;

    /**
     * Creates a plain object from a Param message. Also converts values to other types if specified.
     * @param message Param
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Param, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Param to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Device. */
export interface IDevice {

    /** Device name */
    name?: (string|null);

    /** Device uid */
    uid?: (number|Long|null);

    /** Device type */
    type?: (number|null);

    /** Device params */
    params?: (Param[]|null);
}

/** Represents a Device. */
export class Device implements IDevice {

    /**
     * Constructs a new Device.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDevice);

    /** Device name. */
    public name: string;

    /** Device uid. */
    public uid: (number|Long);

    /** Device type. */
    public type: number;

    /** Device params. */
    public params: Param[];

    /**
     * Creates a new Device instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Device instance
     */
    public static create(properties?: IDevice): Device;

    /**
     * Encodes the specified Device message. Does not implicitly {@link Device.verify|verify} messages.
     * @param message Device message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Device, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Device message, length delimited. Does not implicitly {@link Device.verify|verify} messages.
     * @param message Device message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Device, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Device message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Device;

    /**
     * Decodes a Device message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Device;

    /**
     * Verifies a Device message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Device message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Device
     */
    public static fromObject(object: { [k: string]: any }): Device;

    /**
     * Creates a plain object from a Device message. Also converts values to other types if specified.
     * @param message Device
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Device, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Device to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DevData. */
export interface IDevData {

    /** DevData devices */
    devices?: (Device[]|null);
}

/** Represents a DevData. */
export class DevData implements IDevData {

    /**
     * Constructs a new DevData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDevData);

    /** DevData devices. */
    public devices: Device[];

    /**
     * Creates a new DevData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DevData instance
     */
    public static create(properties?: IDevData): DevData;

    /**
     * Encodes the specified DevData message. Does not implicitly {@link DevData.verify|verify} messages.
     * @param message DevData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: DevData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DevData message, length delimited. Does not implicitly {@link DevData.verify|verify} messages.
     * @param message DevData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: DevData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DevData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DevData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DevData;

    /**
     * Decodes a DevData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DevData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DevData;

    /**
     * Verifies a DevData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DevData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DevData
     */
    public static fromObject(object: { [k: string]: any }): DevData;

    /**
     * Creates a plain object from a DevData message. Also converts values to other types if specified.
     * @param message DevData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DevData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DevData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** State enum. */
export enum State {
    POISON_IVY = 0,
    DEHYDRATION = 1,
    HYPOTHERMIA_START = 2,
    HYPOTHERMIA_END = 3
}

/** Properties of a GameState. */
export interface IGameState {

    /** GameState state */
    state?: (State|null);
}

/** Represents a GameState. */
export class GameState implements IGameState {

    /**
     * Constructs a new GameState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameState);

    /** GameState state. */
    public state: State;

    /**
     * Creates a new GameState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameState instance
     */
    public static create(properties?: IGameState): GameState;

    /**
     * Encodes the specified GameState message. Does not implicitly {@link GameState.verify|verify} messages.
     * @param message GameState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: GameState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GameState message, length delimited. Does not implicitly {@link GameState.verify|verify} messages.
     * @param message GameState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: GameState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameState;

    /**
     * Decodes a GameState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameState;

    /**
     * Verifies a GameState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GameState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameState
     */
    public static fromObject(object: { [k: string]: any }): GameState;

    /**
     * Creates a plain object from a GameState message. Also converts values to other types if specified.
     * @param message GameState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GameState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GameState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Source enum. */
export enum Source {
    GAMEPAD = 0,
    KEYBOARD = 1
}

/** Properties of an Input. */
export interface IInput {

    /** Input connected */
    connected?: (boolean|null);

    /** Input buttons */
    buttons?: (number|Long|null);

    /** Input axes */
    axes?: (number[]|null);

    /** Input source */
    source?: (Source|null);
}

/** Represents an Input. */
export class Input implements IInput {

    /**
     * Constructs a new Input.
     * @param [properties] Properties to set
     */
    constructor(properties?: IInput);

    /** Input connected. */
    public connected: boolean;

    /** Input buttons. */
    public buttons: (number|Long);

    /** Input axes. */
    public axes: number[];

    /** Input source. */
    public source: Source;

    /**
     * Creates a new Input instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Input instance
     */
    public static create(properties?: IInput): Input;

    /**
     * Encodes the specified Input message. Does not implicitly {@link Input.verify|verify} messages.
     * @param message Input message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Input, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Input message, length delimited. Does not implicitly {@link Input.verify|verify} messages.
     * @param message Input message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Input, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Input message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Input
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Input;

    /**
     * Decodes an Input message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Input
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Input;

    /**
     * Verifies an Input message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Input message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Input
     */
    public static fromObject(object: { [k: string]: any }): Input;

    /**
     * Creates a plain object from an Input message. Also converts values to other types if specified.
     * @param message Input
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Input, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Input to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a UserInputs. */
export interface IUserInputs {

    /** UserInputs inputs */
    inputs?: (Input[]|null);
}

/** Represents a UserInputs. */
export class UserInputs implements IUserInputs {

    /**
     * Constructs a new UserInputs.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUserInputs);

    /** UserInputs inputs. */
    public inputs: Input[];

    /**
     * Creates a new UserInputs instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UserInputs instance
     */
    public static create(properties?: IUserInputs): UserInputs;

    /**
     * Encodes the specified UserInputs message. Does not implicitly {@link UserInputs.verify|verify} messages.
     * @param message UserInputs message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: UserInputs, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified UserInputs message, length delimited. Does not implicitly {@link UserInputs.verify|verify} messages.
     * @param message UserInputs message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: UserInputs, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a UserInputs message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UserInputs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): UserInputs;

    /**
     * Decodes a UserInputs message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UserInputs
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): UserInputs;

    /**
     * Verifies a UserInputs message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a UserInputs message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UserInputs
     */
    public static fromObject(object: { [k: string]: any }): UserInputs;

    /**
     * Creates a plain object from a UserInputs message. Also converts values to other types if specified.
     * @param message UserInputs
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UserInputs, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UserInputs to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Mode enum. */
export enum Mode {
    IDLE = 0,
    AUTO = 1,
    TELEOP = 2,
    ESTOP = 3
}

/** Properties of a RunMode. */
export interface IRunMode {

    /** RunMode mode */
    mode?: (Mode|null);
}

/** Represents a RunMode. */
export class RunMode implements IRunMode {

    /**
     * Constructs a new RunMode.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRunMode);

    /** RunMode mode. */
    public mode: Mode;

    /**
     * Creates a new RunMode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RunMode instance
     */
    public static create(properties?: IRunMode): RunMode;

    /**
     * Encodes the specified RunMode message. Does not implicitly {@link RunMode.verify|verify} messages.
     * @param message RunMode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: RunMode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RunMode message, length delimited. Does not implicitly {@link RunMode.verify|verify} messages.
     * @param message RunMode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: RunMode, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RunMode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RunMode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RunMode;

    /**
     * Decodes a RunMode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RunMode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RunMode;

    /**
     * Verifies a RunMode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RunMode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RunMode
     */
    public static fromObject(object: { [k: string]: any }): RunMode;

    /**
     * Creates a plain object from a RunMode message. Also converts values to other types if specified.
     * @param message RunMode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RunMode, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RunMode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a RuntimeStatus. */
export interface IRuntimeStatus {

    /** RuntimeStatus shepConnected */
    shepConnected?: (boolean|null);

    /** RuntimeStatus dawnConnected */
    dawnConnected?: (boolean|null);

    /** RuntimeStatus mode */
    mode?: (Mode|null);

    /** RuntimeStatus battery */
    battery?: (number|null);

    /** RuntimeStatus version */
    version?: (string|null);
}

/** Represents a RuntimeStatus. */
export class RuntimeStatus implements IRuntimeStatus {

    /**
     * Constructs a new RuntimeStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRuntimeStatus);

    /** RuntimeStatus shepConnected. */
    public shepConnected: boolean;

    /** RuntimeStatus dawnConnected. */
    public dawnConnected: boolean;

    /** RuntimeStatus mode. */
    public mode: Mode;

    /** RuntimeStatus battery. */
    public battery: number;

    /** RuntimeStatus version. */
    public version: string;

    /**
     * Creates a new RuntimeStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RuntimeStatus instance
     */
    public static create(properties?: IRuntimeStatus): RuntimeStatus;

    /**
     * Encodes the specified RuntimeStatus message. Does not implicitly {@link RuntimeStatus.verify|verify} messages.
     * @param message RuntimeStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: RuntimeStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RuntimeStatus message, length delimited. Does not implicitly {@link RuntimeStatus.verify|verify} messages.
     * @param message RuntimeStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: RuntimeStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RuntimeStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RuntimeStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RuntimeStatus;

    /**
     * Decodes a RuntimeStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RuntimeStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RuntimeStatus;

    /**
     * Verifies a RuntimeStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RuntimeStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RuntimeStatus
     */
    public static fromObject(object: { [k: string]: any }): RuntimeStatus;

    /**
     * Creates a plain object from a RuntimeStatus message. Also converts values to other types if specified.
     * @param message RuntimeStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RuntimeStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RuntimeStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Pos enum. */
export enum Pos {
    LEFT = 0,
    RIGHT = 1
}

/** Properties of a StartPos. */
export interface IStartPos {

    /** StartPos pos */
    pos?: (Pos|null);
}

/** Represents a StartPos. */
export class StartPos implements IStartPos {

    /**
     * Constructs a new StartPos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStartPos);

    /** StartPos pos. */
    public pos: Pos;

    /**
     * Creates a new StartPos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StartPos instance
     */
    public static create(properties?: IStartPos): StartPos;

    /**
     * Encodes the specified StartPos message. Does not implicitly {@link StartPos.verify|verify} messages.
     * @param message StartPos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: StartPos, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified StartPos message, length delimited. Does not implicitly {@link StartPos.verify|verify} messages.
     * @param message StartPos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: StartPos, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StartPos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StartPos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): StartPos;

    /**
     * Decodes a StartPos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StartPos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): StartPos;

    /**
     * Verifies a StartPos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a StartPos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StartPos
     */
    public static fromObject(object: { [k: string]: any }): StartPos;

    /**
     * Creates a plain object from a StartPos message. Also converts values to other types if specified.
     * @param message StartPos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: StartPos, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StartPos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Text. */
export interface IText {

    /** Text payload */
    payload?: (string[]|null);
}

/** Represents a Text. */
export class Text implements IText {

    /**
     * Constructs a new Text.
     * @param [properties] Properties to set
     */
    constructor(properties?: IText);

    /** Text payload. */
    public payload: string[];

    /**
     * Creates a new Text instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Text instance
     */
    public static create(properties?: IText): Text;

    /**
     * Encodes the specified Text message. Does not implicitly {@link Text.verify|verify} messages.
     * @param message Text message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: Text, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Text message, length delimited. Does not implicitly {@link Text.verify|verify} messages.
     * @param message Text message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: Text, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Text message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Text
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Text;

    /**
     * Decodes a Text message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Text
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Text;

    /**
     * Verifies a Text message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Text message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Text
     */
    public static fromObject(object: { [k: string]: any }): Text;

    /**
     * Creates a plain object from a Text message. Also converts values to other types if specified.
     * @param message Text
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Text, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Text to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a TimeStamps. */
export interface ITimeStamps {

    /** TimeStamps dawnTimestamp */
    dawnTimestamp?: (number|Long|null);

    /** TimeStamps runtimeTimestamp */
    runtimeTimestamp?: (number|Long|null);
}

/** Represents a TimeStamps. */
export class TimeStamps implements ITimeStamps {

    /**
     * Constructs a new TimeStamps.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITimeStamps);

    /** TimeStamps dawnTimestamp. */
    public dawnTimestamp: (number|Long);

    /** TimeStamps runtimeTimestamp. */
    public runtimeTimestamp: (number|Long);

    /**
     * Creates a new TimeStamps instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TimeStamps instance
     */
    public static create(properties?: ITimeStamps): TimeStamps;

    /**
     * Encodes the specified TimeStamps message. Does not implicitly {@link TimeStamps.verify|verify} messages.
     * @param message TimeStamps message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: TimeStamps, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TimeStamps message, length delimited. Does not implicitly {@link TimeStamps.verify|verify} messages.
     * @param message TimeStamps message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: TimeStamps, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TimeStamps message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TimeStamps
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TimeStamps;

    /**
     * Decodes a TimeStamps message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TimeStamps
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TimeStamps;

    /**
     * Verifies a TimeStamps message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TimeStamps message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TimeStamps
     */
    public static fromObject(object: { [k: string]: any }): TimeStamps;

    /**
     * Creates a plain object from a TimeStamps message. Also converts values to other types if specified.
     * @param message TimeStamps
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TimeStamps, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TimeStamps to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
