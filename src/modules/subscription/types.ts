import { PubSub } from 'graphql-subscriptions'
import { Message } from '../message/types'

type Subscription = {
  somethingChanged: Message[]
}

type Result = {
  id: String
}

export const pubsub = new PubSub()
