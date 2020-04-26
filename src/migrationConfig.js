const configure = require('./configure')
const env = require('./env')

const adapt = ({
  name: database,
  user: username,
  password,
  options: { dialect, dialectOptions, host, port, ssl }
}) => {
  const adapted = {
    [env]: {
      database,
      username,
      password,
      dialect,
      host,
      port
    }
  }

  if (dialectOptions) adapted[env].dialectOptions = dialectOptions
  if (ssl) adapted[env].ssl = ssl

  return adapted
}

/**
 * Create database migration confguration data needed by SequelizeCLI.
 *
 * @param config — The content of the `config/config.json` file. Required, no default.
 * @param defaultDbName — If the database name is not set an environment variable, and if the config file does not define a database name, then use this as the database name. Optional, no default.
 * @param logger — You can pass in a logger function here for Sequelize to use. Optional, default is `false`, meaning don't log anything.
 * @param options — You can pass in additional options here. Optional.
 * @return { [env]: { database, username, password, dialect, dialectOptions } }
 */
const migrationConfig = (config, defaultDbName, logger, options) =>
  adapt(configure(config, defaultDbName, logger, options))

module.exports = migrationConfig
