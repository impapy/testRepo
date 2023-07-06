import { Service } from 'typedi'
import * as R from 'ramda'
import { DBCollections, ResourcesSort } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import { ClassePaper, ClassePapersFilterInput, ClassePapersGetResponse } from './types'

@Service()
export class ClassePaperService extends createBaseService(DBCollections.CLASSEPAPER)<ClassePaper> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async all(
    filter: ClassePapersFilterInput,
    sort: any = ResourcesSort.NEWEST,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<ClassePaper, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
  ): Promise<ClassePapersGetResponse> {
    return super.all(
      {
        ...R.omit(['classeId'], filter),
        ...(filter.classeId && { classeId: filter.classeId }),
      },
      sort,
      page,
      perPage,
      filterFields,
    )
  }
}
