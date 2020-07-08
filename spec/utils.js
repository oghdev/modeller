const knex = require('knex')

const sinon = require('sinon')
const chai = require('chai')
const chaiSinon = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')

const datasource = knex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  pool: false
})

chai.use(chaiSinon)
chai.use(chaiAsPromised)

module.exports = { datasource, chai, sinon }
