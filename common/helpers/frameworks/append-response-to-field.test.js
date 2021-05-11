const appendResponseToField = require('./append-response-to-field')

describe('Helpers', function () {
  describe('Frameworks Helpers', function () {
    describe('#appendResponseToField', function () {
      let response

      context('without responses', function () {
        const mockField = {
          name: 'mock-field',
        }

        beforeEach(function () {
          response = appendResponseToField()(mockField)
        })

        it('should return empty response object', function () {
          expect(response).to.deep.equal({
            name: 'mock-field',
            response: {},
          })
        })
      })

      context('with responses', function () {
        const mockResponses = [
          {
            value: 'Yes',
            value_type: 'string',
            question: {
              key: 'mock-field',
            },
          },
          {
            value: 'Comments',
            value_type: 'string',
            question: {
              key: 'followup-field-1',
            },
          },
        ]

        context('without field items', function () {
          const mockField = {
            name: 'mock-field',
          }

          beforeEach(function () {
            response = appendResponseToField(mockResponses)(mockField)
          })

          it('should return empty response object', function () {
            expect(response).to.deep.equal({
              name: 'mock-field',
              response: {
                value: 'Yes',
                value_type: 'string',
                question: {
                  key: 'mock-field',
                },
              },
            })
          })
        })

        context('with field items', function () {
          context('without followup', function () {
            const mockFieldWithItems = {
              name: 'mock-field',
              items: [{ value: 'Yes' }, { value: 'No' }],
            }

            beforeEach(function () {
              response =
                appendResponseToField(mockResponses)(mockFieldWithItems)
            })

            it('should return empty response object', function () {
              expect(response).to.deep.equal({
                name: 'mock-field',
                items: [{ value: 'Yes' }, { value: 'No' }],
                response: {
                  value: 'Yes',
                  value_type: 'string',
                  question: {
                    key: 'mock-field',
                  },
                },
              })
            })
          })

          context('with followup', function () {
            const mockFieldWithItemsFollowup = {
              name: 'mock-field',
              items: [
                {
                  value: 'Yes',
                  followup: [
                    {
                      name: 'followup-field-1',
                    },
                    {
                      name: 'followup-field-2',
                    },
                  ],
                },
                { value: 'No' },
              ],
            }

            beforeEach(function () {
              response = appendResponseToField(mockResponses)(
                mockFieldWithItemsFollowup
              )
            })

            it('should return field object', function () {
              expect(response).to.deep.equal({
                name: 'mock-field',
                response: {
                  value: 'Yes',
                  value_type: 'string',
                  question: {
                    key: 'mock-field',
                  },
                },
                items: [
                  {
                    value: 'Yes',
                    followup: [
                      {
                        name: 'followup-field-1',
                        response: {
                          value: 'Comments',
                          value_type: 'string',
                          question: {
                            key: 'followup-field-1',
                          },
                        },
                      },
                      {
                        name: 'followup-field-2',
                        response: {},
                      },
                    ],
                  },
                  { value: 'No' },
                ],
              })
            })
          })
        })
      })
    })
  })
})
