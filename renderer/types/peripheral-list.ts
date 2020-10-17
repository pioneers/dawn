import { Param } from "../../protos/protos";

export interface Peripheral {
  /** Device name */
  name: string;

  /** Device uid */
  uid: string;

  /** Device type */
  type: number;

  /** Device params */
  params: Param[];
}

export type PeripheralList = { [uid: string]: Peripheral };
