const parseTypes = require('../src/parseTypes/parseTypes')

describe('Testing parseTypes middleware...', () => {
  const req = {
    params: {
      min_age: '35',
      max_age: '45',
      is_employee: 'True',
      min_salary: '35000.52',
      max_salary: '45000.52'
    }
  }
  const res = {}

  test(`Parse string properties into numbers and booleans`, done => {
    const middleware = parseTypes({
      objectToParse: (req) => req.params,
      properties: ['min_age', 'max_age', 'is_employee', 'max_salary']
    })
    middleware(req, res, err => {
      expect(err).toBeUndefined()
      expect(req.parsedObject).toBeDefined()
      expect(req.parsedObject.min_age).toBe(35)
      expect(req.parsedObject.max_age).toBe(45)
      expect(req.parsedObject.is_employee).toBe(true)
      expect(req.parsedObject.min_salary).toBe('35000.52')
      expect(req.parsedObject.max_salary).toBe(45000.52)
      done()
    })
  })

  test(`(check error) 'objectToParse' function must return an object`, done => {
    const middleware = parseTypes({
      // eslint-disable-next-line no-unused-vars
      objectToParse: (req) => 'hola'
    })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.message).toMatch(/'objectToParse' function must return an object/)
      done()
    })
  })

  test(`(check error) 'properties' must be an array`, done => {
    const middleware = parseTypes({
      objectToParse: (req) => req.params,
      properties: 'hola'
    })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.message).toMatch(/'properties' must be an array/)
      done()
    })
  })

})
