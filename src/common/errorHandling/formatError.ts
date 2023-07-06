import { GraphQLError, GraphQLFormattedError } from 'graphql/error/GraphQLError'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import { path } from 'ramda'
import { CustomError } from './costomError'
import messages from './messages'

export const ErrorFormat = (formattedError: GraphQLFormattedError, error: any) => {
  const errorServer = Object.values(ApolloServerErrorCode)
  const errorReq = formattedError.extensions?.code as ApolloServerErrorCode
  if (errorServer.includes(errorReq) || formattedError.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: formattedError.extensions?.code,
        status: 500,
        http: {
          status: 500,
        },
      },
    })
  } else {
    const isValidationError = error?.message?.startsWith('Variable "') || path(['extensions', 'code'], error) === 'GRAPHQL_VALIDATION_FAILED'
    const clientError = { ...error }
    if (isValidationError) {
      clientError.message = messages.SERVER_ERROR['en']
    }
    clientError.code = error?.originalError?.code
    delete clientError.extensions.exception
    return clientError
  }
}
