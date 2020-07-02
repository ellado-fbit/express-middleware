'use strict'

// Middleware to verify a JSON Web Token. The token is extracted from (two options):
// - The `Authorization` header as a bearer token ( `Authorization: Bearer AbCdEf123456` ),
// - Through a `token` query parameter passed to the endpoint ( `http://...?token=AbCdEf123456` ).
//
// If the token is verified, then:
// - The `isTokenVerified` property is set to `true` on the request,
// - The decoded token payload is also available on the request via the `tokenPayload` property.
//
// If the token is invalid, then:
// - The property `isTokenVerified` is set to `false`,
// - The control is passed to the next middleware to manage the authentication error.

const jwt = require('jsonwebtoken')

const verifyJWT = (props) => {
  return (req, res, next) => {

    const secret = props.secret

    try {
      if (!secret) {
        throw new Error(`'secret' parameter is required`)
      }

      let token = null
      if (req.query.token) token = req.query.token
      if (req.headers.authorization) token = req.headers.authorization.replace('Bearer ', '')

      if (token) {

        jwt.verify(token, secret, (err, tokenPayload) => {
          if (err) {
            req.isTokenVerified = false
          } else {
            req.isTokenVerified = true
            req.tokenPayload = tokenPayload
          }
          next()
        })

      } else {
        req.isTokenVerified = false
        next()
      }

    } catch (error) {
      error.message = `[verifyJWT] ${error.message}`
      next(error)
    }

  }
}

module.exports = verifyJWT
