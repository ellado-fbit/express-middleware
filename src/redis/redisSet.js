'use strict'

// Middleware wrapper for the Redis SET command.
// Set the string value of a key.

const redisSet = (props) => {
  return (req, res, next) => {

    const client = props.client
    const key = props.key
    const value = props.value
    const expiration = props.expiration

    const errRequiredMsg = (param) => `'${param}' parameter is required`

    try {

      if (!client) {
        const error = Error(errRequiredMsg('client'))
        throw error
      }

      if (!key) {
        const error = Error(errRequiredMsg('key'))
        throw error
      }

      if (!value) {
        const error = Error(errRequiredMsg('value'))
        throw error
      }

      if (!expiration) {
        const error = Error(errRequiredMsg('expiration'))
        throw error
      }

      if (typeof(key) !== 'function') {
        const error = Error('\'key\' parameter must be a function that accepts req object as parameter')
        throw error
      }

      if (typeof(key(req)) !== 'string') {
        const error = Error('\'key\' function parameter must return a string')
        throw error
      }

      if (typeof(value) !== 'function') {
        const error = Error('\'value\' parameter must be a function that accepts req and res objects as parameter')
        throw error
      }

      if (typeof(value(req, res)) !== 'string') {
        const error = Error('\'value\' function parameter must return a string')
        throw error
      }

      if (!Number.isInteger(expiration)) {
        const error = Error(`'expiration' parameter must be integer`)
        throw error
      }

      if (expiration <= 0) {
        const error = Error(`'expiration' parameter must be greater than zero`)
        throw error
      }

      client.set(key(req), value(req, res), 'EX', expiration, (err) => {
        if (err) throw err
        next()
      })

    } catch (error) {
      error.message = `[redisSet] ${error.message}`
      next(error)
    }

  }
}

module.exports = redisSet
