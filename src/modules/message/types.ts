import { ObjectId } from 'mongodb'
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql'
import ResourcesGetInput from '../../common/factories/ResourcesGetInput'
import ResourcesGetResponse from '../../common/factories/ResourcesGetResponse'
import { ResourcesFilterInput } from '../../common/types'

export enum MessagesSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

registerEnumType(MessagesSort, { name: 'MessagesSort' })

@InputType()
@ObjectType('BaseMessage', { isAbstract: true })
export class MessageAddInput {
  @Field()
  senderId: ObjectId

  @Field()
  content: string

  @Field()
  chateId: ObjectId
}

@ObjectType()
export class Message extends MessageAddInput {
  @Field(() => ObjectId)
  _id: ObjectId

  @Field()
  createdAt: Date

  @Field()
  modifiedAt: Date

  isDeleted: boolean
}

@InputType()
export class MessageEditInput {
  @Field({ nullable: true })
  label?: string
}

@ObjectType()
export class MessagesGetResponse extends ResourcesGetResponse(Message) {}

@InputType()
export class MessagesFilterInput extends ResourcesFilterInput {}

@InputType()
export class MessagesGetInput extends ResourcesGetInput(MessagesFilterInput) {
  @Field(() => MessagesSort, { defaultValue: MessagesSort.NEWEST })
  sort: MessagesSort = MessagesSort.NEWEST
}
