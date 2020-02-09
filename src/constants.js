// see https://github.com/sequelize/sequelize/blob/master/lib/sequelize.js#L126
// ref also https://github.com/davesag/sequelize-pg-utilities/issues/32

const CONFIG_OPTIONS = [
  'benchmark',
  'clientMinMessages',
  'native',
  'omitNull',
  'protocol',
  'replication',
  'timezone'
]

const PROGRAMATIC_OPTIONS = [
  'define',
  'dialectModule',
  'dialectModulePath',
  'hooks',
  'logQueryParameters',
  'minifyAliases',
  'query',
  'quoteIdentifiers',
  'schema',
  'set',
  'sync',
  'transactionType',
  'typeValidation'
]

// note: Do not use the following as an option:
// - standardConformingStrings,
// - quoteIdentifiers

const MAX_RETRIES = 5

module.exports = {
  CONFIG_OPTIONS,
  PROGRAMATIC_OPTIONS,
  MAX_RETRIES
}
