import { ClientSession, ObjectID, ObjectId } from 'mongodb'
import { Service } from 'typedi'
import * as R from 'ramda'
import { DBCollections, ResourcesSort } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import {
  EmploymentRecord,
  TeachingInformationGetRequest,
  TeachingInformationsOutput,
  TeachingQualification,
  UniversityDegree,
  User,
  UserAddInput,
  UsersFilterInput,
  UsersGetResponse,
} from './types'
import { EducationSystemService } from '../educationSystem/EducationSystem'
import { SubjectService } from '../subject/Subject'
import { EducationSystem } from '../educationSystem/types'

@Service()
export class UserService extends createBaseService(DBCollections.USERS)<User> {
  constructor(private readonly educationSystemService: EducationSystemService, private readonly subjectService: SubjectService) {
    super()
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async all(
    filter: UsersFilterInput,
    sort: any = ResourcesSort.NEWEST,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<User, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
  ): Promise<UsersGetResponse> {
    return super.all(
      {
        ...R.omit(['userType', 'userId', 'subjectId'], filter),
        ...(filter.userType && { userType: { $in: filter.userType } }),
        ...(filter.userId && { _id: { $in: filter.userId } }),
        ...(filter.subjectId && { subjectId: filter.subjectId }),
      },
      sort,
      page,
      perPage,
      filterFields,
    )
  }

  async add(userAddInput: Omit<UserAddInput, 'username' | 'password' | 'phone'>, session?: ClientSession): Promise<User> {
    const result = await super.add(
      {
        ...userAddInput,
      },
      session,
    )

    return result
  }

  async checkEmailExist(email?: string): Promise<boolean> {
    if (!email) {
      return false
    }

    return !!(await super.one({ email: email.toLowerCase() }))
  }
  async teachingInformations(user: User): Promise<TeachingInformationsOutput | undefined> {
    const educationSystems = await this.educationSystemService.all(
      { _id: { $in: (user.teachingInformation?.map((information) => information.educationSystemId) as ObjectId[]) || [] } },
      ResourcesSort.NEWEST,
      1,
      1000,
      [],
    )
    let educationSystem
    if (educationSystems) {
      educationSystem = educationSystems.nodes
    } else educationSystem = [] as EducationSystem[]

    const teachingInformations = user.teachingInformation?.length
      ? await user.teachingInformation.map(async (teachingInformation) => ({
          ...teachingInformation,
          educationSystem: await (await this.educationSystemService.one(teachingInformation?.educationSystemId as ObjectId))?.label,
          subject: await (await this.subjectService.one(teachingInformation?.subjectId as ObjectId))?.label,
        }))
      : ([] as TeachingInformationGetRequest[])

    return { teachingInformation: teachingInformations as TeachingInformationGetRequest[] }
  }

  async adduniversityDegree(userId: ObjectId, universityDegree: UniversityDegree, session?: ClientSession): Promise<number> {
    return await this.updateMany({ _id: { $in: [userId] } }, { $push: { 'education.universityDegree': { ...universityDegree, _id: new ObjectId() } } }, session)
  }
  async removeuniversityDegree(userId: ObjectId, universityDegreeId: ObjectId, session?: ClientSession): Promise<number> {
    return await super.updateMany({ _id: { $in: [userId] } }, { $pull: { 'education.universityDegree': { _id: universityDegreeId } } }, session)
  }

  async addTeachingQualification(userId: ObjectId, teachingQualification: TeachingQualification, session?: ClientSession): Promise<number> {
    return await this.updateMany(
      { _id: { $in: [userId] } },
      { $push: { 'education.teachingQualification': { ...teachingQualification, _id: new ObjectId() } } },
      session,
    )
  }
  async removeTeachingQualification(userId: ObjectId, teachingQualificationId: ObjectId, session?: ClientSession): Promise<number> {
    return await super.updateMany({ _id: { $in: [userId] } }, { $pull: { 'education.teachingQualification': { _id: teachingQualificationId } } }, session)
  }

  async addEmploymentRecord(userId: ObjectId, employmentRecord: EmploymentRecord, session?: ClientSession): Promise<number> {
    return await this.updateMany({ _id: { $in: [userId] } }, { $push: { employmentRecord: { ...employmentRecord, _id: new ObjectId() } } }, session)
  }
  async removeEmploymentRecord(userId: ObjectId, employmentRecordId: ObjectId, session?: ClientSession): Promise<number> {
    return await super.updateMany({ _id: { $in: [userId] } }, { $pull: { employmentRecord: { _id: employmentRecordId } } }, session)
  }
}
