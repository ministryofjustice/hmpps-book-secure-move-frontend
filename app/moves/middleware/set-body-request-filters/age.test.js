const { expect } = require('chai')

const ageFilter = require('./age')

describe('age filter', function () {
  const now = new Date('2020-01-01T02:00')
  let clock

  beforeEach(function () {
    clock = sinon.useFakeTimers(now.getTime())
  })

  afterEach(function () {
    clock.restore()
  })

  describe('when called without an age value', function () {
    it('should return an empty object', function () {
      const dobValues = ageFilter(undefined)
      expect(dobValues).to.deep.equal({})
    })
  })

  describe('when called with `over19`', function () {
    it('should return the expected values', function () {
      const dobValues = ageFilter('over19')
      expect(dobValues).to.deep.equal({
        dateOfBirthFrom: undefined,
        dateOfBirthTo: '2001-01-01',
      })
    })
  })

  describe('when called with `under19`', function () {
    it('should return the expected values', function () {
      const dobValues = ageFilter('under19')
      expect(dobValues).to.deep.equal({
        dateOfBirthFrom: '2001-01-01',
        dateOfBirthTo: undefined,
      })
    })
  })

  describe('when called with `17to19`', function () {
    it('should return the expected values', function () {
      const dobValues = ageFilter('17to19')
      expect(dobValues).to.deep.equal({
        dateOfBirthFrom: '2001-01-01',
        dateOfBirthTo: '2002-05-01',
      })
    })
  })

  describe('when called with `under17`', function () {
    it('should return the expected values', function () {
      const dobValues = ageFilter('under17')
      expect(dobValues).to.deep.equal({
        dateOfBirthFrom: '2002-05-01',
        dateOfBirthTo: undefined,
      })
    })
  })
})
