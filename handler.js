'use strict'

const buy = require('./buy.js').buy
const decrypt = require('./decrypt.js')
const promisify = require('./promisify.js')
const log = require('util').log

module.exports.hello = (event, context, callback) => {
  promisify(decrypt)()
    .then(res => {
      const [client_id, key, secret] = res.split(',')
      return buy(key, secret, client_id)
    })
    .then(res => {
      callback(null, res)
    })

    // Let it crash, so AWS logs are triggered
    .catch(e => {
      log('promise error...')
      throw e
    })
}