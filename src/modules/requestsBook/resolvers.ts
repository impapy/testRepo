import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { UserService } from '../user/User'
import { Authenticate } from '../../common/middleware/authenticate'
import { CheckIsStudent } from '../../common/middleware/checkIsStudent'
import { Context } from '../../common/types'
import { User } from '../user/types'
import { ClasseService } from '../classe/Classe'
import { CustomError } from '../../common/errorHandling/costomError'
import { Classe } from '../classe/types'
import { RequestsBook, RequestsBookAddInput, RequestsBookEditInput, RequestsBooksGetInput, RequestsBooksGetResponse } from './types'
import { RequestsBookService } from './RequestsBook'

@Service()
@Resolver(() => RequestsBook)
export class BookedSessionResolver {
  constructor(
    private readonly requestsBookService: RequestsBookService,
    private readonly classeService: ClasseService,
    private readonly userService: UserService,
  ) {}

  @UseMiddleware(Authenticate, CheckIsStudent)
  @Mutation(() => RequestsBook)
  async requestsBookAdd(@Arg('input') input: RequestsBookAddInput, @Ctx() ctx: Context): Promise<RequestsBook> {
    const baseclass = await this.classeService.one({ _id: input.classeId })
    if (!baseclass) throw new CustomError('NOT_FOUND')
    return await this.requestsBookService.add({
      ...input,
      studentId: ctx.payload!.user,
      teacherId: baseclass.userId,
      duration: Number(baseclass.duration),
    })
  }

  @Mutation(() => RequestsBook)
  async requestsBookEdit(@Arg('requestsBookId') _id: ObjectId, @Arg('update') update: RequestsBookEditInput): Promise<RequestsBook> {
    return await this.requestsBookService.edit({ _id }, update)
  }

  @Query(() => RequestsBooksGetResponse)
  async requestsBooks(
    @Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: RequestsBooksGetInput,
    @Ctx() ctx: Context,
  ): Promise<RequestsBooksGetResponse> {
    const userFilter = {
      ...(ctx.isStudent && { studentId: ctx.payload!.user }),
      ...(ctx.isTeacher && { teacherId: ctx.payload!.user }),
    }
    return await this.requestsBookService.all({ ...filter, ...userFilter }, sort, page, perPage, [])
  }

  @Query(() => RequestsBook, { nullable: true })
  async requestsBook(@Arg('requestsBookId') _id: ObjectId): Promise<RequestsBook | null> {
    return await this.requestsBookService.one(_id)
  }

  @FieldResolver(() => User, { nullable: true })
  async student(@Root() requestsBook: RequestsBook): Promise<User | null> {
    return this.userService.one({ _id: requestsBook.studentId })
  }

  @FieldResolver(() => User, { nullable: true })
  async teacher(@Root() bookedSession: RequestsBook): Promise<User | null> {
    return this.userService.one({ _id: bookedSession.teacherId })
  }

  @FieldResolver(() => Classe, { nullable: true })
  async class(@Root() bookedSession: RequestsBook): Promise<Classe | null> {
    return this.classeService.one({ _id: bookedSession.classeId })
  }
}
