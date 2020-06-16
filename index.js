'use strict'

const ipv4 = require('./src/ipv4/ipv4')
const redisGet = require('./src/redis/redisGet')
const redisSet = require('./src/redis/redisSet')

module.exports = {
  ipv4: ipv4,
  redisGet: redisGet,
  redisSet: redisSet
}
