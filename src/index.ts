import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import express from 'express'
import { MikroORM } from '@mikro-orm/core'
import { ApolloServer } from 'apollo-server-express'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'

import { __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import { MyContext } from './types'

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up()
  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  const app = express()

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__ // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'djfooerjefjdlfjfkjflds', // do env var
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server listening on port: 4000')
  })
}

main().catch(e => {
  console.error(e)
})
