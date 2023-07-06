import { Service } from 'typedi'
import * as R from 'ramda'
import { Context, DBCollections } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import { Classe, ClasseAddInput, ClassesFilterInput, ClassesGetResponse, ClassesSort } from './types'
import { CustomError } from '../../common/errorHandling/costomError'
import { ReservType, SessionAddInput, SessionStatus } from '../session/types'
import { transaction } from '../../common/transaction'
import { SessionService } from '../session/Session'
import { MAX_AGE_2H } from '../../constants'
import { ObjectId } from 'mongodb'

@Service()
export class ClasseService extends createBaseService(DBCollections.CLASSES)<Classe> {
  constructor(private readonly sessionService: SessionService) {
    super()
  }

  static sort(sort?: ClassesSort) {
    if (!sort) return {}

    const options = {
      NEWEST: { createdAt: -1 },
      OLDEST: { createdAt: 1 },
      RATING: { rating: -1 },
      BOOKED_COUNT: { bookedCount: -1 },
    }

    return options[sort]
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async all(
    filter: ClassesFilterInput,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<Classe, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
    sort?: ClassesSort,
  ): Promise<ClassesGetResponse> {
    return super.all(
      {
        ...R.omit(['userId', 'reservType', 'subjectId', 'classeStatusType', 'educationSystemId', 'examinationBoardType'], filter),
        ...(filter.userId && { userId: filter.userId }),
        ...(filter.reservType && { reservType: filter.reservType }),
        ...(filter.subjectId && { subjectId: filter.subjectId }),
        ...(filter.classeStatusType && { classeStatusType: { $in: filter.classeStatusType } }),
        ...(filter.educationSystemId && { educationSystemId: filter.educationSystemId }),
        ...(filter.examinationBoardType && { examinationBoardType: filter.examinationBoardType }),
      },
      ClasseService.sort(sort),
      page,
      perPage,
      filterFields,
    )
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async add(record: ClasseAddInput, ctx: Context): Promise<Classe> {
    if (!ctx.payload?.user) throw new CustomError('UNAUTHORIZED', 404)
    if (record.reservType === ReservType.GROUP && record.sessionContentDetails && record.sessionContentDetails?.length) {
      return await transaction(async (session) => {
        const classAdd = await super.add({ ...record, userId: ctx.payload?.user as ObjectId })
        record.sessionContentDetails?.map(
          async (sessionData) =>
            await this.sessionService.add({
              name: sessionData.name,
              description: sessionData.description,
              startDate: sessionData.startDate,
              endDate: sessionData.endDate,
              assignment: sessionData.assignment,
              quiz: sessionData.quiz,
              duration: record.duration || 1,
              classeId: classAdd._id,
              userId: classAdd.userId,
              startOpen: false,
              reservType: ReservType.GROUP,
              bookedStudenstIds: [],
              status: SessionStatus.UPCOMING,
              attendedStudenstIds: [],
            }),
        )
        return classAdd
      })
    }
    return await super.add({ ...record, userId: ctx.payload?.user })
  }
}
