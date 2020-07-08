const { transformData, untransformData } = require('../utils')

const withDatasource = (Model, datasource) => {

  const table = Model.name

  return class extends Model {

    static get datasource () {

      return datasource

    }

    constructor (data, opts) {

      super()

      data = data || {}
      opts = Object.assign({ newInstance: true }, opts || {})

      if (this.schema) {

        data = untransformData(this.schema, data)

      }

      Object.defineProperty(
        this,
        '_origData',
        {
          value: data,
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

      if (this[key]) {

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

      const ctx = trx(table)

      await fn(ctx)
        .then(trx.commit)
        .catch(trx.rollback)

    }

    static async transaction (fn) {

      const trx = await datasource.transaction()

      const ctx = trx(table)

      await fn(ctx)
        .then(trx.commit)
        .catch(trx.rollback)

    }

    async update (data) {

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

      return this.save()

    }

    async save () {

      const Model = this.constructor
      const instance = this

      const isNewInstance = this._newInstance

      const ctx = { instance, isNewInstance }

      if (Model.beforeUpdate && !isNewInstance) {

        await Model.beforeUpdate(ctx)

      } else if (Model.beforeCreate && isNewInstance) {

        await Model.beforeCreate(ctx)

      }

      const data = transformData(this.schema, this._data)

      if (this._newInstance) {

        await this.query()
          .insert(data)

      } else {

        await this.query()
          .where({ id: this.id })
          .update(data)

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

    async remove () {

      const Model = this.constructor
      const instance = this

      const ctx = { instance }

      if (Model.beforeRemove) {

        await Model.beforeRemove(ctx)

      }

      await this.transaction(async (tx) => {

        await tx
          .where('id', this.id)
          .del()

        if (Model.afterRemove) {

          await Model.afterRemove(ctx)

        }

      })

    }

    toJSON () {

      return this._data

    }

    static async build (data) {

      const Model = this

      const instance = new Model(data)

      return instance.save()

    }

    static async upsert (query, data) {

      const existing = await this.one(query)

      if (!existing) {

        return this.build(Object.assign(
          {}, query, data
        ))

      }

      return existing.update(data)

    }

    static async id (id) {

      if (!id) {

        throw new Error('Unable to find resource')

      }

      const res = await this.query()
        .where({ id })
        .first()

      if (!res) {

        throw new Error('Unable to find resource')

      }

      const Model = this

      return new Model(res, { newInstance: false })

    }

    static async find (query) {

      const Model = this

      const res = await this.query()
        .where(query)
        .then((res) => {

          if (!res) {

            return []

          }

          return res
            .map((data) => new Model(data, { newInstance: false }))

        })

      return res

    }

    static async one (query) {

      const Model = this

      const res = await this.query()
        .where(query)
        .first()

      if (!res) {

        return res

      }

      return new Model(res, { newInstance: false })

    }

    static all () {

      const Model = this

      return this.query()
        .select('*')
        .then((res) => {

          if (!res) {

            return []

          }

          return res
            .map((data) => new Model(data, { newInstance: false }))

        })

    }

    static count (query) {

      query = query || {}

      return this.query()
        .where(query)
        .then((res) => res ? res.length || 0 : 0)

    }

    static queryBuilder (fn) {

      const Model = this

      return Promise.resolve()
        .then(() => fn(Model.query()))
        .then((res) => {

          if (!res) {

            return res

          }

          if (Array.isArray(res)) {

            return res
              .map((data) => new Model(data, { newInstance: false }))

          }

          return new Model(Object.assign({}, res), { newInstance: false })

        })

    }

  }

}

module.exports = withDatasource
