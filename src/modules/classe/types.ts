import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, createUnionType, registerEnumType } from 'type-graphql'
import { IsUrl, Max, Min, ValidateNested } from 'class-validator'
import { ResourcesFilterInput } from '../../common/types'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import { IsUnique } from '../../common/custom-validators/isUnique'
import { ReservType } from '../session/types'
import { ExaminationBoardType } from '../user/types'
import { path } from 'ramda'

export enum ClassesSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  RATING = 'RATING',
  BOOKED_COUNT = 'BOOKED_COUNT',
}

export enum ClasseStatusType {
  ONGOING = 'ONGOING',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum AvailabilityWindow {
  MONTHES_IN_ADVANCE_12 = 'MONTHES_IN_ADVANCE_12',
}

export enum BlockSessionsInAdvance {
  WEEKS_5 = 'WEEKS_5',
}
export enum DaysType {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  YUESDAY = 'YUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

// export enum SubjectsType {
//   MATHEMATICS = 'MATHEMATICS',
//   CHEMISTRY = 'CHEMISTRY',
//   PHYSICS = 'PHYSICS',
//   BIOLOGY = 'BIOLOGY',
//   BUSINESS = 'BUSINESS',
//   ECONOMICS = 'ECONOMICS',
//   ACCOUNTING = 'ACCOUNTING',
//   COMPUTER_SCIENCE = 'COMPUTER_SCIENCE',
//   PSYCHOLOGY = 'PSYCHOLOGY',
//   ENGLISH = 'ENGLISH',
//   ARABIC = 'ARABIC',
//   FRINCH = 'FRINCH',
//   OTHER = 'OTHER',
// }
export enum BookingType {
  INSTANT_BOOK = 'INSTANT_BOOK',
  REQUEST_BOOK = 'REQUEST_BOOK',
  BOOK_GROUP = 'BOOK_GROUP',
}
registerEnumType(ClassesSort, { name: 'ClassesSort' })
registerEnumType(ClasseStatusType, { name: 'ClasseStatusType' })
registerEnumType(AvailabilityWindow, { name: 'AvailabilityWindow' })
registerEnumType(BlockSessionsInAdvance, { name: 'BlockSessionsInAdvance' })
registerEnumType(DaysType, { name: 'DaysType' })
registerEnumType(BookingType, { name: 'BookingType' })

@InputType()
@ObjectType('BaseTimelineZone', { isAbstract: true })
class TimelineZone {
  @Field()
  day: string

  @Field(() => [String], { nullable: 'itemsAndList' })
  times: string[]
}
@ObjectType()
@InputType('SessionContentDetailsInput')
class SessionContentDetails {
  @Field()
  name: string

  @Field()
  startDate: Date

  @Field()
  endDate: Date

  @Field()
  description: string

  @Field()
  assignment: string

  @Field()
  quiz: string
}

@InputType()
@ObjectType('BaseClasse', { isAbstract: true })
export class ClasseAddInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @IsUrl({}, { message: 'INVALID_URL' })
  @Field({ nullable: true })
  preview?: string

  @Field(() => [ObjectId], { nullable: 'itemsAndList' })
  intendedLearnerId?: ObjectId[]

  @Min(1)
  @Max(10)
  @Field({ nullable: true })
  sessionCounts?: number

  @Min(1)
  @Max(2)
  @Field({ nullable: true })
  duration?: number

  @Field({ nullable: true })
  startDate?: Date

  @Field(() => [String], { nullable: 'itemsAndList' })
  days?: string[]

  @Field(() => [Date], { nullable: true })
  holidays?: Date[]

  @Field(() => ReservType)
  reservType: ReservType

  @Field(() => [TimelineZone], { nullable: 'itemsAndList' })
  timeline?: TimelineZone[]

  @Field(() => ClasseStatusType, { defaultValue: ClasseStatusType.PUBLISHED })
  classeStatusType: ClasseStatusType

  //////////////////// group  /////////////////////
  @Field(() => [ObjectId], { nullable: 'itemsAndList' })
  educationSystemId?: ObjectId[]

  @Field(() => [ObjectId], { nullable: 'itemsAndList' })
  subjectsIds?: ObjectId[]

