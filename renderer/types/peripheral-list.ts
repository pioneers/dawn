import { Device } from "../../protos/protos";

export type PeripheralList = Array<{ [uid: string]: Device[] }>;
