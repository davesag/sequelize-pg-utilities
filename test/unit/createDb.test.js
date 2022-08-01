const { expect } = require('chai')
const { stub } = require('sinon')
const proxyquire = require('proxyquire')

describe('src/createDb', () => {
  const on = stub()
  const connect = stub()
  const query = stub()

  class Client {
    end() {}
  }

  Client.prototype.on = on
  Client.prototype.connect = connect
  Client.prototype.query = query

  const pg = { Client }
  const createDb = proxyquire('../../src/createDb', {
    pg
  })

  const params = {
    host: 'localhost',
    port: '5432',
    user: 'some-user',
    password: 'shh-secret'
  }

  let result

  const cleanup = () => {
    on.resetHistory()
    connect.resetHistory()
    query.resetHistory()
    result = undefined
  }

  context('when it creates a new database', () => {
    before(async () => {
      query.resolves()
      result = await createDb(params)
    })

    after(cleanup)

    it('returns the expected result', () => {
      expect(result).to.equal(true)
    })
  })

  context('when a database already exists', () => {
    const err = { code: '42P04' }

    before(async () => {
      query.rejects(err)
      result = await createDb(params)
    })

    after(cleanup)

    it('returns the expected result', () => {
      expect(result).to.equal(false)
    })
  })

  context('when an error occurs', () => {
    const err = { code: 'something else' }

    before(async () => {
      query.rejects(err)
      try {
        await createDb(params)
      } catch (e) {
        result = e
      }
    })

    after(cleanup)

    it('returns the expected result', () => {
      expect(result).to.equal(err)
    })
  })
})
