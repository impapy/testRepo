import { ObjectId } from 'mongodb'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { GovernorateService } from './Governorate'
import { Governorate, GovernorateAddInput, GovernorateEditInput, GovernoratesGetInput, GovernoratesGetResponse } from './types'

@Service()
@Resolver()
export class GovernorateResolver {
  constructor(private readonly governorateService: GovernorateService) {}

  @Mutation(() => Governorate)
  async governorateAdd(@Arg('input') input: GovernorateAddInput): Promise<Governorate> {
    return await this.governorateService.add(input)
  }

  @Mutation(() => ObjectId)
  async governorateDelete(@Arg('governorateId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.governorateService.delete(_id)
  }

  @Mutation(() => Governorate)
  async governorateEdit(@Arg('governorateId') _id: ObjectId, @Arg('update', { defaultValue: {} }) update: GovernorateEditInput): Promise<Governorate> {
    return await this.governorateService.edit({ _id }, update)
  }

  @Query(() => GovernoratesGetResponse)
  async governorates(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: GovernoratesGetInput): Promise<GovernoratesGetResponse> {
    return await this.governorateService.all(filter, sort, page, perPage)
  }

  @Query(() => Governorate, { nullable: true })
  async governorate(@Arg('governorateId') _id: ObjectId): Promise<Governorate | null> {
    return await this.governorateService.one(_id)
  }
}
