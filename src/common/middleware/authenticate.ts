import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql'
import { Service } from 'typedi'

// import { CustomError } from '../../errorHandlers/customError'
import { Context } from '../types'
import { UserService } from '../../modules/user/User'
import { CustomError } from '../errorHandling/costomError'

@Service()
export class Authenticate implements MiddlewareInterface<Context> {
  constructor(private readonly userService: UserService) {}

  async use({ context }: ResolverData<Context>, next: NextFn): Promise<NextFn> {
    if (!context.payload) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    const user = await this.userService.one({ _id: context.payload!.user })

    if (!user) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    return next()
  }
}
