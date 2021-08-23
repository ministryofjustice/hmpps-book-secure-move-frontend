const { groupBy } = require('lodash')
const proxyquire = require('proxyquire')

const assessmentAnswersToMetaListComponentStub = sinon.stub().returnsArg(0)
const componentService = require('../services/component')
const assessmentCategoryToPanelListComponent = proxyquire(
  './assessment-category-to-panel-component',
  {
    './assessment-answers-to-meta-list-component':
      assessmentAnswersToMetaListComponentStub,
  }
)

describe('Presenters', function () {
  describe('#assessmentCategorytoPanelComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      sinon.stub(componentService, 'getComponent').returnsArg(0)
      assessmentAnswersToMetaListComponentStub.resetHistory()
    })

    context('with default assessment answer', function () {
      const mockAssessmentCategory = {
        key: 'risk',
        sortOrder: 1,
        tagClass: 'risk-tag-class',
        answers: [
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            comments: 'Lorem ipsum dolor sit amet.',
            key: 'violent',
            title: 'Violent',
          },
          {
            assessment_question_id: 'bafcde0b-46e9-44b2-ad20-de3644256a42',
            category: 'risk',
            comments:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            key: 'escape',
            title: 'Escape risk',
          },
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            comments: null,
            key: 'violent',
            title: 'Violent',
          },
          {
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            category: 'risk',
            comments: null,
            key: 'violent',
            title: 'Self-harm',
          },
        ],
      }

      beforeEach(function () {
        transformedResponse = assessmentCategoryToPanelListComponent(
          mockAssessmentCategory
        )
      })

      it('should include correct keys', function () {
        expect(Object.keys(transformedResponse)).to.deep.equal([
          'key',
          'sortOrder',
          'tagClass',
          'answers',
          'count',
          'panels',
        ])
      })

      it('should create count of answers', function () {
        expect(transformedResponse.count).to.equal(
          mockAssessmentCategory.answers.length
        )
      })

      it('should transform answers by title', function () {
        const groupedByTitle = groupBy(mockAssessmentCategory.answers, 'title')

        for (const group in groupedByTitle) {
          expect(
            assessmentAnswersToMetaListComponentStub
          ).to.have.been.calledWith(groupedByTitle[group])
        }
      })

      it('should transform answers correct number of times', function () {
        expect(assessmentAnswersToMetaListComponentStub.callCount).to.equal(3)
      })

      it('should call metaList component correct number of items', function () {
        expect(componentService.getComponent.callCount).to.equal(3)
      })

      it('should correctly format and sort panels', function () {
        expect(transformedResponse).to.contain.property('panels')
        expect(transformedResponse.panels).to.deep.equal([
          {
            attributes: {
              id: 'escape-risk',
            },
            tag: {
              text: 'Escape risk',
              classes: mockAssessmentCategory.tagClass,
            },
            html: 'appMetaList',
            isFocusable: true,
          },
          {
            attributes: {
              id: 'self-harm',
            },
            tag: {
              text: 'Self-harm',
              classes: mockAssessmentCategory.tagClass,
            },
            html: 'appMetaList',
            isFocusable: true,
          },
          {
            attributes: {
              id: 'violent',
            },
            tag: {
              text: 'Violent',
              classes: mockAssessmentCategory.tagClass,
            },
            html: 'appMetaList',
            isFocusable: true,
          },
        ])
      })
    })
  })
})
