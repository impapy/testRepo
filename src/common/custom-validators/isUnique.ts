// eslint-disable-next-line import/named
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { findInAllCollections } from '../helpers'

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, { property }: ValidationArguments): Promise<boolean> {
    // If it optional then it's logically valid
    if (!value) {
      return true
    }

    return !(await findInAllCollections(property, value))
  }
}

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueConstraint,
    })
  }
}
