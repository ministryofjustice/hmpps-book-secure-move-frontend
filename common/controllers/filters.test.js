const {
  getDefaultValues,
  removeDefaultFilterValues,
  getReferrerValues,
} = require('./filters')

describe('Filters controllers', function () {
  const fields = {
    foo: { defaultValue: 'x' },
    bar: {},
  }
  describe('#getDefaultValues()', function () {
    it('should return default values', function () {
      const defaultValues = getDefaultValues(fields)
      expect(defaultValues).to.deep.equal({ foo: 'x' })
    })
  })

  describe('#removeDefaultFilterValues()', function () {
    it('should return non-default values', function () {
      const values = removeDefaultFilterValues(fields, { foo: 'y' })
      expect(values).to.deep.equal({ foo: 'y' })
    })
    it('should remove default values', function () {
      const values = removeDefaultFilterValues(fields, { foo: 'x' })
      expect(values).to.deep.equal({})
    })
    it('should remove referrer', function () {
      const values = removeDefaultFilterValues(fields, {
        referrer: '/somewhere',
      })
      expect(values).to.deep.equal({})
    })
  })

  describe('#getReferrerValues()', function () {
    it('should return values for referrer', function () {
      const values = getReferrerValues(fields, { a: '1' })
      expect(values).to.deep.equal({ a: '1' })
    })

    it('should not remove filter args', function () {
      const values = getReferrerValues(fields, { foo: 'y' })
      expect(values).to.deep.equal({})
    })
  })
})
