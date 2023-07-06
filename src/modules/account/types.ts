import { Field, registerEnumType, ArgsType, ObjectType, InputType, createUnionType } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { User } from '../user/types'
import { path } from 'ramda'

export enum UserType {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

registerEnumType(UserType, { name: 'userType' })

export class Account {
  user: ObjectId

  username: string

  password: string

  userType: UserType

  userSigningKey: string

  createdAt: Date

  modifiedAt: Date

  isDeleted: boolean
}

export class AccountEditArgs {
  filterQuery: AccountEditFilterQuery

  updateQuery: AccountEditUpdateQuery
}

export class AccountEditFilterQuery {
  user?: ObjectId

  userType?: UserType

  username?: string
}

export class AccountEditUpdateQuery {
  password?: string

  isSuspended?: boolean

  userSigningKey?: string
}

@ArgsType()
export class LoginArgs {
  @Field({ nullable: false })
  username: string

  @Field({ nullable: false })
  password: string
}

export enum TokenType {
  ACCESS = 'ACCESS',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@ArgsType()
export class ChangePasswordArgs {
  @Field({ nullable: false })
  password: string

  @Field({ nullable: false })
  newPassword: string
}

@ArgsType()
export class AccountGetArgs {
  @Field()
  user?: ObjectId

  @Field()
  username?: string
}

export class AccountAddArgs {
  user: ObjectId

  username: string

  userType: UserType

  password: string
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string

  @Field(() => User)
  user: User

  @Field(() => UserType)
  userType?: UserType
}

@InputType()
export class LoginInput {
  @Field()
  username: string

  @Field()
  password: string
}
