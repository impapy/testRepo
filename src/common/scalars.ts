import { GraphQLScalarType, Kind } from 'graphql'
import { ObjectId } from 'mongodb'

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo object id scalar type',
  serialize: function (value: unknown): string {
    // check the type of received value
    if (!(value instanceof ObjectId)) {
      throw new Error('ObjectIdScalar can only serialize ObjectId values')
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return value.toHexString() // value sent to the client
  },
  parseValue(value: unknown): ObjectId {
    // check the type of received value
    if (typeof value !== 'string') {
      throw new Error('ObjectIdScalar can only parse string values')
    }
    return new ObjectId(value) // value from the client input variables
  },
  parseLiteral(ast): ObjectId {
    // check the type of received value
    if (ast.kind !== Kind.STRING) {
      throw new Error('ObjectIdScalar can only parse string values')
    }
    return new ObjectId(ast.value) // value from the client query
  },
})

export const ObjectScalarType = new GraphQLScalarType({
  name: 'Object',
  description: 'Arbitrary object',
  parseValue: (value) => {
    return typeof value === 'object' ? value : typeof value === 'string' ? JSON.parse(value) : null
  },
  serialize: (value) => {
    return typeof value === 'object' ? value : typeof value === 'string' ? JSON.parse(value) : null
  },
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value)
      case Kind.OBJECT:
        throw new Error(`Not sure what to do with OBJECT for ObjectScalarType`)
      default:
        return null
    }
  },
})
