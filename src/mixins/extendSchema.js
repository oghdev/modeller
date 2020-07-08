const extendSchema = (Model, fieldsToMixin) => {

  if (!Model.schema) {

    throw new Error('Model does not have a schema to extend')

  }

  const existingSchema = Model.schema

  const schema = existingSchema.keys(fieldsToMixin)

  return class extends Model {

    static get schema () {

      return schema

    }

    get schema () {

      return schema

    }

  }

}

module.exports = extendSchema
