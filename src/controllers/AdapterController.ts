import { Request } from 'express'

import { Adapter } from '../database/entity/Adapter'
import {
  ModelType,
  MobileOperator,
  TimeZone
} from '../database/entity/enum/AdapterTypes'
import { BaseController } from './BaseController'

export class AdapterController extends BaseController<Adapter> {
  constructor () {
    super(Adapter)
  }

  async listAll () {
    const selector = ['code', 'model', 'equipmentNumber', 'id']
    const users = await this.all(selector)
    return users
  }

  async oneById (request: Request) {
    const users = await this.one(request)
    return users
  }

  async createAdapter (request: Request) {
    const _adapter = <Adapter>request.body

    super.isRequired(_adapter.code, 'O código do equipamento é obrigatório')
    if (_adapter.code < 0) { super.AddNotification('Código precisa ser um número positivo') }
    const codeValidator = await this.repository.findOne({
      where: { code: _adapter.code }
    })
    if (codeValidator) {
      super.AddNotification('Código duplicado')
    }

    // EQUIPMENT DESCRIPTION VALIDATION
    super.isRequired(_adapter.description, 'A descrição é obrigatória')
    super.hasMaxLen(
      _adapter.description,
      200,
      'Descrição precisa ter no máximo 200 caracteres.'
    )

    // EQUIPMENT MODEL VALIDATION
    super.isRequired(_adapter.model, 'O modelo é obrigatório')
    const valuesModels = Object.values(ModelType)
    if (!valuesModels.includes(_adapter.model)) {
      super.AddNotification('Modelo de equipamento inválido')
    }

    super.isRequired(
      _adapter.equipmentNumber,
      'O número do equipamento é obrigatório'
    )
    const equipValidator = await this.repository.findOne({
      where: { equipmentNumber: _adapter.equipmentNumber }
    })
    if (equipValidator) {
      super.AddNotification('Número de equipamento duplicado')
    }

    // PHONE NUMBER VALIDATION
    super.isRequired(_adapter.phone, 'O telefone é obrigatório')
    super.hasMinLen(_adapter.phone, 13, 'Telefone precisa ter 13 caracteres')
    super.hasMaxLen(_adapter.phone, 13, 'Telefone precisa ter 13 caracteres')
    if (_adapter.phone) {
      _adapter.phone.substring(0, 2) === '55'
        ? super.isPhone(_adapter.phone.substring(2), 'Telefone inválido')
        : super.AddNotification('Formato inválido')
      const phoneValidator = await this.repository.findOne({
        where: { phone: _adapter.phone }
      })
      if (phoneValidator) {
        super.AddNotification('Número de telefone duplicado')
      }
    }

    // MOBILE OPERATOR VALIDATION
    super.isRequired(_adapter.mobileOperator, 'A Operadora é obrigatória')
    const valuesOperator = Object.values(MobileOperator)
    if (!valuesOperator.includes(_adapter.mobileOperator)) {
      super.AddNotification('Operadora de telefonia inválida!')
    }

    // CHIP NUMBER VALIDATION
    super.isRequired(_adapter.chipNumber, 'O número do chip é obrigatório')
    super.hasMinLen(
      _adapter.chipNumber,
      20,
      'O número do chip precisa ter 20 caracteres'
    )
    super.hasMaxLen(
      _adapter.chipNumber,
      20,
      'O número do chip precisa ter 20 caracteres'
    )
    const chipValidator = await this.repository.findOne({
      where: { chipNumber: _adapter.chipNumber }
    })
    if (chipValidator) {
      super.AddNotification('Número do chip duplicado')
    }

    super.isRequired(_adapter.timezone, 'A correção do timezone é obrigatória')
    const valuesTimezone = Object.values(TimeZone)
    if (!valuesTimezone.includes(_adapter.timezone)) {
      super.AddNotification('Timezone inválida')
    }
    return super.save(_adapter, ['packet'])
  }
}
