const { expect } = require('chai')

const migrationConfig = require('../../src/migrationConfig')
const config = require('../fixtures/config.json')

describe('src/migrationConfig', () => {
  const expected = {
    test: {
      username: config.test.username,
      password: config.test.password,
      database: config.test.database,
      dialect: config.test.dialect,
      host: config.test.host,
      port: 5432
    }
  }

  const conf = migrationConfig(config)

  it('gave the expected result', () => {
    expect(conf).to.deep.equal(expected)
  })
})
