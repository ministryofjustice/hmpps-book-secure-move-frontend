const helper = require('./map-item-to-section')

describe('Helpers', function () {
  describe('Frameworks Helpers', function () {
    describe('#mapItemToSection', function () {
      const mockSection = {
        foo: 'bar',
        key: 'section-one',
      }
      let output

      context('without item', function () {
        beforeEach(function () {
          output = helper()(mockSection)
        })

        it('should append default values', function () {
          expect(output).to.deep.equal({
            foo: 'bar',
            key: 'section-one',
            progress: undefined,
            questions: {},
            responses: [],
          })
        })
      })

      context('with item', function () {
        const mockItem = {
          meta: {
            section_progress: [
              {
                key: 'section-one',
                status: 'completed',
              },
              {
                key: 'section-two',
                status: 'completed',
              },
            ],
          },
          responses: [
            {
              _question: {
                name: 'question-one',
                description: 'question-one',
              },
              question: {
                section: 'section-one',
              },
            },
            {
              _question: {
                name: 'question-two',
                description: 'question-two',
              },
              question: {
                section: 'section-one',
              },
            },
            {
              _question: {
                name: 'question-three',
                description: 'question-three',
              },
              question: {
                section: 'section-two',
              },
            },
            {
              _question: {
                name: 'question-four',
                description: 'question-four',
              },
              question: {
                section: 'section-two',
              },
            },
          ],
        }

        context('with section key', function () {
          beforeEach(function () {
            output = helper(mockItem)({
              ...mockSection,
              key: 'section-one',
            })
          })

          it('should append correct number of keys', function () {
            expect(Object.keys(output)).to.have.length(5)
          })

          it('should append responses for this section', function () {
            expect(output.responses).to.deep.equal([
              {
                _question: {
                  name: 'question-one',
                  description: 'question-one',
                },
                question: {
                  section: 'section-one',
                },
              },
              {
                _question: {
                  name: 'question-two',
                  description: 'question-two',
                },
                question: {
                  section: 'section-one',
                },
              },
            ])
          })

          it('should append questions for this section', function () {
            expect(output.questions).to.deep.equal({
              'question-one': {
                name: 'question-one',
                description: 'question-one',
              },
              'question-two': {
                name: 'question-two',
                description: 'question-two',
              },
            })
          })

          it('should append progress for this section', function () {
            expect(output.progress).to.equal('completed')
          })
        })

        context('when question does not exist', function () {
          beforeEach(function () {
            output = helper(mockItem)({
              ...mockSection,
              key: 'non-existent',
            })
          })

          it('should append correct number of keys', function () {
            expect(Object.keys(output)).to.have.length(5)
          })

          it('should not append responses for this section', function () {
            expect(output.responses).to.deep.equal([])
          })

          it('should not append any questions for this section', function () {
            expect(output.questions).to.deep.equal({})
          })

          it('should not append progress for this section', function () {
            expect(output.progress).to.equal(undefined)
          })
        })
      })
    })
  })
})
