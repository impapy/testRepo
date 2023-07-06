import { ClientSession } from 'mongodb'
import { client } from '../db'

export const transaction = async <T>(cb: (session: ClientSession) => Promise<T>): Promise<T> => {
  const session = client.startSession()
  session.startTransaction()

  try {
    const res = await cb(session)

    await session.commitTransaction()
    session.endSession()

    return res
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}
