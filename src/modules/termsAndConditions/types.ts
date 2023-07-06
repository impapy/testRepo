import { ArgsType, Field, ObjectType } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { TextLangObject, TextLangObjectRequired } from '../../common/types'

@ObjectType()
export class TermsAndConditions {
  @Field()
  content: TextLangObject

  @Field()
  createdAt: Date

  @Field()
  modifiedAt?: Date

  isDeleted: boolean

  @Field()
  _id: ObjectId
}

@ArgsType()
export class EditTermsAndConditionsArgs {
  @Field({ nullable: false })
  content: TextLangObjectRequired
}
