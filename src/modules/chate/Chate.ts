import { Collection } from 'mongodb'
import createBaseService from '../../common/factories/createBaseService'
import { DBCollections } from '../../common/types'
import { db } from '../../db'
import { Chate, ChateAddInput } from './types'
import { Service } from 'typedi'

@Service()
export class ChateService extends createBaseService(DBCollections.CHATES)<Chate> {
  constructor(private readonly chateCollection = db.collection<Chate>(DBCollections.CHATES)) {
    super()
  }
}
