'use strict'

// Converts string properties of an object to numbers (integers or floats) or booleans.
// Note: the provided object will not be mutated.
// The parsed object will be available on the request via `parsedObject` property.

// Parameters:
//  objectToParse: (required) Function that accepts the request object as parameter, that returns the object to parse.
//  properties: (optional) Array of strings. If not provided, the conversion is applied to all properties of the object.

const parseTypes = (props) => {
  return (req, res, next) => {

    let objectToParse = props.objectToParse
    let properties = props.properties

    try {
      if (!objectToParse) throw new Error(`'objectToParse' parameter is required`)
      if (typeof(objectToParse) !== 'function') throw new Error(`'objectToParse' must be a function that accepts request object as parameter`)
      if (typeof(objectToParse(req)) !== 'object') throw new Error(`'objectToParse' function must return an object`)
      if (properties && properties.constructor !== Array) throw new Error(`'properties' must be an array`)
    } catch (error) {
      error.message = `[parseTypes] ${error.message}`
      return next(error)
    }

    objectToParse = { ...objectToParse(req) }
    properties = properties ? properties : Object.keys(objectToParse)

    properties.forEach(key => {
      if (objectToParse[key] && typeof objectToParse[key] === 'string') {
        if (objectToParse[key].toLowerCase().trim() === 'true') {
          objectToParse[key] = true
        } else if (objectToParse[key].toLowerCase().trim() === 'false') {
          objectToParse[key] = false
        } else if (!isNaN(objectToParse[key].trim())) {
          objectToParse[key] = Number(objectToParse[key].trim())
        }
      }
    })

    req.parsedObject = objectToParse
    next()
  }
}

module.exports = parseTypes
