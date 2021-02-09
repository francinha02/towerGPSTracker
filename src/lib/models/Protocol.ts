import { Socket } from 'net'

export interface Protocol {
  getName(): string;
  getServerList(): Array<string>;
  getSupportedDataCommands(): Array<string>;
  sendDataCommand(chanel: Socket, command: string): void;
  getSupportedTextCommands(): Array<string>;
  sendTextCommand(destAddress: string, command: string): void;
}
