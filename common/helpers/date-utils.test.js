const {
  dateFormat,
  getRelativeDate,
  getDateFromParams,
  getDateRange,
} = require('./date-utils')

describe('Date helpers', function() {
  describe('dateFormat', function() {
    it('exposes dateFormat for convenience', function() {
      expect(dateFormat).to.exist
      expect(dateFormat).to.equal('yyyy-MM-dd')
    })
  })
  describe('#getRelativeDate', function() {
    it('invoked with a negative number, returns the date minus the days specified', function() {
      expect(getRelativeDate('2010-01-02', -7)).to.equal('2009-12-26')
    })
    it('invoked with a positive number, returns the date plus the days specified', function() {
      expect(getRelativeDate('2010-01-02', 7)).to.equal('2010-01-09')
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
    const mockDate = '2017-08-10'

    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('without time period', function() {
      context('without date', function() {
        it('should return undefined', function() {
          expect(getDateRange()).to.deep.equal([undefined, undefined])
        })
      })

      context('with date', function() {
        it('should return given date for both dates', function() {
          expect(getDateRange(new Date(2020, 3, 20), undefined)).to.deep.equal([
            '2020-04-20',
            '2020-04-20',
          ])
        })
      })
    })

    context('with time period of `day`', function() {
      context('without date', function() {
        it('should return undefined', function() {
          expect(getDateRange(undefined, 'day')).to.deep.equal([
            undefined,
            undefined,
          ])
        })
      })

      context('with date', function() {
        context('with a Monday', function() {
          it('should return given date for both dates', function() {
            expect(getDateRange(new Date(2020, 2, 9), 'day')).to.deep.equal([
              '2020-03-09',
              '2020-03-09',
            ])
          })
        })

        context('with another day of the week', function() {
          it('should return given date for both dates', function() {
            expect(getDateRange(new Date(2020, 2, 6), 'day')).to.deep.equal([
              '2020-03-06',
              '2020-03-06',
            ])
          })
        })
      })
    })

    context('with time period of `week`', function() {
      context('without date', function() {
        it('should return dates for this week', function() {
          expect(getDateRange(undefined, 'week')).to.deep.equal([
            undefined,
            undefined,
          ])
        })
      })

      context('with date', function() {
        context('with a Monday', function() {
          it('should return Monday and end of week', function() {
            expect(getDateRange(new Date(2020, 2, 9), 'week')).to.deep.equal([
              '2020-03-09',
              '2020-03-15',
            ])
          })
        })

        context('with another day of the week', function() {
          it('should return start and end of that week', function() {
            expect(getDateRange(new Date(2020, 2, 6), 'week')).to.deep.equal([
              '2020-03-02',
              '2020-03-08',
            ])
          })
        })
      })
    })

    context('with an invalid date', function() {
      const inputs = ['foo', '2020-20-10', false, null]

      inputs.forEach(input => {
        context(`with "${input}"`, function() {
          it('should return undefined dates', function() {
            expect(getDateRange(input)).to.deep.equal([undefined, undefined])
          })
        })
      })
    })

    context('with different date formats', function() {
      context('with date string', function() {
        it('should return correct dates', function() {
          expect(getDateRange('2014-11-05')).to.deep.equal([
            '2014-11-05',
            '2014-11-05',
          ])
        })
      })

      context('with date object', function() {
        it('should return correct dates', function() {
          expect(getDateRange(new Date(2020, 2, 9), undefined)).to.deep.equal([
            '2020-03-09',
            '2020-03-09',
          ])
        })
      })
    })
  })
})
