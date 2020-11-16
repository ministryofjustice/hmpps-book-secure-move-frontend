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
})
