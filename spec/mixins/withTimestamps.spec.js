const { datasource, chai } = require('../utils')

const types = require('../../src/types')
const { modelBuilder } = require('../../src/models')

const uuid = require('uuid').v4

class DateMixinModel {

  method () {

    return 'value'

  }

}

describe('mixins/withTimestamps.js', async () => {

  it('should extend model schema with createdOn and updatedOn', () => {

    const schema = types.SCHEMA({
      id: types.UUID,
      foo: types.STRING
    })

    const Model = modelBuilder(DateMixinModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .withTimestamps()
      .finalise()

    chai.expect(Object.keys(Model.schema.describe().keys)).to.eql([ 'id', 'foo', 'createdOn', 'updatedOn' ])

  })

  it('should give default date to instance with createdOn and updatedOn', async () => {

    const schema = types.SCHEMA({
      id: types.UUID,
      foo: types.STRING
    })

    const Model = modelBuilder(DateMixinModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .withTimestamps()
      .finalise()

    const instance = await Model.build({ id: uuid() })

    chai.expect(instance.createdOn instanceof Date).to.equal(true)
    chai.expect(instance.updatedOn instanceof Date).to.equal(true)

  })

  it('should updated updatedOn field when model is saved', async () => {

    const schema = types.SCHEMA({
      id: types.UUID,
      foo: types.STRING
    })

    const Model = modelBuilder(DateMixinModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .withTimestamps()
      .finalise()

    const instance = await Model.build({ id: uuid() })

    const updatedOn = instance.updatedOn

    await new Promise((resolve) => setTimeout(resolve, 20))

    await instance.save()

    chai.expect(instance.createdOn instanceof Date).to.equal(true)
    chai.expect(instance.updatedOn instanceof Date).to.equal(true)
    chai.expect(instance.updatedOn).to.not.equal(updatedOn)

  })

})
