import { IsEmail, IsPhoneNumber, IsUrl, Max, Min, MinLength, ValidateNested } from 'class-validator'
import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import { Type } from 'class-transformer'
import { ResourcesFilterInput } from '../../common/types'
import { PASSWORD_MIN_LENGTH } from '../../constants'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import { UserType } from '../account/types'

// export enum EducationSystemType {
//   ICCSE = 'ICCSE',
//   AMERICAN = 'AMERICAN',
//   BRITISH = 'BRITISH',
//   AS = 'AS',
//   AL = 'AL',
//   IB = 'IGCSE',
//   SAT = 'SAT',
//   CONADIAN = 'CONADIAN',
//   NATIONAL_EGYPTIAN_CURRICULUM = 'NATIONAL_EGYPTIAN_CURRICULUM',
//   OTHER = 'OTHER',
// }

export enum UsersSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export enum Nationality {
  FINNISH = 'FINNISH',
  AUSTRIAN = 'AUSTRIAN',
  FRENCH = 'FRENCH',
  EGYPTIAN = 'EGYPTIAN',
}

export enum ExaminationBoardType {
  CAMBRIDGE = 'CAMBRIDGE',
  OXFORD = 'OXFORD',
  EDEXCEL = 'EDEXCEL',
  AQA = 'AQA',
  CHECKPOINT = 'CHECKPOINT',
  PRE_ICCSE = 'PRE_ICCSE',
  IELTS = 'IELTS',
  TOEFL = 'TOEFL',
  OTHER = 'OTHER',
}
export enum GradeLevel {
  GRADE_LEVEL_1_2 = '1-2',
  GRADE_LEVEL_1_3 = '1-3',
  GRADE_LEVEL_1_4 = '1-4',
  GRADE_LEVEL_1_5 = '1-5',
  GRADE_LEVEL_1_6 = '1-6',
  GRADE_LEVEL_1_7 = '1-7',
  GRADE_LEVEL_1_8 = '1-8',
  GRADE_LEVEL_1_9 = '1-9',
  GRADE_LEVEL_1_10 = '1-10',
  GRADE_LEVEL_1_11 = '1-11',
  GRADE_LEVEL_1_12 = '1-12',
}

registerEnumType(UsersSort, { name: 'UsersSort' })
registerEnumType(Nationality, { name: 'Nationality' })
registerEnumType(ExaminationBoardType, { name: 'ExaminationBoardType' })
registerEnumType(GradeLevel, { name: 'GradeLevel' })

@ObjectType()
@InputType('BirthDayInput')
export class BirthDay {
  @Max(31)
  @Min(1)
  @Field()
  day: number

  @Max(12)
  @Min(1)
  @Field()
  month: number

  @Min(1800)
  @Field()
  year: number
}

@ObjectType()
@InputType('PersonalDetailsInput')
export class PersonalDetails {
  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field(() => Nationality, { nullable: true })
  nationality?: Nationality

  @Field(() => BirthDay, { nullable: true })
  birthDay?: BirthDay
}

@ObjectType()
@InputType('ContactInformationInput')
export class ContactInformation {
  @Field({ nullable: true })
  addressLine?: string

  @IsPhoneNumber('EG')
  @Field({ nullable: true })
  phone?: string

  @IsEmail({ nullable: true }, { message: 'INVALID_EMAIL' })
  @Field()
  email?: string

  @Field(() => ObjectId, { nullable: true })
  city?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  state?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  country?: ObjectId
}

@ObjectType()
@InputType('TeachingInformationgradeLevelInput')
export class TeachingInformationgradeLevel {
  @Max(12)
  @Min(1)
  @Field({ nullable: true })
  fromgrade: number

  @Max(12)
  @Min(1)
  @Field({ nullable: true })
  tograde: number
}

@ObjectType()
@InputType('TeachingInformationInput')
export class TeachingInformation {
  @Field({ defaultValue: new ObjectId(), nullable: true })
  _id?: ObjectId

  @Field(() => [TeachingInformationgradeLevel], { nullable: true })
  gradeLevel?: TeachingInformationgradeLevel[]

  @Max(100)
  @Min(1)
  @Field({ nullable: true })
  price?: number

  @Field(() => ObjectId, { nullable: true })
  educationSystemId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId

  @Field(() => ExaminationBoardType, { nullable: true })
  examinationBoardType?: ExaminationBoardType

  @Field({ nullable: true })
  otherExaminationBoardType?: string
}

@ObjectType()
@InputType('UniversityDegreeInput')
export class UniversityDegree {
  @Field({ defaultValue: new ObjectId(), nullable: true })
  _id?: ObjectId

  @Field({ nullable: true })
  certificate?: string

  @Field({ nullable: true })
  institution?: string

  @Field({ nullable: true })
  date?: Date
}

@ObjectType()
@InputType('TeachingQualificationInput')
export class TeachingQualification {
  @Field({ defaultValue: new ObjectId(), nullable: true })
  _id?: ObjectId

  @Field({ nullable: true })
  certificate?: string

  @Field({ nullable: true })
  institution?: string

  @Field({ nullable: true })
  date?: Date
}

