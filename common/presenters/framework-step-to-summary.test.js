const i18n = require('../../config/i18n')
const componentService = require('../services/component')

const frameworkStepToSummary = require('./framework-step-to-summary')

describe('Presenters', function () {
  describe('#frameworkStepToSummary', function () {
    const mockBaseUrl = '/base-url'
    const mockResponses = [{ id: '1' }, { id: '2' }, { id: '3' }]
    const mockStep = {
      foo: 'bar',
      slug: 'step-slug',
      fields: ['fieldOne'],
    }
    let response

    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)
    })

    context('with description', function () {
      beforeEach(function () {
        response = frameworkStepToSummary(
          {
            fieldOne: {
              question: 'Question one?',
              description: 'Short question one description',
              id: 'field-one',
            },
          },
          mockResponses,
          mockBaseUrl
        )(['/step-one', mockStep])
      })

      it('should return key as first item', function () {
        expect(response[0]).to.equal('/step-one')
      })

      it('should render component without response', function () {
        expect(
          componentService.getComponent
        ).to.have.been.calledOnceWithExactly('appFrameworkResponse', {
          value: undefined,
          valueType: undefined,
          questionUrl: '/base-url/step-slug#field-one',
        })
      })

      it('should return fields using description text', function () {
        expect(response[1]).to.deep.equal({
          ...mockStep,
          stepUrl: '/base-url/step-slug',
          summaryListComponent: {
            classes: 'govuk-!-font-size-16',
            rows: [
              {
                key: {
                  text: 'Short question one description',
                  classes: 'govuk-!-font-weight-regular',
                },
                value: {
                  html: 'appFrameworkResponse',
                },
              },
            ],
          },
        })
      })
    })

    context('without description', function () {
      beforeEach(function () {
        response = frameworkStepToSummary(
          {
            fieldOne: {
              question: 'Question one?',
              id: 'field-one',
            },
          },
          mockResponses,
          mockBaseUrl
        )(['/step-one', mockStep])
      })

      it('should return key as first item', function () {
        expect(response[0]).to.equal('/step-one')
      })

      it('should render component without response', function () {
        expect(
          componentService.getComponent
        ).to.have.been.calledOnceWithExactly('appFrameworkResponse', {
          value: undefined,
          valueType: undefined,
          questionUrl: '/base-url/step-slug#field-one',
        })
      })

      it('should return fields using question text', function () {
        expect(response[1]).to.deep.equal({
          ...mockStep,
          stepUrl: '/base-url/step-slug',
          summaryListComponent: {
            classes: 'govuk-!-font-size-16',
            rows: [
              {
                key: {
                  text: 'Question one?',
                  classes: 'govuk-!-font-weight-regular',
                },
                value: {
                  html: 'appFrameworkResponse',
                },
              },
            ],
          },
        })
      })
    })

    context('with missing fields', function () {
      beforeEach(function () {
        response = frameworkStepToSummary(
          {
            fieldOne: {
              question: 'Question one?',
              id: 'field-one',
            },
          },
          mockResponses,
          mockBaseUrl
        )([
          '/step-one',
          {
            ...mockStep,
            fields: ['fieldOne', 'missingFieldOne', 'missingFieldTwo'],
          },
        ])
      })

      it('should return key as first item', function () {
        expect(response[0]).to.equal('/step-one')
      })

      it('should remove missing fields', function () {
        expect(response[1]).to.deep.equal({
          ...mockStep,
          fields: ['fieldOne', 'missingFieldOne', 'missingFieldTwo'],
          stepUrl: '/base-url/step-slug',
          summaryListComponent: {
            classes: 'govuk-!-font-size-16',
            rows: [
              {
                key: {
                  text: 'Question one?',
                  classes: 'govuk-!-font-weight-regular',
                },
                value: {
                  html: 'appFrameworkResponse',
                },
              },
            ],
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

    context('with response', function () {
      beforeEach(function () {
        response = frameworkStepToSummary(
          {
            fieldOne: {
              question: 'Question one?',
              id: 'field-one',
            },
          },
          [
            {
              value: 'Yes',
              value_type: 'string',
              question: { key: 'fieldOne' },
            },
          ],
          mockBaseUrl
        )(['/step-one', mockStep])
      })

      it('should sending response to component', function () {
        expect(
          componentService.getComponent
        ).to.have.been.calledOnceWithExactly('appFrameworkResponse', {
          value: 'Yes',
          valueType: 'string',
          questionUrl: '/base-url/step-slug#field-one',
        })
      })

      it('should return fields', function () {
        expect(response[1]).to.deep.equal({
          ...mockStep,
          stepUrl: '/base-url/step-slug',
          summaryListComponent: {
            classes: 'govuk-!-font-size-16',
            rows: [
              {
                key: {
                  text: 'Question one?',
                  classes: 'govuk-!-font-weight-regular',
                },
                value: {
                  html: 'appFrameworkResponse',
                },
              },
            ],
          },
        })
      })
    })
  })
})
