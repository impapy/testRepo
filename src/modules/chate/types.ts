import { ObjectId } from 'mongodb'
import { ArgsType, Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'

export enum ChatesSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(ChatesSort, { name: 'ChatesSort' })

@InputType()
@ObjectType('BaseChate', { isAbstract: true })
export class ChateAddInput {
  @Field({ defaultValue: 'sender' })
  name: string

  @Field(() => Boolean, { defaultValue: false })
  isGroup: boolean

  @Field(() => [ObjectId], { nullable: true })
  usersIds?: ObjectId[]

  @Field({ nullable: true })
  lastestMessageId?: ObjectId

  @Field({ nullable: true })
  groupAdminId?: ObjectId
}

@ObjectType()
export class Chate extends ChateAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class ChateEditInput {
  @Field({ nullable: true })
  label?: string
}

@ObjectType()
export class ChatesGetResponse extends ResourcesGetResponse(Chate) {}

@InputType()
export class ChatesFilterInput extends ResourcesFilterInput {}

@InputType()
export class ChatesGetInput extends ResourcesGetInput(ChatesFilterInput) {
  @Field(() => ChatesSort, { defaultValue: ChatesSort.NEWEST })
  sort: ChatesSort = ChatesSort.NEWEST
}

@ArgsType()
@InputType()
@ObjectType('BaseNotificationChate', { isAbstract: true })
export class Notification {
  @Field()
  message: string
}
