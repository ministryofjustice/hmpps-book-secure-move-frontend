const dateTableDecorator = require('./date-table-decorator')

const tableConfig = {
  caption: 'Table Caption',
  head: [
    { html: 'Header Column', attributes: { width: 220 } },
    { html: 'first label to ignore', date: '2020-01-02' },
    { html: 'second label to ignore', date: '2020-01-03' },
  ],
  rows: [
    [
      { html: 'header column r1' },
      { value: 1, date: '2020-01-02' },
      { value: 8, date: '2020-01-03' },
    ],
    [
      { html: 'header column r2' },
      { value: 99, date: '2020-01-02' },
      { value: -8, classes: 'highlight-negative-value', date: '2020-01-03' },
    ],
  ],
}

describe('dateTableDecorator', function () {
  let result

  describe('applyClasses', function () {
    beforeEach(function () {})

    context('with no cell date and focusDate', function () {
      it('should return empty object', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            key: 'value',
          },
          focusDate: '2020-01-03',
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({})
      })
    })

    context('with invalid cell date and focusDate', function () {
      it('should return empty object', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            date: 'Thursday',
            key: 'value',
          },
          focusDate: '2020-01-03',
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({})
      })
    })

    context('with cell date and no focusDate', function () {
      it('should return object with date styling', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            date: '2020-01-03',
            key: 'value',
          },
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({ classes: 'date-class' })
      })
    })

    context('with cell date as Date and no focusDate', function () {
      it('should return object with date styling', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            date: new Date(2020, 0, 3),
            key: 'value',
          },
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({ classes: 'date-class' })
      })
    })

    context('with cell date and invalid focusDate', function () {
      it('should return object with date styling', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            date: '2020-01-03',
            html: 'Text',
          },
          focusDate: 'Thursday',
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({ classes: 'date-class' })
      })
    })

    context('with cell date and not matching focusDate', function () {
      it('should return object with date styling', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            key: 'value',
            date: '2020-01-03',
          },
          focusDate: '2020-01-04',
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({ classes: 'date-class' })
      })

      it('should return cell with date, focused styling, and existing styling', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            key: 'value',
            date: '2020-01-03',
            classes: 'other-class',
          },
          focusDate: '2020-01-04',
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({
          classes: 'other-class date-class',
        })
      })
    })

    context(
      'with cell date as Date and not matching focusDate as Date',
      function () {
        it('should return object with date styling', function () {
          result = dateTableDecorator.applyClasses({
            cell: {
              key: 'value',
              date: new Date(2020, 0, 3),
            },
            focusDate: new Date(2020, 0, 2),
            dateClass: 'date-class',
            focusedDateClass: 'focused-date-class',
          })

          expect(result).to.deep.equal({ classes: 'date-class' })
        })
      }
    )

    context('with cell date and matching focusDate', function () {
      it('should return object with date and focused styling', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            key: 'value',
            date: '2020-01-03',
          },
          focusDate: '2020-01-03',
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({
          classes: 'date-class focused-date-class',
        })
      })

      it('should return object with date, focused styling, and existing styling', function () {
        result = dateTableDecorator.applyClasses({
          cell: {
            key: 'value',
            date: '2020-01-03',
            classes: 'other-class',
          },
          focusDate: '2020-01-03',
          dateClass: 'date-class',
          focusedDateClass: 'focused-date-class',
        })

        expect(result).to.deep.equal({
          classes: 'other-class date-class focused-date-class',
        })
      })
    })
  })

  describe('applyHeading', function () {
    context('with no cell date ', function () {
      it('should return empty object', function () {
        result = dateTableDecorator.applyHeading({
          cell: {
            key: 'value',
          },
        })

        expect(result).to.deep.equal({})
      })
    })

    context('with invalid cell date ', function () {
      it('should return empty object', function () {
        result = dateTableDecorator.applyHeading({
          cell: {
            date: 'Thursday',
            key: 'value',
          },
        })

        expect(result).to.deep.equal({})
      })
    })

    context('with cell date, and no heading ', function () {
      it.skip('should return heading', function () {
        result = dateTableDecorator.applyHeading({
          cell: {
            date: '2020-01-03',
            key: 'value',
          },
        })

        expect(result).to.deep.equal({
          html: 'Mon 12',
        })
      })
    })

    context('with cell date as date, and text heading ', function () {
      it('should return heading', function () {
        result = dateTableDecorator.applyHeading({
          cell: {
            date: new Date(2020, 0, 3),
            text: 'Heading',
            key: 'value',
          },
        })

        expect(result).to.deep.equal({
          text: 'Fri 03',
        })
      })
    })

    context('with cell date, and text heading ', function () {
      it('should return empty object', function () {
        result = dateTableDecorator.applyHeading({
          cell: {
            date: '2020-01-03',
            text: 'Heading',
            key: 'value',
          },
        })

        expect(result).to.deep.equal({
          text: 'Fri 03',
        })
      })
    })

    context('with cell date, and html and text heading ', function () {
      it('should return empty object', function () {
        result = dateTableDecorator.applyHeading({
          cell: {
            date: '2020-01-03',
            html: 'Heading',
            key: 'value',
          },
        })

        expect(result).to.deep.equal({
          html: 'Fri 03',
        })
      })
    })
  })

  describe('decorateTable', function () {
    context('with focusDate in table data range', function () {
      beforeEach(function () {
        result = dateTableDecorator.decorateAsDateTable({
          focusDate: '2020-01-02',
          tableComponent: tableConfig,
        })
      })

      describe('head', function () {
        context('styling', function () {
          it('should not apply day styling to columns without dates', function () {
            expect(result.head[0].classes).to.be.undefined
          })

          it('should apply day styling to columns with date', function () {
            expect(result.head[1].classes).to.contain('date-table__tr--day')
            expect(result.head[2].classes).to.contain('date-table__tr--day')
          })
          it('should apply focus styling to columns matching the focusDate', function () {
            expect(result.head[1].classes).to.contain(
              'date-table__tr--day date-table__tr--focus'
            )
          })
          it('should not apply focus styling to columns not matching the focusDate', function () {
            expect(result.head[2].classes).not.to.contain(
              'date-table__tr--day date-table__tr--focus'
            )
          })
        })

        context('labels', function () {
          it('should preserve the header text of columns without dates', function () {
            expect(result.head[0].html).to.equal('Header Column')
          })
          it('should replace the header text of columns with dates', function () {
            expect(result.head[1].html).to.equal('Thu 02')
            expect(result.head[2].html).to.equal('Fri 03')
          })
        })
      })

      describe('rows', function () {
        it('should return the same structure of rows', function () {
          expect(result.rows).to.be.an('Array')
          expect(result.rows[0]).to.be.an('Array')
          expect(result.rows[1]).to.be.an('Array')
        })

        context('styling', function () {
          it('should not apply day styling to columns without dates', function () {
            expect(result.rows[0][0].classes).to.be.undefined
            expect(result.rows[1][0].classes).to.be.undefined
          })

          it('should apply day styling to columns with date', function () {
            expect(result.rows[0][1].classes).to.contain('date-table__td--day')
            expect(result.rows[0][2].classes).to.contain('date-table__td--day')
            expect(result.rows[1][1].classes).to.contain('date-table__td--day')
            expect(result.rows[1][2].classes).to.contain('date-table__td--day')
          })
          it('should apply focus styling to columns matching the focusDate', function () {
            expect(result.rows[0][1].classes).to.contain(
              'date-table__td--focus'
            )
            expect(result.rows[0][1].classes).to.contain(
              'date-table__td--focus'
            )
          })
          it('should not apply focus styling to columns not matching the focusDate', function () {
            expect(result.rows[0][2].classes).not.to.contain(
              'date-table__td--focus'
            )
            expect(result.rows[0][2].classes).not.to.contain(
              'date-table__td--focus'
            )
          })
        })

        context('labels', function () {
          it('should preserve the text of columns', function () {
            expect(result.rows[0][0].html).to.equal('header column r1')
            expect(result.rows[0][1].html).to.be.undefined
            expect(result.rows[1][0].html).to.equal('header column r2')
            expect(result.rows[1][1].html).to.be.undefined
          })
        })
      })
    })

    context('with no focusDate', function () {
      beforeEach(function () {
        result = dateTableDecorator.decorateAsDateTable({
          tableComponent: tableConfig,
        })
      })

      describe('head', function () {
        context('styling', function () {
          it('should not apply day styling to columns without dates', function () {
            expect(result.head[0].classes).to.be.undefined
          })

          it('should apply day styling to columns with date', function () {
            expect(result.head[1].classes).to.contain('date-table__tr--day')
            expect(result.head[2].classes).to.contain('date-table__tr--day')
          })
          it('should not apply focus styling to columns not matching the focusDate', function () {
            expect(result.head[1].classes).not.to.contain(
              'date-table__tr--day date-table__tr--focus'
            )
            expect(result.head[2].classes).not.to.contain(
              'date-table__tr--day date-table__tr--focus'
            )
          })
        })
      })

      describe('rows', function () {
        it('should return the same structure of rows', function () {
          expect(result.rows).to.be.an('Array')
          expect(result.rows[0]).to.be.an('Array')
          expect(result.rows[1]).to.be.an('Array')
        })

        context('styling', function () {
          it('should not apply day styling to columns without dates', function () {
            expect(result.rows[0][0].classes).to.be.undefined
            expect(result.rows[1][0].classes).to.be.undefined
          })

          it('should apply day styling to columns with date', function () {
            expect(result.rows[0][1].classes).to.contain('date-table__td--day')
            expect(result.rows[0][2].classes).to.contain('date-table__td--day')
            expect(result.rows[1][1].classes).to.contain('date-table__td--day')
            expect(result.rows[1][2].classes).to.contain('date-table__td--day')
          })
          it('should not apply focus styling to columns not matching the focusDate', function () {
            expect(result.rows[0][1].classes).not.to.contain(
              'date-table__td--focus'
            )
            expect(result.rows[0][1].classes).not.to.contain(
              'date-table__td--focus'
            )
            expect(result.rows[0][2].classes).not.to.contain(
              'date-table__td--focus'
            )
            expect(result.rows[0][2].classes).not.to.contain(
              'date-table__td--focus'
            )
          })
        })
      })
    })
  })
})
