'use strict'

// Middleware to extract the IPv4 address from the request object (it converts IPv6 format to IPv4 format).
// The extracted address will be available on the request via the 'ipv4' property.

const ipv4 = () => {
  return (req, res, next) => {
    let ipv4 = req.ip

    try {
      if (typeof(ipv4) !== 'string') {
        throw new Error('IP address not detected as a string type')
      }

      ipv4 = ipv4.replace('::ffff:', '').replace('::1', '127.0.0.1')
      req.ipv4 = ipv4
      next()

    } catch (error) {
      error.message = `[ipv4] ${error.message}`
      next(error)
    }

  }
}

module.exports = ipv4
