const types = require('../types')

const extendSchema = require('./extendSchema')

const withTimestamps = (Model) => {

  const MixinModel = extendSchema(Model, {
    createdOn: types.DATE.default(Date.now),
    updatedOn: types.DATE.default(Date.now)
  })

  return class extends MixinModel {

    static async beforeUpdate (ctx) {

      ctx.instance.updatedOn = Date.now()

      super.beforeUpdate && await super.beforeUpdate(ctx)

    }

    static async beforeCreate (ctx) {

      ctx.instance.createdOn = Date.now()
      ctx.instance.updatedOn = Date.now()

      super.beforeCreate && await super.beforeCreate(ctx)

    }

  }

}

module.exports = withTimestamps
