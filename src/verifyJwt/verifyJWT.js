'use strict'

// Middleware to verify a JSON Web Token.
// The decoded token payload will be available on the request via the 'user' property.

const jwt = require('jsonwebtoken')
const AuthenticationError = require('../errors/errors').AuthenticationError

const verifyJWT = (props) => {
  return (req, res, next) => {

    const secret = props.secret

    try {
      if (!secret) {
        throw new Error(`[verifyJWT] 'secret' parameter is required`)
      }

      if (typeof(secret) !== 'string') {
        throw new Error(`[verifyJWT] The 'secret' parameter must be a string`)
      }

      let token = null
      if (req.query.token) token = req.query.token
      if (req.headers.authorization) token = req.headers.authorization.replace('Bearer ', '')

      if (token) {
        jwt.verify(token, secret, (err, tokenPayload) => {
          if (err) {
            throw new AuthenticationError(`INVALID_TOKEN`)
          } else {
            req.user = tokenPayload
            next()
          }
        })

      } else {
        throw new AuthenticationError(`Token required via 'authorization' header (bearer token) or passing a 'token' query parameter to the endpoint URL (?token=xxx).`)
      }

    } catch (error) {
      next(error)
    }

  }
}

module.exports = verifyJWT
