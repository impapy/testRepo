import { ClientSession, ObjectId } from 'mongodb'
import { Service } from 'typedi'

import createBaseService from '../../common/factories/createBaseService'
import { transaction } from '../../common/transaction'
import { DBCollections } from '../../common/types'
import { DistrictService } from '../district/District'
import { GovernorateService } from '../governorate/Governorate'
import { Country } from './types'

@Service()
export class CountryService extends createBaseService(DBCollections.COUNTRIES)<Country> {
  constructor(private readonly governorateService: GovernorateService, private readonly districtService: DistrictService) {
    super()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete(_id: ObjectId, session?: ClientSession): Promise<ObjectId | undefined> {
    return transaction(async (session) => {
      await this.governorateService.deleteMany({ countryId: _id }, session)
      await this.districtService.deleteMany({ countryId: _id }, session)

      return super.delete({ _id }, session)
    })
  }
}
