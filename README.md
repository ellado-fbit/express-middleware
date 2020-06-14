A useful collection of Express middlewares.

## Install

```bash
npm install @fundaciobit/express-middleware
```

## Redis GET command
Middleware wrapper for the Redis GET command. Get the value of a key from the Redis cache. Returned value will be available on 'res.locals.redisValue'.

```js
const express = require('express')
const redis = require('redis')
const { redisGet } = require('@fundaciobit/express-middleware')

const REDIS_DB_INDEX = 0
const client = redis.createClient({ db: REDIS_DB_INDEX })

const app = express()

app.get('/username/esteve',
  redisGet({
    client,
    key: (req) => req.path,
    parseResults: true
  }),
  (req, res) => {
    res.json(res.locals.redisValue)
  })

app.get('/username/:username',
  redisGet({
    client,
    key: (req) => req.params.username,
    parseResults: true
  }),
  (req, res) => {
    res.json(res.locals.redisValue)
  })

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```

## IPv4
Middleware to extract the IPv4 address from the request object (it converts IPv6 format to IPv4 format). The extracted address will be available on the request via the 'ipv4' property.

```js
const express = require('express')
const { ipv4 } = require('@fundaciobit/express-middleware')

const app = express()

app.use(ipv4())

app.get('/ip', (req, res) => {
  const { ipv4 } = req
  res.json({ ipv4 })
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```
