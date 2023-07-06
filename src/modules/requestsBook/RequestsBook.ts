import { Service } from 'typedi'
import * as R from 'ramda'
import createBaseService from '../../common/factories/createBaseService'
import { DBCollections, ResourcesSort } from '../../common/types'
import { SessionService } from '../session/Session'
import { ClasseService } from '../classe/Classe'
import { RequestsBook, RequestsBooksFilterInput, RequestsBooksGetResponse } from './types'

@Service()
export class RequestsBookService extends createBaseService(DBCollections.REQUESTS_BOOKS)<RequestsBook> {
  constructor() {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async all(
    filter: RequestsBooksFilterInput,
    sort: any = ResourcesSort.NEWEST,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<RequestsBook, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
  ): Promise<RequestsBooksGetResponse> {
    return super.all(
      {
        ...R.omit(['classeId', 'sessionId', 'studentId'], filter),
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
}
