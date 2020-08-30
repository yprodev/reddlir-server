import { Resolver, Query, Ctx } from 'type-graphql'
import { Post } from '../entities/Post'
import { MyContext } from 'src/types'

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  post(@Ctx() { em }: MyContext): Promise<{}[]> {
    return em.find(Post, {})
  }
}
