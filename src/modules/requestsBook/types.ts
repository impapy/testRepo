import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { Min } from 'class-validator'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'

export enum RequestsBooksSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export enum StatusLabel {
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
}

registerEnumType(RequestsBooksSort, { name: 'RequestsBooksSort' })
registerEnumType(StatusLabel, { name: 'StatusLabel' })

@ObjectType('BaseRequestsBook', { isAbstract: true })
@InputType()
export class RequestsBookAddInput {
  @Min(1)
  @Field()
  sessionsCount: number

  @Field({ nullable: true })
  massage?: string

  @Field(() => Date)
  day: Date

  @Field(() => [String])
  times: string[]

  @Field(() => ObjectId)
  classeId: ObjectId

  @Field(() => StatusLabel, { defaultValue: StatusLabel.PENDING })
  status: StatusLabel

  studentId: ObjectId

  teacherId: ObjectId

  duration: number
}

@ObjectType()
export class RequestsBook extends RequestsBookAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class RequestsBookEditInput {
  @Field(() => StatusLabel, { nullable: true })
  status?: StatusLabel
}

@ObjectType()
export class RequestsBooksGetResponse extends ResourcesGetResponse(RequestsBook) {}

@InputType()
export class RequestsBooksFilterInput extends ResourcesFilterInput {
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
export class RequestsBooksGetInput extends ResourcesGetInput(RequestsBooksFilterInput) {
  @Field(() => RequestsBooksSort, { defaultValue: RequestsBooksSort.NEWEST })
  sort: RequestsBooksSort = RequestsBooksSort.NEWEST
}
