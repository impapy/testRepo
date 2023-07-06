import { ObjectId } from 'mongodb'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { SubjectsGetInput, SubjectsGetResponse, Subject, SubjectAddInput, SubjectEditInput } from './types'
import { SubjectService } from './Subject'

@Service()
@Resolver()
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}

  @Mutation(() => Subject)
  async subjectAdd(@Arg('input') input: SubjectAddInput): Promise<Subject> {
    return await this.subjectService.add(input)
  }

  @Mutation(() => ObjectId)
  async subjectDelete(@Arg('subjectId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.subjectService.delete(_id)
  }

  @Mutation(() => Subject)
  async subjectEdit(@Arg('subjectId') _id: ObjectId, @Arg('update', { defaultValue: {} }) update: SubjectEditInput): Promise<Subject> {
    return await this.subjectService.edit({ _id }, update)
  }

  @Query(() => SubjectsGetResponse)
  async subjects(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: SubjectsGetInput): Promise<SubjectsGetResponse> {
    return await this.subjectService.all(filter, sort, page, perPage, ['label'])
  }

  @Query(() => Subject, { nullable: true })
  async subject(@Arg('subjectId') _id: ObjectId): Promise<Subject | null> {
    return await this.subjectService.one(_id)
  }
}
