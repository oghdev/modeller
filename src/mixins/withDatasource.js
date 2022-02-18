const { transformData, untransformData } = require('../utils')

const withDatasource = (
  Model, datasource, tableName
) => {

  const table = tableName || Model.name

  return class extends Model {

    static transformData (
      schema, data, opts
    ) {

      return transformData(
        schema, data, opts
      )

    }

    static untransformData (
      schema, data, opts
    ) {

      return untransformData(
        schema, data, opts
      )

    }

    static get datasource () {

      return datasource

    }

    untransformData (
      schema, data, opts
    ) {

      return this.constructor.untransformData(
        schema, data, opts
      )

    }

    transformData (
      schema, data, opts
    ) {

      return this.constructor.transformData(
        schema, data, opts
      )

    }

    constructor (data, opts) {

      super()

      data = data || {}
      opts = Object.assign({ newInstance: true }, opts || {})

      if (this.schema) {

        data = this.untransformData(
          this.schema, data, opts
        )

      }

      Object.defineProperty(
        this,
        '_origData',
        {
          value: Object.assign({}, data),
          enumerable: false,
          writeable: false
        }
      )

      Object.defineProperty(
        this,
        '_data',
        {
          value: data,
          enumerable: false,
          configurable: true,
          writeable: false
        }
      )

      if (opts.newInstance) {

        Object.defineProperty(
          this,
          '_newInstance',
          {
            value: true,
            enumerable: false,
            writable: true
          }
        )

      }

      for (const [ key ] of Object.entries(data)) {

        this._createField(key)

      }

      Object.defineProperty(
        this,
        'table',
        { value: table, enumerable: false }
      )

      Object.defineProperty(
        this.constructor,
        'table',
        { value: table, enumerable: false }
      )

      Object.defineProperty(
        this,
        'datasource',
        { value: datasource, enumerable: false }
      )

      Object.defineProperty(
        this.constructor,
        'datasource',
        { value: datasource, enumerable: false }
      )

    }

    _createField (key) {

      if (Object.prototype.hasOwnProperty.call(this, key)) {

        return

      }

      const fieldGetter = () => this._data[key]

      const fieldSetter = key === 'id'
        ? () => {

          throw new Error('Unable to write id')

        } : (val) => (this._data[key] = val)

      Object.defineProperty(
        this,
        key,
        {
          enumerable: true,
          configurable: true,
          get: fieldGetter,
          set: fieldSetter
        }
      )

    }

    query () {

      return datasource(table)

    }

    static query () {

      return datasource(table)

    }

    async transaction (fn) {

      const trx = await datasource.transaction()

      const ctx = this.query().transacting(trx)

      await fn(ctx)
        .then(trx.commit)
        .catch(trx.rollback)

    }

    static async transaction (fn) {

      const trx = await datasource.transaction()

      const ctx = this.query().transacting(trx)

      await fn(ctx)
        .then(trx.commit)
        .catch(trx.rollback)

    }

    async update (data, opts) {

      opts = opts || {}

      const newData = Object.assign(
        {}, this._data, data
      )

      Object.defineProperty(
        this,
        '_data',
        {
          value: newData,
          enumerable: false
        }
      )

      return this.save(opts)

    }

    async save (opts) {

      opts = opts || {}

      const Model = this.constructor
      const instance = this

      const isNewInstance = this._newInstance

      const ctx = { Model, instance, isNewInstance, opts }

      if (Model.beforeUpdate && !isNewInstance) {

        await Model.beforeUpdate(ctx)

      } else if (Model.beforeCreate && isNewInstance) {

        await Model.beforeCreate(ctx)

      }

      const data = Model.transformData(
        this.schema, this._data, opts
      )

      const query = this._newInstance
        ? this.query().insert(data)
        : this.query().where({ id: this.id }).update(data)

      Object.defineProperty(
        ctx, 'query', { value: query, enumerable: false, writeable: true }
      )

      if (Model.beforeQuery) {

        await Model.beforeQuery(ctx)

      }

      await ctx.query

      if (Model.afterQuery) {

        await Model.afterQuery(ctx)

      }

      if (Model.afterUpdate && !isNewInstance) {

        await Model.afterUpdate(ctx)

      } else if (Model.afterCreate && isNewInstance) {

        await Model.afterCreate(ctx)

      }

      if (isNewInstance) {

        this._newInstance = false

      }

      return this

    }

    async remove (opts) {

      opts = opts || {}

      const Model = this.constructor
      const instance = this

      const ctx = { Model, instance }

      if (Model.beforeRemove) {

        await Model.beforeRemove(ctx)

      }

      await this.transaction(async (tx) => {

        const query = tx
          .where('id', this.id)
          .del()

        Object.defineProperty(
          ctx, 'query', { value: query, enumerable: false, writeable: true }
        )

        if (Model.beforeQuery) {

          await Model.beforeQuery(ctx)

        }

        await ctx.query

        if (Model.afterQuery) {

          await Model.afterQuery(ctx)

        }

        if (Model.afterRemove) {

          await Model.afterRemove(ctx)

        }

      })

    }

    toJSON () {

      return this._data

    }

    static async build (data, opts) {

      opts = Object.assign({ newInstance: true }, opts || {})

      const Model = this

      const instance = new Model(data, opts)

      return instance.save(opts)

    }

    static async upsert (
      where, data, opts
    ) {

      opts = opts || {}

      const existing = await this.one(where, opts)

      if (!existing) {

        return this.build(Object.assign(
          {}, where, data
        ))

      }

      return existing.update(data)

    }

    static async id (id, opts) {

      opts = Object.assign({ newInstance: false }, opts || {})

      const Model = this

      if (!id) {

        throw new Error('Unable to find resource')

      }

      const query = Model.query().where({ id }).first()

      const ctx = { Model, query, opts }

      if (Model.beforeQuery) {

        await Model.beforeQuery(ctx)

      }

      const res = await ctx.query

      if (Model.afterQuery) {

        await Model.afterQuery(ctx)

      }

      if (!res) {

        throw new Error('Unable to find resource')

      }

      return new Model(res, opts)

    }

    static async find (where, opts) {

      opts = Object.assign({ newInstance: false }, opts || {})

      const Model = this

      const query = Model.query().where(where)

      const ctx = { Model, query, opts }

      if (Model.beforeQuery) {

        await Model.beforeQuery(ctx)

      }

      const res = await ctx.query
        .then((res) => {

          if (!res) {

            return []

          }

          return res
            .map((data) => new Model(data, opts))

        })

      if (Model.afterQuery) {

        await Model.afterQuery(ctx)

      }

      return res

    }

    static async one (where, opts) {

      if (!where) {

        throw new Error('Query not provided')

      }

      opts = Object.assign({ newInstance: false }, opts || {})

      const Model = this

      const query = Model.query().where(where).first()

      const ctx = { Model, query, opts }

      if (Model.beforeQuery) {

        await Model.beforeQuery(ctx)

      }

      const res = await ctx.query

      if (Model.afterQuery) {

        await Model.afterQuery(ctx)

      }

      if (!res) {

        return res

      }

      return new Model(res, opts)

    }

    static async all (opts) {

      opts = Object.assign({ newInstance: false }, opts || {})

      const Model = this

      const query = Model.query().select('*')

      const ctx = { Model, query, opts }

      if (Model.beforeQuery) {

        await Model.beforeQuery(ctx)

      }

      const res = await ctx.query.then((res) => {

        if (!res) {

          return []

        }

        return res
          .map((data) => new Model(data, opts))

      })

      if (Model.afterQuery) {

        await Model.afterQuery(ctx)

      }

      return res

    }

    static async count (where, opts) {

      where = where || {}
      opts = opts || {}

      const Model = this

      const query = Model.query().where(where)

      const ctx = { Model, query, opts }

      if (Model.beforeQuery) {

        await Model.beforeQuery(ctx)

      }

      const res = await ctx.query.then((res) => res ? res.length || 0 : 0)

      if (Model.afterQuery) {

        await Model.afterQuery(ctx)

      }

      return res

    }

    static queryBuilder (fn, opts) {

      opts = Object.assign({ newInstance: false }, opts || {})

      const Model = this

      return Promise.resolve()
        .then(() => fn(Model.query()))
        .then((res) => {

          if (!res) {

            return res

          }

          if (Array.isArray(res)) {

            return res
              .map((data) => new Model(data, opts))

          }

          return new Model(Object.assign({}, res), opts)

        })

    }

    static toJSON () {

      const name = this.name

      return { name }

    }

  }

}

module.exports = withDatasource
