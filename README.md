A miscellaneous collection of Express middlewares.

*Note: For specific Express middleware wrappers for Redis and MongoDB, please visit* [@fundaciobit/express-redis-mongo](https://www.npmjs.com/package/@fundaciobit/express-redis-mongo)

## Middlewares

| middleware         | description                                           |
|--------------------|-------------------------------------------------------|
| ipv4               | Extracts IP address and converts IPv6 format to IPv4. |
| validateJsonSchema | Validates an instance with a provided JSON Schema.    |

## Install

```bash
npm install @fundaciobit/express-middleware
```

## `ipv4`
Middleware to extract the IPv4 address from the request object (it converts IPv6 format to IPv4 format). The extracted address will be available on the request via the `ipv4` property.

```js
const express = require('express')
const { ipv4 } = require('@fundaciobit/express-middleware')

const app = express()

app.use(ipv4())

app.get('/ip', (req, res) => {
  const { ipv4 } = req
  res.json({ ipv4 })
})

app.use((err, req, res, next) => {
  res.status(500).send(`Error: ${err.message}`)
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```

## `validateJsonSchema`
Middleware to validate the structure of an instance with the provided JSON Schema.

```js
const express = require('express')
const { validateJsonSchema } = require('@fundaciobit/express-middleware')

const app = express()

app.get('/name/:name/city/:city',
  validateJsonSchema({
    schema: {
      type: 'object',
      required: ['name', 'city'],
      properties: {
        name: { type: 'string' },
        city: { type: 'string' },
      },
      additionalProperties: false
    },
    instanceToValidate: (req) => req.params
  }),
  (req, res) => {
    res.status(200).send('Parameters are valid!')
  })

app.use((err, req, res, next) => {
  res.status(500).send(`Error: ${err.message}`)
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```