import { Parts } from '../models/gt06'

export const strPad = (input: string, length: number, string: string): string => {
  string = string || '0'
  input = input + ''
  return input.length >= length
    ? input
    : new Array(length - input.length + 1).join(string) + input
}

export const bufferToHexString = (buffer: string | Buffer | Parts): string => {
  let str = ''
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] < 16) {
      str += '0'
    }
    str += buffer[i].toString(16)
  }
  return str
}

export function zeroPad (nNum: number, nPad: number): string {
  return ('' + (Math.pow(10, nPad) + nNum)).slice(1)
}
