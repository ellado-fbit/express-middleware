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

  test(`(check error) Validate invalid instance`, done => {
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
      expect(err.name).toBe('BadRequestError')
      done()
    })
  })

  test(`(check error) Compile invalid schema`, done => {
    const req = { body: {} }
    const res = {}
    const middleware = validateJsonSchema({
      schema: '',  // invalid schema
      instanceToValidate: (req) => req.body
    })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('Error')
      expect(err.message).toMatch(/schema should be object or boolean/)
      done()
    })
  })

})
