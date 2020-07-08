const { chai } = require('./utils')

const { models, modelBuilder } = require('../src/models')

describe('models.js', async () => {

  describe('models', async () => {

    it('should add model to register when finalised with modelBuilder', () => {

      class TestModel { }

      modelBuilder(TestModel)
        .finalise()

      chai.expect(models).to.have.property(TestModel.name)

    })

  })

  describe('modelBuilder', async () => {

    it('should return instance of modelBuilder', () => {

      class TestModel { }

      const m = modelBuilder(TestModel)

      chai.expect(m).to.have.property('withDatasource')
      chai.expect(m).to.have.property('withSchema')
      chai.expect(m).to.have.property('finalise')

    })

    it('finalise should return a model', () => {

      class TestModel {

        test () {

          return 'foo'

        }

      }

      const Model = modelBuilder(TestModel)
        .finalise()

      const instance = new Model()

      chai.expect(Model.name).to.equal(TestModel.name)
      chai.expect(Model.prototype).to.have.property('test')

      chai.expect(instance.constructor.name).to.equal(TestModel.name)
      chai.expect(instance).to.have.property('test')

    })

  })

})
