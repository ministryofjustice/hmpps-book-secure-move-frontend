const { groupBy } = require('lodash')
const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n').default
const componentService = require('../services/component')

const assessmentAnswersToMetaListComponentStub = sinon.stub().returnsArg(0)

const assessmentCategoryToSummaryListComponent = proxyquire(
  './assessment-category-to-summary-list-component',
  {
    './assessment-answers-to-meta-list-component':
      assessmentAnswersToMetaListComponentStub,
  }
)

describe('Presenters', function () {
  describe('#assessmentCategoryToSummaryListComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
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
        transformedResponse = assessmentCategoryToSummaryListComponent(
          mockAssessmentCategory
        )
      })

      describe('response', function () {
        it('should include correct keys', function () {
          expect(Object.keys(transformedResponse)).to.deep.equal([
            'key',
            'sortOrder',
            'tagClass',
            'answers',
            'heading',
            'count',
            'rows',
          ])
        })

        it('should create count of answers', function () {
          expect(transformedResponse.count).to.equal(
            mockAssessmentCategory.answers.length
          )
        })

        it('should set heading property', function () {
          expect(transformedResponse.heading).to.equal(
            'assessment::heading.text'
          )

          expect(i18n.t).to.be.calledWithExactly('assessment::heading.text', {
            context: mockAssessmentCategory.key,
          })
        })

        it('should transform answers by title', function () {
          const groupedByTitle = groupBy(
            mockAssessmentCategory.answers,
            'title'
          )

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

        it('should correctly format and sort rows', function () {
          expect(transformedResponse.rows).to.deep.equal([
            {
              key: {
                classes: 'govuk-!-font-size-16',
                text: 'Escape risk',
              },
              value: { html: 'appMetaList' },
            },
            {
              key: {
                classes: 'govuk-!-font-size-16',
                text: 'Self-harm',
              },
              value: { html: 'appMetaList' },
            },
            {
              key: {
                classes: 'govuk-!-font-size-16',
                text: 'Violent',
              },
              value: { html: 'appMetaList' },
            },
          ])
        })
      })
    })

    context('when called with empty arguments', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = assessmentCategoryToSummaryListComponent()
      })

      describe('response', function () {
        describe('response', function () {
          it('should return empty rows', function () {
            expect(transformedResponse).to.have.property('rows')
            expect(transformedResponse.rows.length).to.equal(0)
          })

          it('should return empty array', function () {
            expect(transformedResponse.rows).to.deep.equal([])
          })
        })
      })
    })
  })
})
