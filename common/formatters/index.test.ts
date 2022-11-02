import { expect } from 'chai'
import sinon from 'sinon'

import * as formatters from './index'

describe('Formatters', function () {
  describe('#date()', function () {
    context('when input value is a valid date', function () {
      context('with default date format', function () {
        beforeEach(function () {
          const mockDate = new Date('2017-08-10')
          this.clock = sinon.useFakeTimers(mockDate.getTime())
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should return default date format', function () {
          const date = formatters.date('10/10/2010')
          expect(date).to.equal('2010-10-10')
        })

        it('should return default date format', function () {
          const date = formatters.date('today')
          expect(date).to.equal('2017-08-10')
        })

        it('should return default date format', function () {
          const date = formatters.date('yesterday')
          expect(date).to.equal('2017-08-09')
        })
      })

      context('with custom date format', function () {
        it('should return custom date format', function () {
          const date = formatters.date('2010-10-10', 'dd/MM/yyyy')
          expect(date).to.equal('10/10/2010')
        })
      })
    })

    context('when input value is not a valid date', function () {
      it('should return input value', function () {
        const date = formatters.date('not-a-date')
        expect(date).to.equal('not-a-date')
      })
    })
  })

  describe('#time()', function () {
    context('when input value is a valid time', function () {
      context('with default time format', function () {
        it('should return formatted time', function () {
          const time = formatters.time('5:00')
          expect(time).to.equal('05:00')
        })

        it('should return formatted time', function () {
          const time = formatters.time('5am')
          expect(time).to.equal('05:00')
        })

        it('should return formatted time', function () {
          const time = formatters.time('22:00')
          expect(time).to.equal('22:00')
        })

        it('should return formatted time', function () {
          const time = formatters.time('10pm')
          expect(time).to.equal('22:00')
        })
      })

      context('with custom date format', function () {
        it('should return custom date format', function () {
          const time = formatters.time('10:00', "H:mmaaaaa'm")
          expect(time).to.equal('10:00am')
        })
      })
    })

    context('when input value is not a valid time', function () {
      it('should return input value', function () {
        const time = formatters.time('not-a-date')
        expect(time).to.equal('not-a-date')
      })
    })
  })
})
