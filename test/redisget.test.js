const redis = require('redis')
const redisGet = require('../src/redis/redisGet')

describe('Testing redisGet middleware...', () => {
  const REDIS_DB_INDEX = 0
  let client

  beforeAll(() => {
    client = redis.createClient({ db: REDIS_DB_INDEX })
  })

  afterAll(() => {
    client.quit()
  })

  test(`Get value of existing key`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(JSON.parse(res.locals.redisValue).name).toBe('carlitos')
      done()
    })
  })

  test(`Set parameter resultProperty: 'result'`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key, resultProperty: 'result' })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(JSON.parse(res.locals.result).name).toBe('carlitos')
      done()
    })
  })

  test(`(Check error) Redis client not specified`, done => {
    const req = { key: 'juan' }
    const res = { locals: {} }
    const middleware = redisGet({ client: '', key: (req) => req.key })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`(Check error) Key parameter is not a string`, done => {
    const req = { key: 100 }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`(Check error) resultProperty is not a string`, done => {
    const req = { key: 'esteve' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key, resultProperty: 100 })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`Key not found`, done => {
    const req = { key: 'kkdevaka' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(res.locals.redisValue).toBeUndefined()
      done()
    })
  })

})
