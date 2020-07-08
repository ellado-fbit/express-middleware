const express = require('express')
const bodyParser = require('body-parser')
const { ipv4, validateJsonSchema, verifyJWT, signJWT } = require('../')

const secret = 'mimamamemima'

const app = express()

app.use(bodyParser.json())
app.use(ipv4())

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
  // Here include a middleware to verify credentials
  // and set req.user (without password)
  (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    const { username, password } = req.body
    // ... here verify user credentials in DB, and extract user's profile info
    const user = {
      username,
      role: 'admin',
      ip_address: req.ipv4
    }
    req.user = user
    next()
  },
  signJWT({
    payload: (req) => ({ ...req.user }),
    secret,
    signOptions: { expiresIn: '24h' }
  }),
  (req, res) => {
    const { token } = req
    res.status(200).json({ token })
  })

app.get('/protected',
  verifyJWT({ secret }),
  (req, res) => {
    const { tokenPayload } = req
    res.status(200).json({ tokenPayload })
  })

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(port, () => { console.log(`Server running on http://localhost:${port} ...`) })