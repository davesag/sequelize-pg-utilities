const { expect } = require('chai')

const { configure } = require('../../src')
const configWithoutSSL = require('../fixtures/config-without-ssl.json')
const configWithSSL = require('../fixtures/config-with-ssl.json')

describe('src/configure', () => {
  const base = config => ({
    name: config.test.database,
    user: config.test.username,
    password: config.test.password,
    options: {
      host: config.test.host,
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
  })

  let result

  context('without ssl', () => {
    const expected = base(configWithoutSSL)

    before(() => {
      result = configure(configWithoutSSL)
    })

    it('returns the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with ssl', () => {
    const expected = base(configWithSSL)
    const expectedWithSSL = {
      ...expected,
      options: {
        ...expected.options,
        dialectOptions: {
          ssl: configWithSSL.test.ssl
        },
        ssl: true
      }
    }

    before(() => {
      result = configure(configWithSSL)
    })

    it('returns the expected result', () => {
      expect(result).to.deep.equal(expectedWithSSL)
    })
  })
})
