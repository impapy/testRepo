import { Service } from 'typedi'
import * as R from 'ramda'
import { ClientSession, ObjectId } from 'mongodb'
import { DBCollections } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import { db } from '../../db'
import { FormatesDates, ReservType, Session, SessionsFilterInput, SessionsGetResponse, SessionsSort } from './types'
import { CustomError } from '../../common/errorHandling/costomError'

@Service()
export class SessionService extends createBaseService(DBCollections.SESSIONS)<Session> {
  private readonly sessions = db.collection<Session>(DBCollections.SESSIONS)

  static sort(sort?: SessionsSort) {
    if (!sort) return {}

    const options = {
      NEWEST: { createdAt: -1 },
      OLDEST: { createdAt: 1 },
      UPCOMING: { startDate: 1 },
    }

    return options[sort]
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async all(
    filter: SessionsFilterInput,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<Session, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
    sort?: SessionsSort,
  ): Promise<SessionsGetResponse> {
    return super.all(
      {
        ...R.omit(['userId', 'classeId', 'reservType', 'startDate', 'startDateNext', 'bookedStudenstIds'], filter),
        ...(filter.userId && { userId: filter.userId }),
        ...(filter.classeId && { classeId: filter.classeId }),
        ...(filter.reservType && { reservType: filter.reservType }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.startDateNext && { startDate: { $gte: new Date(filter.startDateNext) } }),
        ...(filter.bookedStudenstIds && { bookedStudenstIds: { $in: filter.bookedStudenstIds } }),
        ...(filter.status && { status: filter.status }),
      },
      SessionService.sort(sort),
      page,
      perPage,
      filterFields,
    )
  }

  async formateDate(startDate: Date, endDate: Date): Promise<FormatesDates> {
    return {
      startDate: {
        month: startDate.toLocaleString('en-US', { month: 'numeric' }),
        day: startDate.toLocaleString('en-US', { day: 'numeric' }),
        year: startDate.toLocaleString('en-US', { year: 'numeric' }),
        hour: startDate.toLocaleString('en-US', { hour: '2-digit' }),
      },
      endDate: {
        month: endDate.toLocaleString('en-US', { month: 'numeric' }),
        day: endDate.toLocaleString('en-US', { day: 'numeric' }),
        year: endDate.toLocaleString('en-US', { year: 'numeric' }),
        hour: endDate.toLocaleString('en-US', { hour: '2-digit' }),
      },
    }
  }
}
