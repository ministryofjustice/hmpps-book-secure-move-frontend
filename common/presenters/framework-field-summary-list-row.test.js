const componentService = require('../services/component')

const frameworkFieldToSummaryListRow = require('./framework-field-summary-list-row')

describe('Presenters', function () {
  describe('#frameworkFieldToSummaryListRow', function () {
    let response
    const mockStepUrl = '/step-url'

    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
    })

    context('without items', function () {
      const mockField = {
        name: 'mock-field',
        id: 'mock-field',
        question: 'What is the answer?',
        description: 'What is the answer?',
        response: {},
      }

      context('with description', function () {
        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)(mockField)
        })

        it('should call component service', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appFrameworkResponse',
            {
              value: undefined,
              valueType: undefined,
              responded: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              classes: 'govuk-!-font-size-16',
            }
          )
        })

        it('should return single object in array of rows', function () {
          expect(response).to.deep.equal([
            {
              key: {
                classes: 'govuk-!-font-weight-regular',
                text: mockField.description,
              },
              value: {
                html: 'appFrameworkResponse',
              },
            },
          ])
        })
      })

      context('without description', function () {
        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)({
            ...mockField,
            description: undefined,
          })
        })

        it('should call component service', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appFrameworkResponse',
            {
              value: undefined,
              valueType: undefined,
              responded: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              classes: 'govuk-!-font-size-16',
            }
          )
        })

        it('should return single object in array of rows', function () {
          expect(response).to.deep.equal([
            {
              key: {
                classes: 'govuk-!-font-weight-regular',
                text: mockField.question,
              },
              value: {
                html: 'appFrameworkResponse',
              },
            },
          ])
        })
      })
    })

    context('with items', function () {
      const mockField = {
        name: 'mock-field',
        id: 'mock-field',
        question: 'What is the answer?',
        description: 'What is the answer?',
        response: {},
        items: [
          {
            value: 'Yes',
          },
          {
            value: 'No',
          },
        ],
      }

      context('without followup', function () {
        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)(mockField)
        })

        it('should call component service', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appFrameworkResponse',
            {
              value: undefined,
              valueType: undefined,
              responded: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              classes: 'govuk-!-font-size-16',
            }
          )
        })

        it('should return single object in array of rows', function () {
          expect(response).to.deep.equal([
            {
              key: {
                classes: 'govuk-!-font-weight-regular',
                text: mockField.description,
              },
              value: {
                html: 'appFrameworkResponse',
              },
            },
          ])
        })
      })

      context('with followup', function () {
        const mockFieldWithFollowup = {
          name: 'mock-field',
          id: 'mock-field',
          question: 'What is the answer?',
          response: {},
          items: [
            {
              value: 'Yes',
              followup: [
                {
                  name: 'followup-field',
                  id: 'followup-field',
                  question: 'What is the answer to life?',
                  response: {},
                },
              ],
            },
            {
              value: 'No',
            },
          ],
        }

        context('when response value matches item value', function () {
          beforeEach(function () {
            response = frameworkFieldToSummaryListRow(mockStepUrl)({
              ...mockFieldWithFollowup,
              response: { value: 'Yes', value_type: 'string' },
            })
          })

          it('should call component service', function () {
            expect(componentService.getComponent).to.be.calledTwice
            expect(componentService.getComponent).to.be.calledWithExactly(
              'appFrameworkResponse',
              {
                value: 'Yes',
                valueType: 'string',
                responded: false,
                questionUrl: `${mockStepUrl}#${mockFieldWithFollowup.id}`,
                classes: 'govuk-!-font-size-16',
              }
            )
            expect(componentService.getComponent).to.be.calledWithExactly(
              'appFrameworkResponse',
              {
                value: undefined,
                valueType: undefined,
                responded: false,
                questionUrl: `${mockStepUrl}#${mockFieldWithFollowup.items[0].followup[0].id}`,
                classes: 'govuk-!-font-size-16',
              }
            )
          })

          it('should return array of rows', function () {
            expect(response).to.deep.equal([
              {
                key: {
                  classes: 'govuk-!-font-weight-regular',
                  text: mockFieldWithFollowup.question,
                },
                value: {
                  html: 'appFrameworkResponse',
                },
              },
              {
                key: {
                  classes: 'govuk-!-font-weight-regular',
                  text: mockFieldWithFollowup.items[0].followup[0].question,
                },
                value: {
                  html: 'appFrameworkResponse',
                },
              },
            ])
          })
        })

        context('when response value does not match item value', function () {
          beforeEach(function () {
            response = frameworkFieldToSummaryListRow(mockStepUrl)({
              ...mockFieldWithFollowup,
              response: { value: 'No', value_type: 'string' },
            })
          })

          it('should call component service', function () {
            expect(componentService.getComponent).to.be.calledOnceWithExactly(
              'appFrameworkResponse',
              {
                value: 'No',
                valueType: 'string',
                responded: false,
                questionUrl: `${mockStepUrl}#${mockFieldWithFollowup.id}`,
                classes: 'govuk-!-font-size-16',
              }
            )
          })

          it('should return single object in array of rows', function () {
            expect(response).to.deep.equal([
              {
                key: {
                  classes: 'govuk-!-font-weight-regular',
                  text: mockFieldWithFollowup.question,
                },
                value: {
                  html: 'appFrameworkResponse',
                },
              },
            ])
          })
        })
      })
    })

    context('with response values', function () {
      const mockField = {
        name: 'mock-field',
        id: 'mock-field',
        question: 'What is the answer?',
        description: 'What is the answer?',
        response: {},
      }
      const valueTypes = [
        {
          valueType: 'string',
          emptyValue: '',
          nonEmptyValue: 'Yes',
        },
        {
          valueType: 'object',
          emptyValue: {},
          nonEmptyValue: { option: 'Yes' },
        },
        {
          valueType: 'array',
          emptyValue: [],
          nonEmptyValue: ['Yes'],
        },
        {
          valueType: 'collection',
          emptyValue: [],
          nonEmptyValue: [{ option: 'Yes' }],
        },
      ]

      valueTypes.forEach(test => {
        context(`with ${test.valueType} value type`, function () {
          context(`with empty ${test.valueType}`, function () {
            const mockResponse = {
              value: test.emptyValue,
              value_type: test.valueType,
            }

            beforeEach(function () {
              response = frameworkFieldToSummaryListRow(mockStepUrl)({
                ...mockField,
                response: mockResponse,
              })
            })

            it('should call component service with undefined value', function () {
              expect(componentService.getComponent).to.be.calledOnceWithExactly(
                'appFrameworkResponse',
                {
                  value: undefined,
                  valueType: test.valueType,
                  responded: false,
                  questionUrl: `${mockStepUrl}#${mockField.id}`,
                  classes: 'govuk-!-font-size-16',
                }
              )
            })
          })

          context(`with non-empty ${test.valueType}`, function () {
            const mockResponse = {
              value: test.nonEmptyValue,
              value_type: test.valueType,
            }

            beforeEach(function () {
              response = frameworkFieldToSummaryListRow(mockStepUrl)({
                ...mockField,
                response: mockResponse,
              })
            })

            it('should call component service with undefined value', function () {
              expect(componentService.getComponent).to.be.calledOnceWithExactly(
                'appFrameworkResponse',
                {
                  value: test.nonEmptyValue,
                  valueType: test.valueType,
                  responded: false,
                  questionUrl: `${mockStepUrl}#${mockField.id}`,
                  classes: 'govuk-!-font-size-16',
                }
              )
            })
          })
        })
      })

      context('when response has been answered', function () {
        const mockResponse = {
          value: [],
          value_type: 'array',
          responded: true,
        }

        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)({
            ...mockField,
            response: mockResponse,
          })
        })

        it('should call component service with undefined value and responded value', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appFrameworkResponse',
            {
              value: undefined,
              valueType: 'array',
              responded: true,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              classes: 'govuk-!-font-size-16',
            }
          )
        })
      })
    })
  })
})
