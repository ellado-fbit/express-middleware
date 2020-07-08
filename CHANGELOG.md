# Changelog

All notable changes to this project will be documented in this file.

## [1.6.8] - 2020-07-08

### Changed

- Included `try..catch` block inside async functions (singJWT and verifyJWT).

## [1.6.7] - 2020-07-04

### Changed

- The error message thrown when a token is invalid (verifyJWT).

## [1.6.6] - 2020-07-03

### Added

- Two new Errors used in `verifyJWT` middleware: `RequiredTokenError` and `InvalidTokenError`.

### Changed

- In the `verifyJWT` middleware, the property `isTokenVerified` is not longer set on the request object. Only the decoded payload token will be available on the `tokenPayload` property of the request.
