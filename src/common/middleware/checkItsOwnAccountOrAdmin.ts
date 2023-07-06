import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { Context } from '../types'
import { CustomError } from '../errorHandling/costomError'
import { Service } from 'typedi'

@Service()
export class CheckItsOwnAccountOrAdmin implements MiddlewareInterface<Context> {
  async use({ context, args }: ResolverData<Context>, next: NextFn): Promise<NextFn> {
    const { isAdmin, isStudent, isParent, isTeacher, payload } = context
    if (((isStudent || isParent || isTeacher) && payload!.user + '' != args.userId) || (!isAdmin && !isStudent && !isParent && !isTeacher)) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    return next()
  }
}
