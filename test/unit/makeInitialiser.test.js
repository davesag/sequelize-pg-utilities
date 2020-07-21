const { expect } = require('chai')
const { stub, match, resetHistory } = require('sinon')
const proxyquire = require('proxyquire')

const config = require('../fixtures/config-without-ssl.json')

describe('src/makeInitialiser', () => {
  const createDb = stub()

  const resetStubs = () => {
    createDb.resetBehavior()
  }

  const resetBoth = () => {
    resetStubs()
    resetHistory()
  }

  let makeInitialiser
  let init
  let result

  context('in production', () => {
    const expected = {
      dbNew: false,
      message: 'Running in production so skip database creation.'
    }

    before(async () => {
      makeInitialiser = proxyquire('../../src/makeInitialiser', {
        './createDb': createDb,
        './env': 'production'
      })
      init = makeInitialiser(config)
      result = await init()
    })

    it('returned the expected result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('not in production', () => {
    const logger = {
      debug: stub()
    }
    const sleep = stub()

    before(() => {
      sleep.resolves()
      makeInitialiser = proxyquire('../../src/makeInitialiser', {
        './createDb': createDb,
        './sleep': sleep
      })

      init = makeInitialiser(config, undefined, logger)
    })

    context('succeeds', () => {
      before(() => {
        createDb.resolves(true)
      })

      after(resetStubs)

      context('initialise', () => {
        after(resetHistory)

        it('runs without error', () => expect(init()).to.be.fulfilled)
      })

      context('initialisation', () => {
        const expected = {
          dbNew: true,
          message: `createDb created database '${config.test.database}'`
        }

        before(async () => {
          result = await init()
        })

        after(resetHistory)

        it('called createDb with the correct data', () => {
          expect(createDb).to.have.been.calledWith(
            match(
              {
                user: config.test.username,
                password: config.test.password,
                port: 5432,
                host: 'localhost'
              },
              config.test.database
            )
          )
        })

        it('returned the right result', () => {
          expect(result).to.deep.equal(expected)
        })
      })
    })

    context('retries', () => {
      before(async () => {
        // can't use onFirstCall().rejects(...) due to a bug in sinon.
        createDb.onFirstCall().returns(Promise.reject(new Error('Something went wrong')))
        createDb.onSecondCall().resolves()

        await init()
      })

      after(resetBoth)

      it('called createDb twice', () => {
        expect(createDb).to.have.been.calledTwice
      })

      it('called logger.debug with correct message', () => {
        expect(logger.debug).to.have.been.calledWith('Retrying database init in', 2, 'seconds')
      })

      it('called sleep with the correct delay', () => {
        expect(sleep).to.have.been.calledWith(2000)
      })
    })

    context('database already exists', () => {
      const expected = {
        dbNew: false,
        message: `Database '${config.test.database}' already exists`
      }
      let result

      before(async () => {
        createDb.resolves(false)

        result = await init()
      })

      after(resetBoth)

      it('called createDb once', () => {
        expect(createDb).to.have.been.calledOnce
      })

      it('returned the right result', () => {
        expect(result).to.deep.equal(expected)
      })
    })

    context('fails', () => {
      before(() => {
        createDb.rejects('oops')
      })

      after(resetBoth)

      it('fails', () => expect(init(0)).to.be.rejected)
    })
  })
})
