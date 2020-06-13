'use strict'

// Middleware wrapper for the Redis GET command.
// Get the value of a key from the Redis cache.
// Returned value will be available on 'res.locals.redisValue'.

const redisGet = (props) => {
  return (req, res, next) => {

    // Checking props (props = { client: redisClient, key: redisKey })

    if (!props.client) {
      return res.status(400).json({ error: '[redisGet] \'client\' parameter is required' })
    }

    if (!props.key) {
      return res.status(400).json({ error: '[redisGet] \'key\' parameter is required' })
    }

    if (typeof(props.key) !== 'string') {
      return res.status(400).json({ error: '[redisGet] \'key\' parameter must be a string' })
    }

    const client = props.client
    let key = props.key

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

    try {
      client.get(key, (err, value) => {
        if (err) throw err
        res.locals.redisValue = value
        next()
      })
    } catch(error) {
      return res.status(500).json({ error: error.message })
    }

  }
}

module.exports = redisGet
