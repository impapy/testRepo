import { Request, Response } from 'express'
import { db } from '../../db'
import { Chate, ChateAddInput, Notification } from './types'
import { Context, DBCollections } from '../../common/types'
import { ChateService } from './Chate'
import { ObjectId } from 'aws-sdk/clients/codecommit'
import { Service } from 'typedi'
import { Arg, Args, Mutation, PubSub, Publisher, Resolver, Root, Subscription } from 'type-graphql'
import { MessagesGetInput, MessagesGetResponse } from '../message/types'
import { MessageService } from '../message/Message'
import { PubSubEngine, withFilter } from 'graphql-subscriptions'
import { pubsub } from '../subscription/types'
const SOMETHING_CHANGED_TOPIC = 'something_changed'
@Service()
@Resolver(() => Chate)
export class ChateResolver {
  constructor(private readonly messageService: MessageService, private readonly chateService: ChateService) {}

  @Mutation(() => Boolean)
  async chateAdd(@Arg('input') input: ChateAddInput, @PubSub('MESSAGEQUERY') publish: Publisher<Notification>): Promise<boolean> {
    await this.chateService.add(input)
    await publish({ message: input.name })
    return true
  }

  @Subscription({
    topics: 'MESSAGEQUERY',
    // subscribe: withFilter(
    //   () => pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC),
    //   (payload, variables) => {
    //     return payload.somethingChanged.id === variables.relevantId
    //   },
    // ),
  })
  subscriptionMessage(@Args() args: Notification, @Root() chate: Chate): Notification {
    // ...
    return args
  }
}
