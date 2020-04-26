const { expect } = require('chai')
const { stub, match, resetHistory } = require('sinon')
const proxyquire = require('proxyquire')

const config = require('../fixtures/config-without-ssl.json')

describe('src/makeInitialiser', () => {
  const pgTools = {
    createdb: stub()
  }

  const resetStubs = () => {
    pgTools.createdb.resetBehavior()
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
        pgtools: pgTools,
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
        pgtools: pgTools,
        './sleep': sleep
      })

      init = makeInitialiser(config, undefined, logger)
    })

    context('succeeds', () => {
      before(() => {
        pgTools.createdb.resolves()
      })

      after(resetStubs)

      context('initialise', () => {
        after(resetHistory)

        it('runs without error', () => expect(init()).to.be.fulfilled)
      })

      context('initialisation', () => {
        const expected = {
          isNew: true,
          message: `createdb created database '${config.test.database}'`
        }

        before(async () => {
          result = await init()
        })

        after(resetHistory)

        it('called createdb with the correct data', () => {
          expect(pgTools.createdb).to.have.been.calledWith(
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
        pgTools.createdb
          .onFirstCall()
          .returns(Promise.reject(new Error('Something went wrong')))
        pgTools.createdb.onSecondCall().resolves()

        await init()
      })

      after(resetBoth)

      it('called createdb twice', () => {
        expect(pgTools.createdb).to.have.been.calledTwice
      })

      it('called logger.debug with correct message', () => {
        expect(logger.debug).to.have.been.calledWith(
          'Retrying database init in',
          2,
          'seconds'
        )
      })

      it('called sleep with the correct delay', () => {
        expect(sleep).to.have.been.calledWith(2000)
      })
    })

    context('database already exists', () => {
      const expected = {
        isNew: false,
        message: `Database '${config.test.database}' already exists`
      }
      let result

      before(async () => {
        pgTools.createdb.rejects('duplicate_database')

        result = await init()
      })

      after(resetBoth)

      it('called createdb once', () => {
        expect(pgTools.createdb).to.have.been.calledOnce
      })

      it('returned the right result', () => {
        expect(result).to.deep.equal(expected)
      })
    })

    context('fails', () => {
      before(() => {
        pgTools.createdb.rejects('oops')
      })

      after(resetBoth)

      it('fails', () => expect(init(0)).to.be.rejected)
    })
  })
})
