import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { Authenticate } from '../../common/middleware/authenticate'
import { Context } from '../../common/types'
import { UserService } from '../user/User'
import { User } from '../user/types'
import { LoginInput, LoginResponse } from './types'
import { AccountService } from './Account'
import { CustomError } from '../../common/errorHandling/costomError'

@Service()
@Resolver()
class AccountResolver {
  constructor(private readonly accountService: AccountService, private readonly userService: UserService) {}

  @Mutation(() => LoginResponse)
  async login(@Arg('input') input: LoginInput): Promise<LoginResponse> {
    const account = await this.accountService.one({ username: input.username })

    if (!account) {
      throw new CustomError('NOT_FOUND', 404)
    }

    return await this.accountService.login(input, account)
  }

  @UseMiddleware(Authenticate)
  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User> {
    const user = await this.userService.one({ _id: ctx.payload!.user })
    if (!user) {
      throw new CustomError('NOT_FOUND', 404)
    }

    return user
  }
}

export default AccountResolver
