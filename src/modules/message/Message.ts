import { Service } from 'typedi'
import createBaseService from '../../common/factories/createBaseService'
import { DBCollections } from '../../common/types'
import { db } from '../../db'
import { Message, MessageAddInput } from './types'

@Service()
export class MessageService extends createBaseService(DBCollections.MESSAGES)<Message> {
  constructor(private readonly messageCollection = db.collection<Message>(DBCollections.MESSAGES)) {
    super()
  }
}
