
import { validateBr } from 'js-brasil'

export abstract class BaseNotification {
  notifications: Array<{ message: string }>;

  constructor () {
    // eslint-disable-next-line no-array-constructor
    this.notifications = new Array<{ message: string }>()
  }

  AddNotification (message: string): void {
    this.notifications.push({ message: message })
  }

  isTrue (value: boolean, message: string) {
    if (value) this.notifications.push({ message: message })
  }

  isRequired (value, message: string) {
    if (!value || value.length <= 0) { this.notifications.push({ message: message }) }
  }

  hasMinLen (value: string | any[], min: number, message: any) {
    if (!value || value.length < min) { this.notifications.push({ message: message }) }
  }

  hasMaxLen (value: string | any[], max: number, message: any) {
    if (!value || value.length > max) { this.notifications.push({ message: message }) }
  }

  isFixedLen (value: string | any[], len: any, message: any) {
    if (value.length !== len) this.notifications.push({ message: message })
  }

  isEmail (value: string, message: any) {
    if (!validateBr.email(value)) this.notifications.push({ message: message })
  }

  isCep (value: string, message: any) {
    if (!validateBr.cep(value)) this.notifications.push({ message: message })
  }

  isPhone (value: string, message: any) {
    if (!validateBr.celular(value)) this.notifications.push({ message: message })
  }

  isState (value: string, message: any) {
    const ESTADOS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
    if (!ESTADOS.includes(value)) this.notifications.push({ message: message })
  }

  isCPF (value: string, message: any) {
    if (!validateBr.cpf(value)) this.notifications.push({ message: message })
  }

  isCNPJ (value: string, message: any) {
    if (!validateBr.cnpj(value)) this.notifications.push({ message: message })
  }

  isDate (value: string, message: any) {
    if (!validateBr.data(value)) this.notifications.push({ message: message })
  }

  get allNotifications (): Array<{ message: string }> {
    return this.notifications
  }

  valid (): boolean {
    return this.notifications.length === 0
  }
}
