const reduceDependentFields = require('./reduce-dependent-fields')

describe('Field helpers', function () {
  describe('#reduceDependentFields', function () {
    const mockAccumulator = {
      foo: {
        name: 'foo',
      },
    }
    const mockAllFields = {
      conditionalField1: {
        name: 'conditionalField1',
      },
      conditionalField2: {
        name: 'conditionalField2',
      },
    }

    context('when field does not have items', function () {
      it('should not add to accumulator', function () {
        const field = ['court', { name: 'court' }]
        const response = reduceDependentFields()(mockAccumulator, field)

        expect(response).to.deep.equal(mockAccumulator)
      })
    })

    context('when field has items', function () {
      context('with no conditional values', function () {
        it('should not add to accumulator', function () {
          const field = [
            'court',
            {
              name: 'options-field',
              items: [
                {
                  label: 'Item one',
                  value: 'item-one',
                },
              ],
            },
          ]
          const response = reduceDependentFields()(mockAccumulator, field)

          expect(response).to.deep.equal(mockAccumulator)
        })
      })

      context('when conditional is a string', function () {
        const field = [
          'court',
          {
            name: 'options-field',
            items: [
              {
                label: 'Item one',
                value: 'item-one',
                conditional: 'conditionalField1',
              },
            ],
          },
        ]

        context('when conditional field does not exist', function () {
          it('should not add to accumulator', function () {
            const response = reduceDependentFields()(mockAccumulator, field)

            expect(response).to.deep.equal(mockAccumulator)
          })
        })

        context('when conditional field exists', function () {
          it('should add to accumulator', function () {
            const response = reduceDependentFields(mockAllFields)(
              mockAccumulator,
              field
            )

            expect(response).to.deep.equal({
              ...mockAccumulator,
              conditionalField1: {
                id: 'conditionalField1',
                name: 'conditionalField1',
                skip: true,
                dependent: {
                  field: 'court',
                  value: 'item-one',
                },
              },
            })
          })
        })
      })

      context('when conditional is an array', function () {
        const field = [
          'court',
          {
            name: 'options-field',
            items: [
              {
                label: 'Item one',
                value: 'item-one',
                conditional: ['conditionalField1', 'conditionalField2'],
              },
            ],
          },
        ]

        context('when conditional fields do not exist', function () {
          it('should not add to accumulator', function () {
            const response = reduceDependentFields()(mockAccumulator, field)

            expect(response).to.deep.equal(mockAccumulator)
          })
        })

        context('when conditional field exists', function () {
          it('should add to accumulator', function () {
            const response = reduceDependentFields(mockAllFields)(
              mockAccumulator,
              field
            )

            expect(response).to.deep.equal({
              ...mockAccumulator,
              conditionalField1: {
                id: 'conditionalField1',
                name: 'conditionalField1',
                skip: true,
                dependent: {
                  field: 'court',
                  value: 'item-one',
                },
              },
              conditionalField2: {
                id: 'conditionalField2',
                name: 'conditionalField2',
                skip: true,
                dependent: {
                  field: 'court',
                  value: 'item-one',
                },
              },
            })
          })
        })
      })
    })
  })
})
