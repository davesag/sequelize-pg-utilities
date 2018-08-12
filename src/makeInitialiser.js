const pgtools = require('pgtools')
const sleep = require('./sleep')
const configure = require('./configure')

const MAX_RETRIES = 5

const makeInitialiser = (config, defaultDbName, logger) => {
  const {
    name,
    user,
    password,
    options: { port, host }
  } = configure(config, defaultDbName, logger)
  const dbConfig = { user, password, port, host }
  const tryInit = async () => {
    /* istanbul ignore if */
    if (process.env.NODE_ENV === 'production') {
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
    } catch (err) /* istanbul ignore next */ {
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
      return tryInit(config, defaultDbName)
    } catch (err) /* istanbul ignore next */ {
      if (retries === 0) throw err
      const delay = MAX_RETRIES - retries
      if (logger && typeof logger.debug === 'function')
        logger.debug('Retrying database init in', delay, 'seconds')
      await sleep(1000 * delay)
      return initialise(retries - 1)
    }
  }

  return initialise
}

module.exports = makeInitialiser
