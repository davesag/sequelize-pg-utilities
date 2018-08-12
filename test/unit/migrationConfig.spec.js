const { expect } = require('chai')

const migrationConfig = require('../../src/migrationConfig')

describe('src/migrationConfig', () => {
  const config = {
    user: 'test',
    password: 'testing',
    database: 'testdb',
    env: 'test',
    options: { someOther: 'options ' }
  }

  const expected = {
    test: {
      username: config.user,
      password: config.password,
      database: config.database,
      options: config.options
    }
  }

  const conf = migrationConfig(config)

  it('gave the expected result', () => {
    expect(conf).to.deep.equal(expected)
  })
})
