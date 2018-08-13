const { expect } = require('chai')

const migrationConfig = require('../../src/migrationConfig')
const config = require('../fixtures/config.json')

describe('src/migrationConfig', () => {
  const expected = {
    test: {
      username: config.test.username,
      password: config.test.password,
      database: config.test.database,
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
