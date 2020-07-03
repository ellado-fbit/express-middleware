# Changelog

All notable changes to this project will be documented in this file.

## [1.6.6] - 2020-07-03

### Added

- Two new Errors used in `verifyJWT` middleware: `RequiredTokenError` and `InvalidTokenError`.

### Changed

- In the `verifyJWT` middleware, the property `isTokenVerified` is not longer set on the request object. Only the decoded payload token will be available on the `tokenPayload` property of the request.
