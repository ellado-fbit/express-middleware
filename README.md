# Miscellaneous Express middlewares

A miscellaneous collection of Express middlewares.

*Note: For specific Express middleware wrappers for Redis and MongoDB, please visit* [@fundaciobit/express-redis-mongo](https://www.npmjs.com/package/@fundaciobit/express-redis-mongo)

## Middlewares

| middleware         | description                                           |
|--------------------|-------------------------------------------------------|
| ipv4               | Extracts IP address and converts IPv6 format to IPv4. |
| validateJsonSchema | Validates an instance with a provided JSON Schema.    |
| verifyJWT          | Verify a JSON Web Token.                              |
| signJWT            | Sign a JSON Web Token.                                |

## Install

```bash
npm install @fundaciobit/express-middleware
```

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

## `validateJsonSchema`

Middleware to validate the structure of an instance with the provided JSON Schema.

### Parameters

* `schema`: (*required*) is a JSON Schema object.
* `instanceToValidate`: (*required*) is a function with request object as parameter that returns the 'instance' to validate (string, array or object).

### Usage

```js
const express = require('express')
const bodyParser = require('body-parser')
const { validateJsonSchema } = require('@fundaciobit/express-middleware')

const app = express()

app.use(bodyParser.json())

app.get('/login',
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

Middleware to verify a JSON Web Token.

The token is extracted from:

* The `Authorization` header as a bearer token ( `Authorization: Bearer AbCdEf123456` ),
* or through a `token` query parameter passed to the endpoint ( `http://...?token=AbCdEf123456` ).

If the token is verified, then:

* The `isTokenVerified` property is set to `true` on the request,
* the decoded token payload is also available on the request via the `tokenPayload` property.

If the token is invalid, then:

* The property `isTokenVerified` is set to `false`,
* the control is passed to the next middleware to manage the authentication error.

### Parameters

* `secret`: (*required*) is a string, buffer, or object containing either the secret for HMAC algorithms or the PEM encoded private key for RSA and ECDSA, as described in [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).

### Usage

```js
const express = require('express')
const { verifyJWT } = require('@fundaciobit/express-middleware')

const app = express()

class AuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = 401
  }
}

app.get('/protected',
  verifyJWT({ secret: 'my_secret' }),
  (req, res) => {
    const { isTokenVerified } = req
    if (isTokenVerified) {
      res.status(200).send('Token verified')
    } else {
      throw new AuthenticationError('Invalid token. Forbidden access.')
    }
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

* `payload`: (*required*) is a function with request object as parameter that returns an object literal, buffer or string representing valid JSON.
* `secret`: (*required*) is a string, buffer, or object containing either the secret for HMAC algorithms or the PEM encoded private key for RSA and ECDSA, as described in [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).
* `signOptions`: (*optional*) is an object with extra info to encode, as described in [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken). `Eg: { expiresIn: '24h' }`

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
  //  Else: call next(error) to catch auth error.
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
