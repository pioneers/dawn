import { Param } from "../../protos/protos";

/** This `Peripheral` type is separate from the Device proto. 
 *  The main difference is the uid is a string to account for readability of numbers and 64-bit Longs.
 */
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
