const { expect } = require('chai')

const { configure } = require('../../src')
const { CONFIG_OPTIONS, PROGRAMATIC_OPTIONS } = require('../../src/constants')

const configWithoutSSL = require('../fixtures/config-without-ssl.json')
const configWithSSL = require('../fixtures/config-with-ssl.json')
const configWithAquire = require('../fixtures/config-with-pool.aquire.json')

describe('src/configure', () => {
  const makeExpected = (config, operatorsAliases) => {
    const res = {
      name: config.test.database,
      user: config.test.username,
      password: config.test.password,
      options: {
        host: config.test.host,
        port: 5432,
        dialect: 'postgres',
        pool: {
          ...(config.test.pool || {}),
          min: 1,
          max: 5,
          idle: 10000
        },
        logging: false
      }
    }
    if (operatorsAliases !== undefined)
      res.options.operatorsAliases = operatorsAliases
    if (config.test.ssl) {
      res.options.dialectOptions = { ssl: config.test.ssl }
      res.options.ssl = true
    }
    if (config.test.retry) res.options.retry = config.test.retry

    return res
  }

  let result

  context('without ssl', () => {
    const expected = makeExpected(configWithoutSSL)

    before(() => {
      result = configure(configWithoutSSL)
    })

    it('returns the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with ssl', () => {
    const expected = makeExpected(configWithSSL)

    before(() => {
      result = configure(configWithSSL)
    })

    it('returns the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with operatorsAliases', () => {
    const expected = makeExpected(configWithSSL, false)

    before(() => {
      result = configure(configWithSSL, undefined, false)
    })

    it('returns the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with pool.aquire', () => {
    const expected = makeExpected(configWithAquire, false)

    before(() => {
      result = configure(configWithAquire, undefined, false)
    })

    it('returns the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with retry.max', () => {
    const max = 5
    const retry = { max }
    const base = makeExpected(configWithoutSSL, false)

    const expected = {
      ...base,
      options: {
        ...base.options,
        retry
      }
    }

    before(() => {
      result = configure(configWithoutSSL, undefined, false, undefined, {
        retry
      })
    })

    it('returns the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('with additional options', () => {
    const doTest = optionName => {
      const base = makeExpected(configWithoutSSL, false)

      const expected = {
        ...base,
        options: {
          ...base.options,
          [optionName]: optionName
        }
      }

      context(`with additional option ${optionName}`, () => {
        before(() => {
          result = configure(configWithoutSSL, undefined, false, undefined, {
            [optionName]: optionName
          })
        })

        it('returns the expected result', () => {
          expect(result).to.deep.equal(expected)
        })
      })
    }

    PROGRAMATIC_OPTIONS.forEach(doTest)
  })

  context('with additional config', () => {
    const doTest = optionName => {
      const config = {
        test: {
          ...configWithoutSSL.test,
          [optionName]: optionName
        }
      }
      const base = makeExpected(configWithoutSSL)

      const expected = {
        ...base,
        options: {
          ...base.options,
          [optionName]: optionName
        }
      }

      context(`with additional config ${optionName}`, () => {
        before(() => {
          result = configure(config)
        })

        it('returns the expected result', () => {
          expect(result).to.deep.equal(expected)
        })
      })
    }

    CONFIG_OPTIONS.forEach(doTest)
  })
})
