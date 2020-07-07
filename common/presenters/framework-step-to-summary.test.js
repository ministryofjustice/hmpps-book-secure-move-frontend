const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n')
const frameworksHelpers = require('../helpers/frameworks')
const componentService = require('../services/component')

describe('Presenters', function () {
  describe('#frameworkStepToSummary', function () {
    const frameworkFieldToSummaryListRowStub = sinon
      .stub()
      .callsFake(() => sinon.stub().returnsArg(0))
    const mockBaseUrl = '/base-url'
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
        './framework-field-summary-list-row': frameworkFieldToSummaryListRowStub,
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
            classes: 'govuk-!-font-size-16',
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
  })
})
