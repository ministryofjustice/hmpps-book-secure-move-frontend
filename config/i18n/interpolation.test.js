const proxyquire = require('proxyquire')

const interpolation = proxyquire('./interpolation', {
  '../nunjucks/filters': {
    foo: value => `foo ${value} bar`,
  },
})

describe('i18n interpolation', function () {
  it('should add the filters as formatters', function () {
    expect(interpolation.format('hello', 'foo')).to.equal('foo hello bar')
  })

  context('exists formatter', function () {
    it('should return true is the value exists', function () {
      expect(interpolation.format('hello', 'exists')).to.equal(true)
    })
    it('should return false is the value is undefined', function () {
      expect(interpolation.format(undefined, 'exists')).to.equal(false)
    })
    it('should return false is the value is an empty string', function () {
      expect(interpolation.format('', 'exists')).to.equal(false)
    })
  })

  context('uppercase formatter', function () {
    it('should return the uppercased value if it is a string', function () {
      expect(interpolation.format('ab', 'uppercase')).to.equal('AB')
    })
    it('should return the value if it is not a string', function () {
      expect(interpolation.format(23, 'uppercase')).to.equal(23)
    })
    it('should return undefined is the value is undefined', function () {
      expect(interpolation.format(undefined, 'uppercase')).to.equal(undefined)
    })
  })
})
