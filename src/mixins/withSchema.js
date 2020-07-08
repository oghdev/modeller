const withSchema = (Model, schema) => {

  return class extends Model {

    static get schema () {

      return schema

    }

    get schema () {

      return schema

    }

    constructor (data, opts) {

      opts = Object.assign({ validate: true }, opts || {})

      super(data, opts)

      Object.defineProperty(
        this,
        'validate',
        { value: opts.validate, enumerable: false }
      )

      Object.defineProperty(
        this.constructor,
        'validate',
        { value: opts.validate, enumerable: false }
      )

      for (const key of Object.keys(this.schema.describe().keys)) {

        this._createField(key)

      }

    }

    static async beforeUpdate (ctx) {

      if (this.validate) {

        if (super.beforeValidate) {

          await super.beforeValidate(ctx)

        }

        const instance = ctx.instance

        const res = await this.schema.validateAsync(instance, { abortEarly: false })

        for (const [ key, val ] of Object.entries(res)) {

          instance._data[key] = val

        }

        if (super.afterValidate) {

          await super.afterValidate(ctx)

        }

      }

      super.beforeUpdate && await super.beforeUpdate(ctx)

    }

    static async beforeCreate (ctx) {

      if (this.validate) {

        if (super.beforeValidate) {

          await super.beforeValidate(ctx)

        }

        const instance = ctx.instance

        const res = await this.schema.validateAsync(instance, { abortEarly: false })

        for (const [ key, val ] of Object.entries(res)) {

          instance._data[key] = val

        }

        if (super.afterValidate) {

          await super.afterValidate(ctx)

        }

      }

      super.beforeCreate && await super.beforeCreate(ctx)

    }

  }

}

module.exports = withSchema
