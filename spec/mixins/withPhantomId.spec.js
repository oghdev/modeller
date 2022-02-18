const { datasource, chai } = require('../utils')

const types = require('../../src/types')
const { modelBuilder } = require('../../src/models')

class PhantomModel {

  method () {

    return 'value'

  }

}

describe('mixins/withPhantomId.js', async () => {

  before(async () => {

    await datasource.schema.createTable('PhantomModel', async (table) => {

      table.string('id').notNullable()
      table.increments('_id').primary()
      table.string('foo')
      table.integer('num')

    })

  })

  const schema = types.SCHEMA({
    foo: types.STRING,
    num: types.NUMBER
  })

  const Model = modelBuilder(PhantomModel)
    .withSchema(schema)
    .withDatasource(datasource)
    .withPhantomId()
    .finalise()

  it('should allow phantom id in schema', async () => {

    await Model.build({ foo: 'bar', num: 1 })

  })

  it('should not show phantom id', async () => {

    const model = await Model.build({ foo: 'bar', num: 1 })
    const built = await Model.id(model.id)

    chai.expect(model._id).to.equal(undefined)
    chai.expect(built._id).to.equal(undefined)
    chai.expect(built._origData._id).to.not.equal(undefined)

  })

  it('should allow normal updates through schema validation', async () => {

    const model = await Model.build({ foo: 'bar', num: 1 })
    const built = await Model.id(model.id)

    await built.update({ foo: 'foo' })
    await built.update({ num: 3 })

  })

  it('getRealId() should return real id', async () => {

    const model = await Model.build({ foo: 'bar', num: 1 })

    const realId = model.getRealId()

    chai.expect(realId).to.equal(model._origData._id)

  })

  it('toJSON() should not return phantom id field', async () => {

    const model = await Model.build({ foo: 'bar', num: 1 })
    const built = await Model.id(model.id)
    const json = built.toJSON()

    chai.expect(json._id).to.equal(undefined)

  })

})
