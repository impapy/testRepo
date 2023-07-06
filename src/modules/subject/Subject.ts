import { Service } from 'typedi'

import createBaseService from '../../common/factories/createBaseService'
import { DBCollections } from '../../common/types'
import { Subject } from './types'

@Service()
export class SubjectService extends createBaseService(DBCollections.SUBJECTS)<Subject> {}
