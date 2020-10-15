const helper = require('./set-validation-rules')

describe('Framework helpers', function () {
  describe('#setValidationRules', function () {
    context('with no responses', function () {
      it('should return original item', function () {
        const mockField = ['mock-field', { foo: 'bar' }]
        const output = helper()(mockField)

        expect(output).to.deep.equal(['mock-field', { foo: 'bar' }])
      })
    })

    context('with responses', function () {
      let output
      const mockResponses = [
        {
          id: '1',
          question: {
            key: 'violent-or-dangerous',
          },
        },
      ]

      context('without parent response', function () {
        const mockField = ['mock-field', { foo: 'bar' }]

        beforeEach(function () {
          output = helper(mockResponses)(mockField)
        })

        it('should return original field', function () {
          expect(output).to.deep.equal(['mock-field', { foo: 'bar' }])
        })
      })

      context('with parent response', function () {
        const mockField = [
          'mock-field',
          {
            label: {
              text: 'Please answer this question',
            },
            dependentQuestionKey: 'violent-or-dangerous',
            validate: [
              {
                type: 'custom_validation',
                message: 'Fix custom validation',
              },
              {
                type: 'required_unless_nomis_mappings',
                message: 'Fix required validation',
              },
            ],
          },
        ]

        context('without NOMIS mappings', function () {
          beforeEach(function () {
            output = helper(mockResponses)(mockField)
          })

          it('should update validation', function () {
            expect(output).to.deep.equal([
              'mock-field',
              {
                label: {
                  text: 'Please answer this question',
                },
                dependentQuestionKey: 'violent-or-dangerous',
                validate: [
                  {
                    type: 'custom_validation',
                    message: 'Fix custom validation',
                  },
                  {
                    type: 'required',
                    message: 'Fix required validation',
                  },
                ],
              },
            ])
          })
        })

        context('with empty NOMIS mappings', function () {
          beforeEach(function () {
            output = helper([{ ...mockResponses[0], nomis_mappings: [] }])(
              mockField
            )
          })

          it('should update validation', function () {
            expect(output).to.deep.equal([
              'mock-field',
              {
                label: {
                  text: 'Please answer this question',
                },
                dependentQuestionKey: 'violent-or-dangerous',
                validate: [
                  {
                    type: 'custom_validation',
                    message: 'Fix custom validation',
                  },
                  {
                    type: 'required',
                    message: 'Fix required validation',
                  },
                ],
              },
            ])
          })
        })

        context('with NOMIS mappings', function () {
          beforeEach(function () {
            output = helper([
              { ...mockResponses[0], nomis_mappings: [{ foo: 'bar' }] },
            ])(mockField)
          })

          it('should remove required validation', function () {
            expect(output[1].validate).to.deep.equal([
              {
                type: 'custom_validation',
                message: 'Fix custom validation',
              },
            ])
          })

          it('should append optional to label', function () {
            expect(output[1].label).to.deep.equal({
              text: 'Please answer this question (optional)',
            })
          })

          it('should not mutate field', function () {
            expect(output).to.deep.equal([
              'mock-field',
              {
                label: {
                  text: 'Please answer this question (optional)',
                },
                dependentQuestionKey: 'violent-or-dangerous',
                validate: [
                  {
                    type: 'custom_validation',
                    message: 'Fix custom validation',
                  },
                ],
              },
            ])
          })
        })

        context('without validations', function () {
          const mockFieldWithoutValidations = [
            'mock-field',
            {
              label: {
                text: 'Please answer this question',
              },
              dependentQuestionKey: 'violent-or-dangerous',
            },
          ]
          context('without NOMIS mappings', function () {
            beforeEach(function () {
              output = helper([{ ...mockResponses[0], nomis_mappings: [] }])(
                mockFieldWithoutValidations
              )
            })

            it('should not add validations', function () {
              expect(output).to.deep.equal([
                'mock-field',
                {
                  label: {
                    text: 'Please answer this question',
                  },
                  dependentQuestionKey: 'violent-or-dangerous',
                },
              ])
            })
          })

          context('with NOMIS mappings', function () {
            beforeEach(function () {
              output = helper([
                { ...mockResponses[0], nomis_mappings: [{ foo: 'bar' }] },
              ])(mockFieldWithoutValidations)
            })

            it('should not update label', function () {
              expect(output[1].label).to.deep.equal({
                text: 'Please answer this question',
              })
            })

            it('should not add validations', function () {
              expect(output).to.deep.equal([
                'mock-field',
                {
                  label: {
                    text: 'Please answer this question',
                  },
                  dependentQuestionKey: 'violent-or-dangerous',
                },
              ])
            })
          })
        })
      })
    })
  })
})
