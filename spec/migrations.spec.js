const { datasource, chai } = require('./utils')

const MigrationController = require('../src/migrations')

describe('migrations.js', async () => {

  const migrations = {
    '1-one': {
      up: (datasource) => datasource.schema.createTable('One', (table) => {

        table.string('id').notNullable()
        table.string('foo').notNullable()

      }),
      down: (datasource) => datasource.schema.dropTable('One')
    },
    '2-two': {
      up: (datasource) => datasource.schema.createTable('Two', (table) => {

        table.string('id').notNullable()
        table.string('foo').notNullable()

      }),
      down: (datasource) => datasource.schema.dropTable('Two')
    },
    '3-three': {
      up: (datasource) => datasource.schema.createTable('Three', (table) => {

        table.string('id').notNullable()
        table.string('foo').notNullable()

      }),
      down: (datasource) => datasource.schema.dropTable('Three')
    }
  }

  describe('MigrationController', async () => {

    beforeEach(async () => {

      const m = new MigrationController(datasource, migrations)

      await m.reset()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('none')

    })

    it('should run next migration with up', async () => {

      const m = new MigrationController(datasource, migrations)

      await m.up()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('1-one')

      await m.up()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('2-two')

      await m.up()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('3-three')

    })

    it('should undo previous migration with down', async () => {

      const m = new MigrationController(datasource, migrations)

      await m.latest()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('3-three')

      await m.down()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('2-two')

      await m.down()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('1-one')

      await m.down()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('none')

    })

    it('should run latest migration with latest', async () => {

      const m = new MigrationController(datasource, migrations)

      await m.latest()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('3-three')

    })

    it('should run reset migrations with reset', async () => {

      const m = new MigrationController(datasource, migrations)

      await m.latest()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('3-three')

      await m.reset()

      await chai.expect(m.version()).to.eventually.be.fulfilled.and.equal('none')

    })

  })

})
