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
    let token = null

    try {
      if (!secret) throw new Error(`'secret' parameter is required`)

      if (req.query.token) token = req.query.token.trim()
      if (req.headers.authorization) token = req.headers.authorization.replace('Bearer ', '').trim()
      if (!token) throw new RequiredTokenError('Token is required')

    } catch (error) {
      error.message = `[verifyJWT] ${error.message}`
      return next(error)
    }

    jwt.verify(token, secret, (err, tokenPayload) => {
      try {
        if (err) throw new InvalidTokenError(err.message)

        req.tokenPayload = tokenPayload
        return next()

      } catch (error) {
        error.message = `[verifyJWT] ${error.message}`
        return next(error)
      }
    })

  }
}

module.exports = verifyJWT
