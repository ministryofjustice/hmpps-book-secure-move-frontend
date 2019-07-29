const { addMonths, subMonths } = require('date-fns')

const { filterDisabled } = require('./reference-data')

const nextMonth = addMonths(new Date(), 1)
const lastMonth = subMonths(new Date(), 1)

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
})
