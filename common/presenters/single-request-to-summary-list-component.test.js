const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const singleRequestToSummaryListComponent = require('./single-request-to-summary-list-component')

describe('Presenters', function () {
  describe('#singleRequestToSummaryListComponent()', function () {
    let mockMove
    let transformedResponse

    beforeEach(function () {
      sinon.stub(filters, 'formatDateWithRelativeDay').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)

      mockMove = {
        date_from: '2000-01-01',
        date_to: null,
        move_type: 'prison_transfer',
        additional_information: null,
        prison_transfer_reason: {
          title: 'Court appearance',
        },
        move_agreed: false,
        move_agreed_by: null,
      }
    })

    context('when provided no move', function () {
      beforeEach(function () {
        transformedResponse = singleRequestToSummaryListComponent()
      })

      it('should return undefined', function () {
        expect(transformedResponse).to.be.undefined
      })
    })

    context('when move is not a prison transfer', function () {
      beforeEach(function () {
        transformedResponse = singleRequestToSummaryListComponent({
          ...mockMove,
          move_type: 'hospital',
        })
      })

      it('should return undefined', function () {
        expect(transformedResponse).to.be.undefined
      })
    })

    context('when provided with a minimum mock move object', function () {
      beforeEach(function () {
        transformedResponse = singleRequestToSummaryListComponent(mockMove)
      })

      describe('response', function () {
        it('should contain correct rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(5)
        })

        it('should order items correctly', function () {
          const keys = transformedResponse.rows.map(row => row.key.text)
          expect(keys).to.deep.equal([
            'fields::date_from.label',
            'fields::date_to.label',
            'fields::prison_transfer_type.label',
            'fields::additional_information.display.label',
            'fields::move_agreed.label',
          ])
        })

        it('should set fallback classes', function () {
          const keys = transformedResponse.rows.map(row => row.value.classes)
          expect(keys).to.deep.equal([
            undefined,
            'app-secondary-text-colour',
            undefined,
            'app-secondary-text-colour',
            undefined,
          ])
        })

        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(
            row => row.value.text || row.value.html
          )
          expect(keys).to.deep.equal([
            mockMove.date_from,
            'not_provided',
            mockMove.prison_transfer_reason.title,
            'not_provided',
            'moves::detail.agreement_status.not_agreed',
          ])
        })

        it('should contain correct row structure', function () {
          transformedResponse.rows.forEach(row => {
            expect(row).to.have.all.keys(['key', 'value'])
          })
        })

        it('should contain count', function () {
          expect(transformedResponse).to.have.property('count')
          expect(transformedResponse.count).to.equal(5)
        })

        it('should contain heading', function () {
          expect(transformedResponse).to.have.property('heading')
          expect(transformedResponse.heading).to.equal(
            'moves::detail.single_request.heading'
          )
        })
      })

      describe('translations', function () {
        it('should agreement labels', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'moves::detail.agreement_status.not_agreed'
          )
          expect(i18n.t).not.to.be.calledWithExactly(
            'moves::detail.agreement_status.agreed',
            {
              context: '',
              name: null,
            }
          )
        })
      })

      describe('filters', function () {
        it('should format dates', function () {
          expect(filters.formatDateWithRelativeDay).to.be.calledWithExactly(
            mockMove.date_from
          )
          expect(filters.formatDateWithRelativeDay).to.be.calledWithExactly(
            null
          )
        })
      })
    })

    context('with date to', function () {
      beforeEach(function () {
        transformedResponse = singleRequestToSummaryListComponent({
          ...mockMove,
          date_to: '2000-01-10',
        })
      })

      it('should include date to', function () {
        const values = transformedResponse.rows.map(
          row => row.value.text || row.value.html
        )
        expect(values).to.include('2000-01-10')
      })
    })

    context('with additional information', function () {
      beforeEach(function () {
        transformedResponse = singleRequestToSummaryListComponent({
          ...mockMove,
          additional_information: 'Additional info',
        })
      })

      it('should include additional information', function () {
        const values = transformedResponse.rows.map(
          row => row.value.text || row.value.html
        )
        expect(values).to.include('Additional info')
      })
    })

    context('with move agreed', function () {
      beforeEach(function () {
        transformedResponse = singleRequestToSummaryListComponent({
          ...mockMove,
          move_agreed: true,
          move_agreed_by: 'JANE DOE',
        })
      })

      describe('response', function () {
        it('should include agreed information', function () {
          const values = transformedResponse.rows.map(
            row => row.value.text || row.value.html
          )
          expect(values).to.include('moves::detail.agreement_status.agreed')
        })
      })

      describe('translations', function () {
        it('should agreement labels', function () {
          expect(i18n.t).not.to.be.calledWithExactly(
            'moves::detail.agreement_status.not_agreed'
          )
          expect(i18n.t).to.be.calledWithExactly(
            'moves::detail.agreement_status.agreed',
            {
              context: 'with_name',
              name: 'JANE DOE',
            }
          )
        })
      })
    })
  })
})
