const joi = require('@hapi/joi')

const types = {
  SCHEMA: (schema) => joi.object(schema).unknown(false),
  UUID: joi.string().guid(),
  STRING: joi.string().max(512),
  OBJECT: (schema) => joi.object(schema),
  ARRAY: (schema) => joi.array().items(schema),
  NUMBER: joi.number().positive().allow(0),
  FLOAT: joi.number().precision(4),
  DATE: joi.date(),
  BOOLEAN: joi.boolean(),
  BINARY: joi.binary(),
  REF: (ref) => joi.ref(ref)
}

module.exports = types
