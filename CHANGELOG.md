# Changelog

All notable changes to this project will be documented in this file.

## [1.7.1] - 2020-07-11

### Changed

- Fixed bug: applied trim() to avoid conversion of Number('   ') to 0 (parseTypes). Empty string properties are not parsed.

## [1.7.0] - 2020-07-10

### Added

- Added a new middleware to parse string properties of an object into numbers (integers or floats) or booleans (parseTypes).

## [1.6.9] - 2020-07-09

### Changed

- Fixed bug in sample code of Readme (validateJsonSchema usage section).

### Added

- Added a new example in examples/example-validateJsonSchema.js

## [1.6.8] - 2020-07-08

### Changed

- Included `try..catch` block inside async functions (signJWT and verifyJWT).

## [1.6.7] - 2020-07-04

### Changed

- The error message thrown when a token is invalid (verifyJWT).

## [1.6.6] - 2020-07-03

### Added

- Two new Errors used in `verifyJWT` middleware: `RequiredTokenError` and `InvalidTokenError`.

### Changed

- In the `verifyJWT` middleware, the property `isTokenVerified` is not longer set on the request object. Only the decoded payload token will be available on the `tokenPayload` property of the request.
