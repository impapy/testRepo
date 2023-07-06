import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { Authenticate } from '../../common/middleware/authenticate'
import { CheckIsTeacher } from '../../common/middleware/checkIsTeacher'
import { Context } from '../../common/types'
import { Session, SessionsGetInput, SessionsGetResponse, SessionsSort } from '../session/types'
import { SessionService } from '../session/Session'
import { transaction } from '../../common/transaction'
import { User } from '../user/types'
import { UserService } from '../user/User'
import { ClasseReviewsGetInput, ClasseReviewsGetResponse } from '../classeReviews/types'
import { ClasseReviewService } from '../classeReviews/ClasseReviews'
import { ClassePaperService } from '../classePaper/ClassePaper'
import { ClassePapersGetInput, ClassePapersGetResponse } from '../classePaper/types'
import { Classe, ClasseAddInput, ClasseEditInput, ClassesGetInput, ClassesGetResponse } from './types'
import { ClasseService } from './Classe'
import { CustomError } from '../../common/errorHandling/costomError'
import { SubjectService } from '../subject/Subject'
import { EducationSystemService } from '../educationSystem/EducationSystem'
import { EducationSystemsGetInput, EducationSystemsGetResponse } from '../educationSystem/types'
import { CheckIsStudent } from '../../common/middleware/checkIsStudent'
import { CheckItsStudentOrAdminTeacher } from '../../common/middleware/checkIsStudentOrIsTeacher'

@Service()
@Resolver(() => Classe)
export class ClasseResolver {
  constructor(
    private readonly classeService: ClasseService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly classeReviewService: ClasseReviewService,
    private readonly classePaperService: ClassePaperService,
    private readonly educationSystemService: EducationSystemService,
  ) {}

  @UseMiddleware(Authenticate, CheckIsTeacher)
  @Mutation(() => Classe)
  async classeAdd(@Arg('input') input: ClasseAddInput, @Ctx() ctx: Context): Promise<Classe> {
    return await this.classeService.add(input, ctx)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => ObjectId)
  async classeDelete(@Arg('classeId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await transaction(async (session) => {
      await this.sessionService.deleteMany({ classeId: _id }, session)
      return await this.classeService.delete({ _id }, session)
    })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Classe)
  async classEdit(@Arg('classeId') _id: ObjectId, @Arg('update', { defaultValue: {} }) update: ClasseEditInput): Promise<Classe> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.classeService.edit({ _id }, update)
  }

  @UseMiddleware(Authenticate, CheckItsStudentOrAdminTeacher)
  @Query(() => ClassesGetResponse)
  async classes(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: ClassesGetInput): Promise<ClassesGetResponse> {
    return await this.classeService.all(filter, page, perPage, ['name'], sort)
  }

  @UseMiddleware(Authenticate, CheckItsStudentOrAdminTeacher)
  @Query(() => Classe, { nullable: true })
  async classe(@Arg('classeId') _id: ObjectId): Promise<Classe | null> {
    return await this.classeService.one(_id)
  }

  @FieldResolver(() => SessionsGetResponse)
  async sessions(
    @Root() classe: Classe,
    @Arg('input', () => SessionsGetInput, { defaultValue: {} }) { filter, page, perPage }: SessionsGetInput,
  ): Promise<SessionsGetResponse> {
    return this.sessionService.all({ ...filter, classeId: classe._id }, page, perPage, ['name'], SessionsSort.UPCOMING)
  }

  @FieldResolver(() => User, { nullable: true })
  async teacher(@Root() classe: Classe): Promise<User | null> {
    return this.userService.one({ _id: classe.userId })
  }

  @FieldResolver(() => EducationSystemsGetResponse)
  async educationSystem(
    @Root() classe: Classe,
    @Arg('input', () => ClasseReviewsGetInput, { defaultValue: {} }) { filter, sort, page, perPage }: EducationSystemsGetInput,
  ): Promise<EducationSystemsGetResponse> {
    return this.educationSystemService.all(
      { ...filter, _id: { $in: classe.educationSystemId && classe.educationSystemId.length ? (classe.educationSystemId as ObjectId[]) : [] } },
      sort,
      page,
      perPage,
      ['label'],
    )
  }

  @FieldResolver(() => ClasseReviewsGetResponse)
  async reviews(
    @Root() classe: Classe,
    @Arg('input', () => ClasseReviewsGetInput, { defaultValue: {} }) { filter, sort, page, perPage }: ClasseReviewsGetInput,
  ): Promise<ClasseReviewsGetResponse> {
    return this.classeReviewService.all({ ...filter, classeId: classe._id }, page, perPage, [], sort)
  }

  @FieldResolver(() => ClassePapersGetResponse)
  async papers(
    @Root() classe: Classe,
    @Arg('input', () => ClassePapersGetInput, { defaultValue: {} }) { filter, sort, page, perPage }: ClassePapersGetInput,
  ): Promise<ClassePapersGetResponse> {
    return this.classePaperService.all({ ...filter, classeId: classe._id }, sort, page, perPage, ['title'])
  }

  @FieldResolver(() => Session, { nullable: true })
  async sessionUpcoming(@Root() classe: Classe, @Arg('input', { defaultValue: {} }) { filter }: SessionsGetInput): Promise<Session | null> {
    const allSessions = await this.sessionService.all({ ...filter, classeId: classe._id }, 1, 1, [], SessionsSort.UPCOMING)
    if (allSessions) return allSessions.nodes[0]
    else return null
  }

  @FieldResolver(() => Number)
  async sessionsCountComming(@Root() classe: Classe, @Arg('input', { defaultValue: {} }) { filter, page, perPage }: SessionsGetInput): Promise<number> {
    const allSessions = await this.sessionService.all({ ...filter, classeId: classe._id, startDateNext: new Date() }, page, perPage, [])
    return allSessions.nodes.length
  }
}
