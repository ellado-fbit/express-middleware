const express = require('express')
const parseTypes = require('../').parseTypes

const app = express()

// Example: http://localhost:3000/users/min_age/30/max_age/45/is_employee/true/min_salary/35000.50/max_salary/45000.50

app.get('/users/min_age/:min_age/max_age/:max_age/is_employee/:is_employee/min_salary/:min_salary/max_salary/:max_salary',
  parseTypes({
    objectToParse: (req) => req.params,
    properties: ['min_age', 'is_employee', 'max_salary']
  }),
  (req, res) => {
    const { params, parsedObject } = req
    res.json({ params, parsedObject })
  })

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.toString())
})

const port = 3000
app.listen(3000, () => { console.log(`Server running on http://localhost:${port}`) })
