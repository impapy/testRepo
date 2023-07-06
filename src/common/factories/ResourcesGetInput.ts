import { ClassType, Field, InputType, Int } from 'type-graphql'
import { PER_PAGE } from '../../constants'

function ResourcesGetInput<TFilterInput>(TFilterInputClass: ClassType<TFilterInput>) {
  @InputType({ isAbstract: true })
  abstract class ResourcesGetInputClass {
    @Field(() => TFilterInputClass, { defaultValue: {} })
    filter: TFilterInput

    @Field(() => Int, { defaultValue: 1 })
    page = 1

    @Field(() => Int, { defaultValue: PER_PAGE })
    perPage = PER_PAGE
  }

  return ResourcesGetInputClass
}

export default ResourcesGetInput
