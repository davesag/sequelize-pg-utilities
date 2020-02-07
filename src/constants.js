// see https://github.com/sequelize/sequelize/blob/master/lib/sequelize.js#L126
const PROGRAMATIC_OPTIONS = [
  'dialectModule',
  'dialectModulePath',
  'define',
  'query',
  'schema',
  'set',
  'sync',
  'quoteIdentifiers',
  'transactionType',
  'typeValidation',
  'hooks'
]

const MAX_RETRIES = 5

module.exports = {
  PROGRAMATIC_OPTIONS,
  MAX_RETRIES
}
