'use strict'

const ipv4 = require('./src/ipv4/ipv4')
const validateJsonSchema = require('./src/validateJsonSchema/validateJsonSchema')

module.exports = {
  ipv4: ipv4,
  validateJsonSchema: validateJsonSchema
}
