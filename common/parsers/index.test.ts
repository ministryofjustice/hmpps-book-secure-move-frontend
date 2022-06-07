import * as parsers from './index'
import sinon from 'sinon'
import { expect } from 'chai'

const getExpectedDate = (
  year = new Date().getFullYear(),
  value = '10 March'
) => {
  const expectedDate = new Date(`${value} ${year}`)
  expectedDate.setHours(12)
  return expectedDate
}

describe('Parsers', () => {
  describe('#date', () => {
    let marchCurrentYear: Date
    let octoberCurrentYear: Date
    let march2019: Date
    let october2019: Date

    beforeEach(function() {
      const mockDate = new Date('2020-06-01')
      this.clock = sinon.useFakeTimers(mockDate.getTime())

      marchCurrentYear = getExpectedDate()
      octoberCurrentYear = getExpectedDate(undefined, '3 October')
      march2019 = getExpectedDate(2019)
      october2019 = getExpectedDate(2019, '3 October')
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('When passed non-string value', () => {
      it('should return undefined values as is', () => {
        expect(parsers.date(undefined)).to.be.undefined
      })

      it('should return date values as is', () => {
        const d = new Date()
        expect(parsers.date(d)).to.eql(d)
      })
    })

    context('When passed a valid en_GB format', () => {
      it('should treat dd/MM/yyyy dates as en_GB', () => {
        expect(parsers.date('10/3/2019')).to.eql(march2019)
        expect(parsers.date('10/03/2019')).to.eql(march2019)
        expect(parsers.date('3/10/2019')).to.eql(october2019)
      })

      it('should treat dd/MM dates as en_GB', () => {
        expect(parsers.date('10/3')).to.eql(marchCurrentYear)
        expect(parsers.date('10/03')).to.eql(marchCurrentYear)
        expect(parsers.date('3/10')).to.eql(octoberCurrentYear)
      })

      it('should treat dd-MM-yyyy dates as en_GB', () => {
        expect(parsers.date('10-3-2019')).to.eql(march2019)
      })

      it('should treat dd-MM dates as en_GB', () => {
        expect(parsers.date('10-3')).to.eql(marchCurrentYear)
      })
    })

    context('When passed an invalid en_GB format', () => {
      it('should not treat dd-MM dates as en_GB', () => {
        expect(parsers.date('10-3-19')).to.be.null
      })
    })

    context('When passed an ISO-style format', () => {
      it('should treat date as ISO', () => {
        expect(parsers.date('2019-3-10')).to.eql(march2019)
        expect(parsers.date('2019-03-10')).to.eql(march2019)
      })
    })

    context('When passed an dd MMM format', () => {
      it('should treat date as dd MMM', () => {
        expect(parsers.date('10 Mar')).to.eql(marchCurrentYear)
        expect(parsers.date('10 March')).to.eql(marchCurrentYear)
        expect(parsers.date('Mar 10')).to.eql(marchCurrentYear)
        expect(parsers.date('March 10th')).to.eql(marchCurrentYear)
      })
    })
  })
})
