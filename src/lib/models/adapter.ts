import { Socket } from 'net'

import Device from '../device'
import { ParsedMsg } from './gt06'
import Position from './Position'

export interface Adapter {
  new (connection: Socket)
  decode: { (msg: Buffer): Promise<Position> };
  parseData: { (data: Buffer | any): ParsedMsg[] | any[] };
  clearMsgBuffer: { (): void };
  command: { (msg: Buffer, type: boolean): Buffer | any };
  setDevice: { (device: Device): void }
  getDevice: { (): Device }
}

export interface AdapterTypes {
  protocol: string,
  modelName: string,
  compatibleHardware: string[],
  Adapter: Adapter
}
