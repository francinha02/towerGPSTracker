import { Request } from 'express'
import { EntityTarget, getRepository, Repository } from 'typeorm'

import { BaseNotification } from '../database/entity/BaseNotification'

export abstract class BaseController<T> extends BaseNotification {
  private _repository: Repository<T>;
  private _onlyRootController = false;
  public errorRoot = {
    status: 401,
    errors: ['Voce não está autorizado a executar essa funcionalidade.']
  };

  constructor (entity: EntityTarget<T>, onlyRoot = false) {
    super()
    this._repository = getRepository<T>(entity)
    this._onlyRootController = onlyRoot
  }

  async all (selector: any[]) {
    return this._repository.find({
      where: {
        deleted: false
      },
      select: selector
    })
  }

  async one (request: Request, selector?: any[]) {
    const model = await this._repository.findOne(request.params.id, {
      select: selector,
      loadRelationIds: true
    })

    return (
      model || {
        status: 404,
        errors: ['Item não encontrado no bando de dados.']
      }
    )
  }

  async save (model: any, relations?: Array<string>) {
    if (model.id) {
      delete model.deleted
      delete model.createAt
      delete model.updateAt
      const _modelInDB = await this._repository.findOne(model.id, {
        relations
      })
      if (_modelInDB) {
        Object.assign(_modelInDB, model)
      }
    }

    return this.valid()
      ? await this._repository.save(model)
      : {
          status: 400,
          errors: this.allNotifications
        }
  }

  async remove (request: Request) {
    const id = request.params.id
    const model: any = await this._repository.findOne(id)
    if (model) model.deleted = true
    else {
      return {
        status: 404,
        errors: ['Item não encontrado no bando de dados.']
      }
    }
    return await this._repository.save(model)
  }

  get repository (): Repository<T> {
    return this._repository
  }
}
