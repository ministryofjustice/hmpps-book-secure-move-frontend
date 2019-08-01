const formatters = require('./formatters')

describe('Formatters', function() {
  describe('#date()', function() {
    context('when input value is a valid date', function() {
      context('with default date format', function() {
        beforeEach(function() {
          const mockDate = new Date('2017-08-10')
          this.clock = sinon.useFakeTimers(mockDate.getTime())
        })

        afterEach(function() {
          this.clock.restore()
        })

        it('should return default date format', function() {
          const date = formatters.date('10/10/2010')
          expect(date).to.equal('2010-10-10')
        })

        it('should return default date format', function() {
          const date = formatters.date('today')
          expect(date).to.equal('2017-08-10')
        })

        it('should return default date format', function() {
          const date = formatters.date('yesterday')
          expect(date).to.equal('2017-08-09')
        })
      })

      context('with custom date format', function() {
        it('should return custom date format', function() {
          const date = formatters.date('2010-10-10', 'DD/MM/YYYY')
          expect(date).to.equal('10/10/2010')
        })
      })
    })

    context('when input value is not a valid date', function() {
      it('should return input value', function() {
        const date = formatters.date('not-a-date')
        expect(date).to.equal('not-a-date')
      })
    })
  })
})
