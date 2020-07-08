const transformData = (schema, data) => {

  if (!schema) {

    return data

  }

  const fields = schema.describe().keys

  return Object.entries(data).reduce((acc, [ key, value ]) => {

    if (!fields[key]) {

      throw new Error(`Invalid field '${key}'`)

    }

    const type = fields[key].type

    if (type === 'boolean') {

      return Object.assign(acc, { [key]: value ? 1 : 0 })

    } else if (type === 'object' || type === 'array') {

      return Object.assign(acc, { [key]: JSON.stringify(value) })

    } else {

      return Object.assign(acc, { [key]: value })

    }

  }, {})

}

const untransformData = (schema, data) => {

  if (!schema) {

    return data

  }

  const fields = schema.describe().keys

  return Object.entries(data).reduce((acc, [ key, value ]) => {

    if (!fields[key]) {

      throw new Error(`Invalid field '${key}'`)

    }

    const type = fields[key].type

    if (type === 'boolean') {

      return Object.assign(acc, { [key]: value === 1 || value === '1' })

    } else {

      return Object.assign(acc, { [key]: value })

    }

  }, {})

}

module.exports = { transformData, untransformData }
