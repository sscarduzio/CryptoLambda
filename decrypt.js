const fs = require('fs')
const AWS = require('aws-sdk')
const kms = new AWS.KMS({ region: 'eu-west-1' })

const secretPath = './encrypted-secret'
const encryptedSecret = fs.readFileSync(secretPath)

const params = {
  CiphertextBlob: encryptedSecret
}
module.exports = (handler) => {
  return kms.decrypt(params, (err, res) => {
    if (err) handler(err, null)
    else {
      const decryptedScret = res['Plaintext'].toString()
      handler(null, decryptedScret)
    }
  })
}