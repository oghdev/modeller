const withDatasource = require('./mixins/withDatasource')
const withSchema = require('./mixins/withSchema')
const extendSchema = require('./mixins/extendSchema')
const withTimestamps = require('./mixins/withTimestamps')
const withPhantomId = require('./mixins/withPhantomId')

const models = {}

const storeModel = (model) => {

  models[model.name] = model

  return model

}

const useMixin = (
  mixin, model, ...args
) => {

  const name = model.name
  const newModel = mixin(model, ...args)

  newModel.name = name

  Object.defineProperty(
    newModel, 'name', { value: name, writeable: false, configurable: true }
  )

  return newModel

}

const modelBuilder = (model) => {

  return {
    useMixin: (mixin, ...args) => modelBuilder(useMixin(
      mixin, model, ...args
    )),
    withDatasource: (...args) => modelBuilder(useMixin(
      withDatasource, model, ...args
    )),
    withSchema: (...args) => modelBuilder(useMixin(
      withSchema, model, ...args
    )),
    extendSchema: (...args) => modelBuilder(useMixin(
      extendSchema, model, ...args
    )),
    withTimestamps: (...args) => modelBuilder(useMixin(
      withTimestamps, model, ...args
    )),
    withPhantomId: (...args) => modelBuilder(useMixin(
      withPhantomId, model, ...args
    )),
    finalise: () => storeModel(model)
  }

}

module.exports = { models, modelBuilder }
