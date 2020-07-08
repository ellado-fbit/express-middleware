const express = require('express')
const { ipv4, verifyJWT } = require('../')

const secret = 'mimamamemima'
const ipAddressesWhitelist = ['120.230.33.44', '120.230.33.45', '127.0.0.1']

const app = express()

class AuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = 401
  }
}

const authMiddlewareArray = [
  (req, res, next) => {
    verifyJWT({ secret })(req, res, err => {
      if (err && err.name !== 'RequiredTokenError') {
        next(err)
      } else {
        next()
      }
    })
  },
  (req, res, next) => {
    if (req.tokenPayload) {
      const { tokenPayload } = req

      // Verify HTTP method
      // ...

      res.status(200).json({ autheticated: 'OK', tokenPayload })
    } else {
      console.log('Token not provided, proceed with auth via IP address...')
      next()
    }
  },
  ipv4(),
  (req, res, next) => {
    const { ipv4 } = req
    if (ipAddressesWhitelist.indexOf(ipv4) !== -1) {
      next()
    } else {
      throw new AuthenticationError(`Forbidden access for IP '${ipv4}'`)
    }
  },
  (req, res) => {
    // Verify HTTP method
    // ...
    res.status(200).json({ autheticated: 'OK', ip: req.ipv4 })
  }
]

app.use(authMiddlewareArray)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(port, () => { console.log(`Server running on http://localhost:${port} ...`) })