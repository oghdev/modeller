const { datasource, chai, sinon } = require('../utils')

const types = require('../../src/types')
const { modelBuilder } = require('../../src/models')

const uuid = require('uuid').v4

class BaseModel {

  method () {

    return 'value'

  }

}

describe('mixins/withSchema.js', async () => {

  it('should set model schema', () => {

    const schema = types.SCHEMA({
      id: types.UUID,
      foo: types.STRING,
      num: types.NUMBER
    })

    const Model = modelBuilder(BaseModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .finalise()

    chai.expect(Model.schema).to.equal(schema)

  })

  it('should call previous models hooks', async () => {

    const schema = types.SCHEMA({
      id: types.UUID.default(() => uuid()),
      foo: types.STRING,
      num: types.NUMBER
    })

    class HookModel {

      static beforeCreate () {}
      static afterCreate () {}

      static beforeUpdate () {}
      static afterUpdate () {}

    }

    const beforeCreateSpy = sinon.spy(HookModel, 'beforeCreate')
    const afterCreateSpy = sinon.spy(HookModel, 'afterCreate')

    const beforeUpdateSpy = sinon.spy(HookModel, 'beforeUpdate')
    const afterUpdateSpy = sinon.spy(HookModel, 'afterUpdate')

    const Model = modelBuilder(HookModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .finalise()

    const instance = new Model()

    await instance.save()

    chai.expect(beforeCreateSpy.callCount).to.equal(1)
    chai.expect(afterCreateSpy.callCount).to.equal(1)

    chai.expect(beforeUpdateSpy.callCount).to.equal(0)
    chai.expect(afterUpdateSpy.callCount).to.equal(0)

    await instance.update({ foo: 'bar' })

    chai.expect(beforeUpdateSpy.callCount).to.equal(1)
    chai.expect(afterUpdateSpy.callCount).to.equal(1)

  })

  it('should call previous models validate hooks', async () => {

    const schema = types.SCHEMA({
      id: types.UUID.default(() => uuid()),
      foo: types.STRING,
      num: types.NUMBER
    })

    class HookModel {

      static beforeValidate () {}
      static afterValidate () {}

    }

    const beforeValidateSpy = sinon.spy(HookModel, 'beforeValidate')
    const afterValidateSpy = sinon.spy(HookModel, 'afterValidate')

    const Model = modelBuilder(HookModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .finalise()

    const instance = new Model()

    await instance.save()

    chai.expect(beforeValidateSpy.callCount).to.equal(1)
    chai.expect(afterValidateSpy.callCount).to.equal(1)

    await instance.update({ foo: 'bar' })

    chai.expect(beforeValidateSpy.callCount).to.equal(2)
    chai.expect(afterValidateSpy.callCount).to.equal(2)

  })

  it('should call schema validateAsync on save', async () => {

    const schema = types.SCHEMA({
      id: types.UUID.default(() => uuid()),
      foo: types.STRING,
      num: types.NUMBER
    })

    const validateSpy = sinon.spy(schema, 'validateAsync')

    const Model = modelBuilder(BaseModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .finalise()

    const instance = new Model()

    await instance.save()

    chai.expect(validateSpy.callCount).to.equal(1)

  })

  it('should throw ValidationError for missing required fields in schema before save', async () => {

    const schema = types.SCHEMA({
      id: types.UUID.default(() => uuid()),
      foo: types.STRING.required(),
      num: types.NUMBER.required()
    })

    const Model = modelBuilder(BaseModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .finalise()

    const instance = new Model()

    const promise = instance.save()

    await chai.expect(promise).to.eventually.be.rejected.and.have.property('name', 'ValidationError')

  })

  it('should provide default values to model when defined (new syntax)', async () => {

    const schema = types.SCHEMA({
      id: types.UUID.default(() => uuid()),
      foo: types.STRING.default('bar'),
      bar: types.STRING.default('baz')
    })

    const Model = modelBuilder(BaseModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .finalise()

    const instance = new Model()

    await instance.save()

    chai.expect(instance.foo).to.equal('bar')
    chai.expect(instance.bar).to.equal('baz')

  })

  it('should provide default values to model when defined (Model.build)', async () => {

    const id = uuid()

    const schema = types.SCHEMA({
      id: types.UUID.default(() => id),
      foo: types.STRING.default('bar'),
      bar: types.STRING.default('baz')
    })

    const Model = modelBuilder(BaseModel)
      .withDatasource(datasource)
      .withSchema(schema)
      .finalise()

    const instance = await Model.build({ })

    chai.expect(instance.id).to.equal(id)
    chai.expect(instance.foo).to.equal('bar')
    chai.expect(instance.bar).to.equal('baz')

  })

  it('should provide default to now undefined model values when updating instance', async () => {

    const schema = types.SCHEMA({
      id: types.UUID.default(() => uuid()),
      foo: types.STRING.default(() => uuid()),
      bar: types.STRING.default(() => uuid())
    })

    const Model = modelBuilder(BaseModel)
      .withSchema(schema)
      .withDatasource(datasource)
      .finalise()

    const instance = await Model.build({ })

    const val = instance.foo

    delete instance.foo

    await instance.update({ foo: undefined, bar: '1234' })

    chai.expect(instance.foo).to.not.equal(val)

  })

  it('should provide default values to model from function', async () => {

    const id = uuid()
    const def = () => 'bar'

    const schema = types.SCHEMA({
      id: types.UUID.default(() => id),
      foo: types.STRING.default(def)
    })

    const Model = modelBuilder(BaseModel)
      .withDatasource(datasource)
      .withSchema(schema)
      .finalise()

    const instance = await Model.build()

    chai.expect(instance.id).to.equal(id)
    chai.expect(instance.foo).to.equal(def())

  })

})
