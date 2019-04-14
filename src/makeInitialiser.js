const pgtools = require('pgtools')

const sleep = require('./sleep')
const configure = require('./configure')
const env = require('./env')

const MAX_RETRIES = 5

/**
 * Create a database initialisation function that uses `pgtools` to attempt to create
 * the database as per the derived configuration.
 *
 * @param config — The content of the `config/config.json` file. Required, no default.
 * @param defaultDbName — If the database name is not set an environment variable, and if the config file does not define a database name, then use this as the database name. Optional, no default.
 * @param operatorsAliases — Sequelize recommends you don't use [operators aliases](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-aliases), but if you want to you can set them here.  Optional, default is `false`.
 * @param logger — You can pass in a logger function here for Sequelize to use. Optional, default is `false`, meaning don't log anything.
 * @return an async function that initialises the database.
 */
const makeInitialiser = (config, defaultDbName, operatorsAliases, logger) => {
  const {
    name,
    user,
    password,
    options: { port, host }
  } = configure(config, defaultDbName, operatorsAliases, logger)

  const dbConfig = { user, password, port, host }

  const tryInit = async () => {
    if (env === 'production') {
      return {
        dbNew: false,
        message: 'Running in production so skip database creation.'
      }
    }

    try {
      await pgtools.createdb(dbConfig, name)
      return {
        isNew: true,
        message: `createdb created database '${name}'`
      }
    } catch (err) {
      if (err.name && err.name === 'duplicate_database') {
        return {
          isNew: false,
          message: `Database '${name}' already exists`
        }
      }
      throw err
    }
  }

  const initialise = async (retries = MAX_RETRIES) => {
    try {
      return await tryInit()
    } catch (err) {
      if (retries === 0) throw err
      const delay = 2 * (MAX_RETRIES - retries + 1)

      /* istanbul ignore else */
      if (logger && typeof logger.debug === 'function')
        logger.debug('Retrying database init in', delay, 'seconds')
      await sleep(1000 * delay)
      return initialise(retries - 1)
    }
  }

  return initialise
}

module.exports = makeInitialiser
