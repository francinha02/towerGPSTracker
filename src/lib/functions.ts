export function strPad (input: string, length: number, string: string) {
  string = string || '0'
  input = input + ''
  return input.length >= length ? input : new Array(length - input.length + 1).join(string) + input
}
