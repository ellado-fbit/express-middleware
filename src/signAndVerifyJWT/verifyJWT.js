'use strict'

// Middleware to verify a JSON Web Token. The token to verify is extracted from:
// - The `Authorization` header as a bearer token ( `Authorization: Bearer AbCdEf123456` ),
// - or through a `token` query parameter passed to the endpoint ( `http://...?token=AbCdEf123456` ).

// If the token is verified, then the decoded token payload is available on the request via the
// `tokenPayload` property, and the control is passed to the next middleware.

const jwt = require('jsonwebtoken')
const RequiredTokenError  = require('../errors/errors').RequiredTokenError
const InvalidTokenError  = require('../errors/errors').InvalidTokenError

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
            throw new InvalidTokenError(`Invalid token, ${err.message}`)
          } else {
            req.tokenPayload = tokenPayload
            next()
          }
        })

      } else {
        throw new RequiredTokenError('Token is required')
      }

    } catch (error) {
      error.message = `[verifyJWT] ${error.message}`
      next(error)
    }

  }
}

module.exports = verifyJWT
