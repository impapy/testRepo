import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { Authenticate } from '../../common/middleware/authenticate'
import { CheckIsTeacher } from '../../common/middleware/checkIsTeacher'
import { Context } from '../../common/types'
import { MAX_AGE_2H } from '../../constants'
import { Classe } from '../classe/types'
import { ClasseService } from '../classe/Classe'
import { User, UsersGetInput, UsersGetResponse } from '../user/types'
import { UserService } from '../user/User'
import { CheckIsStudent } from '../../common/middleware/checkIsStudent'
import { FormatesDates, Session, SessionAddInput, SessionEditInput, SessionsGetInput, SessionsGetResponse, SessionsSort } from './types'
import { SessionService } from './Session'
import { CustomError } from '../../common/errorHandling/costomError'
import { BookedSessionService } from '../bookedSessions/BookedSession'
import { BookedSessionsGetInput, BookedSessionsGetResponse } from '../bookedSessions/types'

@Service()
@Resolver(() => Session)
export class SessionResolver {
  constructor(
    private readonly sessionService: SessionService,
    private readonly classeService: ClasseService,
    private readonly userService: UserService,
    private readonly bookedSessionService: BookedSessionService,
  ) {}

  @UseMiddleware(Authenticate, CheckIsTeacher)
  @Mutation(() => Session)
  async sessionAdd(@Arg('input') input: SessionAddInput, @Ctx() ctx: Context): Promise<Session> {
    // const allSessions = await this.sessionService.all({ classeId: input.classeId }, 1, 10, [], SessionsSort.NEWEST)
    // if (allSessions) {
    //   const totalSessionClasses = allSessions.pageInfo.total
    //   if (totalSessionClasses >= 5) throw new CustomError('MAXIMUM_SECTIONS_AT_CLASSES', 404)
    // }
    return await this.sessionService.add({ ...input, endDate: new Date(input.startDate.getTime() + input.duration * MAX_AGE_2H), userId: ctx.payload!.user })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => ObjectId)
  async sessionDelete(@Arg('sessionId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.sessionService.delete({ _id })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Session)
  async sessionEdit(@Arg('sessionId') _id: ObjectId, @Arg('update') update: SessionEditInput): Promise<Session> {
    let endDate: Date
    const session = await this.sessionService.one(_id)
    if (!session) throw new CustomError('NOT_FOUND', 404)
    else if (update.duration && !update.startDate) endDate = new Date(session.startDate.getTime() + update.duration * MAX_AGE_2H)
    else if (!update.duration && update.startDate) endDate = new Date(update.startDate.getTime() + session.duration * MAX_AGE_2H)
    else if (update.duration && update.startDate) endDate = new Date(update.startDate.getTime() + update.duration * MAX_AGE_2H)
    else endDate = session.endDate

    return await this.sessionService.edit({ _id }, { ...update, endDate: endDate as Date })
  }

  @UseMiddleware(Authenticate)
  @Query(() => SessionsGetResponse)
  async sessions(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: SessionsGetInput, @Ctx() ctx: Context): Promise<SessionsGetResponse> {
    return await this.sessionService.all({ ...filter, userId: ctx.payload!.user }, page, perPage, ['name'], sort)
  }

  @UseMiddleware(Authenticate)
  @Query(() => Session, { nullable: true })
  async session(@Arg('sessionId') _id: ObjectId): Promise<Session | null> {
    return await this.sessionService.one(_id)
  }

  @Query(() => Session, { nullable: true })
  async sessionUpcoming(@Arg('input', { defaultValue: {} }) { filter }: SessionsGetInput): Promise<Session | null> {
    const allSessions = await this.sessionService.all(filter, 1, 1, [], SessionsSort.UPCOMING)
    if (allSessions) return allSessions.nodes[0]
    else return null
  }

  @FieldResolver(() => Classe, { nullable: true })
  async classe(@Root() session: Session): Promise<Classe | null> {
    return this.classeService.one({ _id: session.classeId })
  }

  @FieldResolver(() => User, { nullable: true })
  async teacher(@Root() session: Session): Promise<User | null> {
    return this.userService.one({ _id: session.userId })
  }

  @FieldResolver(() => UsersGetResponse, { nullable: true })
  async studentsBooked(
    @Root() session: Session,
    @Arg('input', () => UsersGetInput, { defaultValue: {} }) { filter, sort, page, perPage }: UsersGetInput,
  ): Promise<UsersGetResponse | null> {
    if (!session.bookedStudenstIds) return null
    return this.userService.all({ ...filter, userId: session.bookedStudenstIds }, sort, page, perPage, ['name'])
  }

  @FieldResolver(() => FormatesDates, { nullable: true })
  async formatesDates(@Root() session: Session): Promise<FormatesDates | null> {
    return this.sessionService.formateDate(session.startDate, session.endDate)
  }

  @FieldResolver(() => BookedSessionsGetResponse)
  async bookings(
    @Root() session: Session,
    @Arg('input', () => BookedSessionsGetInput, { defaultValue: {} }) { filter, sort }: BookedSessionsGetInput,
  ): Promise<BookedSessionsGetResponse> {
    return this.bookedSessionService.all({ ...filter, sessionId: session._id }, sort, 1, 100, [])
  }
}
