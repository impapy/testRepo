import { ObjectId } from 'mongodb'
import { Arg, Ctx, Mutation, Query, Resolver, Subscription } from 'type-graphql'
import { Service } from 'typedi'
import { MessagesGetInput, MessagesGetResponse } from '../message/types'
import { Context } from '../../common/types'
import { MessageService } from '../message/Message'
import { ChatesGetResponse } from '../chate/types'

@Service()
@Resolver()
export class SubscriptionResolver {
  constructor(private readonly messageService: MessageService) {}

 
}
