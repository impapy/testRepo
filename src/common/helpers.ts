import { ValidationError } from 'class-validator'
import { path } from 'ramda'
import { db } from '../db'

export function parsePhoneNumber(phone?: string): string {
  if (!phone) return ''

  let parsedPhone = phone?.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()) // convert from arabic digits to English digits

  if (parsedPhone.startsWith('00')) parsedPhone = parsedPhone.slice(2)
  else if (parsedPhone.startsWith('+')) parsedPhone = parsedPhone.slice(1)
  else if (/^01[0125]{1}[0-9]{8}$/.test(parsedPhone)) parsedPhone = `2${parsedPhone}` // Egyptian phone number

  return parsedPhone
}

export function sanitizeUsername(username: string): string {
  return username.trim().toLowerCase()
}

export async function findInAllCollections(field: string, value: any): Promise<boolean> {
  const allCollections = await db.listCollections().toArray()
  let result = false

  switch (field) {
    case 'phone':
      value = parsePhoneNumber(value)
      field = 'contactDetails.phone'
      break

    case 'username':
      value = sanitizeUsername(value)
      break
  }

  for (const collection of allCollections) {
    const isExist = !!(await db.collection(collection.name).findOne({ [field]: value, isDeleted: false }))

    if (isExist) {
      result = true
      break
    }
  }

  return result
}

interface ReturnType {
  [Property: string]: string
}

export function getConstraints(validationErrors: ValidationError[]): ReturnType {
  const constraints = path([0, 'constraints'], validationErrors)
  const children = path([0, 'children'], validationErrors) as ValidationError[]

  if (!constraints && children?.length) {
    return getConstraints(children)
  }

  return constraints as ReturnType
}
