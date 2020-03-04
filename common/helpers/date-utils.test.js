const {
  dateFormat,
  getPeriod,
  getDateFromParams,
  getDateRange,
} = require('./date-utils')

describe('the date utils', function() {
  describe('dateFormat', function() {
    it('exposes dateFormat for convenience', function() {
      expect(dateFormat).to.exist
      expect(dateFormat).to.equal('yyyy-MM-dd')
    })
  })
  describe('#getPeriod', function() {
    it('invoked with a negative number, returns the date minus the days specified', function() {
      expect(getPeriod('2010-01-02', -7)).to.equal('2009-12-26')
    })
    it('invoked with a positive number, returns the date plus the days specified', function() {
      expect(getPeriod('2010-01-02', 7)).to.equal('2010-01-09')
    })
  })
  describe('#getDateFromParams', function() {
    let req
    beforeEach(function() {
      req = {
        params: {},
      }
    })
    it('returns null if there is no date', function() {
      expect(getDateFromParams(req)).to.be.null
    })
    it('returns null if the date is invalid', function() {
      req.params.date = 'invalid date'
      expect(getDateFromParams(req)).to.be.null
    })
    it('extracts the date from the params', function() {
      req.params.date = '2010-01-01'
      expect(getDateFromParams(req)).to.equal('2010-01-01')
    })
  })
  describe('#getDateRange', function() {
    context('with period as week', function() {
      it('on a Monday, it returns the next 7 days', function() {
        expect(getDateRange('week', '2020-03-09')).to.deep.equal([
          '2020-03-09',
          '2020-03-15',
        ])
      })
      it('on any other day, returns the range of 7 days starting from prev Monday', function() {
        expect(getDateRange('week', '2020-03-06')).to.deep.equal([
          '2020-03-02',
          '2020-03-08',
        ])
      })
    })
    context('with period as day', function() {
      it('returns the same date in from and to', function() {
        expect(getDateRange('day', '2020-03-09')).to.deep.equal([
          '2020-03-09',
          '2020-03-09',
        ])
      })
    })
  })
})
