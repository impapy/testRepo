import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { UserService } from '../user/User'
import { Authenticate } from '../../common/middleware/authenticate'
import { CheckIsStudent } from '../../common/middleware/checkIsStudent'
import { Context } from '../../common/types'
import { User } from '../user/types'
import { BookedSession, BookedSessionAddInput, BookedSessionsGetInput, BookedSessionsGetResponse } from './types'
import { BookedSessionService } from './BookedSession'
import { ClasseService } from '../classe/Classe'
import { CustomError } from '../../common/errorHandling/costomError'
import { BookingType, Classe } from '../classe/types'
import { ReservType, Session } from '../session/types'
import { SessionService } from '../session/Session'
import { CheckItsStudentOrAdminTeacher } from '../../common/middleware/checkIsStudentOrIsTeacher'

@Service()
@Resolver(() => BookedSession)
export class BookedSessionResolver {
  constructor(
    private readonly bookedSessionService: BookedSessionService,
    private readonly userService: UserService,
    private readonly classeService: ClasseService,
    private readonly sessionService: SessionService,
  ) {}

  @UseMiddleware(Authenticate, CheckItsStudentOrAdminTeacher)
  @Mutation(() => ObjectId)
  async bookedInstantSessionAdd(@Arg('input') input: BookedSessionAddInput, @Ctx() ctx: Context): Promise<ObjectId> {
    const baseclass = await this.classeService.one({ _id: input.classeId })
    if (!baseclass) throw new CustomError('NOT_FOUND')
    if (baseclass.bookingType === BookingType.INSTANT_BOOK && baseclass.reservType === ReservType.PRIVATE)
      return await this.bookedSessionService.bookedInstantSessionAdd({ ...input, studentId: ctx.payload!.user, teacherId: baseclass.userId }, baseclass)
    if (baseclass.bookingType === BookingType.BOOK_GROUP && baseclass.reservType === ReservType.GROUP)
      return await this.bookedSessionService.bookedGroupSessionAdd({ ...input, studentId: ctx.payload!.user, teacherId: baseclass.userId })
    if (baseclass.bookingType === BookingType.REQUEST_BOOK && baseclass.reservType === ReservType.PRIVATE) {
      if (!input.studentId || !input.requestsBookId) throw new CustomError('NOT_FOUND_STUDENT')
      return await this.bookedSessionService.bookedRequestSessionAdd({ ...input, studentId: input.studentId, teacherId: baseclass.userId }, baseclass)
    }
    throw new CustomError('NOT_FOUND')
  }

  @UseMiddleware(Authenticate)
  @Query(() => BookedSessionsGetResponse)
  async bookedSessions(
    @Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: BookedSessionsGetInput,
    @Ctx() ctx: Context,
  ): Promise<BookedSessionsGetResponse> {
    const userFilter = {
      ...(ctx.isStudent && { studentId: ctx.payload!.user }),
      ...(ctx.isTeacher && { teacherId: ctx.payload!.user }),
    }
    return await this.bookedSessionService.all({ ...filter, ...userFilter }, sort, page, perPage, [])
  }

  @Query(() => BookedSession, { nullable: true })
  async bookedSession(@Arg('bookedSessionId') _id: ObjectId): Promise<BookedSession | null> {
    return await this.bookedSessionService.one(_id)
  }

  @FieldResolver(() => User, { nullable: true })
  async student(@Root() bookedSession: BookedSession): Promise<User | null> {
    return this.userService.one({ _id: bookedSession.studentId })
  }

  @FieldResolver(() => User, { nullable: true })
  async teacher(@Root() bookedSession: BookedSession): Promise<User | null> {
    return this.userService.one({ _id: bookedSession.teacherId })
  }

  @FieldResolver(() => Classe, { nullable: true })
  async class(@Root() bookedSession: BookedSession): Promise<Classe | null> {
    return this.classeService.one({ _id: bookedSession.classeId })
  }

  @FieldResolver(() => Session, { nullable: true })
  async session(@Root() bookedSession: BookedSession): Promise<Session | null> {
    return this.sessionService.one({ _id: bookedSession.sessionId })
  }
}
