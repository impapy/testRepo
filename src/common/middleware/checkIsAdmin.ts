import { MiddlewareFn, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
// import { CustomError } from '../../errorHandlers/customError'
import { Context } from '../types'
import { CustomError } from '../errorHandling/costomError'
import { Service } from 'typedi'

@Service()
export class CheckIsAdmin implements MiddlewareInterface<Context> {
  async use({ context: { isAdmin } }: ResolverData<Context>, next: NextFn): Promise<NextFn> {
    if (!isAdmin) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    return next()
  }
}
