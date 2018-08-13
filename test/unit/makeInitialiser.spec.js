const { expect } = require('chai')
const { stub, match } = require('sinon')
const proxyquire = require('proxyquire')

const config = require('../fixtures/config.json')

describe('src/makeInitialiser', () => {
  const mockPgTools = {
    createdb: stub()
  }

  const makeInitialiser = proxyquire('../../src/makeInitialiser', {
    pgtools: mockPgTools
  })

  const init = makeInitialiser(config)

  const resetStubs = () => {
    mockPgTools.createdb.resetBehavior()
  }

  const resetHistory = () => {
    mockPgTools.createdb.resetHistory()
  }

  const resetBoth = () => {
    resetStubs()
    resetHistory()
  }

  context('succeeds', () => {
    before(async () => {
      mockPgTools.createdb.resolves()
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
      let result

      before(async () => {
        result = await init()
      })

      after(resetHistory)

      it('called createdb with the correct data', () => {
        expect(mockPgTools.createdb).to.have.been.calledWith(
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
      mockPgTools.createdb
        .onFirstCall()
        .returns(Promise.reject(new Error('Something went wrong')))
      mockPgTools.createdb.onSecondCall().resolves()

      await init()
    })

    after(resetBoth)

    it('called createdb twice', () => {
      expect(mockPgTools.createdb).to.have.been.calledTwice
    })
  })

  context('database already exists', () => {
    const expected = {
      isNew: false,
      message: `Database '${config.test.database}' already exists`
    }
    let result

    before(async () => {
      mockPgTools.createdb.rejects('duplicate_database')

      result = await init()
    })

    after(resetBoth)

    it('called createdb once', () => {
      expect(mockPgTools.createdb).to.have.been.calledOnce
    })

    it('returned the right result', () => {
      expect(result).to.deep.equal(expected)
    })
  })

  context('fails', () => {
    before(() => {
      mockPgTools.createdb.rejects('oops')
    })

    after(resetBoth)

    it('fails', () => expect(init(0)).to.be.rejected)
  })
})
