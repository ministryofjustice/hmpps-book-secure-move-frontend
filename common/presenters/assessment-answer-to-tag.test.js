const proxyquire = require('proxyquire')
const { kebabCase } = require('lodash')

const assessmentAnswerToTag = proxyquire('./assessment-answer-to-tag', {
  '../../config': {
    TAG_CATEGORY_WHITELIST: {
      risk: {
        tagClass: 'app-tag--destructive',
        sortOrder: 1,
      },
      health: {
        tagClass: '',
        sortOrder: 2,
      },
    },
  },
})

describe('Presenters', function() {
  describe('#assessmentAnswerToTag()', function() {
    context('when category is in whitelist', function() {
      it('should return correct properties', function() {
        const mockAnswer = {
          title: 'Concealed items',
          category: 'risk',
        }
        const transformedResponse = assessmentAnswerToTag()(mockAnswer)

        expect(transformedResponse).to.deep.equal({
          href: `#${kebabCase(mockAnswer.title)}`,
          text: mockAnswer.title,
          classes: 'app-tag--destructive',
          sortOrder: 1,
        })
      })

      it('should return correct properties', function() {
        const mockAnswer = {
          title: 'Health issue',
          category: 'health',
        }
        const transformedResponse = assessmentAnswerToTag()(mockAnswer)

        expect(transformedResponse).to.deep.equal({
          href: `#${kebabCase(mockAnswer.title)}`,
          text: mockAnswer.title,
          classes: '',
          sortOrder: 2,
        })
      })
    })

    context('when category is not whitelist', function() {
      let transformedResponse, mockAnswer

      beforeEach(function() {
        mockAnswer = {
          title: 'Food allergy',
          category: 'invalid',
        }

        transformedResponse = assessmentAnswerToTag()(mockAnswer)
      })

      it('should return property defaults', function() {
        expect(transformedResponse).to.deep.equal({
          href: `#${kebabCase(mockAnswer.title)}`,
          text: mockAnswer.title,
          classes: 'app-tag--inactive',
          sortOrder: null,
        })
      })
    })

    context('with no href prefix', function() {
      let transformedResponse, mockAnswer

      beforeEach(function() {
        mockAnswer = {
          title: 'Food allergy',
          category: 'invalid',
        }

        transformedResponse = assessmentAnswerToTag()(mockAnswer)
      })

      it('should not return a href prefix', function() {
        expect(transformedResponse.href).to.equal(
          `#${kebabCase(mockAnswer.title)}`
        )
      })
    })

    context('with href prefix', function() {
      let transformedResponse, mockAnswer, mockPrefix

      beforeEach(function() {
        mockPrefix = '/move/123456789'
        mockAnswer = {
          title: 'Food allergy',
          category: 'invalid',
        }

        transformedResponse = assessmentAnswerToTag(mockPrefix)(mockAnswer)
      })

      it('should return a href prefix', function() {
        expect(transformedResponse.href).to.equal(
          `${mockPrefix}#${kebabCase(mockAnswer.title)}`
        )
      })
    })
  })
})
