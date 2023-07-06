import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { Max, Min } from 'class-validator'
import { ResourcesFilterInput } from '../../common/types'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import { BookedSessionsGetResponse } from '../bookedSessions/types'

export enum SessionsSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  UPCOMING = 'UPCOMING',
}
export enum ReservType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

export enum SessionStatus {
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
  UPCOMING = 'UPCOMING',
}

export enum SessionAbsentStatus {
  PENDING = 'PENDING',
  EXCUSED = 'EXCUSED',
  UNEXCUSED = 'UNEXCUSED',
}

registerEnumType(ReservType, { name: 'ReservType' })
registerEnumType(SessionsSort, { name: 'SessionsSort' })
registerEnumType(SessionStatus, { name: 'SessionStatus' })
registerEnumType(SessionAbsentStatus, { name: 'SessionAbsentStatus' })

@InputType()
@ObjectType('BaseSession', { isAbstract: true })
export class SessionAddInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  startDate: Date

  endDate: Date

  @Field({ nullable: true })
  assignment?: string

  @Field({ nullable: true })
  quiz?: string

  @Field({ nullable: true })
  reasonCancelled?: string

  @Max(2)
  @Min(1)
  @Field()
  duration: number

  @Field(() => [ObjectId], { defaultValue: [] })
  bookedStudenstIds: ObjectId[]

  @Field(() => [ObjectId], { defaultValue: [] })
  attendedStudenstIds: ObjectId[]

  @Field(() => ObjectId)
  classeId: ObjectId

  userId: ObjectId

  @Field(() => Boolean, { defaultValue: false })
  startOpen: boolean

  @Field(() => ReservType)
  reservType: ReservType

  @Field(() => SessionStatus, { defaultValue: SessionStatus.UPCOMING })
  status: SessionStatus
}

@ObjectType()
export class Session extends SessionAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean

  @Field()
  endDate: Date

  @Field(() => BookedSessionsGetResponse, { nullable: true })
  bookings?: BookedSessionsGetResponse
}

@InputType()
export class SessionEditInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  startDate?: Date

  endDate: Date

  @Max(2)
  @Min(1)
  @Field({ nullable: true })
  duration: number

  @Field(() => ReservType, { nullable: true })
  reservType?: ReservType

  @Field({ nullable: true })
  reasonCancelled?: string

  @Field(() => SessionStatus, { nullable: true })
  status?: SessionStatus

  @Field(() => Boolean, { nullable: true })
  startOpen?: boolean

  @Field(() => [ObjectId], { nullable: true })
  bookedStudenstIds?: ObjectId[]

  @Field({ nullable: true })
  assignment?: string

  @Field({ nullable: true })
  quiz?: string
}

@ObjectType()
export class SessionsGetResponse extends ResourcesGetResponse(Session) {}

@InputType()
export class SessionsFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  userId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  classeId?: ObjectId

  @Field(() => ReservType, { nullable: true })
  reservType?: ReservType

  @Field(() => SessionStatus, { nullable: true })
  status?: SessionStatus

  @Field(() => Date, { nullable: true })
  startDate?: Date

  @Field(() => Date, { nullable: true })
  startDateNext?: Date

  @Field(() => [ObjectId], { nullable: true })
  bookedStudenstIds?: ObjectId[]
}

@InputType()
export class SessionsGetInput extends ResourcesGetInput(SessionsFilterInput) {
  @Field(() => SessionsSort, { defaultValue: SessionsSort.NEWEST })
  sort: SessionsSort = SessionsSort.NEWEST
}

@ObjectType()
export class FormateDate {
  @Field()
  month: string

  @Field()
  day: string

  @Field()
  year: string

  @Field()
  hour: string
}

@ObjectType()
export class FormatesDates {
  @Field(() => FormateDate)
  startDate: FormateDate

  @Field(() => FormateDate)
  endDate: FormateDate
}
