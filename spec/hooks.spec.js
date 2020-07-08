const { datasource } = require('./utils')

before(async () => {

  await Promise.all([
    datasource.schema.createTable('BaseModel', (table) => {

      table.uuid('id').primary().notNullable()
      table.string('property').nullable().default('')
      table.string('field').nullable().default('')
      table.string('foo').nullable().default('')
      table.string('bar').nullable().default('')
      table.integer('num').nullable().default(0)

    }),
    datasource.schema.createTable('Model', (table) => {

      table.uuid('id').primary().notNullable()
      table.string('property').nullable().default('')
      table.string('field').nullable().default('')
      table.string('foo').nullable().default('')
      table.string('bar').nullable().default('')
      table.integer('num').nullable().default(0)

    }),
    datasource.schema.createTable('HookModel', (table) => {

      table.uuid('id').primary().notNullable()
      table.string('property').nullable().default('')
      table.string('field').nullable().default('')
      table.string('foo').nullable().default('')
      table.string('bar').nullable().default('')
      table.integer('num').nullable().default(0)

    }),
    datasource.schema.createTable('DateMixinModel', (table) => {

      table.uuid('id').primary().notNullable()
      table.string('property').nullable().default('')
      table.string('field').nullable().default('')
      table.string('foo').nullable().default('')
      table.string('bar').nullable().default('')
      table.integer('num').nullable().default(0)
      table.date('updatedOn').notNullable()
      table.date('createdOn').notNullable()

    })
  ])

})
