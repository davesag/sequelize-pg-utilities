const { expect } = require('chai')

const migrationConfig = require('../../src/migrationConfig')
const { test: config } = require('../fixtures/config.json')

describe('src/migrationConfig', () => {
  const expected = {
    test: {
      username: config.username,
      password: config.password,
      database: config.database,
      options: {
        dialect: 'postgres',
        host: 'localhost',
        logging: false,
        operatorsAliases: false,
        pool: {
          idle: 10000,
          max: 5,
          min: 1
        },
        port: 5432
      }
    }
  }

  const conf = migrationConfig(config)

  it('gave the expected result', () => {
    expect(conf).to.deep.equal(expected)
  })
})
