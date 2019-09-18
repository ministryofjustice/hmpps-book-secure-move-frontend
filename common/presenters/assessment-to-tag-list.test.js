const proxyquire = require('proxyquire')

const mockWhitelist = {
  whitelisted: {
    tagClass: 'app-tag--destructive',
    sortOrder: 1,
  },
  whitelisted_other: {
    tagClass: '',
    sortOrder: 2,
  },
}

describe('Presenters', function() {
  describe('#assessmentToTagList()', function() {
    let assessmentToTagList, answerToTagStub, filterExpiredStub, mapStub

    beforeEach(function() {
      answerToTagStub = sinon.stub()
      filterExpiredStub = sinon.stub()
      mapStub = sinon.stub().returnsArg(0)
      assessmentToTagList = proxyquire('./assessment-to-tag-list', {
        '../../config': {
          TAG_CATEGORY_WHITELIST: mockWhitelist,
        },
        '../../common/helpers/reference-data': {
          filterExpired: filterExpiredStub.returnsArg(0),
        },
        './assessment-answer-to-tag': answerToTagStub.returns(mapStub),
      })
    })

    context('when category is in whitelist', function() {
      it('should not filter it out', function() {
        const mockAnswers = [
          {
            key: 'health_issue',
            title: 'Health issue',
            assessment_question_id: '394d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted',
          },
        ]
        const response = assessmentToTagList(mockAnswers)

        expect(response).to.deep.equal(mockAnswers)
      })

      it('should not filter it out', function() {
        const mockAnswers = [
          {
            key: 'escape',
            title: 'Escape risk',
            assessment_question_id: '195d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted_other',
          },
        ]
        const response = assessmentToTagList(mockAnswers)

        expect(response).to.deep.equal(mockAnswers)
      })

      it('should remove duplicate titles', function() {
        const mockAnswers = [
          {
            key: 'escape',
            title: 'Escape risk',
            assessment_question_id: '195d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted_other',
          },
          {
            key: 'escape',
            title: 'Escape risk',
            assessment_question_id: '195d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted_other',
          },
          {
            key: 'health_issue',
            title: 'Health issue',
            assessment_question_id: '394d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted',
          },
          {
            key: 'escape',
            title: 'Escape risk',
            assessment_question_id: '195d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted_other',
          },
        ]
        const response = assessmentToTagList(mockAnswers)

        expect(response).to.deep.equal([
          {
            key: 'escape',
            title: 'Escape risk',
            assessment_question_id: '195d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted_other',
          },
          {
            key: 'health_issue',
            title: 'Health issue',
            assessment_question_id: '394d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted',
          },
        ])
      })

      it('should call expired filter', function() {
        const mockAnswers = [
          {
            key: 'escape',
            title: 'Escape risk',
            assessment_question_id: '195d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'whitelisted_other',
          },
        ]
        assessmentToTagList(mockAnswers)

        expect(filterExpiredStub).to.be.calledOnce
      })
    })

    context('when category is not whitelist', function() {
      it('should filter it out', function() {
        const mockAnswers = [
          {
            key: 'escape',
            title: 'Escape risk',
            assessment_question_id: '195d3f05-4d25-43ef-8e7e-6d3a0e742888',
            category: 'invalid_category',
          },
        ]
        const response = assessmentToTagList(mockAnswers)

        expect(response).to.deep.equal([])
      })
    })

    context('when href prefix is not included', function() {
      it('should call assessmentAnswerToTag with default value', function() {
        assessmentToTagList([])
        expect(answerToTagStub).to.be.calledWith('')
      })
    })

    context('when href prefix is included', function() {
      it('should call assessmentAnswerToTag with default value', function() {
        const mockPrefix = '/prefix'
        assessmentToTagList([], mockPrefix)

        expect(answerToTagStub).to.be.calledWith(mockPrefix)
      })
    })
  })
})
