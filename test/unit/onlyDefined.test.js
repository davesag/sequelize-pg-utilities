const { expect } = require('chai')

const onlyDefined = require('../../src/onlyDefined')

const original = {
  array: [{ inner: 'w00t!', however: undefined }, undefined, { outer: 'huzzah!' }],
  here: 'is okay',
  test: undefined,
  otherTest: { nah: undefined }
}

const expected = {
  array: [{ inner: 'w00t!' }, original.array[2]],
  here: original.here
}

describe('src/onlyDefined', () => {
  it('returns the expected result', () => {
    expect(onlyDefined(original)).to.deep.equal(expected)
  })
})
