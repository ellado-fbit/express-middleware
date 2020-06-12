'use strict'

// Middleware wrapper for the Redis GET command.
// Get the value of a key from the Redis cache.
// Returned value will be available on 'res.locals.redisValue'.

const redisGet = (redisClient, key) => {
  return (req, res, next) => {

      redisClient.get(key, (error, value) => {
        if (!error) {
          if (value) {
            res.locals.redisValue = JSON.parse(value)
          } else {
            res.locals.redisValue = null
          }
          next()
        } else {
          return res.status(500).json({ error: error.message })
        }
      })

  }
}

module.exports = redisGet