  @Field(() => [ExaminationBoardType], { nullable: 'itemsAndList' })
  examinationBoardType?: ExaminationBoardType[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  gradeLevel?: string[]

  @Min(1)
  @Field({ nullable: true })
  numberStudent?: number
  //////////////// sessions //////////////////

  @Field(() => [SessionContentDetails], { nullable: true })
  @ValidateNested()
  sessionContentDetails?: SessionContentDetails[]

  ///////////// booked /////////////
  @Field(() => BookingType)
  bookingType: BookingType
  //////////////////// some  ////////////////////

  @Field(() => [String], { defaultValue: [] })
  ansowerFormate: string[]

  @Field(() => [String], { defaultValue: [] })
  sessionsContent: string[]

  // @Field()
  // price: number

  // @Field()
  // year: number

  @Field({ defaultValue: 0 })
  rating: number

  @Field({ defaultValue: 0 })
  bookedCount: number

  // @Max(2)
  // @Min(1)
  // @Field({ defaultValue: 1 })
  // sessionsDuration: number

  // @Field(() => ObjectId)
  // educationSystemId: ObjectId

  // @Field(() => ExaminationBoardType)
  // examinationBoardType: ExaminationBoardType

  // @Field(() => ObjectId)
  // subjectId: ObjectId

  // @Field(() => AvailabilityWindow)
  // availabilityWindow: AvailabilityWindow

  // @Field(() => BlockSessionsInAdvance)
  // blockSessionsInAdvance: BlockSessionsInAdvance

  // @Field(() => [DaysType], { nullable: 'itemsAndList' })
  // blockedDays: DaysType[]

  @Field(() => Boolean, { defaultValue: false })
  resourcesToStudyFrom: boolean

  @Field(() => Boolean, { defaultValue: false })
  quizzesAndAssignments: boolean

  @Field(() => Boolean, { defaultValue: false })
  directChateWithTheTeacher: boolean

  @Field(() => Boolean, { defaultValue: false })
  practiceTests: boolean

  userId: ObjectId
}

@ObjectType()
export class Classe extends ClasseAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class ClasseEditInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @IsUrl({}, { message: 'INVALID_URL' })
  @Field({ nullable: true })
  preview?: string

  @Field(() => [String], { nullable: true })
  ansowerFormate?: string[]

  @Field(() => [String], { nullable: true })
  sessionsContent?: string[]

  @Field({ nullable: true })
  price?: number

  @Field(() => BookingType, { nullable: true })
  bookingType?: BookingType

  @Field({ nullable: true })
  year?: number

  @Field(() => ReservType, { nullable: true })
  reservType?: ReservType

  @Field(() => ClasseStatusType, { nullable: true })
  classeStatusType?: ClasseStatusType

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  educationSystemId?: ObjectId

  @Field(() => [ExaminationBoardType], { nullable: true })
  examinationBoardType?: ExaminationBoardType[]

  @Field(() => AvailabilityWindow, { nullable: true })
  availabilityWindow?: AvailabilityWindow

  @Field(() => BlockSessionsInAdvance, { nullable: true })
  blockSessionsInAdvance?: BlockSessionsInAdvance

  @Field(() => [DaysType], { nullable: true })
  blockedDays?: DaysType[]

  @Field(() => Boolean, { nullable: true })
  resourcesToStudyFrom?: boolean

  @Field(() => Boolean, { nullable: true })
  quizzesAndAssignments?: boolean

  @Field(() => Boolean, { nullable: true })
  directChateWithTheTeacher?: boolean

  @Field(() => Boolean, { nullable: true })
  practiceTests?: boolean
}

@ObjectType()
export class ClassesGetResponse extends ResourcesGetResponse(Classe) {}

@InputType()
export class ClassesFilterInput extends ResourcesFilterInput {
  @Field(() => ObjectId, { nullable: true })
  userId?: ObjectId

  @Field(() => ReservType, { nullable: true })
  reservType?: ReservType

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId

  @Field(() => [ClasseStatusType], { nullable: 'itemsAndList' })
  classeStatusType?: ClasseStatusType[]

  @Field(() => ObjectId, { nullable: true })
  educationSystemId?: ObjectId

  @Field(() => ExaminationBoardType, { nullable: true })
  examinationBoardType?: ExaminationBoardType

  @Field(() => BookingType, { nullable: true })
  bookingType?: BookingType
}

@InputType()
export class ClassesGetInput extends ResourcesGetInput(ClassesFilterInput) {
  @Field(() => ClassesSort, { defaultValue: ClassesSort.NEWEST })
  sort: ClassesSort = ClassesSort.NEWEST
}
