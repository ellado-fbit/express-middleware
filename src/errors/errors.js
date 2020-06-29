'use strict'

class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
    this.statusCode = 400
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = 401
  }
}

module.exports = {
  BadRequestError: BadRequestError,
  AuthenticationError: AuthenticationError
}
