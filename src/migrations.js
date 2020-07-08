class MigrationController {

  constructor (datasource, ctx) {

    const migrationSource = {
      getMigrations: () => Promise.resolve(Object.keys(ctx).sort()),
      getMigrationName: (migration) => migration,
      getMigration: (migration) => ctx[migration]
    }

    const config = { migrationSource }

    this.datasource = datasource
    this.migrationSource = migrationSource
    this.config = config

  }

  latest () {

    return this.datasource.migrate.latest(this.config)

  }

  up () {

    return this.datasource.migrate.up(this.config)

  }

  down (name) {

    return this.datasource.migrate.down(this.config)

  }

  async reset () {

    const [ hasRan ] = await this.datasource.migrate.list(this.config)

    for (const name of hasRan.reverse()) {

      await this.datasource.migrate.down({ name, ...this.config })

    }

  }

  version () {

    return this.datasource.migrate.currentVersion(this.config)

  }

}

module.exports = MigrationController
