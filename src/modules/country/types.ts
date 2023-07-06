import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'

export enum CountriesSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(CountriesSort, { name: 'CountriesSort' })

@InputType()
@ObjectType('BaseCountry', { isAbstract: true })
export class CountryAddInput {
  @Field()
  label: string
}

@ObjectType()
export class Country extends CountryAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class CountryEditInput {
  @Field({ nullable: true })
  label?: string
}

@ObjectType()
export class CountriesGetResponse extends ResourcesGetResponse(Country) {}

@InputType()
export class CountriesFilterInput extends ResourcesFilterInput {}

@InputType()
export class CountriesGetInput extends ResourcesGetInput(CountriesFilterInput) {
  @Field(() => CountriesSort, { defaultValue: CountriesSort.NEWEST })
  sort: CountriesSort = CountriesSort.NEWEST
}
