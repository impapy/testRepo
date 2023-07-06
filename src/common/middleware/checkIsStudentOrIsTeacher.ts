import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { Context } from '../types'
import { CustomError } from '../errorHandling/costomError'
import { Service } from 'typedi'

@Service()
export class CheckItsStudentOrAdminTeacher implements MiddlewareInterface<Context> {
  async use({ context: { isStudent, isTeacher } }: ResolverData<Context>, next: NextFn): Promise<NextFn> {
    if (isStudent || isTeacher) return next()
    throw new CustomError('UNAUTHORIZED', 404)
  }
}
