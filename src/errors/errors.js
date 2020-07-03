'use strict'

class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
    this.statusCode = 400
  }
}

class RequiredTokenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RequiredTokenError'
    this.statusCode = 401
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidTokenError'
    this.statusCode = 401
  }
}

module.exports = {
  BadRequestError: BadRequestError,
  RequiredTokenError: RequiredTokenError,
  InvalidTokenError: InvalidTokenError
}
