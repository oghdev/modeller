const { chai } = require('./utils')

const types = require('../src/types')
const { transformData, untransformData } = require('../src/utils')

describe('utils.js', async () => {

  describe('transformData', async () => {

    it('should return data as-is without schema', () => {

      const data = { id: 1 }

      chai.expect(transformData(undefined, data)).to.deep.equal(data)

    })

    it('should transform boolean to integer representation with schema', () => {

      const schema = types.OBJECT({ bool: types.BOOLEAN.required() })

      chai.expect(transformData(schema, { bool: true })).to.deep.equal({ bool: 1 })
      chai.expect(transformData(schema, { bool: false })).to.deep.equal({ bool: 0 })

    })

    it('should transform json objects to string representation with schema', () => {

      const schema = types.OBJECT({ json: types.OBJECT({ field: types.STRING.required() }).required() })
      const data = { json: { field: '123' } }

      chai.expect(transformData(schema, data)).to.deep.equal({ json: JSON.stringify(data.json) })

    })

    it('should transform json arrays to string representation with schema', () => {

      const schema = types.OBJECT({ json: types.ARRAY(types.STRING.required()).required() })
      const data = { json: [ '123', '456' ] }

      chai.expect(transformData(schema, data)).to.deep.equal({ json: JSON.stringify(data.json) })

    })

  })

  describe('untransformData', async () => {

    it('should return data as-is without schema', () => {

      const data = { id: 1 }

      chai.expect(untransformData(undefined, data)).to.deep.equal(data)

    })

    it('should transform boolean integer fields to thier boolean representation with schema', () => {

      const schema = types.OBJECT({ bool: types.BOOLEAN.required() })

      chai.expect(untransformData(schema, { bool: 1 })).to.deep.equal({ bool: true })
      chai.expect(untransformData(schema, { bool: 0 })).to.deep.equal({ bool: false })

    })

  })

})
