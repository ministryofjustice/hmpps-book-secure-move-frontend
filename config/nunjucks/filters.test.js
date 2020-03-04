const proxyquire = require('proxyquire')
const timezoneMock = require('timezone-mock')

const filters = proxyquire('./filters', {
  '../index': {
    DATE_FORMATS: {
      LONG: 'd MMM yyyy',
      WITH_DAY: 'EEEE d MMM yyyy',
    },
  },
})

describe('Nunjucks filters', function() {
  describe('#formatDate()', function() {
    context('when no date is provided', function() {
      it('should return input value', function() {
        const formattedDate = filters.formatDate('')

        expect(formattedDate).to.equal('')
      })
    })

    context('when given an invalid date', function() {
      it('should return input value', function() {
        const formattedDate = filters.formatDate('2010-45-5')

        expect(formattedDate).to.equal('2010-45-5')
      })
    })

    context('when given a valid date', function() {
      context('when no format is specified', function() {
        it('should return date in default format', function() {
          const formattedDate = filters.formatDate('2010-05-15')

          expect(formattedDate).to.equal('15 May 2010')
        })
      })

      context('when a format is specified', function() {
        it('should return date in that format', function() {
          const formattedDate = filters.formatDate('2010-05-01', 'dd/MM/yy')

          expect(formattedDate).to.equal('01/05/10')
        })
      })
    })

    context('when given a valid date object', function() {
      const mockDate = new Date('2010-05-15')

      context('when no format is specified', function() {
        it('should return date in default format', function() {
          const formattedDate = filters.formatDate(mockDate)

          expect(formattedDate).to.equal('15 May 2010')
        })
      })

      context('when a format is specified', function() {
        it('should return date in that format', function() {
          const formattedDate = filters.formatDate(mockDate, 'dd/MM/yy')

          expect(formattedDate).to.equal('15/05/10')
        })
      })
    })
  })

  describe('#formatISOWeek', function() {
    it('returns the argument if it is not an array', function() {
      expect(filters.formatISOWeek('invalid date')).to.equal('invalid date')
    })
    it('returns the correct week if the date range is passed correctly', function() {
      expect(filters.formatISOWeek(['2020-03-02', '2020-03-08'])).to.equal(
        '2020-W10'
      )
    })
  })

  describe('#formatDateWithDay()', function() {
    it('should return config date with day format', function() {
      const formattedDate = filters.formatDateWithDay('2010-01-05')

      expect(formattedDate).to.equal('Tuesday 5 Jan 2010')
    })
  })

  describe('#formatDateAsRelativeDay()', function() {
    beforeEach(function() {
      const mockDate = new Date('2017-08-10')
      this.clock = sinon.useFakeTimers(mockDate.getTime())
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('when current date is today', function() {
      it('should return `Today`', function() {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-10')
        expect(formattedDate).to.equal('Today')
      })
    })

    context('when current date is tomorrow', function() {
      it('should return `Tomorrow`', function() {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-11')
        expect(formattedDate).to.equal('Tomorrow')
      })
    })

    context('when current date is yesterday', function() {
      it('should return `Yesterday`', function() {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-09')
        expect(formattedDate).to.equal('Yesterday')
      })
    })

    context('when date is another date', function() {
      context('when no custom format is supplied', function() {
        it('should return date in default format', function() {
          const formattedDate = filters.formatDateAsRelativeDay('2017-08-01')
          expect(formattedDate).to.equal('Tuesday 1 Aug 2017')
        })
      })

      context('when a custom format is supplied', function() {
        it('should return date in custom formatt', function() {
          const formattedDate = filters.formatDateAsRelativeDay(
            '2017-08-01',
            'dd/MM/yy'
          )
          expect(formattedDate).to.equal('01/08/17')
        })
      })
    })
  })

  describe('#formatDateRange', function() {
    const formatDateRange = filters.formatDateRange
    context('when unforeseen parameters are passed to it', function() {
      it('returns empty string if passed empty string', function() {
        expect(formatDateRange('')).to.equal('')
      })
      it('returns a string if passed a string', function() {
        expect(formatDateRange('10/10/2019')).to.equal('10/10/2019')
      })
      it('returns other unexpected things if passed to it', function() {
        expect(formatDateRange({ time: '1' })).to.deep.equal({ time: '1' })
        expect(formatDateRange(['2010-10-10'])).to.deep.equal(['2010-10-10'])
      })
      it('throws on invalid dates', function() {
        expect(
          formatDateRange.bind(null, ['2010-30-30', '2010-30-31'])
        ).to.throw()
      })
    })
    context('when dates as strings are passed to it ', function() {
      it('returns the range correctly when spanning different years', function() {
        expect(formatDateRange(['2019-11-01', '2020-01-18'])).to.equal(
          '1 Nov 2019 to 18 Jan 2020'
        )
      })
      it('returns the range correctly when spanning different months', function() {
        expect(formatDateRange(['2019-11-01', '2019-12-10'])).to.equal(
          '1 Nov to 10 Dec 2019'
        )
      })
      it('returns the range correctly when in the same month', function() {
        expect(formatDateRange(['2019-11-01', '2019-11-10'])).to.equal(
          '1 to 10 Nov 2019'
        )
      })
    })
    context('when dates as date objects are passed to it ', function() {
      it('returns the range correctly when spanning different years', function() {
        expect(
          formatDateRange([new Date('2019-11-01'), new Date('2020-01-18')])
        ).to.equal('1 Nov 2019 to 18 Jan 2020')
      })
      it('returns the range correctly when spanning different months', function() {
        expect(
          formatDateRange([new Date('2019-11-01'), new Date('2019-12-10')])
        ).to.equal('1 Nov to 10 Dec 2019')
      })
      it('returns the range correctly when in the same month', function() {
        expect(
          formatDateRange([new Date('2019-11-01'), new Date('2019-11-10')])
        ).to.equal('1 to 10 Nov 2019')
      })
    })
  })

  describe('#calculateAge()', function() {
    context('when given an invalid date', function() {
      it('should return input value', function() {
        const age = filters.calculateAge('2010-45-5')
        expect(age).to.equal('2010-45-5')
      })

      it('should return input value', function() {
        const age = filters.calculateAge('not a date')
        expect(age).to.equal('not a date')
      })
    })

    context('when given a valid date', function() {
      const dateOfBirth = '1979-01-10'

      context('the day before a birthday', function() {
        beforeEach(function() {
          this.clock = sinon.useFakeTimers(new Date('2019-01-09').getTime())
        })

        afterEach(function() {
          this.clock.restore()
        })

        it('should return the age in years', function() {
          const age = filters.calculateAge(dateOfBirth)
          expect(age).to.equal(39)
        })
      })

      context('on a birthday', function() {
        beforeEach(function() {
          this.clock = sinon.useFakeTimers(new Date('2019-01-10').getTime())
        })

        afterEach(function() {
          this.clock.restore()
        })

        it('should return the age in years', function() {
          const age = filters.calculateAge(dateOfBirth)
          expect(age).to.equal(40)
        })
      })

      context('the day after a birthday', function() {
        beforeEach(function() {
          this.clock = sinon.useFakeTimers(new Date('2019-01-11').getTime())
        })

        afterEach(function() {
          this.clock.restore()
        })

        it('should return the age in years', function() {
          const age = filters.calculateAge(dateOfBirth)
          expect(age).to.equal(40)
        })
      })
    })
  })

  describe('#formatTime()', function() {
    context('when given an invalid datetime', function() {
      it('should return input value', function() {
        const age = filters.formatTime('2010-45-5')
        expect(age).to.equal('2010-45-5')
      })

      it('should return input value', function() {
        const age = filters.formatTime('not a date')
        expect(age).to.equal('not a date')
      })
    })

    context('when given falsey values', function() {
      it('should return input value', function() {
        const age = filters.formatTime(undefined)
        expect(age).to.be.undefined
      })

      it('should return input value', function() {
        const age = filters.formatTime(null)
        expect(age).to.equal(null)
      })

      it('should return input value', function() {
        const age = filters.formatTime(false)
        expect(age).to.equal(false)
      })

      it('should return input value', function() {
        const age = filters.formatTime(0)
        expect(age).to.equal(0)
      })

      it('should return input value', function() {
        const age = filters.formatTime('')
        expect(age).to.equal('')
      })
    })

    context('when given a valid datetime', function() {
      context('when timezone is UTC', function() {
        beforeEach(function() {
          timezoneMock.register('UTC')
        })

        afterEach(function() {
          timezoneMock.unregister()
        })

        context('when the time is 12am', function() {
          it('should midnight as a string', function() {
            const time = filters.formatTime('2000-01-01T00:00:00Z')
            expect(time).to.equal('Midnight')
          })
        })

        context('when the time is 12pm', function() {
          it('should midday as a string', function() {
            const time = filters.formatTime('2000-01-01T12:00:00Z')
            expect(time).to.equal('Midday')
          })
        })

        context('when time is in the morning', function() {
          it('should return correct format', function() {
            const time = filters.formatTime('2000-01-01T08:00:00Z')
            expect(time).to.equal('8am')
          })

          it('should return correct format', function() {
            const time = filters.formatTime('2000-01-01T10:00:00Z')
            expect(time).to.equal('10am')
          })
        })

        context('when time is in the afternoon', function() {
          it('should return correct format', function() {
            const time = filters.formatTime('2000-01-01T14:00:00Z')
            expect(time).to.equal('2pm')
          })

          it('should return correct format', function() {
            const time = filters.formatTime('2000-01-01T17:00:00Z')
            expect(time).to.equal('5pm')
          })
        })

        context('when time is not on the hour', function() {
          it('should return correct format', function() {
            const time = filters.formatTime('2000-01-01T23:59:59Z')
            expect(time).to.equal('11:59pm')
          })

          it('should return correct format', function() {
            const time = filters.formatTime('2000-01-01T11:59:59Z')
            expect(time).to.equal('11:59am')
          })

          it('should return correct format', function() {
            const time = filters.formatTime('2000-01-01T09:30:00Z')
            expect(time).to.equal('9:30am')
          })
        })

        it('should return correct format', function() {
          const time = filters.formatTime('2000-01-01T01:00:00Z')
          expect(time).to.equal('1am')
        })

        it('should return correct format', function() {
          const time = filters.formatTime('2000-06-01T01:00:00Z')
          expect(time).to.equal('1am')
        })
      })

      context('when timezone is US/Pacific', function() {
        beforeEach(function() {
          timezoneMock.register('US/Pacific')
        })

        afterEach(function() {
          timezoneMock.unregister()
        })

        it('should return correct format', function() {
          const time = filters.formatTime('2000-01-01T01:00:00Z')
          expect(time).to.equal('5pm')
        })

        it('should return correct format', function() {
          const time = filters.formatTime('2000-06-01T01:00:00Z')
          expect(time).to.equal('6pm')
        })
      })

      context('when timezone is Brazil/East', function() {
        beforeEach(function() {
          timezoneMock.register('Brazil/East')
        })

        afterEach(function() {
          timezoneMock.unregister()
        })

        it('should return correct format', function() {
          const time = filters.formatTime('2018-01-01T01:00:00Z')
          expect(time).to.equal('11pm')
        })

        it('should return correct format', function() {
          const time = filters.formatTime('2018-06-01T01:00:00Z')
          expect(time).to.equal('10pm')
        })
      })
    })
  })
})
