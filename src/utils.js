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

    } else if (type === 'object' && typeof value !== 'string') {

      return Object.assign(acc, { [key]: value ? JSON.stringify(value) : '{}' })

    } else if (type === 'array' && typeof value !== 'string') {

      return Object.assign(acc, { [key]: value ? JSON.stringify(value) : '[]' })

    } else if (type === 'date' && value instanceof Date) {

      return Object.assign(acc, { [key]: value.getTime() })

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

    } else if (type === 'object' && typeof value !== 'object') {

      return Object.assign(acc, { [key]: value ? JSON.parse(value) : {} })

    } else if (type === 'array' && typeof value !== 'object') {

      return Object.assign(acc, { [key]: value ? JSON.parse(value) : [] })

    } else if (type === 'date' && typeof value === 'number') {

      return Object.assign(acc, { [key]: value ? new Date(value) : undefined })

    } else {

      return Object.assign(acc, { [key]: value })

    }

  }, {})

}

module.exports = { transformData, untransformData }
