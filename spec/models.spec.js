const { chai } = require('./utils')

const { models, modelBuilder } = require('../src/models')

describe('models.js', async () => {

  class TestModel {

    test () {

      return 'foo'

    }

  }

  describe('models', async () => {

    it('should add model to register when finalised with modelBuilder', () => {

      modelBuilder(TestModel)
        .finalise()

      chai.expect(models).to.have.property(TestModel.name)

    })

  })

  describe('modelBuilder', async () => {

    it('should return instance of modelBuilder', () => {

      const m = modelBuilder(TestModel)

      chai.expect(m).to.have.property('withDatasource')
      chai.expect(m).to.have.property('withSchema')
      chai.expect(m).to.have.property('finalise')

    })

    describe('useMixin', () => {

      const mixinWithoutArgs = (Model) => {

        return class extends Model {

          static get mixedprop () {

            return 'foo'

          }

          get mixedprop () {

            return 'bar'

          }

        }

      }

      it('should return a model from mixin function', () => {

        const Model = modelBuilder(TestModel)
          .useMixin(mixinWithoutArgs)
          .finalise()

        const instance = new Model()

        chai.expect(Model.name).to.equal(TestModel.name)
        chai.expect(Model.prototype).to.have.property('test')
        chai.expect(Model.mixedprop).to.equal('foo')

        chai.expect(instance.constructor.name).to.equal(TestModel.name)
        chai.expect(instance).to.have.property('test')
        chai.expect(instance.mixedprop).to.equal('bar')

      })

      it('should pass args to mixin function', () => {

        const mixinWithArgs = (
          Model, args1, args2
        ) => {

          chai.expect(args1).to.equal('foo')
          chai.expect(args2).to.equal('bar')

          return class extends Model {

            static get args1 () {

              return args1

            }

            get args1 () {

              return args1

            }

            static get args2 () {

              return args2

            }

            get args2 () {

              return args2

            }

          }

        }

        const Model = modelBuilder(TestModel)
          .useMixin(
            mixinWithArgs, 'foo', 'bar'
          )
          .finalise()

        const instance = new Model()

        chai.expect(Model.name).to.equal(TestModel.name)
        chai.expect(Model.args1).to.equal('foo')
        chai.expect(Model.args2).to.equal('bar')

        chai.expect(instance.constructor.name).to.equal(TestModel.name)
        chai.expect(instance.args1).to.equal('foo')
        chai.expect(instance.args2).to.equal('bar')

      })

    })

    it('finalise should return a model', () => {

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
