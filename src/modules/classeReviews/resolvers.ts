import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Service } from 'typedi'
import { ObjectId } from 'mongodb'
import { Authenticate } from '../../common/middleware/authenticate'
import { Context } from '../../common/types'
import { ClasseService } from '../classe/Classe'
import { ClasseReview, ClasseReviewAddInput, ClasseReviewsGetInput, ClasseReviewsGetResponse } from './types'
import { ClasseReviewService } from './ClasseReviews'
import { CustomError } from '../../common/errorHandling/costomError'

@Service()
@Resolver(() => ClasseReview)
export class ClasseReviewResolver {
  constructor(private readonly classeReviewService: ClasseReviewService, private readonly classeService: ClasseService) {}

  @UseMiddleware(Authenticate)
  @Mutation(() => ClasseReview)
  async classeReviewAdd(@Arg('input') input: ClasseReviewAddInput, @Ctx() ctx: Context): Promise<ClasseReview> {
    const classe = await this.classeService.one({ _id: input.classeId })
    if (!classe) throw new CustomError('NOT_FOUND', 404)
    return await this.classeReviewService.add({ ...input, studentId: ctx.payload!.user, teacherId: classe.userId })
  }

  @Query(() => ClasseReviewsGetResponse)
  async classeReviews(@Arg('input', { defaultValue: {} }) { filter, sort, page, perPage }: ClasseReviewsGetInput): Promise<ClasseReviewsGetResponse> {
    return await this.classeReviewService.all(filter, page, perPage, [], sort)
  }

  @Query(() => ClasseReview, { nullable: true })
  async classeReview(@Arg('classeReviewId') _id: ObjectId): Promise<ClasseReview | null> {
    return await this.classeReviewService.one(_id)
  }
}
