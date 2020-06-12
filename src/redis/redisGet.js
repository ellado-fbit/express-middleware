'use strict'

// Middleware wrapper for the Redis GET command.
// Get the value of a key from the Redis cache.
// Returned value will be available on 'req.locals.redisValue'.

const redisGet = (redisClient, key) => {
  return (req, res, next) => {

      redisClient.get(key, (error, value) => {
        if (!error) {
          if (value) {
            req.locals.redisValue = JSON.parse(value)
          } else {
            req.locals.redisValue = null
          }
          next()
        } else {
          return res.status(500).json({ error: error.message })
        }
      })

  }
}

module.exports = redisGet
