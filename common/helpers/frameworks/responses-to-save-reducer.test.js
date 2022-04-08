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
                question: {
                  key: 'question',
                  response_type: 'string',
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
                question: {
                  key: 'question',
                  response_type: 'array',
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
                question: {
                  key: 'question',
                  response_type: 'array',
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
            testName: 'with object::followup_comment without comments',
            formValues: {
              question: 'Yes',
            },
            responses: [
              {
                id: '1',
                question: {
                  key: 'question',
                  response_type: 'object::followup_comment',
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
            testName: 'with object::followup_comment with comments',
            formValues: {
              question: 'Yes',
              'question--yes': 'Further yes details',
            },
            responses: [
              {
                id: '1',
                question: {
                  key: 'question',
                  response_type: 'object::followup_comment',
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
            testName: 'with collection::followup_comment without comments',
            formValues: {
              question: ['One', 'Two', 'Three'],
            },
            responses: [
              {
                id: '1',
                question: {
                  key: 'question',
                  response_type: 'collection::followup_comment',
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
            testName: 'with collection::followup_comment with comments',
            formValues: {
              question: ['One', 'Two', 'Three'],
              'question--one': 'Further comments about one',
              'question--three': 'Further comments about three',
            },
            responses: [
              {
                id: '1',
                question: {
                  key: 'question',
                  response_type: 'collection::followup_comment',
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
            testName: 'with collection::add_multiple_items',
            formValues: {
              question: [
                {
                  'que-string': 'String value',
                  'que-array': ['One', 'Two', 'Three'],
                  'que-object': 'Yes',
                  'que-object--yes': 'Some more details about yes',
                  'que-collection': ['One', 'Two'],
                  'que-collection--one': undefined,
                  'que-collection--two': 'Some more details about two',
                },
                {
                  'que-string': 'String value',
                  'que-array': 'Two',
                  'que-object': 'No',
                  'que-collection': 'One',
                  'que-collection--one': 'Some more details about one',
                },
              ],
            },
            responses: [
              {
                id: '1',
                question: {
                  key: 'question',
                  response_type: 'collection::add_multiple_items',
                  descendants: [
                    {
                      id: '1.1',
                      key: 'que-string',
                      response_type: 'string',
                    },
                    {
                      id: '1.2',
                      key: 'que-array',
                      response_type: 'array',
                    },
                    {
                      id: '1.3',
                      key: 'que-object',
                      response_type: 'object::followup_comment',
                    },
                    {
                      id: '1.4',
                      key: 'que-collection',
                      response_type: 'collection::followup_comment',
                    },
                  ],
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: [
                  {
                    item: 0,
                    responses: [
                      {
                        framework_question_id: '1.1',
                        value: 'String value',
                      },
                      {
                        framework_question_id: '1.2',
                        value: ['One', 'Two', 'Three'],
                      },
                      {
                        framework_question_id: '1.3',
                        value: {
                          option: 'Yes',
                          details: 'Some more details about yes',
                        },
                      },
                      {
                        framework_question_id: '1.4',
                        value: [
                          {
                            option: 'One',
                            details: undefined,
                          },
                          {
                            option: 'Two',
                            details: 'Some more details about two',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    item: 1,
                    responses: [
                      {
                        framework_question_id: '1.1',
                        value: 'String value',
                      },
                      {
                        framework_question_id: '1.2',
                        value: ['Two'],
                      },
                      {
                        framework_question_id: '1.3',
                        value: {
                          option: 'No',
                        },
                      },
                      {
                        framework_question_id: '1.4',
                        value: [
                          {
                            option: 'One',
                            details: 'Some more details about one',
                          },
                        ],
                      },
                    ],
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
                question: {
                  key: 'question',
                  response_type: 'unknkown',
                },
              },
            ],
            expectedValue: [],
          },
          {
            testName: 'with empty but optional field',
            formValues: {
              question: null,
            },
            responses: [
              {
                id: '1',
                question: {
                  key: 'question',
                  response_type: 'object::followup_comment',
                },
                _question: {
                  validate: [],
                },
              },
            ],
            expectedValue: [
              {
                id: '1',
                value: {},
              },
            ],
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
