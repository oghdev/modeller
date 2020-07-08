const { chai } = require('../utils')

const types = require('../../src/types')
const { modelBuilder } = require('../../src/models')

class BaseModel {

  method () {

    return 'value'

  }

}

describe('mixins/extendSchema.js', async () => {

  const schema = types.SCHEMA({
    id: types.UUID,
    foo: types.STRING
  })

  const Model = modelBuilder(BaseModel)
    .withSchema(schema)
    .finalise()

  it('should extend model schema', () => {

    const schemaMixin = { bar: types.STRING }

    const MixinModel = modelBuilder(Model)
      .extendSchema(schemaMixin)
      .finalise()

    chai.expect(Model.schema).to.equal(schema)
    chai.expect(Object.keys(Model.schema.describe().keys)).to.eql([ 'id', 'foo' ])
    chai.expect(Object.keys(MixinModel.schema.describe().keys)).to.eql([ 'id', 'foo', 'bar' ])

  })

  it('should throw error on non-schema', async () => {

    const schemaMixin = false

    chai.expect(() => modelBuilder(BaseModel).extendSchema(schemaMixin)).to.throw(Error)

  })

})
