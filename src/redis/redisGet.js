'use strict'

// Middleware wrapper for the Redis GET command.
// Get the value of a key from the Redis cache.
// Returned value will be available on 'res.locals.redisValue'.

const redisGet = (props) => {
  return (req, res, next) => {

    const client = props.client
    const key = props.key
    const parseResults = props.parseResults

    if (!client) {
      return res.status(400).json({ error: '[redisGet] \'client\' parameter is required' })
    }

    if (!key) {
      return res.status(400).json({ error: '[redisGet] \'key\' parameter is required' })
    }

    try {
      client.get(key(req), (err, value) => {
        if (err) throw err

        if (value) {
          if (parseResults) {

            try {
              res.locals.redisValue = JSON.parse(value)
            } catch (error) {
              return res.status(500).json({ error: `[redisGet] Error when parsing the value obtained from Redis: ${error.message}` })
            }

          } else {
            res.locals.redisValue = value
          }
        }

        next()
      })
    } catch (error) {
      return res.status(500).json({ error: `[redisGet] ${error.message}` })
    }

  }
}

module.exports = redisGet
