# Miscellaneous Express middlewares

A miscellaneous collection of Express middlewares.

*Note: For specific Express middleware wrappers for Redis and MongoDB, please visit* [@fundaciobit/express-redis-mongo](https://www.npmjs.com/package/@fundaciobit/express-redis-mongo)

## Middlewares

| middleware         | description                                           |
|--------------------|-------------------------------------------------------|
| ipv4               | Extracts IP address and converts IPv6 format to IPv4. |
| parseTypes         | Parses string properties into numbers or booleans.    |
| validateJsonSchema | Validates an instance with a provided JSON Schema.    |
| verifyJWT          | Verify a JSON Web Token.                              |
| signJWT            | Sign a JSON Web Token.                                |

## Install

```bash
npm install @fundaciobit/express-middleware
```

## Index

- [`ipv4`](#ipv4)
- [`parseTypes`](#parsetypes)
- [`validateJsonSchema`](#validatejsonschema)
- [`verifyJWT`](#verifyjwt)
- [`signJWT`](#signjwt)

## `ipv4`

Middleware to extract the IPv4 address from the request object (it converts IPv6 format to IPv4 format). The extracted address will be available on the request via the `ipv4` property.

### Usage

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
  res.status(500).send(err.toString())
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```

## `parseTypes`

Middleware to convert string properties of an object to numbers (integers or floats) or booleans. The provided object will not be mutated. The copied and parsed object will be available on the request via `parsedObject` property.

### Parameters

- `objectToParse`: (*required*) Function that accepts the request object as parameter, that returns the object to parse.
- `properties`: (*optional*) Array of properties to parse. If not provided, the conversion is applied to all properties of the object.

### Usage

```js
const express = require('express')
const { parseTypes } = require('@fundaciobit/express-middleware')

const app = express()

app.get('/users/min_age/:min_age/max_age/:max_age/is_employee/:is_employee/min_salary/:min_salary/max_salary/:max_salary',
  parseTypes({
    objectToParse: (req) => req.params
  }),
  (req, res) => {
    const { params, parsedObject } = req
    res.status(200).json({ params, parsedObject })
  })

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(3000, () => { console.log(`Server running on port ${port}...`) })

```

## `validateJsonSchema`

Middleware to validate the structure of an instance with the provided JSON Schema.

### Parameters

- `schema`: (*required*) is a JSON Schema object.
- `instanceToValidate`: (*required*) is a function that accepts the request object as parameter, that returns the 'instance' to validate (string, array or object).

### Usage

```js
const express = require('express')
const bodyParser = require('body-parser')
const { validateJsonSchema } = require('@fundaciobit/express-middleware')

const app = express()

app.use(bodyParser.json())

app.post('/login',
  validateJsonSchema({
    schema: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      additionalProperties: false
    },
    instanceToValidate: (req) => req.body
  }),
  (req, res) => {
    res.sendStatus(200)
  })

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```

## `verifyJWT`

Middleware to verify a JSON Web Token. The token to verify is extracted from:

- the `Authorization` header as a bearer token ( `Authorization: Bearer AbCdEf123456` ),
- or through a `token` query parameter ( `http://...?token=AbCdEf123456` ).

If the token is verified, then the decoded token payload is available on the request via the `tokenPayload` property, and the control is passed to the next middleware.

### Parameters

- `secret`: (*required*) is a string, buffer, or object containing either the secret for HMAC algorithms or the PEM encoded private key for RSA and ECDSA, as described in [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).

### Usage

```js
const express = require('express')
const { verifyJWT } = require('@fundaciobit/express-middleware')

const app = express()

app.get('/protected',
  verifyJWT({ secret: 'my_secret' }),
  (req, res) => {
    res.sendStatus(200)
  })

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```

## `signJWT`

Middleware to sign a JSON Web Token. The signed token will be available on the request via `token` property.

### Parameters

- `payload`: (*required*) is a function that accepts the request object as parameter, that returns an object literal, buffer or string representing valid JSON.
- `secret`: (*required*) is a string, buffer, or object containing either the secret for HMAC algorithms or the PEM encoded private key for RSA and ECDSA, as described in [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).
- `signOptions`: (*optional*) is an object with extra info to encode, as described in [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken). `Eg: { expiresIn: '24h' }`

### Usage

```js
const express = require('express')
const bodyParser = require('body-parser')
const { signJWT } = require('@fundaciobit/express-middleware')

const app = express()

app.use(bodyParser.json())

app.post('/login',
  // Here include a middleware to verify user credentials from req.body:
  //  If Ok: set user info in req.user (without password) and call next().
  //  Else: call next(error) to handle the authentication error.
  signJWT({
    payload: (req) => ({
      username:  req.user.username,
      role: req.user.role
    }),
    secret: 'my_secret',
    signOptions: { expiresIn: '24h' }
  }),
  (req, res) => {
    const { token } = req
    res.status(200).json({ token })
  })

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```
