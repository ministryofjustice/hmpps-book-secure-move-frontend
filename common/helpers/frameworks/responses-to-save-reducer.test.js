const responsesToSaveReducer = require('./responses-to-save-reducer')

describe('Helpers', function () {
  describe('Frameworks Helpers', function () {
    describe('#responsesToSaveReducer', function () {
      let responses
      const mockResponses = [
        {
          id: '1',
          question: {
            key: 'question-1',
          },
        },
        {
          id: '2',
          question: {
            key: 'question-2',
          },
        },
        {
          id: '3',
          question: {
            key: 'question-3',
          },
        },
      ]

      context('with no form values', function () {
        beforeEach(function () {
          responses = mockResponses.reduce(responsesToSaveReducer(), [])
        })

        it('should not return any responses', function () {
          expect(responses).to.deep.equal([])
        })
      })

      context('with form values', function () {
        const testCases = [
          {
            testName: 'with string',
            formValues: {
              question: 'Yes',
            },
            responses: [
              {
                id: '1',
                value_type: 'string',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: 'Yes',
              },
            ],
          },
          {
            testName: 'with array',
            formValues: {
              question: ['Yes', 'No'],
            },
            responses: [
              {
                id: '1',
                value_type: 'array',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: ['Yes', 'No'],
              },
            ],
          },
          {
            testName: 'with array with falsy values',
            formValues: {
              question: ['', null, undefined, false],
            },
            responses: [
              {
                id: '1',
                value_type: 'array',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: [],
              },
            ],
          },
          {
            testName: 'with object without followup comments',
            formValues: {
              question: 'Yes',
            },
            responses: [
              {
                id: '1',
                value_type: 'object',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: {
                  option: 'Yes',
                },
              },
            ],
          },
          {
            testName: 'with object with followup comments',
            formValues: {
              question: 'Yes',
              'question--yes': 'Further yes details',
            },
            responses: [
              {
                id: '1',
                value_type: 'object',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: {
                  option: 'Yes',
                  details: 'Further yes details',
                },
              },
            ],
          },
          {
            testName: 'with collection without followup comments',
            formValues: {
              question: ['One', 'Two', 'Three'],
            },
            responses: [
              {
                id: '1',
                value_type: 'collection',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: [
                  {
                    option: 'One',
                    details: undefined,
                  },
                  {
                    option: 'Two',
                    details: undefined,
                  },
                  {
                    option: 'Three',
                    details: undefined,
                  },
                ],
              },
            ],
          },
          {
            testName: 'with collection without followup comments',
            formValues: {
              question: ['One', 'Two', 'Three'],
              'question--one': 'Further comments about one',
              'question--three': 'Further comments about three',
            },
            responses: [
              {
                id: '1',
                value_type: 'collection',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: [
                  {
                    option: 'One',
                    details: 'Further comments about one',
                  },
                  {
                    option: 'Two',
                    details: undefined,
                  },
                  {
                    option: 'Three',
                    details: 'Further comments about three',
                  },
                ],
              },
            ],
          },
          {
            testName: 'with any unknown type',
            formValues: {
              question: 'Unknown',
            },
            responses: [
              {
                id: '1',
                value_type: 'unknkown',
                question: {
                  key: 'question',
                },
              },
            ],
            expectedValue: [],
          },
        ]

        testCases.forEach(test => {
          context(test.testName, function () {
            beforeEach(function () {
              responses = test.responses.reduce(
                responsesToSaveReducer(test.formValues),
                []
              )
            })

            it('should format response correctly', function () {
              expect(responses).to.deep.equal(test.expectedValue)
            })
          })
        })
      })
    })
  })
})
