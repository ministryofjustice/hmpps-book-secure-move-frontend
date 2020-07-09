const mapFieldFromName = require('./map-field-from-name')

describe('Helpers', function () {
  describe('Frameworks Helpers', function () {
    describe('#mapFieldFromName', function () {
      const mockFieldName = 'mock-field'
      let response

      context('without allFields', function () {
        beforeEach(function () {
          response = mapFieldFromName()(mockFieldName)
        })

        it('should return empty object', function () {
          expect(response).to.deep.equal({})
        })
      })

      context('with allFields', function () {
        const mockAllFields = {
          'mock-field': {
            id: 'mock-field',
            question: 'What is life?',
          },
          'items-field': {
            id: 'mock-field',
            question: 'What is life?',
            items: [{ value: 'Yes' }, { value: 'No' }],
          },
          'items-followup-field': {
            id: 'mock-field',
            question: 'What is life?',
            items: [
              {
                value: 'Yes',
                followup: ['followup-1', 'followup-2'],
              },
              { value: 'No' },
            ],
          },
          'followup-1': {
            id: 'followup-1',
            question: 'Follow up one?',
          },
          'followup-2': {
            id: 'followup-2',
            question: 'Follow up two?',
          },
        }

        context('when field exists', function () {
          context('without field items', function () {
            beforeEach(function () {
              response = mapFieldFromName(mockAllFields)(mockFieldName)
            })

            it('should return field object', function () {
              expect(response).to.deep.equal(mockAllFields[mockFieldName])
              expect(response).to.deep.equal({
                id: 'mock-field',
                question: 'What is life?',
              })
            })
          })

          context('with field items', function () {
            context('without followup', function () {
              beforeEach(function () {
                response = mapFieldFromName(mockAllFields)('items-field')
              })

              it('should return field object', function () {
                expect(response).to.deep.equal({
                  id: 'mock-field',
                  question: 'What is life?',
                  items: [{ value: 'Yes' }, { value: 'No' }],
                })
              })
            })

            context('with followup', function () {
              beforeEach(function () {
                response = mapFieldFromName(mockAllFields)(
                  'items-followup-field'
                )
              })

              it('should return field object', function () {
                expect(response).to.deep.equal({
                  id: 'mock-field',
                  question: 'What is life?',
                  items: [
                    {
                      value: 'Yes',
                      followup: [
                        {
                          id: 'followup-1',
                          question: 'Follow up one?',
                        },
                        {
                          id: 'followup-2',
                          question: 'Follow up two?',
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

        context('when field does not exist', function () {
          beforeEach(function () {
            response = mapFieldFromName(mockAllFields)('unknown-field')
          })

          it('should return empty object', function () {
            expect(response).to.deep.equal({})
          })
        })
      })
    })
  })
})
