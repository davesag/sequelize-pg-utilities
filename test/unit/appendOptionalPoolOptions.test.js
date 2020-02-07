const { expect } = require('chai')

const appendOptionalPoolOptions = require('../../src/appendOptionalPoolOptions')

const config = {
  pool: { acquire: 5000 }
}

const pool = {
  something: 'wheee'
}

describe('src/appendOptionalPoolOptions', () => {
  context('when there are extra options', () => {
    const extra = { some: 'extra' }

    it('appends the extra options', () => {
      expect(appendOptionalPoolOptions(config, extra)(pool)).to.deep.equal({
        ...pool,
        ...config.pool,
        ...extra
      })
    })
  })

  context('when there are no extra options', () => {
    it('returns the original options', () => {
      expect(appendOptionalPoolOptions(config)(pool)).to.deep.equal({
        ...pool,
        ...config.pool
      })
    })
  })
})
