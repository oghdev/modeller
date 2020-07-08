const { chai } = require('./utils')

const joi = require('@hapi/joi')
const uuid = require('uuid').v4
const randomize = require('randomatic')
const rn = require('random-number')

const types = require('../src/types')

describe('types.js', async () => {

  describe('types', async () => {

    it('should allow type extension (string)', async () => {

      chai.expect(types.STRING).to.deep.equal(joi.string().max(512))

      chai.expect(types.STRING.max(128)).to.deep.equal(joi.string().max(128))

    })

    it('should allow type extension (float)', async () => {

      chai.expect(types.FLOAT).to.deep.equal(joi.number().precision(4))

    })

    it('should allow type extension (negative float)', async () => {

      chai.expect(types.FLOAT.negative()).to.deep.equal(joi.number().precision(4).negative())

    })

    describe('types.SCHEMA', async () => {

      it('should match joi schema', async () => {

        chai.expect(types.SCHEMA()).to.have.property('type', 'object')

      })

      it('should match joi inner schema', async () => {

        const schema = types.SCHEMA({ val: types.STRING, num: types.NUMBER })

        chai.expect(schema.$_terms.keys[0]).to.have.property('key', 'val')
        chai.expect(schema.$_terms.keys[0].schema).to.have.property('type', 'string')

        chai.expect(schema.$_terms.keys[1]).to.have.property('key', 'num')
        chai.expect(schema.$_terms.keys[1].schema).to.have.property('type', 'number')

      })

    })

    describe('types.STRING', async () => {

      const type = types.STRING

      it('should match joi schema', async () => {

        chai.expect(type).to.deep.equal(joi.string().max(512))

      })

      it('should validate correct value (string 12345)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('12345')).to.eventually.be.fulfilled

      })

      it('should validate correct value (random string length 255)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(randomize('*', 255))).to.eventually.be.fulfilled

      })

      it('should validate correct value (random string length 512)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(randomize('*', 512))).to.eventually.be.fulfilled

      })

      it('should throw on incorrect value (positive integer)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(900)).to.eventually.be.rejected

      })

      it('should throw on incorrect value (empty string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (Date)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(new Date())).to.eventually.be.rejected

      })

      it('should throw on incorrect value (random string length 1024)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(randomize('*', 1024))).to.eventually.be.rejected

      })

    })

    describe('types.UUID', async () => {

      const type = types.UUID

      it('should match joi schema', async () => {

        chai.expect(type).to.deep.equal(joi.string().guid())

      })

      it('should validate correct value (uuid())', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(uuid())).to.eventually.be.fulfilled

      })

      it('should throw on incorrect value (string 123)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('123')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (positive integer)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(456)).to.eventually.be.rejected

      })

    })

    describe('types.NUMBER', () => {

      const type = types.NUMBER

      it('should match joi schema', async () => {

        chai.expect(type).to.deep.equal(joi.number().positive().allow(0))

      })

      it('should validate correct value (1)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(1)).to.eventually.be.fulfilled

      })

      it('should validate correct value (1024)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(1024)).to.eventually.be.fulfilled

      })

      it('should validate correct value (random positive integer)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(rn({ min: 0, max: 5000, integer: true }))).to.eventually.be.fulfilled

      })

      it('should throw on incorrect value (negative integer)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(-1)).to.eventually.be.rejected

      })

      it('should throw on incorrect value (empty string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (hello world string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('hello world')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (date)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(new Date())).to.eventually.be.rejected

      })

      it('should throw on incorrect value (random string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(randomize('*', 1024))).to.eventually.be.rejected

      })

    })

    describe('types.FLOAT', () => {

      const type = types.FLOAT

      it('should match joi schema', async () => {

        chai.expect(type).to.deep.equal(joi.number().precision(4))

      })

      it('should validate correct value (1)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(1)).to.eventually.be.fulfilled

      })

      it('should validate correct value (1024)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(1.234456)).to.eventually.be.fulfilled

      })

      it('should validate correct value (random positive integer)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(rn({ min: 0, max: 5000, integer: true }))).to.eventually.be.fulfilled

      })

      it('should validate correct value (negative integer)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(-1)).to.eventually.be.fulfilled

      })

      it('should throw on incorrect value (empty string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (hello world string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('hello world')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (date)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(new Date())).to.eventually.be.rejected

      })

      it('should throw on incorrect value (random string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(randomize('*', 1024))).to.eventually.be.rejected

      })

    })

    describe('types.BOOLEAN', () => {

      const type = types.BOOLEAN

      it('should match joi schema', async () => {

        chai.expect(type).to.deep.equal(joi.boolean())

      })

      it('should validate correct value (true)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(true)).to.eventually.be.fulfilled

      })

      it('should validate correct value (false)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(false)).to.eventually.be.fulfilled

      })

      it('should throw on incorrect value (9)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(0)).to.eventually.be.rejected

      })

      it('should throw on incorrect value (1)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(1)).to.eventually.be.rejected

      })

      it('should throw on incorrect value (negative integer)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(-1)).to.eventually.be.rejected

      })

      it('should throw on incorrect value (empty string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (hello world string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('hello world')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (date)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(new Date())).to.eventually.be.rejected

      })

      it('should throw on incorrect value (random string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(randomize('*', 1024))).to.eventually.be.rejected

      })

    })

    describe('types.DATE', () => {

      const type = types.DATE

      it('should match joi schema', async () => {

        chai.expect(type).to.deep.equal(joi.date())

      })

      it('should validate correct value (new Date())', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(new Date())).to.eventually.be.fulfilled

      })

      it('should validate correct value (new Date(time))', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(new Date(Date.now()))).to.eventually.be.fulfilled

      })

      it('should validate correct value (0)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(0)).to.eventually.be.fulfilled

      })

      it('should validate correct value (1)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(1)).to.eventually.be.fulfilled

      })

      it('should throw on incorrect value (empty string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (hello world string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync('hello world')).to.eventually.be.rejected

      })

      it('should throw on incorrect value (random string)', async () => {

        // eslint-disable-next-line no-unused-expressions
        await chai.expect(type.validateAsync(randomize('*', 1024))).to.eventually.be.rejected

      })

    })

  })

})
