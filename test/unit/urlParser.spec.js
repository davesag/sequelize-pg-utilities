const { expect } = require('chai')

const urlParser = require('../../src/urlParser')

describe('src/urlParser', () => {
  const dbUrl =
    'postgres://pfforbjhkrletg:aic5oO6Cran1g3hk6mJa5QqNZB@ec2-23-21-91-97.compute-1.amazonaws.com:5432/dek11b2j1g3mfb'
  const expected = {
    database: 'dek11b2j1g3mfb',
    username: 'pfforbjhkrletg',
    password: 'aic5oO6Cran1g3hk6mJa5QqNZB',
    host: 'ec2-23-21-91-97.compute-1.amazonaws.com',
    port: '5432',
    dialect: 'postgres',
    protocol: 'postgres'
  }

  it('parses an Heroku style database url', () => {
    expect(urlParser(dbUrl)).to.deep.equal(expected)
  })

  it('parses nothing into {}', () => {
    expect(urlParser()).to.deep.equal({})
  })

  it('parses an empty string into {}', () => {
    expect(urlParser('')).to.deep.equal({})
  })
})
