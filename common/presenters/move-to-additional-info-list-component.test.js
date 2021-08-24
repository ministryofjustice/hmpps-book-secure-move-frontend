const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const moveToSummaryListComponent = require('./move-to-additional-info-list-component')

const mockMove = {
  time_due: '2000-01-01T14:00:00Z',
  additional_information: 'Some more info',
  move_type: 'court_appearance',
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

    afterEach(function () {
      timezoneMock.unregister()
    })

    context('when provided no move', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent()
      })

      it('should return empty rows', function () {
        expect(transformedResponse).to.deep.equal({
          classes: 'govuk-!-font-size-16',
          count: 0,
          heading: 'moves::detail.additional_information.heading',
          key: undefined,
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
          expect(transformedResponse.rows.length).to.equal(2)
        })

        it('should order items correctly', function () {
          const keys = transformedResponse.rows.map(row => row.key.text)
          expect(keys).to.deep.equal([
            'fields::time_due.label',
            'fields::additional_information.display.label',
          ])
        })

        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(
            row => row.value.text || row.value.html
          )
          expect(keys).to.deep.equal([
            mockMove.time_due,
            mockMove.additional_information,
          ])
        })

        it('should contain correct row structure', function () {
          transformedResponse.rows.forEach(row => {
            expect(row).to.have.all.keys(['key', 'value'])
          })
        })

        it('should contain key', function () {
          expect(transformedResponse).to.have.property('key')
          expect(transformedResponse.key).to.equal('court_appearance')
        })

        it('should contain count', function () {
          expect(transformedResponse).to.have.property('count')
          expect(transformedResponse.count).to.equal(2)
        })

        it('should contain heading', function () {
          expect(transformedResponse).to.have.property('heading')
          expect(transformedResponse.heading).to.equal(
            'moves::detail.additional_information.heading'
          )
        })
      })

      describe('translations', function () {
        it('should translate keys', function () {
          transformedResponse.rows.forEach(row => {
            expect(i18n.t).to.be.calledWithExactly(row.key.text, {
              context: 'court_appearance',
            })
          })
        })

        it('should translate heading', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'moves::detail.additional_information.heading',
            {
              context: 'court_appearance',
            }
          )
        })
      })

      describe('time due', function () {
        it('should format time due', function () {
          expect(filters.formatTime).to.be.calledWithExactly(mockMove.time_due)
        })
      })
    })

    context('with hospital move type', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent({
          ...mockMove,
          move_type: 'hospital',
        })
      })

      describe('translations', function () {
        it('should translate time due label', function () {
          expect(i18n.t).to.be.calledWithExactly('fields::time_due.label', {
            context: 'hospital',
          })
        })
        it('should translate additional info label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::additional_information.display.label',
            {
              context: 'hospital',
            }
          )
        })
      })
    })
  })
})
