import ConfigKey from './ConfigKey'
import { KeyType } from './KeyType'

export default class ConfigSuffix<T> {
  private keySuffix: string;
  private types: Array<KeyType>;
  private defaultValue: T;

  constructor (keySuffix: string, types: Array<KeyType>) {
    this.configSuffix(keySuffix, types, null)
  }

  configSuffix (keySuffix: string, types: Array<KeyType>, defaultValue: T) {
    this.keySuffix = keySuffix
    this.types = types
    this.defaultValue = defaultValue
  }

  public withPrefix (prefix: string): ConfigKey<T> {
    return new ConfigKey<T>(prefix + this.keySuffix, this.types, this.defaultValue)
  }
}
