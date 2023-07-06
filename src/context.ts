import type { Request } from 'express'
import { verify, decode } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { nanoid } from 'nanoid'
import languageParser from 'accept-language-parser'
import { Context, LangType, Payload } from './common/types'
import { db } from './db/index'
import { UserType, Account, TokenType } from './modules/account/types'
import secrets from './secrets'
import { PubSub } from 'graphql-subscriptions'

export default async ({ req }: { req: Request }): Promise<Context> => {
  const context: Context = {
    lang: (languageParser.pick(['en', 'ar'], req?.headers?.['accept-language'] as string, { loose: true }) ?? 'en') as LangType,
    req,
    requestId: nanoid(),
    isAdmin: false,
    // TODO: add flags to user types
    isTeacher: false,
    isStudent: false,
    isParent: false,
    isSuperAdmin: false,
    pubsub: new PubSub(),
  }

  const tokenHeader = req?.headers?.authorization
  if (!tokenHeader) return context
  const token = tokenHeader.split(' ')[1]
  if (!token) return context

  try {
    const data = decode(token) as Payload
    const user = await db.collection<Account>(`accounts`).findOne({ username: data?.username, userType: data?.userType })
    const payload = verify(token, `${secrets.JWT_SECRET}${user?.userSigningKey}`) as Payload
    if (!payload || data?.type !== TokenType.ACCESS) return context

    context.isTeacher = user?.userType === UserType.TEACHER
    context.isStudent = user?.userType === UserType.STUDENT
    context.isParent = user?.userType === UserType.PARENT
    //  TODO: handle other types when they're added
    context.payload = { ...payload, user: new ObjectId(payload.user) }
    // context.isSuperAdmin = !!user?.isSuperAdmin

    return context
  } catch (e) {
    return context
  }
}
