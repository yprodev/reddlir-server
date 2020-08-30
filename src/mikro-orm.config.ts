import path from 'path'
import { MikroORM } from '@mikro-orm/core'

import { Post } from './entities/Post'
import { __prod__ } from './constants'

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/
  },
  entities: [Post],
  dbName: 'reddlir',
  user: 'reddlir',
  password: '1qaz2wsx',
  type: 'postgresql',
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0]
