import { ClientSession, ObjectId } from 'mongodb'
import { Service } from 'typedi'
import createBaseService from '../../common/factories/createBaseService'
import { transaction } from '../../common/transaction'
import { DBCollections } from '../../common/types'
import { DistrictService } from '../district/District'
import { Governorate } from './types'

@Service()
export class GovernorateService extends createBaseService(DBCollections.GOVERNORATES)<Governorate> {
  constructor(private readonly districtService: DistrictService) {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete(_id: ObjectId, session?: ClientSession): Promise<ObjectId | undefined> {
    return transaction(async (session) => {
      await this.districtService.deleteMany({ governorateId: _id }, session)

      return super.delete({ _id }, session)
    })
  }
}
