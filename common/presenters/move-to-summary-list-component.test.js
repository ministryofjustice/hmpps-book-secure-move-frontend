const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const moveToSummaryListComponent = require('./move-to-summary-list-component')

const mockMove = {
  date: '2019-06-09',
  time_due: '2000-01-01T14:00:00Z',
  move_type: 'court_appearance',
  from_location: {
    title: 'HMP Leeds',
  },
  to_location: {
    title: 'Barrow in Furness County Court',
  },
}

describe('Presenters', function () {
  describe('#moveToSummaryListComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      timezoneMock.register('UTC')
      sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
      sinon.stub(filters, 'formatTime').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)
    })

    context('when provided no move', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent()
      })

      it('should return empty rows', function () {
        expect(transformedResponse).to.deep.equal({
          classes: 'govuk-!-font-size-16',
          rows: [],
        })
      })
    })

    context('when provided with a mock move object', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent(mockMove)
      })

      describe('response', function () {
        it('should contain correct rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(4)
        })

        it('should order items correctly', function () {
          const keys = transformedResponse.rows.map(row => row.key.text)
          expect(keys).to.deep.equal([
            'fields::from_location.label',
            'fields::to_location.label',
            'fields::date_custom.label',
            'fields::time_due.label',
          ])
        })

        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)
          expect(keys).to.deep.equal([
            mockMove.from_location.title,
            mockMove.to_location.title,
            mockMove.date,
            mockMove.time_due,
          ])
        })

        it('should contain correct row structure', function () {
          transformedResponse.rows.forEach(row => {
            expect(row).to.have.all.keys(['key', 'value'])
          })
        })
      })

      describe('translations', function () {
        it('should translate keys', function () {
          transformedResponse.rows.forEach(row => {
            expect(i18n.t).to.be.calledWithExactly(row.key.text)
          })
        })
      })

      describe('date', function () {
        it('should format date', function () {
          expect(filters.formatDateWithDay).to.be.calledWithExactly(
            mockMove.date
          )
        })

        it('should format time', function () {
          expect(filters.formatTime).to.be.calledWithExactly(mockMove.time_due)
        })
      })
    })

    context('with prison recall move type', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent({
          ...mockMove,
          move_type: 'prison_recall',
        })
      })

      describe('response', function () {
        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)
          expect(keys).to.deep.equal([
            mockMove.from_location.title,
            'fields::move_type.items.prison_recall.label',
            mockMove.date,
            mockMove.time_due,
          ])
        })
      })

      describe('translataion', function () {
        it('should translate label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
        })
      })
    })

    context('with video remand move type', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent({
          ...mockMove,
          move_type: 'video_remand',
        })
      })

      describe('response', function () {
        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)
          expect(keys).to.deep.equal([
            mockMove.from_location.title,
            'fields::move_type.items.video_remand.label',
            mockMove.date,
            mockMove.time_due,
          ])
        })
      })

      describe('translataion', function () {
        it('should translate label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.video_remand.label'
          )
        })
      })
    })

    context('with unknown to location', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent({
          ...mockMove,
          to_location: null,
        })
      })

      describe('response', function () {
        it('should contain unknown as destination label', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)
          expect(keys).to.deep.equal([
            mockMove.from_location.title,
            'Unknown',
            mockMove.date,
            mockMove.time_due,
          ])
        })
      })
    })
  })
})
