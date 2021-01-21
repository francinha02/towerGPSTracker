export class ExtendedModel {
  private attributes: Map<string, boolean | string | number | any>

  constructor () {
    this.attributes = new Map()
  }

  /**
   * getAttributes
   */
  public getAttributes () {
    return this.attributes
  }

  /**
   * setAttributes
   */
  public setAttributes (attributes: Map<string, any>): void {
    this.attributes = attributes
  }

  /**
   * set
   */
  public set (key: string, value: any): void {
    if (value) {
      this.attributes.set(key, value)
    }
  }

  /**
   * add
   */
  public add (entry: Map<string, any>): void {
    if (entry && entry.size > 0) {
      for (const keyValue of entry.entries()) {
        this.attributes.set(keyValue[0], keyValue[1])
      }
    }
  }

  /**
   * getString
   */
  public getString (key: string) {
    const valid = <string> this.attributes.get(key)
    return valid || null
  }

  /**
   * getBoolean
   */
  public getBoolean (key: string) {
    const valid = <boolean> this.attributes.get(key)
    return valid || false
  }

  /**
   * getInteger
   */
  public getInteger (key: string) {
    const valid = parseInt(<string> this.attributes.get(key))
    return valid || 0
  }

  /**
   * getFloat
   */
  public getFloat (key: string) {
    const valid = parseFloat(<string> this.attributes.get(key))
    return valid || 0.0
  }
}
