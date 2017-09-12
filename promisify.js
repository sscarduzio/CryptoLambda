// ---- Node 6 is too old for util.promisify
module.exports = (fn) => {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      fn.apply(null, args.concat(function (err, result) {
        if (err) {
          reject(err)
        }
        else if (result.status == 'error') {
          reject(result)
        }
        else {
          resolve(result)
        }
      }))
    })
  }
}
