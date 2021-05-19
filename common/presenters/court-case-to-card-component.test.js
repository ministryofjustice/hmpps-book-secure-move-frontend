const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const courtCaseToCardComponent = require('./court-case-to-card-component')

const mockCourtCase = {
  nomis_case_id: 'T20167984',
  nomis_case_status: 'ACTIVE',
  case_start_date: '2016-11-14',
  case_type: 'Adult',
  case_number: 'T20167984',
  location: {
    title: 'Snaresbrook Crown Court',
  },
}

describe('Presenters', function () {
  describe('#courtCaseToCardComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(filters, 'formatDate').returnsArg(0)
    })

    context('with mock court case', function () {
      beforeEach(function () {
        transformedResponse = courtCaseToCardComponent(mockCourtCase)
      })

      describe('response', function () {
        it('should contain a title', function () {
          expect(transformedResponse).to.have.property('title')
          expect(transformedResponse.title).to.deep.equal({
            text: 'T20167984 at Snaresbrook Crown Court',
          })
        })

        it('should format date', function () {
          expect(filters.formatDate).to.be.calledOnceWithExactly(
            mockCourtCase.case_start_date
          )
        })

        it('should contain correct meta data', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta).to.deep.equal({
            items: [
              {
                label: { text: 'moves::court_case.items.start_date.label' },
                text: mockCourtCase.case_start_date,
              },
              {
                label: { text: 'moves::court_case.items.case_type.label' },
                text: mockCourtCase.case_type,
              },
            ],
          })
        })
      })

      describe('translations', function () {
        it('should translate age label', function () {
          expect(i18n.t.getCall(0)).to.be.calledWithExactly(
            'moves::court_case.items.start_date.label'
          )
        })

        it('should translate date of birth label', function () {
          expect(i18n.t.getCall(1)).to.be.calledWithExactly(
            'moves::court_case.items.case_type.label'
          )
        })
      })
    })

    context('without location', function () {
      beforeEach(function () {
        const mockCourtCaseWithoutLocation = {
          ...mockCourtCase,
        }
        delete mockCourtCaseWithoutLocation.location

        transformedResponse = courtCaseToCardComponent(
          mockCourtCaseWithoutLocation
        )
      })

      describe('response', function () {
        it('title should only contain case number', function () {
          expect(transformedResponse).to.have.property('title')
          expect(transformedResponse.title).to.deep.equal({
            text: 'T20167984',
          })
        })
      })
    })

    context('without null location', function () {
      beforeEach(function () {
        const mockCourtCaseWithoutLocation = {
          ...mockCourtCase,
          location: null,
        }
        transformedResponse = courtCaseToCardComponent(
          mockCourtCaseWithoutLocation
        )
      })

      describe('response', function () {
        it('title should only contain case number', function () {
          expect(transformedResponse).to.have.property('title')
          expect(transformedResponse.title).to.deep.equal({
            text: 'T20167984',
          })
        })
      })
    })
  })
})
