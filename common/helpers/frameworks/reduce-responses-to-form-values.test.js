const reduceResponsesToFormValues = require('./reduce-responses-to-form-values')

describe('Helpers', function () {
  describe('Frameworks Helpers', function () {
    describe('#reduceResponsesToFormValues', function () {
      let response

      context('with `object` value type', function () {
        beforeEach(function () {
          response = reduceResponsesToFormValues(
            {},
            {
              value: {
                option: 'Yes, I do',
                details: 'Lorem ipsum',
              },
              value_type: 'object',
              question: {
                key: 'object-response',
              },
            }
          )
        })

        it('should set field for option', function () {
          expect(response).to.have.property('object-response')
          expect(response['object-response']).to.equal('Yes, I do')
        })

        it('should set field for details', function () {
          expect(response).to.have.property('object-response--yes-i-do')
          expect(response['object-response--yes-i-do']).to.equal('Lorem ipsum')
        })

        it('should set correct amount of keys', function () {
          expect(Object.keys(response)).to.have.length(2)
        })
      })

      context('with `collection` value type', function () {
        beforeEach(function () {
          response = reduceResponsesToFormValues(
            {},
            {
              value: [
                {
                  option: 'Check item one',
                  details: 'Lorem ipsum one',
                },
                {
                  option: 'Check item two',
                  details: 'Lorem ipsum two',
                },
              ],
              value_type: 'collection',
              question: {
                key: 'collection-response',
                options: [
                  'Check item one',
                  'Check item two',
                  'Check item three',
                ],
              },
            }
          )
        })

        it('should set correct value keys', function () {
          expect(response).to.have.all.keys([
            'collection-response',
            'collection-response--check-item-one',
            'collection-response--check-item-two',
            'collection-response--check-item-three',
          ])
        })

        it('should set correct values', function () {
          const values = Object.entries(response).map(([k, v]) => v)
          expect(values).to.deep.equal([
            ['Check item one', 'Check item two'],
            'Lorem ipsum one',
            'Lorem ipsum two',
            undefined,
          ])
        })

        it('should set correct amount of keys', function () {
          expect(Object.keys(response)).to.have.length(4)
        })
      })

      context('with `string` value type', function () {
        beforeEach(function () {
          response = reduceResponsesToFormValues(
            {},
            {
              value: 'Lorem ipsum',
              value_type: 'string',
              question: {
                key: 'string-response',
              },
            }
          )
        })

        it('should set string as value', function () {
          expect(response).to.have.property('string-response')
          expect(response['string-response']).to.equal('Lorem ipsum')
        })

        it('should set correct amount of keys', function () {
          expect(Object.keys(response)).to.have.length(1)
        })
      })

      context('with `array` value type', function () {
        beforeEach(function () {
          response = reduceResponsesToFormValues(
            {},
            {
              value: ['Item one', 'Item two'],
              value_type: 'array',
              question: {
                key: 'array-response',
              },
            }
          )
        })

        it('should set array as value', function () {
          expect(response).to.have.property('array-response')
          expect(response['array-response']).to.deep.equal([
            'Item one',
            'Item two',
          ])
        })

        it('should set correct amount of keys', function () {
          expect(Object.keys(response)).to.have.length(1)
        })
      })

      context('with any other value type', function () {
        beforeEach(function () {
          response = reduceResponsesToFormValues(
            {},
            {
              value: {
                option: 'Yes, I do',
                details: 'Lorem ipsum',
              },
              value_type: 'unknown',
              question: {
                key: 'unknown-response',
              },
            }
          )
        })

        it('should not set field', function () {
          expect(response).not.to.have.property('unknown-response')
        })

        it('should set correct amount of keys', function () {
          expect(Object.keys(response)).to.have.length(0)
        })
      })
    })
  })
})
