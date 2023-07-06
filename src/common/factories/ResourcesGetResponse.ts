import { ClassType, Field, ObjectType } from 'type-graphql'
import { PageInfo } from '../types'

function ResourcesGetResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class ResourcesGetResponseClass {
    @Field(() => PageInfo)
    pageInfo: PageInfo

    @Field(() => [TItemClass], { nullable: 'items' })
    nodes: TItem[]
  }

  return ResourcesGetResponseClass
}

export default ResourcesGetResponse
