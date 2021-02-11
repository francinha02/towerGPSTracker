import { KeyType } from './KeyType'

export default class ConfigKey<T> {
  private key: string;
  private types: KeyType[];
  private defaultValue: T;

  constructor (key: string, types: KeyType[], defaultValue?: T) {
    this.key = key
    this.types = types
    this.defaultValue = defaultValue
  }

  getKey (): string {
    return this.key
  }

  /**
   * getTypes
   */
  public getTypes (): KeyType[] {
    return this.types
  }

  /**
   * getDefaultValue
   */
  public getDefaultValue (): T {
    return this.defaultValue
  }
}
