const types = require('../types')
const extendSchema = require('./extendSchema')
const uuid = require('uuid').v4

const withPhantomId = (Model, opts) => {

  opts = Object.assign({
    idType: types.UUID.default(() => uuid()),
    phantomIdType: types.NUMBER
  }, opts || {})

  const MixinModel = extendSchema(Model, {
    _id: opts.phantomIdType,
    id: opts.idType
  })

  return class extends MixinModel {

    constructor (data, opts) {

      super(data, opts)

      Object.defineProperty(
        this,
        '_id',
        {
          value: undefined,
          enumerable: false,
          writeable: false
        }
      )

      delete this._data._id

    }

    getRealId () {

      return this._origData._id

    }

  }

}

module.exports = withPhantomId
