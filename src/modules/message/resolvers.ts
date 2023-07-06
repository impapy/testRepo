import { Request, Response } from 'express'
import { Arg, Ctx, Mutation, PubSub, PubSubEngine, Query, Resolver, Subscription } from 'type-graphql'
import { Service } from 'typedi'
import { Message, MessageAddInput, MessagesGetInput, MessagesGetResponse } from './types'
import { Context } from '../../common/types'
import { MessageService } from './Message'

const subscriptions: any[] = []
const noMassageUpdare = (fn: any) => subscriptions.push(fn)

@Service()
@Resolver(() => Message)
class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  async messageAdd(@Arg('input') input: MessageAddInput): Promise<Message> {
    subscriptions.forEach((fn) => fn())
    return await this.messageService.add(input)
  }

  // @Subscription({
  //   subscribe: (root, args, { pubSub }) => {
  //     const channel = Math.random().toString(36).slice(2, 15)
  //     noMassageUpdare(() => pubSub.puplish(channel, { MessagesGetResponse }))
  //     setTimeout(() => {
  //       pubSub.puplish(channel, { MessagesGetResponse })
  //     }, 0)
  //     return pubSub.asyncIterator(channel)
  //   },
  // })
  // async subscrioMessages(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: MessagesGetInput): Promise<MessagesGetResponse> {
  //   return await this.messageService.all(filter, sort, page, perPage)
  // }
}

export default MessageResolver
