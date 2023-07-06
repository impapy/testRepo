import { MiddlewareFn, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { Context } from '../types'
import { CustomError } from '../errorHandling/costomError'
import { Service } from 'typedi'

@Service()
export class CheckIsTeacher implements MiddlewareInterface<Context> {
  async use({ context: { isTeacher } }: ResolverData<Context>, next: NextFn): Promise<NextFn> {
    if (!isTeacher) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    return next()
  }
}
