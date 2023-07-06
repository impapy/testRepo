import { MiddlewareFn, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { Context } from '../types'
import { CustomError } from '../errorHandling/costomError'
import { Service } from 'typedi'

@Service()
export class CheckIsStudent implements MiddlewareInterface<Context> {
  async use({ context: { isStudent } }: ResolverData<Context>, next: NextFn): Promise<NextFn> {
    if (!isStudent) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    return next()
  }
}
