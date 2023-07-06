import { ValidationError } from 'class-validator'
import { getConstraints } from './helpers'

describe('getConstraints', () => {
  it('should return the correct output', () => {
    const validationErrors: ValidationError[] = [
      {
        target: {
          name: 'hgkjhg',
          sku: 'hgfjyg',
          description: 'jhlijgi',
          mockups: [
            {
              frontImage: 'http://a.jpeg',
              backImage: 'http://a',
            },
          ],
        },
        value: [
          {
            frontImage: 'http://a.jpeg',
            backImage: 'http://a',
          },
        ],
        property: 'mockups',
        children: [
          {
            target: [
              {
                frontImage: 'http://a.jpeg',
                backImage: 'http://a',
              },
            ],
            value: {
              frontImage: 'http://a.jpeg',
              backImage: 'http://a',
            },
            property: '0',
            children: [
              {
                target: {
                  frontImage: 'http://a.jpeg',
                  backImage: 'http://a',
                },
                value: 'http://a',
                property: 'backImage',
                children: [],
                constraints: {
                  isUrl: 'INVALID_URL',
                },
              },
            ],
          },
        ],
      },
    ]
    const constraints = getConstraints(validationErrors)

    expect(constraints.isUrl).toBe('INVALID_URL')
  })

  it('should return undefined if got an empty array', () => {
    const validationErrors: ValidationError[] = []
    const constraints = getConstraints(validationErrors)

    expect(constraints).toBe(undefined)
  })

  it('should return undefined and not recursively call itself forever if `constraints` property not found!', () => {
    const validationErrors: ValidationError[] = [
      {
        target: {
          name: 'hgkjhg',
          sku: 'hgfjyg',
          description: 'jhlijgi',
          mockups: [
            {
              frontImage: 'http://a.jpeg',
              backImage: 'http://a',
            },
          ],
        },
        value: [
          {
            frontImage: 'http://a.jpeg',
            backImage: 'http://a',
          },
        ],
        property: 'mockups',
        children: [
          {
            target: [
              {
                frontImage: 'http://a.jpeg',
                backImage: 'http://a',
              },
            ],
            value: {
              frontImage: 'http://a.jpeg',
              backImage: 'http://a',
            },
            property: '0',
            children: [
              {
                target: {
                  frontImage: 'http://a.jpeg',
                  backImage: 'http://a',
                },
                value: 'http://a',
                property: 'backImage',
                children: [],
              },
            ],
          },
        ],
      },
    ]
    const constraints = getConstraints(validationErrors)

    expect(constraints).toBe(undefined)
  })
})
