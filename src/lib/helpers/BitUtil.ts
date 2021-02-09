export default class BitUtil {
  public static check (number: number, index: number): boolean {
    return (number & (1 << index)) !== 0
  }

  public static between (number: number, from: number, to: number): number {
    return (number >> from) & ((1 << to - from) - 1)
  }

  public static from (number: number, from: number): number {
    return number >> from
  }

  public static to (number: number, to: number): number {
    return BitUtil.between(number, 0, to)
  }
}
