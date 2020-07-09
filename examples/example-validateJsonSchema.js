const express = require('express')
const bodyParser = require('body-parser')
const { validateJsonSchema } = require('../')

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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(port, () => { console.log(`Server running on http://localhost:${port} ...`) })