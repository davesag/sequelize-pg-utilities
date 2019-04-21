const configure = require('./configure')
const env = require('./env')

const adapt = ({
  name: database,
  user: username,
  password,
  options: { dialect, dialectOptions, host, port, ssl, operatorsAliases }
}) => {
  const adapted = {
    [env]: {
      database,
      username,
      password,
      dialect,
      host,
      port,
      operatorsAliases
    }
  }
  if (dialectOptions) adapted.dialectOptions = dialectOptions
  if (ssl) adapted.ssl = ssl
  return adapted
}

/**
 * Create database migration confguration data needed by SequelizeCLI.
 *
 * @param config — The content of the `config/config.json` file. Required, no default.
 * @param defaultDbName — If the database name is not set an environment variable, and if the config file does not define a database name, then use this as the database name. Optional, no default.
 * @param operatorsAliases — Sequelize recommends you don't use [operators aliases](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-aliases), but if you want to you can set them here.  Optional, default is `false`.
 * @param logger — You can pass in a logger function here for Sequelize to use. Optional, default is `false`, meaning don't log anything.
 * @return { [env]: { database, username, password, dialect, operatorsAliases, options } }
 */
const migrationConfig = (config, defaultDbName, operatorsAliases, logger) =>
  adapt(configure(config, defaultDbName, operatorsAliases, logger))

module.exports = migrationConfig
