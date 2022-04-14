const cypto = require('crypto')
const _ = require('lodash')

exports.md5 = str => {
    return cypto.createHash('md5').update(str).digest('hex')
}

exports._ = _