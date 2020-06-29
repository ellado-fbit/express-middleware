const jwt = require('jsonwebtoken')
const verifyJWT = require('../src/verifyJwt/verifyJWT')

describe('Testing verifyJWT middleware...', () => {

  test(`Verify JSON Web Token via query (&token=xxx)`, done => {
    // Signing a token
    const secret = 'MortadeloFilemoN'
    const payload = { username: 'ellado', role: 'admin' }
    let token = jwt.sign(payload, secret, { expiresIn: '24h' })

    const req = { headers: {}, query: {} }
    req.query.token = token
    const res = {}

    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeUndefined()
      expect(req.user.username).toBe('ellado')
      expect(req.user.role).toBe('admin')
      done()
    })
  })

  test(`Verify JSON Web Token via bearer token`, done => {
    // Signing a token
    const secret = 'MortadeloFilemoN'
    const payload = { username: 'ellado', role: 'admin' }
    let token = jwt.sign(payload, secret, { expiresIn: '24h' })

    const req = { headers: {}, query: {} }
    req.headers.authorization = `Bearer ${token}`
    const res = {}

    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeUndefined()
      expect(req.user.username).toBe('ellado')
      expect(req.user.role).toBe('admin')
      done()
    })
  })

  test(`(check AuthenticationError) No token provided`, done => {
    const secret = 'MortadeloFilemoN'
    const req = { headers: {}, query: {} }
    const res = {}

    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('AuthenticationError')
      expect(err.message).toMatch(/Token required/)
      expect(err.statusCode).toBe(401)
      done()
    })
  })

  test(`(check AuthenticationError) Invalid token`, done => {
    // Signing a token
    const secret = 'MortadeloFilemoN'
    const payload = { username: 'ellado', role: 'admin' }
    let token = jwt.sign(payload, secret, { expiresIn: '24h' })

    const req = { headers: {}, query: {} }
    req.headers.authorization = `Bearer ${token}aa`  // Added 'aa'
    const res = {}
    const middleware = verifyJWT({ secret })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('AuthenticationError')
      expect(err.message).toMatch(/INVALID_TOKEN/)
      expect(err.statusCode).toBe(401)
      done()
    })
  })

  test(`(check AuthenticationError) Bad secret`, done => {
    // Signing a token
    const secret = 'MortadeloFilemoN'
    const payload = { username: 'ellado', role: 'admin' }
    let token = jwt.sign(payload, secret, { expiresIn: '24h' })

    const req = { headers: {}, query: {} }
    req.headers.authorization = `Bearer ${token}`
    const res = {}
    const middleware = verifyJWT({ secret: 'bad_secret' })

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('AuthenticationError')
      expect(err.message).toMatch(/INVALID_TOKEN/)
      expect(err.statusCode).toBe(401)
      done()
    })
  })

  test(`(check Error) 'secret' parameter is required`, done => {
    const req = { headers: {}, query: {} }
    const res = {}
    const middleware = verifyJWT({})

    middleware(req, res, err => {
      expect(err).toBeDefined()
      expect(err.name).toBe('Error')
      expect(err.message).toMatch(/parameter is required/)
      done()
    })
  })

})
