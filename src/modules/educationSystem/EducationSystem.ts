import { ClientSession, ObjectId } from 'mongodb'
import { Service } from 'typedi'

import createBaseService from '../../common/factories/createBaseService'
import { transaction } from '../../common/transaction'
import { DBCollections } from '../../common/types'
import { SubjectService } from '../subject/Subject'
import { EducationSystem } from './types'

@Service()
export class EducationSystemService extends createBaseService(DBCollections.EDUCATION_SYSTEMS)<EducationSystem> {
  constructor(private readonly subjectService: SubjectService) {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete(_id: ObjectId, session?: ClientSession): Promise<ObjectId | undefined> {
    return transaction(async (session) => {
      await this.subjectService.deleteMany({ educationSystemId: _id }, session)
      return super.delete({ _id }, session)
    })
  }
}
