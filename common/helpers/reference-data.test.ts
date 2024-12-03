import { expect } from 'chai'
import { addMonths, subMonths } from 'date-fns'

import { filterDisabled, filterExpired } from './reference-data'

const nextMonth = addMonths(new Date(), 1).toISOString()
const lastMonth = subMonths(new Date(), 1).toISOString()

describe('Reference data helpers', function () {
  describe('#filterDisabled', function () {
    context('when an option was disabled in the past', function () {
      beforeEach(function () {
        this.options = [
          {
            id: '1234',
            name: 'Freds',
            disabled_at: lastMonth,
          },
        ]
      })

      context('when the option is not the current field value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(
            filterDisabled({
              currentValue: '3',
              createdOn: lastMonth,
            })
          )
        })

        it('should not include the option', function () {
          expect(this.filteredOptions).to.have.length(0)
        })
      })

      context('when the option is the current field value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(
            filterDisabled({
              currentValue: '1234',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', function () {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when there is no current value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(filterDisabled())
        })

        it('should not include the option', function () {
          expect(this.filteredOptions).to.have.length(0)
        })
      })
    })

    context('when an option is disabled in the future', function () {
      beforeEach(function () {
        this.options = [
          {
            id: '1234',
            name: 'Freds',
            disabled_at: nextMonth,
          },
        ]
      })

      context('when the option is not the current field value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(
            filterDisabled({
              currentValue: '3',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', function () {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when the option is the current field value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(
            filterDisabled({
              currentValue: '1234',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', function () {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when there is no current value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(filterDisabled())
        })

        it('should include the option', function () {
          expect(this.filteredOptions).to.have.length(1)
        })
      })
    })

    context('when an option is not disabled', function () {
      beforeEach(function () {
        this.options = [
          {
            id: '1234',
            name: 'Freds',
            disabled_at: null,
          },
        ]
      })

      context('when the option is not the current field value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(
            filterDisabled({
              currentValue: '3',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', function () {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when the option is the current field value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(
            filterDisabled({
              currentValue: '1234',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', function () {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when there is no current value', function () {
        beforeEach(function () {
          this.filteredOptions = this.options.filter(filterDisabled())
        })

        it('should include the option', function () {
          expect(this.filteredOptions).to.have.length(1)
        })
      })
    })
  })

  context('#filterExpired', function () {
    context('without expired property', function () {
      it('should return true', function () {
        expect(filterExpired({})).to.be.true
      })
    })

    context('with expired property', function () {
      context('with falsy values', function () {
        const falsyValues = [undefined, null, '', NaN, 0] as (
          | string
          | null
          | undefined
        )[]

        falsyValues.forEach(function (value) {
          it('should return true', function () {
            expect(filterExpired({ expires_at: value })).to.be.true
          })
        })
      })

      context('when not expired', function () {
        it('should return true', function () {
          expect(
            filterExpired({
              expires_at: nextMonth,
            })
          ).to.be.true
        })
      })

      context('when is expired', function () {
        it('should return false', function () {
          expect(
            filterExpired({
              expires_at: lastMonth,
            })
          ).to.be.false
        })
      })
    })
  })
})
