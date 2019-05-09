var proxyquire = require('proxyquire')

const filters = proxyquire('./filters', {
  '../index': {
    DATE_FORMATS: {
      LONG: 'D MMM YYYY',
      WITH_DAY: 'dddd D MMM YYYY',
    },
  },
})

describe('Nunjucks filters', () => {
  describe('#formatDate()', () => {
    context('when given an invalid date', () => {
      it('should return input value', () => {
        const formattedDate = filters.formatDate('2010-45-5')

        expect(formattedDate).to.equal('2010-45-5')
      })
    })

    context('when given a valid date', () => {
      context('when no format is specified', () => {
        it('should return date in default format', () => {
          const formattedDate = filters.formatDate('2010-05-15')

          expect(formattedDate).to.equal('15 May 2010')
        })
      })

      context('when a format is specified', () => {
        it('should return date in that format', () => {
          const formattedDate = filters.formatDate('2010-05-01', 'DD/MM/YY')

          expect(formattedDate).to.equal('01/05/10')
        })
      })
    })
  })

  describe('#formatDateWithDay()', () => {
    it('should return config date with day format', () => {
      const formattedDate = filters.formatDateWithDay('2010-01-05')

      expect(formattedDate).to.equal('Tuesday 5 Jan 2010')
    })
  })
})
