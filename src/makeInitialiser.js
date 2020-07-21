const createDb = require('./createDb')
const sleep = require('./sleep')
const configure = require('./configure')
const env = require('./env')
const { MAX_RETRIES } = require('./constants')

/**
 * Create a database initialisation function that uses `pgtools` to attempt to create
 * the database as per the derived configuration.
 *
 * @param config — The content of the `config/config.json` file. Required, no default.
 * @param defaultDbName — If the database name is not set an environment variable, and if the config file does not define a database name, then use this as the database name. Optional, no default.
 * @param logger — You can pass in a logger function here for Sequelize to use. Optional, default is `false`, meaning don't log anything.
 * @param options — You can pass in additional options here. Optional.
 * @return an async function that initialises the database.
 */
const makeInitialiser = (config, defaultDbName, logger, options) => {
  const {
    name,
    user,
    password,
    options: { port, host }
  } = configure(config, defaultDbName, logger, options)

  const dbConfig = { user, password, port, host }

  const tryInit = async () => {
    if (env === 'production') {
      return {
        dbNew: false,
        message: 'Running in production so skip database creation.'
      }
    }

    const dbNew = await createDb(dbConfig, name)

    const message = dbNew
      ? `createDb created database '${name}'`
      : `Database '${name}' already exists`

    return { dbNew, message }
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
