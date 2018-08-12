const configure = require('./configure')
const makeInitialiser = require('./makeInitialiser')
const urlParser = require('./urlParser')
const migrationConfig = require('./migrationConfig')

const env = process.env.NODE_ENV || /* istanbul ignore next */ 'development'

module.exports = {
  configure,
  makeInitialiser,
  urlParser,
  migrationConfig,
  env
}
