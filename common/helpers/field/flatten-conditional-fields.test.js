const flattenConditionalFields = require('./flatten-conditional-fields')

describe('Field helpers', function () {
  describe('#flattenConditionalFields()', function () {
    context('when field does not have items', function () {
      it('should return original field', function () {
        const field = ['court', { name: 'court' }]
        const response = flattenConditionalFields(field)

        expect(response).to.deep.equal(['court', { name: 'court' }])
      })
    })

    context('when field has items', function () {
      context('with no conditional items', function () {
        it('should return original field', function () {
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
          const response = flattenConditionalFields(field)

          expect(response).to.deep.equal([
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
          ])
        })
      })

      context('with conditional items', function () {
        context('when conditional is a string', function () {
          it('should return original field', function () {
            const field = [
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: 'conditional-one',
                  },
                ],
              },
            ]
            const response = flattenConditionalFields(field)

            expect(response).to.deep.equal([
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditional-one'],
                  },
                ],
              },
            ])
          })
        })

        context('when conditional is an object', function () {
          it('should flatten conditional', function () {
            const field = [
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: {
                      name: 'conditional-obj',
                      id: 'conditional-obj',
                    },
                  },
                ],
              },
            ]
            const response = flattenConditionalFields(field)

            expect(response).to.deep.equal([
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditional-obj'],
                  },
                ],
              },
            ])
          })
        })

        context('when conditionals is an array', function () {
          it('should flatten conditionals', function () {
            const field = [
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: [
                      'conditional-string',
                      {
                        name: 'conditional-obj',
                        id: 'conditional-obj',
                      },
                    ],
                  },
                ],
              },
            ]
            const response = flattenConditionalFields(field)

            expect(response).to.deep.equal([
              'court',
              {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditional-string', 'conditional-obj'],
                  },
                ],
              },
            ])
          })
        })
      })
    })
  })
})
