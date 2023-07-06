import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'
import { GovernorateEditInput } from '../governorate/types'
import { path } from 'ramda'

export enum DistrictsSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(DistrictsSort, { name: 'DistrictsSort' })

@InputType()
@ObjectType('BaseDistrict', { isAbstract: true })
export class DistrictAddInput {
  countryId: ObjectId

  @Field(() => ObjectId)
  governorateId: ObjectId

  @Field()
  label: string
}

@ObjectType()
export class District extends DistrictAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class DistrictEditInput extends GovernorateEditInput {}

@ObjectType()
export class DistrictsGetResponse extends ResourcesGetResponse(District) {}

@InputType()
export class DistrictsFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  governorateId?: ObjectId
}

@InputType()
export class DistrictsGetInput extends ResourcesGetInput(DistrictsFilterInput) {
  @Field(() => DistrictsSort, { defaultValue: DistrictsSort.NEWEST })
  sort: DistrictsSort = DistrictsSort.NEWEST
}
