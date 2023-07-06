import { Args, Ctx, Mutation, Resolver, Query } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../../common/types'
import { TermsAndConditions, EditTermsAndConditionsArgs } from './types'
import { TermsAndConditionsService } from './TermsAndConditions'
import { CustomError } from '../../common/errorHandling/costomError'

@Service()
@Resolver(() => TermsAndConditions)
export class TermsAndConditionsResolver {
  constructor(private readonly termsAndConditionsService: TermsAndConditionsService) {}

  @Mutation(() => TermsAndConditions)
  async addTermsAndConditions(@Args() args: EditTermsAndConditionsArgs, @Ctx() ctx: Context): Promise<TermsAndConditions> {
    if (!ctx.isAdmin) throw new CustomError('UNAUTHORIZED', 500)
    return this.termsAndConditionsService.edit({ ...args })
  }

  @Query(() => TermsAndConditions)
  async getTermsAndConditions(): Promise<TermsAndConditions> {
    return await this.termsAndConditionsService.all()
  }

  @Mutation(() => TermsAndConditions)
  async editTermsAndConditions(@Args() args: EditTermsAndConditionsArgs, @Ctx() ctx: Context): Promise<TermsAndConditions | null> {
    if (!ctx.isAdmin) throw new CustomError('UNAUTHORIZED', 500)
    return this.termsAndConditionsService.edit(args)
  }
}
