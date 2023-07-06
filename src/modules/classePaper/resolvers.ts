import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { Authenticate } from '../../common/middleware/authenticate'
import { ClasseService } from '../classe/Classe'
import { CheckIsStudent } from '../../common/middleware/checkIsStudent'
import { ClassePaper, ClassePaperAddInput, ClassePaperEditInput, ClassePapersGetInput, ClassePapersGetResponse } from './types'
import { ClassePaperService } from './ClassePaper'

@Service()
@Resolver(() => ClassePaper)
export class ClassePaperResolver {
  constructor(private readonly classePaperService: ClassePaperService, private readonly classeService: ClasseService) {}

  @UseMiddleware(Authenticate, CheckIsStudent)
  @Mutation(() => ClassePaper)
  async classePaperAdd(@Arg('input') input: ClassePaperAddInput): Promise<ClassePaper> {
    return await this.classePaperService.add(input)
  }

  @Query(() => ClassePapersGetResponse)
  async classePapers(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: ClassePapersGetInput): Promise<ClassePapersGetResponse> {
    return await this.classePaperService.all(filter, sort, page, perPage, ['title'])
  }

  @Query(() => ClassePaper, { nullable: true })
  async classePaper(@Arg('classePapereId') _id: ObjectId): Promise<ClassePaper | null> {
    return await this.classePaperService.one(_id)
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => ObjectId)
  async classePaperDelete(@Arg('classePaperId') _id: ObjectId): Promise<ObjectId | undefined> {
    return await this.classePaperService.delete({ _id })
  }

  @UseMiddleware(Authenticate)
  @Mutation(() => ClassePaper)
  async classePaperEdit(@Arg('classePaperId') _id: ObjectId, @Arg('update', { defaultValue: {} }) update: ClassePaperEditInput): Promise<ClassePaper> {
    return await this.classePaperService.edit({ _id }, update)
  }
}
