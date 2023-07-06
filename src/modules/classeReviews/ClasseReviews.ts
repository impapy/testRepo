import { Service } from 'typedi'
import * as R from 'ramda'
import { DBCollections } from '../../common/types'
import createBaseService from '../../common/factories/createBaseService'
import { ClasseReview, ClasseReviewsFilterInput, ClasseReviewsGetResponse, ClasseReviewsSort } from './types'

@Service()
export class ClasseReviewService extends createBaseService(DBCollections.CLASSEREVIEW)<ClasseReview> {
  static sort(sort?: ClasseReviewsSort) {
    if (!sort) return {}

    const options = {
      NEWEST: { createdAt: -1 },
      OLDEST: { createdAt: 1 },
      RATING: { rating: -1 },
    }

    return options[sort]
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async all(
    filter: ClasseReviewsFilterInput,
    page = 1,
    perPage = 30,
    filterFields: (keyof Omit<ClasseReview, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>)[],
    sort?: ClasseReviewsSort,
  ): Promise<ClasseReviewsGetResponse> {
    return super.all(
      {
        ...R.omit(['studentId', 'classeId'], filter),
        ...(filter.classeId && { classeId: filter.classeId }),
        ...(filter.studentId && { studentId: filter.studentId }),
      },
      ClasseReviewService.sort(sort),
      page,
      perPage,
      filterFields,
    )
  }
}
