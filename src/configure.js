/**
 *  this is excluded from code coverage reporting due to a bug in instanbul
 *  whereby it will not ignore the if on line 49
 *
 *  TODO: revisit this when the bug is fixed.
 */
const configure = (
  config,
  defaultDbName,
  operatorsAliases = false,
  logger = false
) => {
  const name =
    process.env.DB_NAME ||
    config.database ||
    /* istanbul ignore next */ defaultDbName
  const user =
    process.env.DB_USER || config.username || /* istanbul ignore next */ null
  const password =
    process.env.DB_PASS || config.password || /* istanbul ignore next */ null

  /* istanbul ignore next */
  const poolOptions = config.pool
    ? {
        max: process.env.DB_POOL_MAX || config.pool.max || 5,
        min: process.env.DB_POOL_MIN || config.pool.min || 1,
        idle: process.env.DB_POOL_IDLE || config.pool.idle || 10000
      }
    : {
        max: process.env.DB_POOL_MAX || 5,
        min: process.env.DB_POOL_MIN || 1,
        idle: process.env.DB_POOL_IDLE || 10000
      }

  const options = {
    host:
      process.env.DB_HOST ||
      config.host ||
      /* istanbul ignore next */ 'localhost',
    port: process.env.DB_PORT || config.port || 5432,
    dialect:
      process.env.DB_TYPE ||
      config.dialect ||
      /* istanbul ignore next */ 'postgres',
    pool: poolOptions,
    operatorsAliases, // see https://github.com/sequelize/sequelize/issues/8417
    logging: logger // this can be a logging function.
  }

  /* istanbul ignore if */
  if (process.env.DATABASE_URL) options.protocol = config.protocol

  return { name, user, password, options }
}

module.exports = configure