@ObjectType()
@InputType('EducationInput')
export class Education {
  @Field(() => [UniversityDegree], { nullable: true })
  universityDegree?: UniversityDegree[]

  @Field(() => [TeachingQualification], { nullable: true })
  teachingQualification?: TeachingQualification[]
}

@ObjectType()
@InputType('EmploymentRecordInput')
export class EmploymentRecord {
  @Field({ defaultValue: new ObjectId(), nullable: true })
  _id?: ObjectId

  @Field({ nullable: true })
  from?: Date

  @Field({ nullable: true })
  to?: Date

  @Field({ nullable: true })
  institution?: string

  @Field({ nullable: true })
  position?: string
}

@ObjectType()
export class User {
  @Field()
  _id: ObjectId

  @Field()
  image?: string

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  @Field()
  aboutYourself?: string

  @Field(() => Boolean, { defaultValue: true })
  isActive: true

  isDeleted: boolean

  @Field(() => UserType)
  userType: UserType

  @Field(() => PersonalDetails, { nullable: true })
  personalDetails?: PersonalDetails

  @Field(() => ContactInformation, { nullable: true })
  contactInformation?: ContactInformation

  @Field(() => [TeachingInformation], { nullable: true })
  teachingInformation?: TeachingInformation[]

  @Field(() => Education, { nullable: true })
  education?: Education

  @Field(() => [EmploymentRecord], { nullable: true })
  employmentRecord?: EmploymentRecord[]

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId
}

@InputType()
export class UserAddInput {
  @IsUrl({}, { message: 'INVALID_URL' })
  @Field({ nullable: true })
  image?: string

  @Field()
  name: string

  @IsEmail({}, { message: 'INVALID_EMAIL' })
  @Field()
  email: string

  @MinLength(PASSWORD_MIN_LENGTH, { message: 'PASSWORD_TOO_SHORT' })
  @Field()
  password: string

  @Field({ nullable: true })
  aboutYourself?: string

  @Field(() => UserType)
  userType: UserType

  @Field(() => PersonalDetails, { nullable: true })
  @Type(() => PersonalDetails)
  @ValidateNested()
  personalDetails?: PersonalDetails

  @Field(() => ContactInformation, { nullable: true })
  @Type(() => ContactInformation)
  @ValidateNested()
  contactInformation?: ContactInformation

  @Field(() => [TeachingInformation], { nullable: true })
  @ValidateNested()
  teachingInformation?: TeachingInformation[]

  @Field(() => Education, { nullable: true })
  @Type(() => Education)
  @ValidateNested()
  education?: Education

  @Field(() => [EmploymentRecord], { nullable: true })
  @ValidateNested()
  employmentRecord?: EmploymentRecord[]

  isActive: true

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId
}

@InputType()
export class UserEditInput {
  @Field({ nullable: true })
  name?: string

  @IsUrl({}, { message: 'INVALID_URL' })
  @Field({ nullable: true })
  image?: string

  @Field({ nullable: true })
  aboutYourself?: string

  @Field({ nullable: true })
  isActive?: boolean

  @Field(() => PersonalDetails, { nullable: true })
  personalDetails?: PersonalDetails

  @Field(() => ContactInformation, { nullable: true })
  contactInformation?: ContactInformation

  @Field(() => [TeachingInformation], { nullable: true })
  teachingInformation?: [TeachingInformation]

  @Field(() => Education, { nullable: true })
  education?: Education

  @Field(() => [EmploymentRecord], { nullable: true })
  employmentRecord?: EmploymentRecord[]

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId
}

@ObjectType()
export class UsersGetResponse extends ResourcesGetResponse(User) {}

@InputType()
export class UsersFilterInput extends ResourcesFilterInput {
  @Field(() => [UserType], { nullable: 'itemsAndList' })
  userType?: UserType[]

  @Field(() => [ObjectId], { nullable: 'itemsAndList' })
  userId?: ObjectId[]

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId
}

@InputType()
export class UsersGetInput extends ResourcesGetInput(UsersFilterInput) {
  @Field(() => UsersSort, { defaultValue: UsersSort.NEWEST })
  sort: UsersSort = UsersSort.NEWEST
}

@ObjectType()
export class TeachingInformationGetRequest {
  @Field()
  _id: ObjectId

  @Field(() => [TeachingInformationgradeLevel], { nullable: true })
  gradeLevel?: TeachingInformationgradeLevel[]

  @Max(100)
  @Min(1)
  @Field({ nullable: true })
  price?: number

  @Field(() => ObjectId, { nullable: true })
  educationSystemId?: ObjectId

  @Field(() => ObjectId, { nullable: true })
  subjectId?: ObjectId

  @Field({ nullable: true })
  educationSystem?: string

  @Field({ nullable: true })
  subject?: string

  @Field(() => ExaminationBoardType, { nullable: true })
  examinationBoardType?: ExaminationBoardType

  @Field({ nullable: true })
  otherExaminationBoardType?: string
}

@ObjectType()
export class TeachingInformationsOutput {
  @Field(() => [TeachingInformationGetRequest], { nullable: true })
  teachingInformation?: TeachingInformationGetRequest[]
}
