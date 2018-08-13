# sequelize-pg-utilities

An opinionated set of database utilities that manage creating and connecting to a Postgres database

[![Greenkeeper badge](https://badges.greenkeeper.io/davesag/sequelize-pg-utilities.svg)](https://greenkeeper.io/)

## Branches

| Branch | Status | Coverage | Notes |
| ------ | ------ | -------- | - |
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/develop) | [![codecov](https://codecov.io/gh/davesag/sequelize-pg-utilities/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/sequelize-pg-utilities) | Work in progress |
| `master` | [![CircleCI](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/master) | [![codecov](https://codecov.io/gh/davesag/sequelize-pg-utilities/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/sequelize-pg-utilities) | Latest stable release |

## Prerequisites

This library assumes:

1. You are using NodeJS 8+
2. You are using Sequelize to manage interactions with Postgres

## Install

Add `sequelize-pg-utilities` as a `dependency`:

    npm i sequelize-pg-utilities

`sequelize-pg-utilities` has one dependency.

* [`pgtools`](https://www.npmjs.com/package/pgtools)

## Example

### Configuration

Typically a Sequelize project will include a `config/config.json` file with entries as follows:

```
{
  "development": {
    "username": "my-dev-user",
    "password": "my-dev-password",
    "database": "my-project-development"
  },
  "test": {
    "username": "my-test-user",
    "password": "my-test-password",
    "database": "my-project-test"
  },
  "production": {
    "username": "my-production-user",
    "password": "my-production-password",
    "database": "my-project-prod"
  }
}
```

When your application starts you'll want to construct correct database configuration values as a mix of the above config file, selected environment variables, and sensible defaults.

To do this simply create a configuration object as follows:

```
const { configure } = require('sequelize-pg-utilities')
const config = require('path/to/config/config.json')

const { name, user, password, options } = configure(config)
```

These configuration values can then be passed in to Sequelize as follows:

```
const sequelize = new Sequelize(name, user, password, options)
```

#### Environment Variables Supported

The following environment variables take precedence over whatever is defined in `config/config.json`

* `DATABASE_URL` The database url, if provided, will override many of the below `DB` settings.
* `DB_NAME` The database name — You may also supply a default (see below)
* `DB_USER` The database user — no default
* `DB_PASS` The database password — no default
* `DB_POOL_MAX` The maximum number of database connections — Defaults to `5`
* `DB_POOL_MIN` The minimum number of database connections — Defaults to `1`
* `DB_POOL_IDLE` The database idle time — Defaults to `10000` ms
* `DB_HOST` The database host — Defaults to `'localhost'`
* `DB_PORT` The database port — Defaults to `5432`
* `DB_TYPE` The database type — Defaults to `'postgres'` — This library is written with Postgres in mind so please don't change this unless you know what you are doing.

If you supply the `DATABASE_URL` environment variable, as Heroku and other Paas systems generally do, then the `configure` function will extract most of what it needs from that and those extracted values will take priority over other values.

### Initialisation of a database

Often, especially in development and test environments, you'll want your server to create its database the first time it runs. To do this you can make an `initialiser` using the `makeInitialiser` function.

```
const { makeInitialiser } = require('sequelize-pg-utilities')
const config = require('path/to/config/config.json')

const initialise = makeInitialiser(config)

const start = async () => {
  try {
    const result = await initialise()

    if (isDevelopment) console.log(result.message)

    // now do whatever else is needed to start your server
  } catch (err) {
    console.error('Could not start server', err)
    process.exit(1)
  }
}
```

You can set the number of retries by passing it in as a parameter to `initialise`. The default is `5`.

```
const result = await initialise(10)
```

The `result` object has two properties:

```
{
  dbNew: <true>|<false>, // was a new database created?
  message: 'More information lives here' // some clarifying text.
}
```

### Configuring migrations

The Sequelize CLI requires that you define a `.sequelizerc` file at the root of your project that exports data such as `config`, `migrations-path`, and `models-path`.

The config is in the form:

```
{
  [env]: { username, password, database, options }
}
```

You can use the `migrationConfig` function to generate configuration details to suit SequelizeCLI's needs.

```
const path = require('path')
const { migrationConfig } = require('sequelize-pg-utilities')
const config = require('path/to/config/config.json')

module.exports = {
  config: migrationConfig(config),
  'migrations-path': path.resolve(__dirname, 'migrations'),
  'models-path': path.resolve(__dirname, 'src', 'models')
}
```

### Options

The `configure`, `makeInitialiser`, and `migrationConfig` functions all have an identical signature.  They accept the following parameters.

* `config`: The content of the `config/config.json` file. Required, no default.
* `defaultDbName`: If the database name is not set in an environment variable, and if the config file does not define a database name, then use this as the database name. Optional, no default.
* `operatorsAliases`: Sequelize recommends you don't use [operators aliases](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-aliases), but if you want to you can set them here.  Optional, default is `false`.
* `logger`: You can pass in a logger function here for Sequelize to use. Optional, default is `false`, meaning don't log anything.

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
