var proxyquire = require('proxyquire')

const filters = proxyquire('./filters', {
  '../index': {
    DATE_FORMATS: {
      LONG: 'D MMM YYYY',
      WITH_DAY: 'dddd D MMM YYYY',
    },
  },
})

describe('Nunjucks filters', function () {
  describe('#formatDate()', function () {
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
          const formattedDate = filters.formatDate('2010-05-01', 'DD/MM/YY')

          expect(formattedDate).to.equal('01/05/10')
        })
      })
    })
  })

  describe('#formatDateWithDay()', function () {
    it('should return config date with day format', function () {
      const formattedDate = filters.formatDateWithDay('2010-01-05')

      expect(formattedDate).to.equal('Tuesday 5 Jan 2010')
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
        expect(formattedDate).to.equal('Today')
      })
    })

    context('when current date is tomorrow', function () {
      it('should return `Tomorrow`', function () {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-11')
        expect(formattedDate).to.equal('Tomorrow')
      })
    })

    context('when current date is yesterday', function () {
      it('should return `Yesterday`', function () {
        const formattedDate = filters.formatDateAsRelativeDay('2017-08-09')
        expect(formattedDate).to.equal('Yesterday')
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
          const formattedDate = filters.formatDateAsRelativeDay('2017-08-01', 'DD/MM/YY')
          expect(formattedDate).to.equal('01/08/17')
        })
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
      let dateOfBirth = '1979-01-10'

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
})
