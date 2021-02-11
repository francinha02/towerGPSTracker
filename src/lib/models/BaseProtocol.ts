import { AdapterTypes } from './adapter'
import Command from './Command'
import { Protocol } from './Protocol'

abstract class BaseProtocol implements Protocol {
  private name: string;
    private supportedDataCommands = new Array<string>();
    private supportedTextCommands = new Array<string>();
    private serverList = [];
    private textCommandEncoder = null;

    public nameFromClass (classe: AdapterTypes): string {
      return classe.Adapter.name.toLowerCase()
    }

    /**
     * getName
     */
    public getName (): string {
      return this.name
    }

    /**
     * addServer
     */
    public addServer (server: any): void {
      this.serverList.push(server)
    }

    /**
     * gerServerList
     */
    public getServerList (): any[] {
      return this.serverList
    }

    /**
   * setSupportedDataCommands
   */
    public setSupportedDataCommands (...commands: string[]) {
      this.supportedDataCommands.push(...commands)
    }

    /**
   * setSupportedDataCommands
   */
    public setSupportedTextCommands (...commands: string[]) {
      this.supportedTextCommands.push(...commands)
    }

    /**
     * getSupportedDataCommands
     */
    public getSupportedDataCommands (): Array<string> {
      const commands = this.supportedDataCommands
      commands.push(Command.TYPE_CUSTOM)
      return commands
    }

    /**
     * getSupportedTextCommands
     */
    public getSupportedTextCommands (): Array<string> {
      const commands = this.supportedTextCommands
      commands.push(Command.TYPE_CUSTOM)
      return commands
    }

    /**
     * sendTextCommand
     */
    public sendTextCommand (): void {
      //
    }

    /**
     * sendDataCommand
     */
    public sendDataCommand (): void {
      //
    }
}

export default BaseProtocol
