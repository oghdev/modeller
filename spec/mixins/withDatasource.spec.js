const { datasource, chai, sinon } = require('../utils')

const { modelBuilder } = require('../../src/models')

const uuid = require('uuid').v4

class BaseModel {

  method () {

    return 'value'

  }

}

describe('mixins/withDatasource.js', async () => {

  it('should create Model instance with datasource and schema', () => {

    const Model = modelBuilder(BaseModel)
      .withDatasource(datasource)
      .finalise()

    chai.expect(Model).to.have.deep.property('datasource', datasource)

  })

  it('should include datasource operations', () => {

    const expectedOperations = [
      'toJSON',
      'update'
    ]

    const expectedStaticOperations = [
      'build',
      'id',
      'all',
      'one',
      'upsert',
      'count'
    ]

    const Model = modelBuilder(BaseModel)
      .withDatasource(datasource)
      .finalise()

    for (const op of expectedOperations) {

      chai.expect(Model.prototype).to.have.property(op)

    }

    for (const op of expectedStaticOperations) {

      chai.expect(Model).to.have.property(op)

    }

  })

  describe('Model', async () => {

    const Model = modelBuilder(BaseModel)
      .withDatasource(datasource)
      .finalise()

    const getHookModel = () => {

      class HookModel extends Model {

        static beforeUpdate () {}

        static afterUpdate () {}

        static beforeCreate () {}

        static afterCreate () {}

        static beforeRemove () {}

        static afterRemove () {}

      }

      sinon.spy(HookModel, 'beforeUpdate')
      sinon.spy(HookModel, 'afterUpdate')
      sinon.spy(HookModel, 'beforeCreate')
      sinon.spy(HookModel, 'afterCreate')
      sinon.spy(HookModel, 'beforeRemove')
      sinon.spy(HookModel, 'afterRemove')

      return HookModel

    }

    describe('instance', () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      describe('hooks', async () => {

        it('should not call beforeUpdate hook', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = new HookModel({ id: uuid(), property: '123' })

          chai.expect(HookModel.beforeUpdate.callCount).to.equal(0)

        })

        it('should not call beforeCreate hook', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = new HookModel({ id: uuid(), property: '123' })

          chai.expect(HookModel.beforeCreate.callCount).to.equal(0)

        })

        it('should not call afterUpdate hook', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = new HookModel({ id: uuid(), property: '123' })

          chai.expect(HookModel.afterUpdate.callCount).to.equal(0)

        })

        it('should not call afterCreate hook', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = new HookModel({ id: uuid(), property: '123' })

          chai.expect(HookModel.afterCreate.callCount).to.equal(0)

        })

      })

    })

    describe('update()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      describe('hooks', async () => {

        it('should call beforeUpdate hook once', async () => {

          const HookModel = getHookModel()

          const instance = await HookModel.build({ id: uuid(), property: '123' })

          await instance.update({ property: '456' })

          chai.expect(HookModel.beforeUpdate.callCount).to.equal(1)

        })

        it('should call afterUpdate hook once', async () => {

          const HookModel = getHookModel()

          const instance = await HookModel.build({ id: uuid(), property: '123' })

          await instance.update({ property: '456' })

          chai.expect(HookModel.afterUpdate.callCount).to.equal(1)

        })

        it('should not call beforeCreate hook', async () => {

          const HookModel = getHookModel()

          const instance = await HookModel.build({ id: uuid(), property: '123' })

          await instance.update({ property: '456' })

          chai.expect(HookModel.beforeCreate.callCount).to.equal(1)

        })

        it('should not call afterCreate hook', async () => {

          const HookModel = getHookModel()

          const instance = await HookModel.build({ id: uuid(), property: '123' })

          await instance.update({ property: '456' })

          chai.expect(HookModel.afterCreate.callCount).to.equal(1)

        })

      })

    })

    describe('remove()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      describe('hooks', async () => {

        it('should call beforeRemove hook once', async () => {

          const HookModel = getHookModel()

          const instance = await HookModel.build({ id: uuid(), property: '123' })

          await instance.remove()

          chai.expect(HookModel.beforeRemove.callCount).to.equal(1)

        })

        it('should call afterRemove hook once', async () => {

          const HookModel = getHookModel()

          const instance = await HookModel.build({ id: uuid(), property: '123' })

          await instance.remove()

          chai.expect(HookModel.afterRemove.callCount).to.equal(1)

        })

      })

    })

    describe('static::build()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should return instance of Model', async () => {

        const instance = await Model.build({ id: uuid(), property: '1234' })

        chai.expect(instance instanceof Model).to.equal(true)

      })

      describe('hooks', async () => {

        it('should call beforeCreate hook once', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.build({ id: uuid(), property: '123' })

          chai.expect(HookModel.beforeCreate.callCount).to.equal(1)

        })

        it('should call afterCreate hook once', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.build({ id: uuid(), property: '123' })

          chai.expect(HookModel.afterCreate.callCount).to.equal(1)

        })

        it('should not call beforeUpdate hook', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.build({ id: uuid(), property: '123' })

          chai.expect(HookModel.beforeUpdate.callCount).to.equal(0)

        })

        it('should not call afterUpdate hook', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.build({ id: uuid(), property: '123' })

          chai.expect(HookModel.afterUpdate.callCount).to.equal(0)

        })

      })

    })

    describe('static::id()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should return instance by id', async () => {

        const instance = await Model.build({ id: uuid(), property: '123' })

        const instanceById = await Model.id(instance.id)

        chai.expect(instanceById).to.deep.equal(instanceById)

      })

      it('should throw Error with no id', async () => {

        const promise = Model.id()

        await chai.expect(promise).to.eventually.be.rejected

      })

      it('should throw Error with invalid id', async () => {

        const promise = Model.id(uuid())

        await chai.expect(promise).to.eventually.be.rejected

      })

    })

    describe('static::all()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should return instance array', async () => {

        const instance1 = await Model.build({ id: uuid(), property: '123' })
        const instance2 = await Model.build({ id: uuid(), property: '123' })

        const instances = await Model.all()

        chai.expect(Array.isArray(instances)).to.equal(true)

        chai.expect(instances[0] instanceof Model).to.equal(true)
        chai.expect(instances[1] instanceof Model).to.equal(true)

        chai.expect([ instances.some((i) => i.id === instance1.id), instances.some((i) => i.id === instance2.id) ])
          .to.deep.include.members([ true, true ])

      })

      it('should return emptry array with no results', async () => {

        const instances = await Model.all()

        chai.expect(Array.isArray(instances)).to.equal(true)

        chai.expect(instances.length).to.equal(0)

      })

    })

    describe('static::find()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should return only instances matched in instance array with query', async () => {

        const instance1 = await Model.build({ id: uuid(), property: '123' })
        const instance2 = await Model.build({ id: uuid(), property: '123' })
        const instance3 = await Model.build({ id: uuid(), property: '456' })
        const instance4 = await Model.build({ id: uuid(), property: '456' })

        const instances = await Model.find({ property: '456' })

        chai.expect(Array.isArray(instances)).to.equal(true)

        chai.expect([ instances.some((i) => i.id === instance1.id), instances.some((i) => i.id === instance2.id) ])
          .to.not.deep.include.members([ true, true ])

        chai.expect([ instances.some((i) => i.id === instance3.id), instances.some((i) => i.id === instance4.id) ])
          .to.deep.include.members([ true, true ])

      })

    })

    describe('static::one()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should return instance with query', async () => {

        const propVal = uuid()

        const instance1 = await Model.build({ id: uuid(), property: '123' })
        const instance2 = await Model.build({ id: uuid(), property: propVal })

        const instance = await Model.one({ property: propVal })

        chai.expect(instance).to.be.instanceOf(Model)
        chai.expect(instance.id).to.not.equal(instance1.id)
        chai.expect(instance.id).to.equal(instance2.id)

      })

      it('should return undefined for unfufilled query', async () => {

        const propVal = uuid()

        const instance = await Model.one({ property: propVal })

        chai.expect(instance).to.equal(undefined)

      })

    })

    describe('static::count()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should return instance count', async () => {

        await Promise.all([
          Model.build({ id: uuid(), property: '123' }),
          Model.build({ id: uuid(), property: '123' })
        ])

        const instances = await Model.count()

        chai.expect(instances).to.equal(2)

      })

      it('should return instance count with query', async () => {

        await Promise.all([
          Model.build({ id: uuid(), property: '123' }),
          Model.build({ id: uuid(), property: '123' }),
          Model.build({ id: uuid(), property: '456' }),
          Model.build({ id: uuid(), property: '456' })
        ])

        const instances = await Model.count()

        const queryInstances = await Model.count({ property: '456' })

        chai.expect(instances).to.equal(4)
        chai.expect(queryInstances).to.equal(2)

      })

    })

    describe('static::upsert()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should create and return instance that does not exist', async () => {

        const instanceId = uuid()

        const instance = await Model.upsert({ id: instanceId, property: '123' })

        chai.expect(instance).to.be.instanceOf(Model)
        chai.expect(instance.id).to.equal(instanceId)

      })

      it('should return instance that does exist with query', async () => {

        const instance1 = await Model.build({ id: uuid(), property: '456' })

        const instance2 = await Model.upsert({ id: instance1.id })

        chai.expect(instance2).to.be.instanceOf(Model)
        chai.expect(instance2.id).to.equal(instance1.id)

      })

      it('should return new property values for instance that does exist with query', async () => {

        const instance1 = await Model.build({ id: uuid(), property: '789' })

        const instance2 = await Model.upsert({ id: instance1.id }, { property: '101112' })

        chai.expect(instance2).to.be.instanceOf(Model)
        chai.expect(instance2.id).to.equal(instance1.id)
        chai.expect(instance1.property).to.equal('789')
        chai.expect(instance2.property).to.equal('101112')

      })

      describe('hooks', async () => {

        it('should call beforeCreate hook once for new instance', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.upsert({ property: uuid() }, { id: uuid() })

          chai.expect(HookModel.beforeCreate.callCount).to.equal(1)

        })

        it('should call afterCreate hook once for new instance', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.upsert({ property: uuid() }, { id: uuid() })

          chai.expect(HookModel.beforeCreate.callCount).to.equal(1)

        })

        it('should not call beforeUpdate hook for new instance', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.upsert({ property: uuid() }, { id: uuid() })

          chai.expect(HookModel.beforeUpdate.callCount).to.equal(0)

        })

        it('should not call afterUpdate hook for new instance', async () => {

          const HookModel = getHookModel()

          // eslint-disable-next-line no-unused-vars
          const instance = await HookModel.upsert({ property: uuid() }, { id: uuid() })

          chai.expect(HookModel.afterUpdate.callCount).to.equal(0)

        })

        it('should call beforeUpdate hook for updated instance', async () => {

          const HookModel = getHookModel()

          const instance1 = await HookModel.build({ id: uuid(), property: '123' })

          // eslint-disable-next-line no-unused-vars
          const instance2 = await HookModel.upsert({ id: instance1.id }, { property: uuid() })

          chai.expect(HookModel.beforeUpdate.callCount).to.equal(1)

        })

        it('should call afterUpdate hook for updated instance', async () => {

          const HookModel = getHookModel()

          const instance1 = await HookModel.build({ id: uuid(), property: '123' })

          // eslint-disable-next-line no-unused-vars
          const instance2 = await HookModel.upsert({ id: instance1.id }, { property: uuid() })

          chai.expect(HookModel.afterUpdate.callCount).to.equal(1)

        })

        it('should not call beforeCreate hook for new instance', async () => {

          const HookModel = getHookModel()

          const instance1 = await HookModel.build({ id: uuid(), property: '123' })

          // eslint-disable-next-line no-unused-vars
          const instance2 = await HookModel.upsert({ id: instance1.id }, { property: uuid() })

          chai.expect(HookModel.beforeCreate.callCount).to.equal(1)

        })

        it('should not call afterCreate hook for new instance', async () => {

          const HookModel = getHookModel()

          const instance1 = await HookModel.build({ id: uuid() }, { property: '123' })

          // eslint-disable-next-line no-unused-vars
          const instance2 = await HookModel.upsert({ id: instance1.id }, { property: uuid() })

          chai.expect(HookModel.afterCreate.callCount).to.equal(1)

        })

      })

    })

    describe('static::queryBuilder()', async () => {

      beforeEach(() => Model.all().then((res) => res.map((m) => m.remove())))

      it('should allow use of knex instance', async () => {

        await Model.queryBuilder(async (query) => {

          chai.expect(query.constructor.name).to.equal('Builder')

        })

      })

      it('should return array of models from query', async () => {

        await Model.build({ id: '1234', foo: 'bar' })

        const res = await Model.queryBuilder(async (query) => {

          return query
            .where({ foo: 'bar' })

        })

        chai.expect(Array.isArray(res)).to.equal(true)
        chai.expect(res[0] instanceof Model).to.equal(true)

      })

      it('should return model for single result with first()', async () => {

        await Model.build({ id: '1234', foo: 'bar' })

        const res = await Model.queryBuilder(async (query) => {

          return query
            .where({ foo: 'bar' })
            .first()

        })

        chai.expect(Array.isArray(res)).to.equal(false)
        chai.expect(res instanceof Model).to.equal(true)

      })

    })

  })

})
