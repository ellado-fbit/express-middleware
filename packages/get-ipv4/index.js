'use strict'

// Express middleware to extract the IPv4 address from the request object.
// The extracted address will be available on the request via the 'ipv4' property.

module.exports = (req, res, next) => {

  let clientIp = req.ip

  if (typeof(clientIp) === 'string') {
    clientIp = clientIp.replace('::ffff:', '').replace('::1', '127.0.0.1')
    req.ipv4 = clientIp
    next()
  } else {
    return res.status(400).json({ error: 'IP address not detected' })
  }

}
