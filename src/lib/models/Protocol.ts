export interface Protocol {
  getName(): string;
  getServerList(): Array<string>;
  getSupportedDataCommands(): Array<string>;
  sendCommand(chanel, socketAddress, command: string): void;
  getSupportedTextCommands(): Array<string>;
  sendTextCommand(destAddress: string, command: string): void;
}
