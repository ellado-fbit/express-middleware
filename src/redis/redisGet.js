'use strict'

// Middleware wrapper for the Redis GET command.
// Get the value of a key from the Redis cache.
// Returned value will be available on 'res.locals.redisValue' by default.

const redisGet = (props) => {
  return (req, res, next) => {

    const client = props.client
    const key = props.key
    const parseResults = props.parseResults
    const responseProperty = props.responseProperty

    try {

      if (!client) {
        const error = Error('\'client\' parameter is required')
        throw error
      }

      if (!key) {
        const error = Error('\'key\' parameter is required')
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

      if (parseResults && typeof(parseResults) !== 'boolean') {
        const error = Error('\'parseResults\' parameter must be boolean')
        throw error
      }

      if (responseProperty && typeof(responseProperty) !== 'string') {
        const error = Error('\'responseProperty\' parameter must be string')
        throw error
      }

      client.get(key(req), (err, value) => {
        if (err) throw err

        if (value) {
          res.locals[responseProperty ? responseProperty : 'redisValue'] = parseResults ? JSON.parse(value) : value
        }

        next()
      })

    } catch (error) {
      error.message = `[redisGet] ${error.message}`
      next(error)
    }

  }
}

module.exports = redisGet
