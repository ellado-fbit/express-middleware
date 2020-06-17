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

  test(`(Check error) Redis client not specified`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client: '', key: (req) => req.key })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`(Check error) Key parameter not specified`, done => {
    const req = {}
    const res = { locals: {} }
    const middleware = redisGet({ client })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`(Check error) Key parameter is not a function`, done => {
    const req = {}
    const res = { locals: {} }
    const middleware = redisGet({ client, key: 'pedro' })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`(Check error) Key parameter function not returns a string`, done => {
    const req = { key: 100 }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`(Check error) responseProperty is not a string`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key, responseProperty: 100 })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`(Check error) parseResults is not a boolean`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key, parseResults: 100 })
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`Get value of existing key`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(JSON.parse(res.locals.redisValue).name).toBe('carlitos')
      expect(err).toBeUndefined()
      done()
    })
  })

  test(`Set parameter responseProperty to 'result'`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key, responseProperty: 'result' })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(JSON.parse(res.locals.result).name).toBe('carlitos')
      expect(err).toBeUndefined()
      done()
    })
  })

  test(`Key not found`, done => {
    const req = { key: 'miguel' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(res.locals.redisValue).toBeUndefined()
      expect(err).toBeUndefined()
      done()
    })
  })

  test(`Get JSON parsed value of existing key`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key, parseResults: true })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(res.locals.redisValue.name).toBe('carlitos')
      expect(err).toBeUndefined()
      done()
    })
  })

  test(`Get JSON parsed value of existing key, and set parameter responseProperty to 'result'`, done => {
    const req = { key: 'carlitos' }
    const res = { locals: {} }
    const middleware = redisGet({ client, key: (req) => req.key, responseProperty: 'result', parseResults: true })
    // eslint-disable-next-line no-unused-vars
    middleware(req, res, err => {
      expect(res.locals.result.name).toBe('carlitos')
      expect(err).toBeUndefined()
      done()
    })
  })

})
