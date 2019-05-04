const { expect } = require('chai')

const migrationConfig = require('../../src/migrationConfig')
const configWithoutSSL = require('../fixtures/config-without-ssl.json')
const configWithSSL = require('../fixtures/config-with-ssl.json')

describe('src/migrationConfig', () => {
  const makeExpected = (config, operatorsAliases) => {
    const res = {
      test: {
        username: config.test.username,
        password: config.test.password,
        database: config.test.database,
        dialect: config.test.dialect,
        host: config.test.host,
        port: 5432
      }
    }
    if (config.test.ssl) {
      res.test.dialectOptions = { ssl: config.test.ssl }
      res.test.ssl = true
    }
    if (operatorsAliases !== undefined)
      res.test.operatorsAliases = operatorsAliases
    return res
  }

  let result

  context('without ssl', () => {
    const expected = makeExpected(configWithoutSSL)

    before(() => {
      result = migrationConfig(configWithoutSSL)
    })

    it('gave the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with ssl', () => {
    const expected = makeExpected(configWithSSL)

    before(() => {
      result = migrationConfig(configWithSSL)
    })

    it('gave the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with operatorsAliases', () => {
    const operatorsAliases = ['some', 'operators', 'aliases']
    const expected = makeExpected(configWithSSL, operatorsAliases)

    before(() => {
      result = migrationConfig(configWithSSL, undefined, operatorsAliases)
    })

    it('gave the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })
})
