'use strict'

// Middleware wrapper for the Redis SET command.
// Set the string value of a key.

const redisSet = (props) => {
  return (req, res, next) => {

    const client = props.client
    const key = props.key
    const value = props.value
    const expiration = props.expiration

    const errRequiredMsg = (param) => `[redisSet] '${param}' parameter is required`

    if (!client) {
      return res.status(400).json({ error: errRequiredMsg('client') })
    }

    if (!key) {
      return res.status(400).json({ error: errRequiredMsg('key') })
    }

    if (!value) {
      return res.status(400).json({ error: errRequiredMsg('value') })
    }

    if (!expiration) {
      return res.status(400).json({ error: errRequiredMsg('expiration') })
    }

    if (typeof(key(req)) !== 'string') {
      return res.status(400).json({ error: '[redisSet] \'key\' function parameter must return a string' })
    }

    if (typeof(value(req, res)) !== 'string') {
      return res.status(400).json({ error: '[redisSet] \'value\' function parameter must return a string' })
    }

    if (!Number.isInteger(expiration)) {
      return res.status(400).json({ error: `[redisSet] 'expiration' parameter must be integer` })
    }

    if (expiration <= 0) {
      return res.status(400).json({ error: `[redisSet] 'expiration' parameter must be greater than zero` })
    }

    try {
      client.set(key(req), value(req, res), 'EX', expiration, (err) => {
        if (err) throw err
        next()
      })
    } catch (error) {
      return res.status(500).json({ error: `[redisSet] ${error.message}` })
    }

  }
}

module.exports = redisSet
