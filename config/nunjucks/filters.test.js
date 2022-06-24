const proxyquire = require('proxyquire')
const timezoneMock = require('timezone-mock')

const actions = {
  current_week: 'This is the week that is',
}

const mockFilesizeResponse = '10 MB'
const mockFilesizejs = sinon.stub().returns(mockFilesizeResponse)

const filters = proxyquire('./filters', {
  '../index': {
    DATE_FORMATS: {
      LONG: 'd MMM yyyy',
      WITH_DAY: 'EEEE d MMM yyyy',
      WITH_TIME_AND_DAY: "h:mm bbbb 'on' EEEE d MMM yyyy",
      WITH_TIME_WITH_SECONDS_AND_DAY: "h:mm:ss bbbb 'on' EEEE d MMM yyyy",
    },
  },
  '../../locales/en/actions.json': actions,
  filesize: mockFilesizejs,
})

describe('Nunjucks filters', function () {
  describe('#formatDate()', function () {
    context('when no date is provided', function () {
      it('should return input value', function () {
        const formattedDate = filters.formatDate('')

        expect(formattedDate).to.equal('')
      })
    })

    context('when given an invalid date', function () {
      it('should return input value', function () {
        const formattedDate = filters.formatDate('2010-45-5')

        expect(formattedDate).to.equal('2010-45-5')
      })
    })

    context('when given a valid date', function () {
      context('when no format is specified', function () {
        it('should return date in default format', function () {
          const formattedDate = filters.formatDate('2010-05-15')

          expect(formattedDate).to.equal('15 May 2010')
        })
      })

      context('when a format is specified', function () {
        it('should return date in that format', function () {
          const formattedDate = filters.formatDate('2010-05-01', 'dd/MM/yy')

          expect(formattedDate).to.equal('01/05/10')
        })
      })
    })

    context('when given a valid date object', function () {
      const mockDate = new Date('2010-05-15')

      context('when no format is specified', function () {
        it('should return date in default format', function () {
          const formattedDate = filters.formatDate(mockDate)

          expect(formattedDate).to.equal('15 May 2010')
        })
      })

      context('when a format is specified', function () {
        it('should return date in that format', function () {
          const formattedDate = filters.formatDate(mockDate, 'dd/MM/yy')

          expect(formattedDate).to.equal('15/05/10')
        })
      })
    })
  })

  describe('#formatISOWeek', function () {
    it('returns the argument if it is not an array', function () {
      expect(filters.formatISOWeek('invalid date')).to.equal('invalid date')
    })
    it('returns the correct week if the date range is passed correctly', function () {
      expect(filters.formatISOWeek(['2020-03-02', '2020-03-08'])).to.equal(
        '2020-W10'
      )
    })
  })

  describe('#formatDateWithDay()', function () {
    it('should return config date with day format', function () {
      const formattedDate = filters.formatDateWithDay('2010-01-05')

      expect(formattedDate).to.equal('Tuesday 5 Jan 2010')
    })
  })

  describe('#formatDateWithTimeAndDay()', function () {
    it('should return config date with day and time format', function () {
      const formattedDate = filters.formatDateWithTimeAndDay(
        '2000-01-05T13:46:00.00Z'
      )

      expect(formattedDate).to.equal('1:46 p.m. on Wednesday 5 Jan 2000')
    })

    it('should return config date with day and noon format', function () {
      const formattedDate = filters.formatDateWithTimeAndDay(
        '2000-01-05T12:00:00.00Z'
      )

      expect(formattedDate).to.equal('12:00 noon on Wednesday 5 Jan 2000')
    })

    it('should return config date with day, time and seconds format', function () {
      const formattedDate = filters.formatDateWithTimeAndDay(
        '2000-01-05T14:13:45Z',
        true
      )

      expect(formattedDate).to.equal('2:13:45 p.m. on Wednesday 5 Jan 2000')
    })
  })

  describe('#formatDateAsRelativeDay()', function () {
    beforeEach(function () {
      const mockDate = new Date('2017-08-10')
      this.clock = sinon.useFakeTimers(mockDate.getTime())
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('when current date is today', function () {
      it('should return `Today`', function () {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-10')
        expect(formattedDate).to.equal('today')
      })
    })

    context('when current date is tomorrow', function () {
      it('should return `Tomorrow`', function () {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-11')
        expect(formattedDate).to.equal('tomorrow')
      })
    })

    context('when current date is yesterday', function () {
      it('should return `Yesterday`', function () {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-09')
        expect(formattedDate).to.equal('yesterday')
      })
    })

    context('when date is another date', function () {
      context('when no custom format is supplied', function () {
        it('should return date in default format', function () {
          const formattedDate = filters.formatDateAsRelativeDay('2017-08-01')
          expect(formattedDate).to.equal('Tuesday 1 Aug 2017')
        })
      })

      context('when a custom format is supplied', function () {
        it('should return date in custom formatt', function () {
          const formattedDate = filters.formatDateAsRelativeDay(
            '2017-08-01',
            'dd/MM/yy'
          )
          expect(formattedDate).to.equal('01/08/17')
        })
      })
    })
  })

  describe('#formatDateWithRelativeDay()', function () {
    beforeEach(function () {
      const mockDate = new Date('2017-08-10')
      this.clock = sinon.useFakeTimers(mockDate.getTime())
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('with falsy values', function () {
      const values = ['', null, undefined, false]

      values.forEach(value => {
        it('should return input value', function () {
          const formattedDate = filters.formatDateWithRelativeDay(value)
          expect(formattedDate).to.equal(value)
        })
      })
    })

    context('when current date is today', function () {
      it('should return date along with `Today`', function () {
        const formattedDate = filters.formatDateWithRelativeDay('2017-08-10')
        expect(formattedDate).to.equal('Thursday 10 Aug 2017 (today)')
      })
    })

    context('when current date is tomorrow', function () {
      it('should return date along with `Tomorrow`', function () {
        const formattedDate = filters.formatDateWithRelativeDay('2017-08-11')
        expect(formattedDate).to.equal('Friday 11 Aug 2017 (tomorrow)')
      })
    })

    context('when current date is yesterday', function () {
      it('should return date along with `Yesterday`', function () {
        const formattedDate = filters.formatDateWithRelativeDay('2017-08-09')
        expect(formattedDate).to.equal('Wednesday 9 Aug 2017 (yesterday)')
      })
    })

    context('when date is another date', function () {
      it('should return date in default format', function () {
        const formattedDate = filters.formatDateWithRelativeDay('2017-08-01')
        expect(formattedDate).to.equal('Tuesday 1 Aug 2017')
      })
    })
  })

  describe('#formatDateRangeWithRelativeWeek()', function () {
    const mockStartDate = new Date('2017-08-14')
    const mockEndDate = new Date('2017-08-20')
    const dateRange = [mockStartDate, mockEndDate]

    beforeEach(function () {
      this.clock = sinon.useFakeTimers(mockStartDate.getTime())
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('with falsy values', function () {
      const values = ['', null, undefined, false]

      values.forEach(value => {
        it('should return input value', function () {
          const formattedDate = filters.formatDateRangeWithRelativeWeek(value)
          expect(formattedDate).to.equal(value)
        })
      })
    })

    context('when current date is this week', function () {
      it('should return date along with `This week`', function () {
        const formattedDate = filters.formatDateRangeWithRelativeWeek(dateRange)
        expect(formattedDate).to.equal(
          `14 to 20 Aug 2017 (${actions.current_week})`
        )
      })
    })

    context('when current date is next week', function () {
      it('should return date along with `Tomorrow`', function () {
        const formattedDate = filters.formatDateRangeWithRelativeWeek([
          new Date('2017-09-11'),
          new Date('2017-09-17'),
        ])
        expect(formattedDate).to.equal('11 to 17 Sep 2017')
      })
    })

    context('when current date is a range with a single date', function () {
      it('should return the formatted date', function () {
        const formattedDate = filters.formatDateRangeWithRelativeWeek([
          '2017-08-09',
        ])
        expect(formattedDate).to.equal('9 Aug 2017')
      })
    })
  })

  describe('#formatDateRange', function () {
    const formatDateRange = filters.formatDateRange

    describe('invalid inputs', function () {
      context('with no date range', function () {
        it('returns input value', function () {
          expect(formatDateRange()).to.be.undefined
          expect(formatDateRange('')).to.equal('')
        })
      })

      context('with empty array', function () {
        it('returns input value', function () {
          expect(formatDateRange([])).to.deep.equal([])
          expect(formatDateRange(['', ''])).to.deep.equal(['', ''])
          expect(formatDateRange(['', '', ''])).to.deep.equal(['', '', ''])
        })
      })

      context('with object', function () {
        it('returns input value', function () {
          expect(formatDateRange({ time: '1' })).to.deep.equal({ time: '1' })
        })
      })
    })

    context('with dates strings', function () {
      const mockStartDate = '2019-11-01'

      context('with one date', function () {
        it('return formatted date', function () {
          expect(formatDateRange(['', mockStartDate])).to.equal('1 Nov 2019')
          expect(formatDateRange([mockStartDate, ''])).to.equal('1 Nov 2019')
          expect(formatDateRange([mockStartDate])).to.equal('1 Nov 2019')
          expect(formatDateRange(['', mockStartDate, ''])).to.equal(
            '1 Nov 2019'
          )
        })
      })

      context('with two dates', function () {
        context('when dates span different years', function () {
          it('should contain both years', function () {
            expect(formatDateRange([mockStartDate, '2020-01-18'])).to.equal(
              '1 Nov 2019 to 18 Jan 2020'
            )
          })
        })

        context('when dates span different months', function () {
          it('should contain both months', function () {
            expect(formatDateRange([mockStartDate, '2019-12-10'])).to.equal(
              '1 Nov to 10 Dec 2019'
            )
          })
        })

        context('when dates are in the same month', function () {
          it('should contain both years', function () {
            expect(formatDateRange([mockStartDate, '2019-11-10'])).to.equal(
              '1 to 10 Nov 2019'
            )
          })
        })

        context(
          'when dates are in the same month of different years',
          function () {
            it('should contain both years', function () {
              expect(formatDateRange([mockStartDate, '2020-11-10'])).to.equal(
                '1 Nov 2019 to 10 Nov 2020'
              )
            })
          }
        )
      })
    })

    context('with date objects', function () {
      const mockStartDate = new Date('2019-11-01')

      context('with one date', function () {
        it('return formatted date', function () {
          expect(formatDateRange(['', mockStartDate])).to.equal('1 Nov 2019')
          expect(formatDateRange([mockStartDate, ''])).to.equal('1 Nov 2019')
          expect(formatDateRange([mockStartDate])).to.equal('1 Nov 2019')
          expect(formatDateRange(['', mockStartDate, ''])).to.equal(
            '1 Nov 2019'
          )
        })
      })

      context('with two dates', function () {
        context('when dates span different years', function () {
          it('should contain both years', function () {
            expect(
              formatDateRange([mockStartDate, new Date('2020-01-18')])
            ).to.equal('1 Nov 2019 to 18 Jan 2020')
          })
        })

        context('when dates span different months', function () {
          it('should contain both months', function () {
            expect(
              formatDateRange([mockStartDate, new Date('2019-12-10')])
            ).to.equal('1 Nov to 10 Dec 2019')
          })
        })

        context('when dates are in the same month', function () {
          it('should contain both years', function () {
            expect(
              formatDateRange([mockStartDate, new Date('2019-11-10')])
            ).to.equal('1 to 10 Nov 2019')
          })
        })

        context(
          'when dates are in the same month of different years',
          function () {
            it('should contain both years', function () {
              expect(
                formatDateRange([mockStartDate, new Date('2020-11-10')])
              ).to.equal('1 Nov 2019 to 10 Nov 2020')
            })
          }
        )
      })
    })

    context('with custom delimiter', function () {
      const mockStartDate = new Date('2019-11-01')

      context('with one date', function () {
        it('should not contain delimiter', function () {
          expect(formatDateRange([mockStartDate], 'and')).to.equal('1 Nov 2019')
        })
      })

      context('with two dates', function () {
        context('when dates span different years', function () {
          it('should contain both years', function () {
            expect(
              formatDateRange([mockStartDate, new Date('2020-01-18')], 'and')
            ).to.equal('1 Nov 2019 and 18 Jan 2020')
          })
        })

        context('when dates span different months', function () {
          it('should contain both months', function () {
            expect(
              formatDateRange([mockStartDate, new Date('2019-12-10')], 'and')
            ).to.equal('1 Nov and 10 Dec 2019')
          })
        })

        context('when dates are in the same month', function () {
          it('should contain both years', function () {
            expect(
              formatDateRange([mockStartDate, new Date('2019-11-10')], 'and')
            ).to.equal('1 and 10 Nov 2019')
          })
        })

        context(
          'when dates are in the same month of different years',
          function () {
            it('should contain both years', function () {
              expect(
                formatDateRange([mockStartDate, new Date('2020-11-10')], 'and')
              ).to.equal('1 Nov 2019 and 10 Nov 2020')
            })
          }
        )
      })
    })
  })

  describe('#formatDateRangeAsRelativeWeek()', function () {
    beforeEach(function () {
      const mockDate = new Date('2020-04-06')
      this.clock = sinon.useFakeTimers(mockDate.getTime())
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('when current dates are this week', function () {
      context('with exact dates', function () {
        it('should return `This week`', function () {
          const formattedRange = filters.formatDateRangeAsRelativeWeek([
            '2020-04-06',
            '2020-04-12',
          ])
          expect(formattedRange).to.equal(actions.current_week)
        })
      })

      context('with dates within this week', function () {
        it('should return `This week`', function () {
          const formattedRange = filters.formatDateRangeAsRelativeWeek([
            '2020-04-08',
            '2020-04-12',
          ])
          expect(formattedRange).to.equal(actions.current_week)
        })

        it('should return `This week`', function () {
          const formattedRange = filters.formatDateRangeAsRelativeWeek([
            '2020-04-06',
            '2020-04-10',
          ])
          expect(formattedRange).to.equal(actions.current_week)
        })
      })
    })

    context('when current dates are next week', function () {
      it('should return `Next week`', function () {
        const formattedRange = filters.formatDateRangeAsRelativeWeek([
          '2020-04-13',
          '2020-04-19',
        ])
        expect(formattedRange).to.equal('13 to 19 Apr 2020')
        // expect(formattedRange).to.equal('Next week')
      })
    })

    context('when current dates are last week', function () {
      it('should return `Last week`', function () {
        const formattedRange = filters.formatDateRangeAsRelativeWeek([
          '2020-03-30',
          '2020-04-05',
        ])
        expect(formattedRange).to.equal('30 Mar to 5 Apr 2020')
        // expect(formattedRange).to.equal('Last week')
      })
    })

    context('when dates are other weeks', function () {
      it('should return date in default format', function () {
        const formattedRange = filters.formatDateRangeAsRelativeWeek([
          '2020-04-05',
          '2020-04-12',
        ])
        expect(formattedRange).to.equal('5 to 12 Apr 2020')
      })

      it('should return date in default format', function () {
        const formattedRange = filters.formatDateRangeAsRelativeWeek([
          '2020-04-06',
          '2020-04-13',
        ])
        expect(formattedRange).to.equal('6 to 13 Apr 2020')
      })

      it('should return date in default format', function () {
        const formattedRange = filters.formatDateRangeAsRelativeWeek([
          '2017-08-01',
          '2017-08-08',
        ])
        expect(formattedRange).to.equal('1 to 8 Aug 2017')
      })
    })
  })

  describe('#calculateAge()', function () {
    context('when given an invalid date', function () {
      it('should return input value', function () {
        const age = filters.calculateAge('2010-45-5')
        expect(age).to.equal('2010-45-5')
      })

      it('should return input value', function () {
        const age = filters.calculateAge('not a date')
        expect(age).to.equal('not a date')
      })
    })

    context('when given a valid date', function () {
      const dateOfBirth = '1979-01-10'

      context('the day before a birthday', function () {
        beforeEach(function () {
          this.clock = sinon.useFakeTimers(new Date('2019-01-09').getTime())
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should return the age in years', function () {
          const age = filters.calculateAge(dateOfBirth)
          expect(age).to.equal(39)
        })
      })

      context('on a birthday', function () {
        beforeEach(function () {
          this.clock = sinon.useFakeTimers(new Date('2019-01-10').getTime())
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should return the age in years', function () {
          const age = filters.calculateAge(dateOfBirth)
          expect(age).to.equal(40)
        })
      })

      context('the day after a birthday', function () {
        beforeEach(function () {
          this.clock = sinon.useFakeTimers(new Date('2019-01-11').getTime())
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should return the age in years', function () {
          const age = filters.calculateAge(dateOfBirth)
          expect(age).to.equal(40)
        })
      })
    })
  })

  describe('#formatTime()', function () {
    context('when given an invalid datetime', function () {
      it('should return input value', function () {
        const time = filters.formatTime('2010-45-5')
        expect(time).to.equal('2010-45-5')
      })

      it('should return input value', function () {
        const time = filters.formatTime('not a date')
        expect(time).to.equal('not a date')
      })
    })

    context('when given falsey values', function () {
      it('should return input value', function () {
        const time = filters.formatTime(undefined)
        expect(time).to.be.undefined
      })

      it('should return input value', function () {
        const time = filters.formatTime(null)
        expect(time).to.equal(null)
      })

      it('should return input value', function () {
        const time = filters.formatTime(false)
        expect(time).to.equal(false)
      })

      it('should return input value', function () {
        const time = filters.formatTime('')
        expect(time).to.equal('')
      })
    })

    context('when given a valid datetime', function () {
      context('when timezone is UTC', function () {
        beforeEach(function () {
          timezoneMock.register('UTC')
        })

        afterEach(function () {
          timezoneMock.unregister()
        })

        context('when the time is 12am', function () {
          it('should midnight as a string', function () {
            const time = filters.formatTime('2000-01-01T00:00:00.00Z')
            expect(time).to.equal('Midnight')
          })
        })

        context('when time is in the morning', function () {
          it('should return correct format', function () {
            const time = filters.formatTime('2000-01-01T08:00:00.00Z')
            expect(time).to.equal('8am')
          })

          it('should return correct format', function () {
            const time = filters.formatTime('2000-01-01T10:00:00.00Z')
            expect(time).to.equal('10am')
          })
        })

        context('when time is in the afternoon', function () {
          it('should return correct format', function () {
            const time = filters.formatTime('2000-01-01T14:00:00.00Z')
            expect(time).to.equal('2pm')
          })

          it('should return correct format', function () {
            const time = filters.formatTime('2000-01-01T17:00:00.00Z')
            expect(time).to.equal('5pm')
          })
        })

        context('when time is not on the hour', function () {
          it('should return correct format', function () {
            const time = filters.formatTime('2000-01-01T23:59:59Z')
            expect(time).to.equal('11:59pm')
          })

          it('should return correct format', function () {
            const time = filters.formatTime('2000-01-01T11:59:59Z')
            expect(time).to.equal('11:59am')
          })

          it('should return correct format', function () {
            const time = filters.formatTime('2000-01-01T09:30:00.00Z')
            expect(time).to.equal('9:30am')
          })
        })

        it('should return correct format', function () {
          const time = filters.formatTime('2000-01-01T01:00:00.00Z')
          expect(time).to.equal('1am')
        })

        it('should return correct format', function () {
          const time = filters.formatTime('2000-06-01T01:00:00.00Z')
          expect(time).to.equal('1am')
        })

        it('should return correct format', function () {
          const time = filters.formatTime('10:00')
          expect(time).to.equal('10am')
        })

        it('should return correct format', function () {
          const time = filters.formatTime('22:00')
          expect(time).to.equal('10pm')
        })
      })

      context('when timezone is US/Pacific', function () {
        beforeEach(function () {
          timezoneMock.register('US/Pacific')
        })

        afterEach(function () {
          timezoneMock.unregister()
        })

        it('should return correct format', function () {
          const time = filters.formatTime('2000-01-01T01:00:00.000Z')
          expect(time).to.equal('5pm')
        })

        it('should return correct format', function () {
          const time = filters.formatTime('2000-06-01T01:00:00.000Z')
          expect(time).to.equal('6pm')
        })
      })

      context('when timezone is Brazil/East', function () {
        beforeEach(function () {
          timezoneMock.register('Brazil/East')
        })

        afterEach(function () {
          timezoneMock.unregister()
        })

        it('should return correct format', function () {
          const time = filters.formatTime('2018-01-01T01:00:00.000Z')
          expect(time).to.equal('11pm')
        })

        it('should return correct format', function () {
          const time = filters.formatTime('2018-06-01T01:00:00.000Z')
          expect(time).to.equal('10pm')
        })
      })
    })
  })

  describe('#oxfordJoin()', function () {
    context('by default', function () {
      context('with undefined', function () {
        it('should return undefined', function () {
          const joined = filters.oxfordJoin()
          expect(joined).to.equal('')
        })
      })

      context('with a string', function () {
        it('should return string untouched', function () {
          const joined = filters.oxfordJoin('foo')
          expect(joined).to.equal('foo')
        })
      })

      context('with a number', function () {
        it('should return number untouched', function () {
          const joined = filters.oxfordJoin(23)
          expect(joined).to.equal(23)
        })
      })

      context('with a boolean', function () {
        it('should return boolean untouched', function () {
          const joined = filters.oxfordJoin(false)
          expect(joined).to.equal(false)
        })
      })

      context('with no items', function () {
        it('should return empty string', function () {
          const joined = filters.oxfordJoin([])
          expect(joined).to.equal('')
        })
      })

      context('with one item', function () {
        it('should return item', function () {
          const joined = filters.oxfordJoin(['one'])
          expect(joined).to.equal('one')
        })
      })

      context('with two items', function () {
        it('should join with `and`', function () {
          const joined = filters.oxfordJoin(['one', 'two'])
          expect(joined).to.equal('one and two')
        })
      })

      context('with multiple items', function () {
        it('should join with comma and `and`', function () {
          const joined = filters.oxfordJoin(['one', 'two', 'three'])
          expect(joined).to.equal('one, two, and three')
        })
      })
    })

    context('with custom delimiter', function () {
      context('with no items', function () {
        it('should return empty string', function () {
          const joined = filters.oxfordJoin([], 'or')
          expect(joined).to.equal('')
        })
      })

      context('with one item', function () {
        it('should return item', function () {
          const joined = filters.oxfordJoin(['one'], 'or')
          expect(joined).to.equal('one')
        })
      })

      context('with two items', function () {
        it('should join with `or`', function () {
          const joined = filters.oxfordJoin(['one', 'two'], 'or')
          expect(joined).to.equal('one or two')
        })
      })

      context('with multiple items', function () {
        it('should join with comma and `or`', function () {
          const joined = filters.oxfordJoin(['one', 'two', 'three'], 'or')
          expect(joined).to.equal('one, two, or three')
        })
      })
    })
  })

  describe('#filesize()', function () {
    const testFilesize = '101010'
    let filesize

    beforeEach(function () {
      filesize = filters.filesize(testFilesize)
    })

    it('should call filesizejs with string', function () {
      expect(mockFilesizejs).to.be.calledOnceWithExactly(testFilesize, {
        round: 0,
      })
    })

    it('should return filesize', function () {
      expect(filesize).to.equal(mockFilesizeResponse)
    })
  })
})
