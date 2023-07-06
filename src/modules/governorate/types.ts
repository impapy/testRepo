import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'

import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'

export enum GovernoratesSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(GovernoratesSort, { name: 'GovernoratesSort' })

@ObjectType('BaseGovernorate', { isAbstract: true })
@InputType()
export class GovernorateAddInput {
  @Field(() => ObjectId)
  countryId: ObjectId

  @Field()
  label: string
}

@InputType()
export class GovernorateEditInput {
  @Field({ nullable: true })
  label?: string
}

@ObjectType()
export class Governorate extends GovernorateAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@ObjectType()
export class GovernoratesGetResponse extends ResourcesGetResponse(Governorate) {}

@InputType()
export class GovernoratesFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  countryId?: ObjectId
}

@InputType()
export class GovernoratesGetInput extends ResourcesGetInput(GovernoratesFilterInput) {
  @Field(() => GovernoratesSort, { defaultValue: GovernoratesSort.NEWEST })
  sort: GovernoratesSort = GovernoratesSort.NEWEST
}
