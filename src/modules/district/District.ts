import { ObjectId, ClientSession } from 'mongodb'
import { Service } from 'typedi'
import createBaseService from '../../common/factories/createBaseService'
import { DBCollections } from '../../common/types'
import { GovernorateService } from '../governorate/Governorate'
import { District, DistrictAddInput } from './types'
import { CustomError } from '../../common/errorHandling/costomError'

@Service()
export class DistrictService extends createBaseService(DBCollections.DISTRICTS)<District> {
  constructor(private readonly governorateService: GovernorateService) {
    super()
  }

  async districtAdd(record: DistrictAddInput, session?: ClientSession): Promise<District> {
    const countryId = (await this.governorateService.one({ _id: record.governorateId }))?.countryId
    if (!countryId) {
      throw new CustomError('GOVERNORATE_NOT_FOUND', 404)
    }
    return super.add({ ...record, countryId }, session)
  }
}
