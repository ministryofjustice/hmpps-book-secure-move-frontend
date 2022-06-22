import * as formatters from './index'
import { expect } from 'chai'
import sinon from 'sinon'

describe('Formatters', () => {
  describe('#date()', () => {
    context('when input value is a valid date', () => {
      context('with default date format', () => {
        beforeEach(function() {
          const mockDate = new Date('2017-08-10')
          this.clock = sinon.useFakeTimers(mockDate.getTime())
        })

        afterEach(function() {
          this.clock.restore()
        })

        it('should return default date format', () => {
          const date = formatters.date('10/10/2010')
          expect(date).to.equal('2010-10-10')
        })

        it('should return default date format', () => {
          const date = formatters.date('today')
          expect(date).to.equal('2017-08-10')
        })

        it('should return default date format', () => {
          const date = formatters.date('yesterday')
          expect(date).to.equal('2017-08-09')
        })
      })

      context('with custom date format', () => {
        it('should return custom date format', () => {
          const date = formatters.date('2010-10-10', 'dd/MM/yyyy')
          expect(date).to.equal('10/10/2010')
        })
      })
    })

    context('when input value is not a valid date', () => {
      it('should return input value', () => {
        const date = formatters.date('not-a-date')
        expect(date).to.equal('not-a-date')
      })
    })
  })

  describe('#time()', () => {
    context('when input value is a valid time', () => {
      context('with default time format', () => {
        it('should return formatted time', () => {
          const time = formatters.time('5:00')
          expect(time).to.equal('05:00')
        })

        it('should return formatted time', () => {
          const time = formatters.time('5am')
          expect(time).to.equal('05:00')
        })

        it('should return formatted time', () => {
          const time = formatters.time('22:00')
          expect(time).to.equal('22:00')
        })

        it('should return formatted time', () => {
          const time = formatters.time('10pm')
          expect(time).to.equal('22:00')
        })
      })

      context('with custom date format', () => {
        it('should return custom date format', () => {
          const time = formatters.time('10:00', 'H:mmaaaaa\'m')
          expect(time).to.equal('10:00am')
        })
      })
    })

    context('when input value is not a valid time', () => {
      it('should return input value', () => {
        const time = formatters.time('not-a-date')
        expect(time).to.equal('not-a-date')
      })
    })
  })
})
