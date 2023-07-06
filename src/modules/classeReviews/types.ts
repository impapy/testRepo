import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'

import { Max, Min } from 'class-validator'
import { ResourcesFilterInput } from '../../common/types'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'

export enum ClasseReviewsSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  RATING = 'RATING',
}

registerEnumType(ClasseReviewsSort, { name: 'ClasseReviewsSort' })

@InputType()
@ObjectType('BaseClasseReview', { isAbstract: true })
export class ClasseReviewAddInput {
  @Field()
  massage: string

  @Max(5)
  @Min(1)
  @Field({ defaultValue: 1 })
  rating: number

  @Field()
  classeId: ObjectId

  studentId: ObjectId

  teacherId: ObjectId
}

@ObjectType()
export class ClasseReview extends ClasseReviewAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@ObjectType()
export class ClasseReviewsGetResponse extends ResourcesGetResponse(ClasseReview) {}

@InputType()
export class ClasseReviewsFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  studentId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  classeId?: ObjectId
}

@InputType()
export class ClasseReviewsGetInput extends ResourcesGetInput(ClasseReviewsFilterInput) {
  @Field(() => ClasseReviewsSort, { defaultValue: ClasseReviewsSort.NEWEST })
  sort: ClasseReviewsSort = ClasseReviewsSort.NEWEST
}
