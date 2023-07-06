import { ObjectId } from 'mongodb'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { EducationSystemsGetInput, EducationSystemsGetResponse, EducationSystem, EducationSystemAddInput, EducationSystemEditInput } from './types'
import { EducationSystemService } from './EducationSystem'

@Service()
@Resolver()
export class EducationSystemResolver {
  constructor(private readonly educationSystemService: EducationSystemService) {}

  @Mutation(() => EducationSystem)
  async educationSystemAdd(@Arg('input') input: EducationSystemAddInput): Promise<EducationSystem> {
    return await this.educationSystemService.add(input)
  }

  @Mutation(() => ObjectId)
  async educationSystemDelete(@Arg('educationSystemId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.educationSystemService.delete(_id)
  }

  @Mutation(() => EducationSystem)
  async educationSystemEdit(
    @Arg('educationSystemId') _id: ObjectId,
    @Arg('update', { defaultValue: {} }) update: EducationSystemEditInput,
  ): Promise<EducationSystem> {
    return await this.educationSystemService.edit({ _id }, update)
  }

  @Query(() => EducationSystemsGetResponse)
  async educationSystems(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: EducationSystemsGetInput): Promise<EducationSystemsGetResponse> {
    return await this.educationSystemService.all(filter, sort, page, perPage, ['label'])
  }

  @Query(() => EducationSystem, { nullable: true })
  async educationSystem(@Arg('educationSystemId') _id: ObjectId): Promise<EducationSystem | null> {
    return await this.educationSystemService.one(_id)
  }
}
