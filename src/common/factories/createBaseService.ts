import { ClientSession, FilterQuery, ObjectId, OptionalId, UpdateQuery } from 'mongodb'
import { mergeDeepRight, omit } from 'ramda'
import { PER_PAGE } from '../../constants'

import { db } from '../../db'
import { DBCollections, PageInfo, ResourcesSortOptions, ResourcesSort, BaseDocument } from '../types'
import { CustomError } from '../errorHandling/costomError'

interface ResourceGetResponse<T> {
  pageInfo: PageInfo

  nodes: T[]
}

type DeepPartial<T extends Record<string, any>> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

type Keysof<T> = keyof Omit<T, 'isDeleted' | 'createdAt' | 'modifiedAt' | '_id'>

function createBaseService(collectionName: DBCollections) {
  return class BaseService<T extends BaseDocument> {
    protected readonly collection = db.collection<T>(collectionName)

    protected sort(sort: ResourcesSort = ResourcesSort.NEWEST): ResourcesSortOptions[ResourcesSort] {
      const options: ResourcesSortOptions = {
        NEWEST: { createdAt: -1 },
        OLDEST: { createdAt: 1 },
      }

      return options[sort] || sort
    }

    protected filter(
      filter: FilterQuery<T> & {
        searchTerm?: string
      },
      fields: Keysof<T>[],
    ) {
      const symbolsRegex = /[.*+?^${}()|[\]\\]/g
      const searchObject = filter.searchTerm && {
        $regex: filter.searchTerm.replace(symbolsRegex, '\\$&'),
        $options: 'i',
      }

      let searchObjectFields: { [Property: string]: typeof searchObject }[] = []

      for (const field of fields) {
        searchObjectFields = [...searchObjectFields, { [field]: searchObject }]
      }

      return {
        ...(filter.searchTerm && {
          $or: searchObjectFields,
        }),
        ...filter,
        isDeleted: false,
      } as FilterQuery<T> & {
        searchTerm?: string
      }
    }
    /**
     * just provide a `searchTerm` in the @param filter and @param filterFields to search by i.e. `["name"]` if all you need to do is searching
     */

    async all(
      filter: FilterQuery<T> & {
        searchTerm?: string
      } = {},
      sort: any = ResourcesSort.NEWEST,
      page = 1,
      perPage = PER_PAGE,
      filterFields: Keysof<T>[] = [],
    ): Promise<ResourceGetResponse<T>> {
      const sortOptions = this.sort(sort)
      const filterOptions = this.filter(filter, filterFields)
      const skip = (page - 1) * perPage
      const [nodes, total] = await Promise.all([
        this.collection
          .find(omit(['searchTerm'], filterOptions) as any)
          .sort(sortOptions)
          .skip(skip)
          .limit(perPage)
          .toArray(),
        this.collection.find(omit(['searchTerm'], filterOptions) as any).count(),
      ])
      const hasNextPage = page * perPage < total

      return { nodes, pageInfo: { total, hasNextPage, perPage, currentPage: page } }
    }

    async one(filter: Omit<FilterQuery<T>, 'isDeleted'>): Promise<T | null> {
      return await this.collection.findOne({
        ...filter,
        isDeleted: false,
      })
    }

    async add(record: Omit<OptionalId<T>, 'createdAt' | 'modifiedAt' | 'isDeleted'>, session?: ClientSession): Promise<T> {
      const now = new Date()

      const result = await this.collection.insertOne({ ...record, createdAt: now, modifiedAt: now, isDeleted: false } as unknown as OptionalId<T>, {
        session,
      })

      return result.ops[0] as T
    }

    async delete(filter: Omit<FilterQuery<T>, 'isDeleted'>, session?: ClientSession): Promise<ObjectId> {
      return (await this.edit(filter, { isDeleted: true } as any, session))._id
    }

    async edit(
      filter: Omit<FilterQuery<T>, 'isDeleted'>,
      update: Omit<DeepPartial<T>, '_id' | 'createdAt' | 'modifiedAt' | 'isDeleted'>,
      session?: ClientSession,
    ): Promise<T> {
      const resource = (await this.collection.findOne({
        ...filter,
        isDeleted: false,
      })) as unknown as Record<string, unknown>

      if (!resource) {
        throw new CustomError('NOT_FOUND')
      }

      const mergedResource = mergeDeepRight(resource, update) as T

      await this.collection.updateOne(
        {
          ...filter,
          isDeleted: false,
        } as FilterQuery<T>,
        {
          $set: { ...mergedResource, modifiedAt: new Date() },
        },
        { session },
      )

      return mergedResource
    }

    async updateMany(filter: Omit<FilterQuery<T>, 'isDeleted'>, update: UpdateQuery<T> | Partial<T>, session?: ClientSession): Promise<number> {
      return (
        await this.collection.updateMany({ ...filter, isDeleted: false }, { ...update, $set: { ...(update as any)['$set'], modifiedAt: new Date() } } as any, {
          session,
        })
      ).result.ok
    }

    deleteMany(filter: Omit<FilterQuery<T>, 'isDeleted'>, session?: ClientSession): Promise<number> {
      return this.updateMany(filter, { $set: { isDeleted: true } } as any, session)
    }
  }
}

export default createBaseService
