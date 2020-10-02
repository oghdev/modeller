const withDatasource = require('./mixins/withDatasource')
const withSchema = require('./mixins/withSchema')
const extendSchema = require('./mixins/extendSchema')
const withTimestamps = require('./mixins/withTimestamps')

const models = {}

const storeModel = (model) => {

  models[model.name] = model

  return model

}

const modelBuilder = function modelBuilder (model) {

  return {
    withDatasource: (datasource) => modelBuilder(withDatasource(model, datasource)),
    withSchema: (schema) => modelBuilder(withSchema(model, schema)),
    extendSchema: (mixin) => modelBuilder(extendSchema(model, mixin)),
    withTimestamps: (relations) => modelBuilder(withTimestamps(model)),
    finalise: () => storeModel(model)
  }

}

module.exports = { models, modelBuilder }
