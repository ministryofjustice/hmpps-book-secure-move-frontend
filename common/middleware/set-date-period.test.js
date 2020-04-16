const setDatePeriod = require('./set-date-period')
describe('Moves middleware', function() {
  describe('#setDatePeriod', function() {
    it('creates setDatePeriod on the locals', function() {
      const locals = {}
      setDatePeriod({}, { locals }, () => {}, 'week')
      expect(locals).to.deep.equal({
        period: 'week',
      })
    })
    it('invokes next', function() {
      const next = sinon.stub()
      setDatePeriod({}, { locals: {} }, next, 'week')
      expect(next).to.have.been.calledOnce
    })
  })
})
