import { ObjectId } from 'mongodb'
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { DistrictService } from './District'
import { District, DistrictAddInput, DistrictEditInput, DistrictsGetInput, DistrictsGetResponse } from './types'
import { Authenticate } from '../../common/middleware/authenticate'
import { CheckIsTeacher } from '../../common/middleware/checkIsTeacher'

@Service()
@Resolver()
export class DistrictResolver {
  constructor(private readonly districtService: DistrictService) {}

  @UseMiddleware(CheckIsTeacher)
  @Mutation(() => District)
  async districtAdd(@Arg('input') input: DistrictAddInput): Promise<District> {
    return await this.districtService.districtAdd(input)
  }

  @Mutation(() => ObjectId)
  async districtDelete(@Arg('districtId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.districtService.delete({ _id })
  }

  @Mutation(() => District)
  async districtEdit(@Arg('districtId') _id: ObjectId, @Arg('update', { defaultValue: {} }) update: DistrictEditInput): Promise<District> {
    return await this.districtService.edit({ _id }, update)
  }

  @Query(() => DistrictsGetResponse)
  async districts(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: DistrictsGetInput): Promise<DistrictsGetResponse> {
    return await this.districtService.all(filter, sort, page, perPage)
  }

  @Query(() => District, { nullable: true })
  async district(@Arg('districtId') _id: ObjectId): Promise<District | null> {
    return await this.districtService.one(_id)
  }
}
