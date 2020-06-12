'use strict'

// Middleware wrapper for the Redis GET command.
// Get the value of a key from the Redis cache.
// Returned value will be available on 'res.locals.redisValue'.

const redisGet = (props) => {
  return (req, res, next) => {

    const client = props.client
    let key = props.key

    if (typeof(key) !== 'string') {
      return res.status(400).json({ error: '[redisGet] \'key\' parameter must be a string' })
    }

    let fields = key.split('.')

    if (fields[0] === 'req') {
      if (fields.length === 2) {
        key = req[fields[1]]
      } else if (fields.length === 3) {
        key = req[fields[1]][fields[2]]
      } else {
        return res.status(400).json({ error: '[redisGet] invalid \'key\' parameter' })
      }
    }

    client.get(key, (error, value) => {
      if (!error) {
        res.locals.redisValue = value
        next()
      } else {
        return res.status(500).json({ error: error.message })
      }
    })

  }
}

module.exports = redisGet
