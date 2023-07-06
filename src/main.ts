import 'reflect-metadata'

import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { createSchema } from './modules'
import { connectToDB } from './db/index'
import context from './context'
import secrets from './secrets'
import bodyParser from 'body-parser'
import { ErrorFormat } from './common/errorHandling/formatError'
import { createServer } from 'http'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

const checkEnvVariables = () => {
  for (const key in secrets) {
    if (!secrets[key as keyof typeof secrets]) console.warn(`env variable ${key} is not set`) // eslint-disable-line no-console
  }
}

const main = async (): Promise<void> => {
  checkEnvVariables()
  await connectToDB()

  const app = express()
  const { PORT = 3001 } = process.env
  const httpServer = createServer(app)

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
  })
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const schema = await createSchema()
  const serverCleanup = useServer({ schema }, wsServer)

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    formatError: ErrorFormat,
    introspection: secrets.IS_PLAYGROUND_ENABLED || secrets.IS_INTROSPECTION_ENABLED,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await apolloServer.start()

  app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(apolloServer, { context }))

  httpServer.listen(PORT, () => console.log(`server ready on http://localhost:${PORT}/graphql`))
}

main().catch((err) => console.log(err)) // eslint-disable-line no-console
