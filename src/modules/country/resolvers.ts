import { ObjectId } from 'mongodb'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { CountryService } from './Country'
import { CountriesGetInput, CountriesGetResponse, Country, CountryAddInput, CountryEditInput } from './types'

@Service()
@Resolver()
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Mutation(() => Country)
  async countryAdd(@Arg('input') input: CountryAddInput): Promise<Country> {
    return await this.countryService.add(input)
  }

  @Mutation(() => ObjectId)
  async countryDelete(@Arg('countryId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.countryService.delete(_id)
  }

  @Mutation(() => Country)
  async countryEdit(@Arg('countryId') _id: ObjectId, @Arg('update', { defaultValue: {} }) update: CountryEditInput): Promise<Country> {
    return await this.countryService.edit({ _id }, update)
  }

  @Query(() => CountriesGetResponse)
  async countries(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: CountriesGetInput): Promise<CountriesGetResponse> {
    return await this.countryService.all(filter, sort, page, perPage)
  }

  @Query(() => Country, { nullable: true })
  async country(@Arg('countryId') _id: ObjectId): Promise<Country | null> {
    return await this.countryService.one(_id)
  }
}
