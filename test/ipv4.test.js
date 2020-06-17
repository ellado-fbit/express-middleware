const ipv4 = require('../src/ipv4/ipv4')

describe('Testing ipv4 middleware...', () => {

  test(`(Check error) req.ip not detected as a string`, done => {
    const req = { ip: 100 }
    const res = {}
    const middleware = ipv4()
    middleware(req, res, err => {
      expect(err).toBeDefined()
      done()
    })
  })

  test(`Convert IPv6 format to IPv4 format`, done => {
    const req = { ip: '::ffff:192.0.2.128' }
    const res = {}
    const middleware = ipv4()
    middleware(req, res, err => {
      expect(req.ipv4).toBe('192.0.2.128')
      expect(err).toBeUndefined()
      done()
    })
  })

  test(`Convert localhost IPv6 format to IPv4 format`, done => {
    const req = { ip: '::1' }
    const res = {}
    const middleware = ipv4()
    middleware(req, res, err => {
      expect(req.ipv4).toBe('127.0.0.1')
      expect(err).toBeUndefined()
      done()
    })
  })

})
