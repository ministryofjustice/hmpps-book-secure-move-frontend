const i18n = require('../../config/i18n')

const frameworkStepToSummary = require('./framework-step-to-summary')

describe('Presenters', function () {
  describe('#frameworkStepToSummary', function () {
    const mockBaseUrl = '/base-url'
    const mockStep = {
      foo: 'bar',
      slug: 'step-slug',
      fields: ['fieldOne'],
    }
    let response

    beforeEach(function () {
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
          mockBaseUrl
        )(['/step-one', mockStep])
      })

      it('should return key as first item', function () {
        expect(response[0]).to.equal('/step-one')
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
                  html:
                    '<a href="/base-url/step-slug#field-one">actions::answer_question</a>',
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
          mockBaseUrl
        )(['/step-one', mockStep])
      })

      it('should return key as first item', function () {
        expect(response[0]).to.equal('/step-one')
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
                  html:
                    '<a href="/base-url/step-slug#field-one">actions::answer_question</a>',
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
                  html:
                    '<a href="/base-url/step-slug#field-one">actions::answer_question</a>',
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
