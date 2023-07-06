import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'

import { IsUrl } from 'class-validator'
import { ResourcesFilterInput } from '../../common/types'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'

export enum ClassePapersSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export enum ClassePaperType {
  ASSIGNMENT = 'ASSIGNMENT',
  QUIZ = 'QUIZ',
  PRACTICE_TEST = 'PRACTICE_TEST',
  MATERIAL = 'MATERIAL',
}

registerEnumType(ClassePapersSort, { name: 'ClassePapersSort' })
registerEnumType(ClassePaperType, { name: 'ClassePaperType' })

@InputType()
@ObjectType('BaseClassePaper', { isAbstract: true })
export class ClassePaperAddInput {
  @Field()
  title: string

  @IsUrl({}, { message: 'INVALID_URL' })
  @Field()
  fileUrl: string

  @Field(() => ClassePaperType)
  classePaperType: ClassePaperType

  @Field()
  classeId: ObjectId
}

@ObjectType()
export class ClassePaper extends ClassePaperAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class ClassePaperEditInput {
  @Field({ nullable: true })
  title?: string

  @IsUrl({}, { message: 'INVALID_URL' })
  @Field({ nullable: true })
  fileUrl?: string

  @Field(() => ClassePaperType, { nullable: true })
  classePaperType?: ClassePaperType
}

@ObjectType()
export class ClassePapersGetResponse extends ResourcesGetResponse(ClassePaper) {}

@InputType()
export class ClassePapersFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  classeId?: ObjectId
}

@InputType()
export class ClassePapersGetInput extends ResourcesGetInput(ClassePapersFilterInput) {
  @Field(() => ClassePapersSort, { defaultValue: ClassePapersSort.NEWEST })
  sort: ClassePapersSort = ClassePapersSort.NEWEST
}
