import { Service } from 'typedi'
import { db } from '../../db/index'
import { TermsAndConditions, EditTermsAndConditionsArgs } from './types'
import { CustomError } from '../../common/errorHandling/costomError'

@Service()
export class TermsAndConditionsService {
  async all(): Promise<TermsAndConditions> {
    const items = await db.collection<TermsAndConditions>('termsAndConditions').find({}).sort({}).toArray()
    return items[0]
  }

  async edit({ content }: EditTermsAndConditionsArgs): Promise<TermsAndConditions> {
    const now = new Date()

    const updateResult = await db.collection<TermsAndConditions>('termsAndConditions').findOneAndUpdate(
      { isDeleted: false },
      {
        $set: {
          content,
          modifiedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { returnDocument: 'after', upsert: true },
    )
    if (!updateResult.value) throw new CustomError('TERMS_AND_CONDITIONS_NOT_FOUND', 500)
    return updateResult.value
  }
}
