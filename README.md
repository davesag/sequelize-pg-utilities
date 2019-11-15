# sequelize-pg-utilities

An opinionated set of database utilities that simplify creating and connecting to a [`Postgresql`](https://www.postgresql.org) database via [`Sequelize`](https://github.com/sequelize/sequelize).

[![NPM](https://nodei.co/npm/sequelize-pg-utilities.png)](https://nodei.co/npm/sequelize-pg-utilities/)

## Related Projects

- [`sequelize-test-helpers`](https://github.com/davesag/sequelize-test-helpers) — Mocks and helpers that simplify unit testing of `Sequelize` models.

## Prerequisites

This library assumes:

1. You are using NodeJS 8.10+
2. You are using [`Sequelize`](https://github.com/sequelize/sequelize) to manage interactions with [`Postgresql`](https://www.postgresql.org)

## Install

Add `sequelize-pg-utilities` as a dependency:

```sh
npm i sequelize-pg-utilities
```

`sequelize-pg-utilities` has one dependency.

- [`pgtools`](https://www.npmjs.com/package/pgtools)

## Example

### Configuration

Typically a Sequelize project will include a `config/config.json` file with entries as follows:

```json
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

When your application starts you'll need to construct correct database configuration values as a mix of the above config file, selected environment variables, and sensible defaults.

To do this simply create a configuration object as follows:

```js
const { configure } = require('sequelize-pg-utilities')
const config = require('path/to/config/config.json')

const { name, user, password, options } = configure(config)
```

These configuration values can then be passed in to Sequelize as follows:

```js
const sequelize = new Sequelize(name, user, password, options)
```

#### Environment Variables Supported

The following environment variables take precedence over whatever is defined in `config/config.json`

- `DATABASE_URL` The database url, if provided, will override many of the below `DB` settings.
- `DB_NAME` The database name — You may also supply a default (see below)
- `DB_USER` The database user — no default
- `DB_PASS` The database password — no default
- `DB_POOL_MAX` The maximum number of database connections — Defaults to `5`
- `DB_POOL_MIN` The minimum number of database connections — Defaults to `1`
- `DB_POOL_IDLE` The database idle time — Defaults to `10000` ms
- `DB_HOST` The database host — Defaults to `'localhost'`
- `DB_PORT` The database port — Defaults to `5432`
- `DB_TYPE` The database type — Defaults to `'postgres'` — This library is written with Postgres in mind so please don't change this unless you know what you are doing.

If you supply the `DATABASE_URL` environment variable, as Heroku and other PaaS systems generally do, then the `configure` function will extract most of what it needs from that and the extracted values will take priority over other values.

### Initialisation of a database

In `development` and `test` environments, you'll need your server to create a database the first time it runs. To do this you can make an `initialiser` using the `makeInitialiser` function.

```js
const { makeInitialiser } = require('sequelize-pg-utilities')
const config = require('path/to/config/config.json')

const initialise = makeInitialiser(config)

const start = async () => {
  try {
    const result = await initialise()
    console.log(result.message)

    // now do whatever else is needed to start your server
  } catch (err) {
    console.error('Could not start server', err)
    process.exit(1)
  }
}
```

You can set the number of retries by passing it in as a parameter to `initialise`. The default is `5`.

```js
const result = await initialise(10)
```

On each retry it will wait for a progressively longer period of time, starting with 2 seconds, and increasing the delay by 2 seconds each retry.

The `result` object has two properties:

```js
{
  dbNew: false, // or true if a new database was created?
  message: 'More information' // some clarifying text.
}
```

In `production` it assumes your database already exists.

### Configuring migrations

The Sequelize CLI requires a `.sequelizerc` file at the root of the project that exports data such as `config`, `migrations-path`, and `models-path`.

The `config` is an object in the form:

```js
{
  [env]: {
    username,
    password,
    database,
    dialect,
    host,
    port,
  }
}
```

Use the `migrationConfig` function to generate configuration details to suit Sequelize CLI's needs.

Create a `migrationConfig.js` file as follows:

```js
const { migrationConfig } = require('sequelize-pg-utilities')
const config = require('path/to/config/config.json')

module.exports = migrationConfig(config)
```

Then in `.sequelizerc` file do this:

```js
const path = require('path')

module.exports = {
  config: path.resolve(__dirname, 'path', 'to', 'migrationConfig.js'),
  'migrations-path': path.resolve(__dirname, 'migrations'),
  'models-path': path.resolve(__dirname, 'src', 'models')
}
```

### Function Signature

The `configure`, `makeInitialiser`, and `migrationConfig` functions all have an identical signature.

They each accept the following parameters.

- `config`: The content of the `config/config.json` file. Required, no default.
- `defaultDbName`: If the database name is not set in an environment variable, and if the config file does not define a database name, then use this as the database name. Optional, no default.
- `operatorsAliases`: Sequelize recommends you don't use [operators aliases](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-aliases), but if you want to you can set them here. If you are using Sequelize 4 or older then you need to set this to `false` but if you are using Sequelize 5 or better you ought to just ignore this option. ([more information](https://github.com/sequelize/sequelize/issues/8417#issuecomment-461150731))
- `logger`: You can pass in a logger function here for Sequelize to use. Optional, default is `false`, meaning don't log anything. This gets returned as `logging` in the configs.

### SSL Options

If you supply `ssl` options in your `config.json` file then these will be injected into your configuration as `dialectOptions` and the `ssl` option will be set to `true`.

Note this is not used by `makeInitialiser` as it's assumed that you are only using `ssl` in `production` and you won't be trying to create your database from within your code when in `production`. A future release may address that however.

## Development

[![Greenkeeper badge](https://badges.greenkeeper.io/davesag/sequelize-pg-utilities.svg)](https://greenkeeper.io/)

### Branches

<!-- prettier-ignore -->
| Branch | Status | Coverage | Notes |
| ------ | ------ | -------- | ----- |
| `develop` | [![CircleCI](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/develop) | [![codecov](https://codecov.io/gh/davesag/sequelize-pg-utilities/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/sequelize-pg-utilities) | Work in progress |
| `master` | [![CircleCI](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/sequelize-pg-utilities/tree/master) | [![codecov](https://codecov.io/gh/davesag/sequelize-pg-utilities/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/sequelize-pg-utilities) | Latest stable release |

### Prerequisites

- [NodeJS](https://nodejs.org) — Version `8.10` or better.

### Test it

- `npm test` — runs the unit tests.
- `npm run test:unit:cov` — runs the unit tests with coverage reporting.
- `npm run test:mutants` — runs the mutation tests

### Lint it

```sh
npm run lint
```

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
