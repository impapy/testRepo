import { GraphQLError } from 'graphql'
import messages from './messages'

export type MessageType = keyof typeof messages

export class CustomError extends Error {
  constructor(code: MessageType, statusCode?: number) {
    super()
    const message = Object.values(messages[code])?.[0]
    throw new GraphQLError(message, {
      extensions: {
        code: code,
        status: statusCode || 404,
        http: {
          status: statusCode || 404,
        },
      },
    })
  }
}
