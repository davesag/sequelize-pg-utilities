const { expect } = require('chai')
const { stub } = require('sinon')
const proxyquire = require('proxyquire')

const { test: config } = require('../fixtures/config.json')

describe('src/makeInitialiser', () => {
  const mockPgTools = {
    createdb: stub()
  }

  const makeInitialiser = proxyquire('../../src/makeInitialiser', {
    pgtools: mockPgTools
  })

  const init = makeInitialiser(config)

  before(async () => {
    mockPgTools.createdb.resolves()
  })

  it('worked okay', () => expect(init()).to.be.fulfilled)
})
