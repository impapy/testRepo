import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'

import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'
import { path } from 'ramda'

export enum SubjectsSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(SubjectsSort, { name: 'SubjectsSort' })

@ObjectType('BaseSubject', { isAbstract: true })
@InputType()
export class SubjectAddInput {
  @Field(() => ObjectId)
  educationSystemId: ObjectId

  @Field()
  label: string
}

@InputType()
export class SubjectEditInput {
  @Field({ nullable: true })
  label?: string
}

@ObjectType()
export class Subject extends SubjectAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@ObjectType()
export class SubjectsGetResponse extends ResourcesGetResponse(Subject) {}

@InputType()
export class SubjectsFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  educationSystemId?: ObjectId
}

@InputType()
export class SubjectsGetInput extends ResourcesGetInput(SubjectsFilterInput) {
  @Field(() => SubjectsSort, { defaultValue: SubjectsSort.NEWEST })
  sort: SubjectsSort = SubjectsSort.NEWEST
}
