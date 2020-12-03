const helper = require('./map-question-to-response')

describe('Helpers', function () {
  describe('Frameworks Helpers', function () {
    describe('#mapQuestionToResponse', function () {
      const mockResponse = {
        foo: 'bar',
      }
      let response

      context('without options', function () {
        beforeEach(function () {
          response = helper()(mockResponse)
        })

        it('should append undefined question', function () {
          expect(response).to.deep.equal({
            _question: undefined,
            foo: 'bar',
          })
        })
      })

      context('with questions', function () {
        const mockQuestions = {
          'question-one': {
            id: 'question-one',
            question: 'What is life?',
          },
        }

        context('when question exists', function () {
          beforeEach(function () {
            response = helper({ questions: mockQuestions })({
              ...mockResponse,
              question: {
                key: 'question-one',
              },
            })
          })

          it('should append question', function () {
            expect(response).to.deep.equal({
              _question: {
                id: 'question-one',
                question: 'What is life?',
              },
              foo: 'bar',
              question: {
                key: 'question-one',
              },
            })
          })
        })

        context('when question does not exist', function () {
          beforeEach(function () {
            response = helper({ questions: mockQuestions })({
              ...mockResponse,
              question: {
                key: 'non-existent',
              },
            })
          })

          it('should append undefined question', function () {
            expect(response).to.deep.equal({
              _question: undefined,
              foo: 'bar',
              question: {
                key: 'non-existent',
              },
            })
          })
        })
      })
    })
  })
})
