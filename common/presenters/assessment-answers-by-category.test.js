const proxyquire = require('proxyquire')

const referenceDataHelpers = require('../helpers/reference-data')

const assessmentAnswersByCategory = proxyquire(
  './assessment-answers-by-category',
  {
    '../../config': {
      ASSESSMENT_ANSWERS_CATEGORY_SETTINGS: {
        health: {
          tagClass: '',
          sortOrder: 2,
        },
        risk: {
          tagClass: 'app-tag--destructive',
          sortOrder: 1,
        },
      },
    },
  }
)

describe('Presenters', function () {
  describe('#assessmentAnswersByCategory()', function () {
    let transformedResponse

    beforeEach(function () {
      sinon.stub(referenceDataHelpers, 'filterExpired').returnsArg(0)
    })

    context('when answers exist for categories', function () {
      const mockAnswers = [
        {
          title: 'Violent',
          category: 'risk',
        },
        {
          title: 'Escape',
          category: 'risk',
        },
        {
          title: 'Must be held separately',
          category: 'risk',
        },
        {
          title: 'Medication',
          category: 'health',
        },
        {
          title: 'Solicitor or other legal representation',
          category: 'court',
        },
      ]

      beforeEach(function () {
        transformedResponse = assessmentAnswersByCategory(mockAnswers)
      })

      it('should return the correct number of categories', function () {
        expect(transformedResponse.length).to.equal(2)
      })

      it('should correctly order categories', function () {
        const keys = transformedResponse.map(it => it.key)
        expect(keys).to.deep.equal(['risk', 'health'])
      })

      it('should contain correct number of answers', function () {
        expect(Object.keys(transformedResponse[0].answers)).to.have.length(3)
        expect(Object.keys(transformedResponse[1].answers)).to.have.length(1)
      })

      it('should include category params', function () {
        transformedResponse.forEach(it => {
          expect(Object.keys(it)).to.have.length(4)
          expect(Object.keys(it)).to.deep.equal([
            'tagClass',
            'sortOrder',
            'answers',
            'key',
          ])
        })
      })

      it('should call expiry filter on all answers', function () {
        expect(referenceDataHelpers.filterExpired.callCount).to.equal(4)
      })
    })

    context('when no answers exist for categories', function () {
      beforeEach(function () {
        transformedResponse = assessmentAnswersByCategory([])
      })

      it('should return the correct number of categories', function () {
        expect(transformedResponse.length).to.equal(2)
      })

      it('should correctly order categories', function () {
        const keys = transformedResponse.map(it => it.key)
        expect(keys).to.deep.equal(['risk', 'health'])
      })

      it('should contain empty answers for each', function () {
        transformedResponse.forEach(it => {
          expect(it.answers).to.have.length(0)
        })
      })
    })

    context('when called with no arguments', function () {
      beforeEach(function () {
        transformedResponse = assessmentAnswersByCategory()
      })

      it('should return the correct number of categories', function () {
        expect(transformedResponse.length).to.equal(2)
      })

      it('should correctly order categories', function () {
        const keys = transformedResponse.map(it => it.key)
        expect(keys).to.deep.equal(['risk', 'health'])
      })

      it('should contain empty answers for each', function () {
        transformedResponse.forEach(it => {
          expect(it.answers).to.have.length(0)
        })
      })
    })
  })
})
