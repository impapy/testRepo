import { Service } from 'typedi'
import { ObjectId, ClientSession } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcryptjs'
import { pick } from 'ramda'
import { db } from '../../db/index'
import { DBCollections } from '../../common/types'
import secrets from '../../secrets'
import { sanitizeUsername } from '../../common/helpers'
import { UserService } from '../user/User'
import { Account, AccountAddArgs, AccountEditArgs, AccountGetArgs, LoginInput, LoginResponse, TokenType } from './types'
import { CustomError } from '../../common/errorHandling/costomError'

@Service()
export class AccountService {
  private readonly accounts = db.collection<Account>(DBCollections.ACCOUNTS)

  constructor(private readonly userService: UserService) {}

  static async signToken(payload: Record<string, string>, userSigningKey: string): Promise<string> {
    const keysMix = `${secrets.JWT_SECRET}${userSigningKey}`
    const token = sign(payload, keysMix)
    return token
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)
    return hashedPassword
  }

  static async comparePasswords(password: string, passwordHash: string): Promise<boolean> {
    const passwordMatched = await compare(password, passwordHash)
    return passwordMatched
  }

  async one({ username, user }: AccountGetArgs): Promise<Account | null> {
    if (!user && !username) return null

    return await this.accounts.findOne({
      isDeleted: false,
      ...(username && { username: sanitizeUsername(username) }),
      ...(user && { user }),
    })
  }

  async add({ user, userType, username, password }: AccountAddArgs, session?: ClientSession): Promise<Account> {
    const sanitizedUsername = sanitizeUsername(username)
    if (!sanitizedUsername) throw new CustomError('USERNAME_REQUIRED', 404)

    const salt = await genSalt()

    const now = new Date()

    const insertedResult = await this.accounts.insertOne(
      {
        user,
        userType,
        password: await AccountService.hashPassword(password),
        username: sanitizedUsername,
        userSigningKey: salt,
        createdAt: now,
        modifiedAt: now,
        isDeleted: false,
      },
      { session },
    )
    return insertedResult.ops[0]
  }

  async edit(args: AccountEditArgs, session?: ClientSession): Promise<Account> {
    const modifiedAt = new Date()
    const { filterQuery, updateQuery } = args

    const result = await this.accounts.findOneAndUpdate(
      { ...pick(['user', 'userType'], filterQuery), ...(filterQuery.username && { username: sanitizeUsername(filterQuery.username) }) },
      { $set: { ...updateQuery, modifiedAt } },
      { ...(session && { session }) },
    )

    if (!result.value) throw new CustomError('ACCOUNT_NOT_FOUND', 404)

    return result.value
  }

  async delete(user: ObjectId, session?: ClientSession): Promise<ObjectId> {
    const result = await this.accounts.findOneAndUpdate(
      { user, isDeleted: false },
      { $set: { modifiedAt: new Date(), isDeleted: true } },
      { ...(session && { session }) },
    )

    if (!result.value) {
      throw new CustomError('NOT_FOUND', 404)
    }

    return result.value.user
  }

  async login(args: LoginInput, account: Account): Promise<LoginResponse> {
    const isMatches = await AccountService.comparePasswords(args.password, account.password as string)

    if (!isMatches) {
      throw new CustomError('INCORRECT_CREDENTIALS', 404)
    }

    const token = await AccountService.signToken(
      {
        user: account.user.toString(),
        username: account.username,
        type: TokenType.ACCESS,
        userSigningKey: account.userSigningKey,
        userType: account.userType,
      },
      account.userSigningKey,
    )

    const user = (await this.userService.one({ _id: account.user }))!

    return {
      token,
      userType: account.userType,
      user: user!,
    }
  }

  async checkUsernameExist(username?: string, _id?: ObjectId): Promise<boolean> {
    if (!username) return false

    return !!(await this.accounts.findOne({
      username: sanitizeUsername(username),
      ...(_id && { _id: { $ne: _id } }),
    }))
  }

  parseUsername(username: string): string {
    return username.trim().toLowerCase()
  }
}
