const validateJsonSchema = require('../src/validateJsonSchema/validateJsonSchema')

describe('Testing validateJsonSchema middleware...', () => {

  test(`Validate instance`, done => {
    const req = { body: {
      name: 'esteve',
      city: 'palma'
    } }
    const res = {}
    const middleware = validateJsonSchema({
      schema: {
        type: 'object',
        required: ['name', 'city'],
        properties: {
          name: { type: 'string' },
          city: { type: 'string' },
        },
        additionalProperties: false
      },
      instanceToValidate: (req) => req.body
    })
    middleware(req, res, err => {
      expect(err).toBeUndefined()
      done()
    })
  })

  test(`Validate invalid instance`, done => {
    const req = { body: {
      name: 'esteve',
      city: 'palma'
    } }
    const res = {}
    const middleware = validateJsonSchema({
      schema: {
        type: 'object',
        required: ['name', 'surname', 'city'],
        properties: {
          name: { type: 'string' },
          surname: { type: 'string' },
          city: { type: 'string' },
        },
        additionalProperties: false
      },
      instanceToValidate: (req) => req.body
    })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

})
