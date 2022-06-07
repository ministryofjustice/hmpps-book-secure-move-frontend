const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n').default
const componentService = require('../services/component')

const frameworkNomisMappingsToPanelStub = sinon.stub().returns('NOMIS_HTML')
const frameworkFieldToSummaryListRow = proxyquire(
  './framework-field-summary-list-row',
  {
    '../presenters/framework-nomis-mappings-to-panel':
      frameworkNomisMappingsToPanelStub,
  }
)

describe('Presenters', function () {
  describe('#frameworkFieldToSummaryListRow', function () {
    let response
    const mockStepUrl = '/step-url'

    beforeEach(function () {
      frameworkNomisMappingsToPanelStub.resetHistory()
      sinon.stub(i18n, 't').returnsArg(0)
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
              prefilled: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: undefined,
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
              prefilled: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: undefined,
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

      context('with NOMIS mappings', function () {
        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)({
            ...mockField,
            response: {
              nomis_mappings: [{ foo: 'bar' }, { fizz: 'buzz' }],
            },
          })
        })

        it('should transform mappings', function () {
          expect(frameworkNomisMappingsToPanelStub).to.be.calledOnceWithExactly(
            {
              heading:
                'person-escort-record::nomis_mappings.information_included',
              mappings: [{ foo: 'bar' }, { fizz: 'buzz' }],
            }
          )
        })

        it('should call component service', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appFrameworkResponse',
            {
              value: undefined,
              valueType: undefined,
              responded: false,
              prefilled: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: undefined,
              afterContent: {
                html: 'NOMIS_HTML',
              },
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

      context('with assessment', function () {
        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)({
            ...mockField,
            response: { assessment: { status: 'completed' } },
          })
        })

        it('should call component service', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appFrameworkResponse',
            {
              value: undefined,
              valueType: undefined,
              responded: false,
              prefilled: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: 'completed',
            }
          )
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
              prefilled: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: undefined,
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
              response: {
                value: 'Yes',
                question: { response_type: 'string' },
              },
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
                prefilled: false,
                questionUrl: `${mockStepUrl}#${mockFieldWithFollowup.id}`,
                assessmentStatus: undefined,
              }
            )
            expect(componentService.getComponent).to.be.calledWithExactly(
              'appFrameworkResponse',
              {
                value: undefined,
                valueType: undefined,
                responded: false,
                prefilled: false,
                questionUrl: `${mockStepUrl}#${mockFieldWithFollowup.items[0].followup[0].id}`,
                assessmentStatus: undefined,
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
              response: {
                value: 'No',
                question: { response_type: 'string' },
              },
            })
          })

          it('should call component service', function () {
            expect(componentService.getComponent).to.be.calledOnceWithExactly(
              'appFrameworkResponse',
              {
                value: 'No',
                valueType: 'string',
                responded: false,
                prefilled: false,
                questionUrl: `${mockStepUrl}#${mockFieldWithFollowup.id}`,
                assessmentStatus: undefined,
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
              question: {
                response_type: test.valueType,
              },
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
                  prefilled: false,
                  questionUrl: `${mockStepUrl}#${mockField.id}`,
                  assessmentStatus: undefined,
                }
              )
            })
          })

          context(`with non-empty ${test.valueType}`, function () {
            const mockResponse = {
              value: test.nonEmptyValue,
              question: {
                response_type: test.valueType,
              },
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
                  prefilled: false,
                  questionUrl: `${mockStepUrl}#${mockField.id}`,
                  assessmentStatus: undefined,
                }
              )
            })
          })
        })
      })

      context('when response has been answered', function () {
        const mockResponse = {
          value: [],
          responded: true,
          question: {
            response_type: 'array',
          },
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
              prefilled: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: undefined,
            }
          )
        })
      })

      context('when response has been prefilled', function () {
        const mockResponse = {
          value: 'An answer',
          responded: false,
          prefilled: true,
          question: {
            response_type: 'string',
          },
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
              value: 'An answer',
              valueType: 'string',
              responded: false,
              prefilled: true,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: undefined,
            }
          )
        })
      })
    })

    context('with `add_multiple_items`', function () {
      const mockField = {
        name: 'mock-field',
        id: 'mock-field',
        question: 'What is the answer?',
        description: 'What is the answer?',
        descendants: [
          {
            name: '__string__',
            id: '__string__field__',
          },
          {
            name: '__collection__',
            id: '__collection__field__',
          },
        ],
        response: {
          value: [],
          question: {
            response_type: 'collection::add_multiple_items',
            descendants: [
              {
                id: '__string__1__',
                key: '__string__',
                response_type: 'string',
              },
              {
                id: '__collection__2__',
                key: '__collection__',
                response_type: 'collection',
              },
            ],
          },
        },
      }

      context('with items', function () {
        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)({
            ...mockField,
            response: {
              ...mockField.response,
              value: [
                {
                  responses: [
                    {
                      framework_question_id: '__collection__2__',
                      value: [
                        {
                          option: 'UK currency',
                          details: '23.99',
                        },
                        {
                          option: 'Valuables',
                          details: 'Gold chain',
                        },
                      ],
                    },
                    {
                      value: '12345',
                      framework_question_id: '__string__1__',
                    },
                  ],
                },
                {
                  responses: [
                    {
                      value: '67890',
                      framework_question_id: '__string__1__',
                    },
                    {
                      framework_question_id: '__collection__2__',
                      value: [
                        {
                          option: 'UK currency',
                          details: '50.00',
                        },
                        {
                          option: 'Medication',
                          details: 'Hayfever tablets',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          })
        })

        it('should call component service for each nested response', function () {
          expect(componentService.getComponent.callCount).to.equal(4)
        })

        const valueTypes = [
          {
            id: '__string__field__',
            valueType: 'string',
            value: '12345',
          },
          {
            id: '__collection__field__',
            valueType: 'collection',
            value: [
              { details: '23.99', option: 'UK currency' },
              { details: 'Gold chain', option: 'Valuables' },
            ],
          },
          {
            id: '__string__field__',
            valueType: 'string',
            value: '67890',
          },
          {
            id: '__collection__field__',
            valueType: 'collection',
            value: [
              { details: '50.00', option: 'UK currency' },
              { details: 'Hayfever tablets', option: 'Medication' },
            ],
          },
        ]

        valueTypes.forEach(test => {
          it(`should call component service with ${test.valueType} field`, function () {
            expect(componentService.getComponent).to.be.calledWithExactly(
              'appFrameworkResponse',
              {
                value: test.value,
                valueType: test.valueType,
                responded: true,
                prefilled: false,
                questionUrl: `${mockStepUrl}#${test.id}`,
                assessmentStatus: undefined,
              }
            )
          })
        })
      })

      context('without items', function () {
        beforeEach(function () {
          response = frameworkFieldToSummaryListRow(mockStepUrl)(mockField)
        })

        it('should call component service with undefined value', function () {
          expect(componentService.getComponent).to.be.calledOnceWithExactly(
            'appFrameworkResponse',
            {
              value: undefined,
              valueType: 'collection::add_multiple_items',
              responded: false,
              prefilled: false,
              questionUrl: `${mockStepUrl}#${mockField.id}`,
              assessmentStatus: undefined,
            }
          )
        })
      })
    })
  })
})
