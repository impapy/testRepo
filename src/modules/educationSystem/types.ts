import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'

export enum EducationSystemsSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(EducationSystemsSort, { name: 'EducationSystemsSort' })

@InputType()
@ObjectType('BaseEducationSystem', { isAbstract: true })
export class EducationSystemAddInput {
  @Field()
  label: string
}

@ObjectType()
export class EducationSystem extends EducationSystemAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class EducationSystemEditInput {
  @Field({ nullable: true })
  label?: string
}

@ObjectType()
export class EducationSystemsGetResponse extends ResourcesGetResponse(EducationSystem) {}

@InputType()
export class EducationSystemsFilterInput extends ResourcesFilterInput {}

@InputType()
export class EducationSystemsGetInput extends ResourcesGetInput(EducationSystemsFilterInput) {
  @Field(() => EducationSystemsSort, { defaultValue: EducationSystemsSort.NEWEST })
  sort: EducationSystemsSort = EducationSystemsSort.NEWEST
}
