const { expect } = require('chai')

const { configure } = require('../../src')
const { test: config } = require('../fixtures/config.json')

describe('src/configure', () => {
  const expected = {
    name: config.database,
    user: config.username,
    password: config.password,
    options: {
      host: config.host,
      port: 5432,
      dialect: 'postgres',
      pool: {
        min: 1,
        max: 5,
        idle: 10000
      },
      operatorsAliases: false,
      logging: false
    }
  }

  const result = configure(config)

  it('returns the expected result', () => {
    expect(result).to.deep.equal(expected)
  })
})
