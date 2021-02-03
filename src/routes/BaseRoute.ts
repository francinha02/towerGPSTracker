import { NextFunction, Request, Response, Router } from 'express'

export class BaseRoute<T> {
  private static router = Router()

  public route (method: string, route: string, Controller: { new (...args: any[]): T}, action: string, ...args): void {
    BaseRoute.router[method](route, args, (req: Request, res: Response, next: NextFunction) => {
      const result = new Controller()[action](req, res, next)
      if (result instanceof Promise) {
        result.then((result) => {
          result && result.status
            ? res
                .status(
                  result.status >= 100 && result.status < 600
                    ? result.status
                    : 500
                )
                .json(result.message || result.errors)
            : res.json(result)
        })
      } else if (result !== null && result !== undefined) {
        res.json(result)
      }
    })
  }

  public getRouter (): Router {
    return BaseRoute.router
  }
}
