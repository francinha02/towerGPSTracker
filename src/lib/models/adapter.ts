import { ParsedMsg } from './gt06'

export interface Adapter {
  parseData: { (data: Buffer | any): ParsedMsg[] | any[] };
  clearMsgBuffer: { (): void };
  command: { (msg: Buffer, type: boolean): Buffer | any };
}
