const componentService = require('../services/component')

const presenter = require('./framework-responses-to-meta-list-component')

describe('Presenters', function () {
  describe('#frameworkResponsesToMetaListComponent', function () {
    let output

    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returns('__getComponent__')
    })

    context('with no responses', function () {
      beforeEach(function () {
        output = presenter()
      })

      it('should return empty items', function () {
        expect(output).to.deep.equal({
          classes: 'app-meta-list--divider',
          items: [],
        })
      })
    })

    context('with responses', function () {
      const mockResponses = [
        {
          value: 'string value',
          value_type: 'string',
          responded: true,
          _question: {
            description: 'String',
          },
        },
        {
          value: { option: 'Yes' },
          value_type: 'object',
          responded: false,
          _question: {
            description: 'Object',
          },
        },
        {
          value: ['One'],
          value_type: 'array',
          responded: true,
          _question: {
            description: 'Array',
          },
        },
      ]

      beforeEach(function () {
        output = presenter(mockResponses)
      })

      it('should return output', function () {
        expect(output).to.deep.equal({
          classes: 'app-meta-list--divider',
          items: [
            {
              value: {
                html: '<h4 class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-font-size-16">String</h4>__getComponent__',
              },
            },
            {
              value: {
                html: '<h4 class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-font-size-16">Object</h4>__getComponent__',
              },
            },
            {
              value: {
                html: '<h4 class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-font-size-16">Array</h4>__getComponent__',
              },
            },
          ],
        })
      })

      describe('component service', function () {
        mockResponses.forEach(response => {
          describe(response._question.description, function () {
            it('should call component with value', function () {
              expect(componentService.getComponent).to.have.been.calledWith(
                'appFrameworkResponse',
                {
                  value: response.value,
                  valueType: response.value_type,
                  responded: response.responded,
                }
              )
            })
          })
        })
      })
    })

    context('with empty responses', function () {
      const mockEmptyResponses = [
        {
          value: '',
          value_type: 'string',
          responded: true,
          _question: {
            description: 'String',
          },
        },
        {
          value: {},
          value_type: 'object',
          responded: false,
          _question: {
            description: 'Object',
          },
        },
        {
          value: [],
          value_type: 'array',
          responded: true,
          _question: {
            description: 'Array',
          },
        },
      ]

      beforeEach(function () {
        output = presenter(mockEmptyResponses)
      })

      it('should return output', function () {
        expect(output).to.deep.equal({
          classes: 'app-meta-list--divider',
          items: [
            {
              value: {
                html: '<h4 class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-font-size-16">String</h4>__getComponent__',
              },
            },
            {
              value: {
                html: '<h4 class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-font-size-16">Object</h4>__getComponent__',
              },
            },
            {
              value: {
                html: '<h4 class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-font-size-16">Array</h4>__getComponent__',
              },
            },
          ],
        })
      })

      describe('component service', function () {
        mockEmptyResponses.forEach(response => {
          describe(response._question.description, function () {
            it('should call component with undefined', function () {
              expect(componentService.getComponent).to.have.been.calledWith(
                'appFrameworkResponse',
                {
                  value: undefined,
                  valueType: response.value_type,
                  responded: response.responded,
                }
              )
            })
          })
        })
      })
    })
  })
})
