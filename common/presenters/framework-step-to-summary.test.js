const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n').default
const frameworksHelpers = require('../helpers/frameworks')
const componentService = require('../services/component')

describe('Presenters', function () {
  describe('#frameworkStepToSummary', function () {
    const frameworkFieldToSummaryListRowStub = sinon
      .stub()
      .callsFake(() => sinon.stub().returnsArg(0))
    const mockBaseUrl = '/base-url/'
    const mockResponses = [{ id: '1' }, { id: '2' }, { id: '3' }]
    const mockStep = {
      foo: 'bar',
      slug: 'step-slug',
      fields: ['fieldOne'],
    }
    let frameworkStepToSummary
    let response

    beforeEach(function () {
      sinon
        .stub(frameworksHelpers, 'mapFieldFromName')
        .callsFake(() => sinon.stub().returnsArg(0))
      sinon
        .stub(frameworksHelpers, 'appendResponseToField')
        .callsFake(() => sinon.stub().returnsArg(0))
      sinon.stub(componentService, 'getComponent').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)

      frameworkStepToSummary = proxyquire('./framework-step-to-summary', {
        './framework-field-summary-list-row':
          frameworkFieldToSummaryListRowStub,
      })
    })

    context('with fields', function () {
      const mockFields = {
        fieldOne: {
          question: 'Question one?',
          description: 'Short question one description',
          id: 'field-one',
        },
      }

      beforeEach(function () {
        response = frameworkStepToSummary(
          mockFields,
          mockResponses,
          mockBaseUrl
        )(['/step-one', mockStep])
      })

      it('should return key as first item', function () {
        expect(response[0]).to.equal('/step-one')
      })

      it('should map fields', function () {
        expect(frameworksHelpers.mapFieldFromName).to.be.calledOnceWithExactly(
          mockFields
        )
      })

      it('should append responses', function () {
        expect(
          frameworksHelpers.appendResponseToField
        ).to.be.calledOnceWithExactly(mockResponses)
      })

      it('should render summary list rows', function () {
        expect(frameworkFieldToSummaryListRowStub).to.be.calledWithExactly(
          '/base-url/step-slug'
        )
      })

      it('should return summary object', function () {
        expect(response[1]).to.deep.equal({
          ...mockStep,
          stepUrl: '/base-url/step-slug',
          summaryListComponent: {
            classes: 'govuk-!-margin-bottom-0 govuk-!-font-size-16',
            rows: ['fieldOne'],
          },
        })
      })
    })

    context('without base URL', function () {
      const mockFields = {
        fieldOne: {
          question: 'Question one?',
          description: 'Short question one description',
          id: 'field-one',
        },
      }

      beforeEach(function () {
        response = frameworkStepToSummary(
          mockFields,
          mockResponses
        )(['/step-one', mockStep])
      })

      it('should render summary list rows', function () {
        expect(frameworkFieldToSummaryListRowStub).to.be.calledWithExactly(
          'step-slug'
        )
      })

      it('should return summary object', function () {
        expect(response[1]).to.deep.equal({
          ...mockStep,
          stepUrl: 'step-slug',
          summaryListComponent: {
            classes: 'govuk-!-margin-bottom-0 govuk-!-font-size-16',
            rows: ['fieldOne'],
          },
        })
      })
    })

    context('without fields', function () {
      beforeEach(function () {
        response = frameworkStepToSummary(
          {},
          mockResponses,
          mockBaseUrl
        )([
          '/step-one',
          {
            ...mockStep,
            fields: [],
          },
        ])
      })

      it('should return undefined', function () {
        expect(response).to.be.undefined
      })
    })

    context('with conditional steps', function () {
      const mockFields = {
        fieldOne: {
          question: 'Question one?',
          description: 'Short question one description',
          id: 'field-one',
        },
      }
      const mockSteps = [
        [
          '/step-one',
          {
            next: [
              {
                field: 'conditionalField',
                value: 'Yes',
                next: 'step-two',
              },
              'step-three',
            ],
            slug: 'step-one',
            fields: ['fieldOne'],
          },
        ],
        [
          '/step-two',
          {
            next: 'step-three',
            slug: 'step-two',
            fields: ['fieldOne'],
          },
        ],
        [
          '/step-three',
          {
            slug: 'step-three',
            fields: ['fieldOne'],
          },
        ],
      ]

      context('when responses match condition', function () {
        const mockResponsesWithCondition = [
          ...mockResponses,
          {
            value: 'Yes',
            question: {
              key: 'conditionalField',
            },
          },
        ]

        beforeEach(function () {
          response = mockSteps.map(
            frameworkStepToSummary(
              mockFields,
              mockResponsesWithCondition,
              mockBaseUrl
            )
          )
        })

        it('should return correct number of steps', function () {
          expect(response).to.be.an('array')
          expect(response).to.have.length(3)
        })

        it('should return array for each step', function () {
          response.forEach(step => {
            expect(step).to.be.an('array')
          })
        })
      })

      context('when responses does not match condition', function () {
        beforeEach(function () {
          response = mockSteps.map(
            frameworkStepToSummary(mockFields, mockResponses, mockBaseUrl)
          )
        })

        it('should remove conditional steps', function () {
          expect(response).to.be.an('array')
          expect(response.filter(Boolean)).to.have.length(2)
        })

        it('should return non-conditional steps', function () {
          const steps = response.filter(Boolean).map(item => item[0])

          expect(steps).to.deep.equal(['/step-one', '/step-three'])
        })
      })
    })
  })
})
