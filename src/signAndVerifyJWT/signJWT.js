'use strict'

// Middleware to sign a JSON Web Token.
// The signed token will be available on the request via `token` property.

const jwt = require('jsonwebtoken')

const signJWT = (props) => {
  return (req, res, next) => {

    const payload = props.payload
    const secret = props.secret
    const signOptions = props.signOptions ? props.signOptions : {}

    try {
      if (!payload) {
        throw new Error(`'payload' parameter is required`)
      }

      if (typeof(payload) !== 'function') {
        throw new Error(`'payload' parameter must be a function that accepts req object as parameter`)
      }

      if (!secret) {
        throw new Error(`'secret' parameter is required`)
      }

      if (typeof(signOptions) !== 'object') {
        throw new Error(`The 'signOptions' parameter must be an object`)
      }

      jwt.sign(payload(req), secret, signOptions, (err, token) => {
        if (err) {
          throw new Error(err.message)
        } else {
          req.token = token
          next()
        }
      })

    } catch (error) {
      error.message = `[signJWT] ${error.message}`
      next(error)
    }

  }
}

module.exports = signJWT
