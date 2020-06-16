'use strict'

// Middleware wrapper for the Redis GET command.
// Get the value of a key from the Redis cache.
// Returned value will be available on 'res.locals.redisValue' by default.

const redisGet = (props) => {
  return (req, res, next) => {

    const client = props.client
    const key = props.key
    let resultProperty = props.resultProperty

    try {

      if (!client) {
        const error = Error('\'client\' parameter is required')
        throw error
      }

      if (!key) {
        const error = Error('\'key\' parameter is required')
        throw error
      }

      if (typeof(key(req)) !== 'string') {
        const error = Error('\'key\' function parameter must return a string')
        throw error
      }

      if (resultProperty && typeof(resultProperty) !== 'string') {
        const error = Error('\'resultProperty\' parameter must be string')
        throw error
      }

      client.get(key(req), (err, value) => {
        if (err) throw err

        if (value) {
          if (!resultProperty) resultProperty = 'redisValue'
          res.locals[resultProperty] = value
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
