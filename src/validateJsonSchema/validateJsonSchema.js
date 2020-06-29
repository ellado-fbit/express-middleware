'use strict'

// Middleware to validate the structure of an instance with the provided JSON Schema

const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })
const BadRequestError = require('../errors/errors').BadRequestError

const validateJsonSchema = (props) => {
  return (req, res, next) => {

    const schema = props.schema
    const instanceToValidate = props.instanceToValidate

    try {
      const validate = ajv.compile(schema)
      if (!validate(instanceToValidate(req))) throw new BadRequestError(JSON.stringify(validate.errors, null, 2))

      next()

    } catch (error) {
      error.message = `[validateJsonSchema] ${error.message}`
      next(error)
    }

  }
}

module.exports = validateJsonSchema
