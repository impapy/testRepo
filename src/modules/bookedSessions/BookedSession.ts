import { Service } from 'typedi'

import { ClientSession, ObjectID, ObjectId } from 'mongodb'
import * as R from 'ramda'
import createBaseService from '../../common/factories/createBaseService'
import { DBCollections, ResourcesSort } from '../../common/types'
import { SessionService } from '../session/Session'
import { ReservType, SessionStatus, SessionsSort } from '../session/types'
import { MAX_AGE_2H, WEEK_H } from '../../constants'
import { transaction } from '../../common/transaction'
import { BookedSession, BookedSessionAddInput, BookedSessionsFilterInput, BookedSessionsGetResponse } from './types'
import { CustomError } from '../../common/errorHandling/costomError'
import { ClasseService } from '../classe/Classe'
import { Classe } from '../classe/types'
import { RequestsBookService } from '../requestsBook/RequestsBook'
import { StatusLabel } from '../requestsBook/types'

@Service()
export class BookedSessionService extends createBaseService(DBCollections.BOOKED_SESSIONS)<BookedSession> {
  constructor(private readonly sessionService: SessionService, private readonly requestsBookService: RequestsBookService) {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async all(
    filter: BookedSessionsFilterInput,
    sort: any = ResourcesSort.NEWEST,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<BookedSession, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
  ): Promise<BookedSessionsGetResponse> {
    return super.all(
      {
        ...R.omit(['classeId', 'sessionId', 'studentId', 'teacherId'], filter),
        ...(filter.classeId && { classeId: filter.classeId }),
        ...(filter.sessionId && { sessionId: filter.sessionId }),
        ...(filter.studentId && { studentId: filter.studentId }),
        ...(filter.teacherId && { teacherId: filter.teacherId }),
      },
      sort,
      page,
      perPage,
      filterFields,
    )
  }

  async bookedInstantSessionAdd(record: BookedSessionAddInput, baseclass: Classe, session?: ClientSession): Promise<ObjectId> {
    return transaction(async (session) => {
      for (let i = 0; i < record.sessionsCount; i++) {
        const inputSession = await this.sessionService.add(
          {
            startDate: new Date(record.startDate.getTime() + WEEK_H * i * MAX_AGE_2H),
            endDate: new Date(new Date(record.startDate.getTime() + WEEK_H * i * MAX_AGE_2H).getTime() + Number(baseclass.duration) * MAX_AGE_2H),
            classeId: baseclass._id,
            duration: Number(baseclass.duration),
            userId: baseclass.userId,
            startOpen: false,
            reservType: baseclass.reservType,
            bookedStudenstIds: [record.studentId],
            status: SessionStatus.UPCOMING,
            attendedStudenstIds: [],
          },
          session,
        )
        await this.add(
          { ...record, _id: new ObjectID(), startDate: inputSession.startDate, sessionId: inputSession._id, endDate: inputSession.endDate },
          session,
        )
      }

      return record.classeId
    })
  }

  async bookedRequestSessionAdd(record: BookedSessionAddInput, baseclass: Classe, session?: ClientSession): Promise<ObjectId> {
    return transaction(async (session) => {
      await this.sessionService.add(
        {
          startDate: new Date(record.startDate.getTime()),
          endDate: new Date(new Date(record.startDate.getTime()).getTime() + Number(baseclass.duration) * MAX_AGE_2H),
          classeId: baseclass._id,
          duration: Number(baseclass.duration),
          userId: baseclass.userId,
          startOpen: false,
          reservType: baseclass.reservType,
          bookedStudenstIds: [record.studentId],
          status: SessionStatus.UPCOMING,
          attendedStudenstIds: [],
        },
        session,
      )
      await this.requestsBookService.edit({ _id: record.requestsBookId }, { status: StatusLabel.CONFIRMED }, session)

      return record.classeId
    })
  }

  async bookedGroupSessionAdd(record: BookedSessionAddInput, session?: ClientSession): Promise<ObjectId> {
    return transaction(async (session) => {
      const baseSession = await this.sessionService.one({ _id: record.sessionId })
      if (!baseSession) throw new CustomError('NOT_FOUND')

      const baseSessions = await this.sessionService.all(
        { classeId: record.classeId, startDateNext: baseSession.startDate },
        1,
        record.sessionsCount,
        [],
        SessionsSort.UPCOMING,
      )

      if (record.sessionsCount > baseSessions.pageInfo.total) throw new CustomError('INVALID_COUNT_SESSION')

      if (record.sessionsCount) {
        await baseSessions.nodes.map(async (itemSession) => {
          await this.add(
            { ...record, _id: new ObjectID(), startDate: itemSession.startDate, sessionId: itemSession._id, endDate: itemSession.endDate },
            session,
          )
        })
      }
      const baseSessionsIds = baseSessions.nodes.map((item) => item._id)
      await this.sessionService.updateMany({ _id: { $in: baseSessionsIds } }, { $push: { bookedStudenstIds: record.studentId } })

      return record.classeId
    })
  }
}
