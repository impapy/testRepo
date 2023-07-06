import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { Min } from 'class-validator'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'

export enum BookedSessionsSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(BookedSessionsSort, { name: 'BookedSessionsSort' })

@ObjectType('BaseBookedSession', { isAbstract: true })
@InputType()
export class BookedSessionAddInput {
  @Min(1)
  @Field({ nullable: true })
  year?: number

  @Min(1)
  @Field()
  sessionsCount: number

  @Field({ nullable: true })
  massage?: string

  @Field()
  startDate: Date

  @Field({ nullable: true })
  sessionId?: ObjectId

  @Field(() => ObjectId)
  classeId: ObjectId

  @Field(() => ObjectId, { nullable: true })
  studentId: ObjectId

  @Field(() => ObjectId, { nullable: true })
  requestsBookId: ObjectId

  endDate: Date

  teacherId: ObjectId
}

@ObjectType()
export class BookedSession extends BookedSessionAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@ObjectType()
export class BookedSessionsGetResponse extends ResourcesGetResponse(BookedSession) {}

@InputType()
export class BookedSessionsFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  classeId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  sessionId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  studentId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  teacherId?: ObjectId
}

@InputType()
export class BookedSessionsGetInput extends ResourcesGetInput(BookedSessionsFilterInput) {
  @Field(() => BookedSessionsSort, { defaultValue: BookedSessionsSort.NEWEST })
  sort: BookedSessionsSort = BookedSessionsSort.NEWEST
}
