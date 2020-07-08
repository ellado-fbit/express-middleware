const verifyJWT = require('../src/signAndVerifyJWT/verifyJWT')
const signJWT = require('../src/signAndVerifyJWT/signJWT')

describe('Testing signJWT and verifyJWT middlewares...', () => {

  const req = {
    headers: {},
    query: {},
    body: { username: 'ellado', role: 'admin' }
  }
  const res = {}

  let secret = 'MortadeloFilemoN'

  test(`Sign JSON Web Token`, done => {
    const middleware = signJWT({
      payload: (req) => req.body,
      secret,
      signOptions: { expiresIn: '24h' }
    })

    middleware(req, res, err => {
      expect(err).toBeUndefined()
      expect(req.token).toBeDefined()
      done()
    })
  })

  test(`Verify JSON Web Token via req.query.token`, done => {
    req.query.token = req.token
    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeUndefined()
      expect(req.tokenPayload.username).toBe('ellado')
      expect(req.tokenPayload.role).toBe('admin')
      done()
    })
  })

  test(`Verify JSON Web Token via bearer token`, done => {
    req.headers.authorization = `Bearer ${req.token}`
    delete req.query.token
    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeUndefined()
      expect(req.tokenPayload.username).toBe('ellado')
      expect(req.tokenPayload.role).toBe('admin')
      done()
    })
  })

  test(`Verify invalid secret`, done => {
    const middleware = verifyJWT({ secret: 'bad_secret' })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('InvalidTokenError')
      done()
    })
  })

  test(`Verify invalid token`, done => {
    const token = 'invalid_token'
    req.headers.authorization = `Bearer ${token}`
    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('InvalidTokenError')
      done()
    })
  })

  test(`No token provided`, done => {
    delete req.headers.authorization

    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('RequiredTokenError')
      expect(err.message).toMatch(/Token is required/)
      done()
    })
  })

  test(`(check error) 'secret' parameter is required in verifyJWT`, done => {
    const middleware = verifyJWT({})

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('Error')
      expect(err.message).toMatch(/parameter is required/)
      done()
    })
  })

  test(`(check error) 'payload' parameter is required in signJWT`, done => {
    const middleware = signJWT({})

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('Error')
      expect(err.message).toMatch(/'payload' parameter is required/)
      done()
    })
  })

  test(`(check error) 'secret' parameter is required in signJWT`, done => {
    const middleware = signJWT({
      payload: (req) => ({ username: req.user.username })
    })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('Error')
      expect(err.message).toMatch(/'secret' parameter is required/)
      done()
    })
  })

  test(`(check error) 'payload' parameter must be a function in signJWT`, done => {
    const middleware = signJWT({ payload: 'payload', secret })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('Error')
      expect(err.message).toMatch(/'payload' must be a function/)
      done()
    })
  })

  test(`(check error) 'signOptions' parameter must be object in signJWT`, done => {
    const middleware = signJWT({
      payload: (req) => ({ username: req.user.username }),
      secret,
      signOptions: 'options'
    })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('Error')
      expect(err.message).toMatch(/must be an object/)
      done()
    })
  })

})
