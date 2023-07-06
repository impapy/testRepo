import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { AccountService } from '../account/Account'
import { Context, ResourcesSort } from '../../common/types'
import { Authenticate } from '../../common/middleware/authenticate'
import { transaction } from '../../common/transaction'
import {
  EmploymentRecord,
  TeachingInformation,
  TeachingInformationGetRequest,
  TeachingInformationgradeLevel,
  TeachingInformationsOutput,
  TeachingQualification,
  UniversityDegree,
  User,
  UserAddInput,
  UserEditInput,
  UsersGetInput,
  UsersGetResponse,
} from './types'
import { UserService } from './User'
import { CustomError } from '../../common/errorHandling/costomError'
import { EducationSystemService } from '../educationSystem/EducationSystem'
import { EducationSystem, EducationSystemsGetInput, EducationSystemsGetResponse } from '../educationSystem/types'
import { SubjectService } from '../subject/Subject'
import { Subject } from '../subject/types'

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly educationSystemService: EducationSystemService,
    private readonly subjectService: SubjectService,
  ) {}

  @Mutation(() => User)
  async userAdd(@Arg('input') input: UserAddInput, @Ctx() ctx: Context): Promise<User> {
    const possibleUser = await this.userService.one({
      email: input.email,
    })

    if (possibleUser) throw new CustomError('USER_EXISTS', 404)

    let user: User | null = null
    await transaction(async (session) => {
      user = await this.userService.add({ ...input, isActive: true }, session)

      await this.accountService.add(
        {
          user: user._id,
          username: input.email,
          password: input.password,
          userType: input.userType,
        },
        session,
      )
    })

    if (!user) throw new CustomError('ERROR_WHILE_CREATING_USER', 404)
    return user
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => ObjectId)
  async userDelete(@Arg('userId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.userService.delete({ _id })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => User)
  async userEdit(@Arg('userId') _id: ObjectId, @Arg('update') update: UserEditInput): Promise<User> {
    // teachingInformations
    const teachingInformations = update?.teachingInformation ? update.teachingInformation : []
    const teachingInformation = (await teachingInformations.map((item) => ({
      _id: item._id ? item._id : new ObjectId(),
      gradeLevel: item.gradeLevel?.map((grade) => ({ fromgrade: grade.fromgrade, tograde: grade.tograde })) as TeachingInformationgradeLevel[],
      price: item.price,
      educationSystemId: item.educationSystemId,
      subjectId: item.subjectId,
      examinationBoardType: item.examinationBoardType,
    }))) as TeachingInformation[]
    // universityDegrees
    const universityDegrees = update?.education?.universityDegree ? update.education.universityDegree : []
    const universityDegree = (await universityDegrees.map((item) => ({
      _id: new ObjectId(),
      certificate: item.certificate,
      institution: item.institution,
      date: item.date,
    }))) as UniversityDegree[]
    // teachingQualifications
    const teachingQualifications = update?.education?.teachingQualification ? update.education.teachingQualification : []
    const teachingQualification = (await teachingQualifications.map((item) => ({
      _id: new ObjectId(),
      certificate: item.certificate,
      institution: item.institution,
      date: item.date,
    }))) as TeachingQualification[]
    // employmentRecord
    const employmentRecords = update?.employmentRecord ? update.employmentRecord : []
    const employmentRecord = (await employmentRecords.map((item) => ({
      _id: new ObjectId(),
      ...item,
    }))) as EmploymentRecord[]
    return await this.userService.edit(
      { _id },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      {
        ...update,
        ...(teachingInformations.length && { teachingInformation: teachingInformation }),
        ...(employmentRecords.length && { employmentRecord: employmentRecord }),
        ...(update.education && {
          education: {
            ...(teachingQualifications.length && { teachingQualification: teachingQualification }),
            ...(universityDegrees.length && { universityDegree: universityDegree }),
          },
        }),
        // ...(universityDegrees.length && { education: { universityDegree: universityDegree } }),
      },
    )
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async addUniversityDegree(
    @Arg('userId', () => ObjectId) userId: ObjectId,
    @Arg('universityDegree', () => UniversityDegree) universityDegree: UniversityDegree,
  ): Promise<number> {
    return this.userService.adduniversityDegree(userId, universityDegree)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async removeUniversityDegree(
    @Arg('userId', () => ObjectId) userId: ObjectId,
    @Arg('universityDegreeId', () => ObjectId) universityDegreeId: ObjectId,
  ): Promise<number> {
    return this.userService.removeuniversityDegree(userId, universityDegreeId)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async addTeachingQualification(
    @Arg('userId', () => ObjectId) userId: ObjectId,
    @Arg('teachingQualification', () => TeachingQualification) teachingQualification: TeachingQualification,
  ): Promise<number> {
    return this.userService.addTeachingQualification(userId, teachingQualification)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async removeTeachingQualification(
    @Arg('userId', () => ObjectId) userId: ObjectId,
    @Arg('teachingQualificationId', () => ObjectId) teachingQualificationId: ObjectId,
  ): Promise<number> {
    return this.userService.removeTeachingQualification(userId, teachingQualificationId)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async addEmploymentRecord(
    @Arg('userId', () => ObjectId) userId: ObjectId,
    @Arg('employmentRecord', () => EmploymentRecord) employmentRecord: EmploymentRecord,
  ): Promise<number> {
    return this.userService.addEmploymentRecord(userId, employmentRecord)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => Number)
  async removeEmploymentRecord(
    @Arg('userId', () => ObjectId) userId: ObjectId,
    @Arg('employmentRecordId', () => ObjectId) employmentRecordId: ObjectId,
  ): Promise<number> {
    return this.userService.removeEmploymentRecord(userId, employmentRecordId)
  }

  @UseMiddleware(Authenticate)
  @Query(() => UsersGetResponse)
  async users(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: UsersGetInput, @Ctx() ctx: Context): Promise<UsersGetResponse> {
    return await this.userService.all(filter, sort, page, perPage, ['name'])
  }

  @UseMiddleware(Authenticate)
  @Query(() => User)
  async user(@Arg('userId') _id: ObjectId): Promise<User | null> {
    return await this.userService.one({ _id })
  }

  @UseMiddleware(Authenticate)
  @Query(() => TeachingInformationsOutput)
  async teachingInformations(@Ctx() ctx: Context): Promise<TeachingInformationsOutput | undefined> {
    const user = await this.userService.one({ _id: ctx.payload!.user })

    if (!user) {
      throw new CustomError('UNAUTHORIZED', 404)
    }

    return this.userService.teachingInformations(user)
  }

  @FieldResolver(() => EducationSystemsGetResponse)
  async educationSystem(
    @Root() user: User,
    @Arg('input', () => EducationSystemsGetInput, { defaultValue: {} }) { filter, sort, page, perPage }: EducationSystemsGetInput,
  ): Promise<EducationSystemsGetResponse> {
    return this.educationSystemService.all(
      { ...filter, _id: { $in: (user.teachingInformation?.map((information) => information.educationSystemId) as ObjectId[]) || [] } },
      sort,
      page,
      perPage,
      [],
    )
  }

  @FieldResolver(() => Subject)
  async subject(@Root() user: User): Promise<Subject | null> {
    return this.subjectService.one({ _id: user.subjectId })
  }

  @FieldResolver(() => [TeachingInformationGetRequest])
  async informationsTeaching(@Root() user: User): Promise<TeachingInformationGetRequest[] | undefined> {
    const teachingInformation = await this.userService.teachingInformations(user)
    return teachingInformation?.teachingInformation
  }
}
