import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { Context } from '../types'
import { CustomError } from '../errorHandling/costomError'
import { Service } from 'typedi'

@Service()
export class CheckIsParent implements MiddlewareInterface<Context> {
  async use({ context: { isParent } }: ResolverData<Context>, next: NextFn): Promise<NextFn> {
    if (!isParent) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    return next()
  }
}
