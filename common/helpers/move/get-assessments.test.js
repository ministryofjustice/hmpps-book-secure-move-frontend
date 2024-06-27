const proxyquire = require('proxyquire').noCallThru()

const frameworkSectionToPanelList = sinon
  .stub()
  .returns(sinon.stub().returnsArg(0))
const assessmentAnswersByCategory = sinon.stub().returns([])
const assessmentCategoryToPanelComponent = sinon.stub().returnsArg(0)
const assessmentCategoryToSummaryListComponent = sinon.stub().returnsArg(0)
const presenters = {
  frameworkSectionToPanelList,
  assessmentAnswersByCategory,
  assessmentCategoryToPanelComponent,
  assessmentCategoryToSummaryListComponent,
}

const getMoveUrl = sinon.stub().returns('move-url')

const pathStubs = {
  '../../presenters': presenters,
  './get-move-url': getMoveUrl,
}

const getAssessments = proxyquire('./get-assessments', pathStubs)

const mockAssessmentAnswers = []
const mockAssessmentByCategory = [
  {
    key: 'risk',
    answers: [],
  },
  {
    key: 'health',
    answers: [],
  },
  {
    key: 'court',
    answers: [],
  },
]

const mockMove = {
  id: 'moveId',
  status: 'requested',
  profile: {
    assessment_answers: mockAssessmentAnswers,
  },
  documents: [],
  court_hearings: [
    {
      id: '1',
      start_time: '2020-10-20T13:00:00+00:00',
      case_number: 'T12345',
    },
    {
      id: '2',
      start_time: '2020-10-20T20:00:00+00:00',
      case_number: 'S12345',
    },
    {
      id: '3',
      start_time: '2020-10-20T09:00:00+00:00',
      case_number: 'S67890',
    },
    {
      id: '4',
      start_time: '2020-10-20T16:30:00+00:00',
      case_number: 'T001144',
    },
    {
      id: '5',
      start_time: '2020-10-20T11:20:00+00:00',
      case_number: 'T66992277',
    },
  ],
}

describe('Move helpers', function () {
  describe('#getAssessments()', function () {
    let assessments
    let move

    beforeEach(function () {
      getMoveUrl.resetHistory()
      frameworkSectionToPanelList.resetHistory()
      assessmentAnswersByCategory.resetHistory()
      assessmentCategoryToPanelComponent.resetHistory()
      assessmentCategoryToSummaryListComponent.resetHistory()

      move = {
        ...mockMove,
      }
    })

    context('by default', function () {
      beforeEach(function () {
        assessmentAnswersByCategory.returns(mockAssessmentByCategory)
        assessments = getAssessments(move)
      })

      it('should contain an assessmentSections param', function () {
        expect(assessments).to.have.property('assessmentSections')
      })

      it('should call assessmentAnswersByCategory presenter with correct args', function () {
        expect(assessmentAnswersByCategory).to.be.calledWithExactly(
          mockAssessmentAnswers
        )
      })

      it('should call assessmentCategoryToPanelComponent presenter with correct categories', function () {
        expect(assessmentCategoryToPanelComponent).to.be.calledTwice
        expect(assessmentCategoryToPanelComponent).to.be.calledWith(
          {
            answers: [],
            key: 'health',
          },
          1
        )
        expect(assessmentCategoryToPanelComponent).to.be.calledWith(
          {
            answers: [],
            key: 'risk',
          },
          0
        )
      })

      it('should contain assessment param', function () {
        expect(assessments).to.have.property('assessment')
        expect(assessments.assessment).to.deep.equal([
          {
            answers: [],
            key: 'risk',
          },
          {
            answers: [],
            key: 'health',
          },
        ])
      })

      it('should call assessmentCategoryToSummaryListComponent presenter with correct categories', function () {
        expect(assessmentCategoryToSummaryListComponent).to.be.calledOnce
        expect(assessmentCategoryToSummaryListComponent).to.be.calledWith(
          {
            answers: [],
            key: 'court',
          },
          0
        )
      })

      it('should contain court summary param', function () {
        expect(assessments).to.have.property('courtSummary')
        expect(assessments.courtSummary).to.deep.equal({
          key: 'court',
          answers: [],
        })
      })
    })

    context('with Youth Risk Assessment', function () {
      const mockYouthRiskAssessment = {
        sections: [
          { key: 'two', order: 2, youth: true },
          { key: 'one', order: 1, youth: true },
          { key: 'four', order: 4, youth: true },
          { key: 'five', order: 5, youth: true },
          { key: 'three', order: 3, youth: true },
          { key: 'six', order: 6, youth: true },
        ],
        id: '67890',
        status: 'in_progress',
        meta: {
          section_progress: {
            one: 'in_progress',
            two: 'completed',
          },
        },
        flags: [
          {
            id: '12345',
            type: 'framework_flags',
            title: 'Flag 1',
          },
          {
            id: '67890',
            type: 'framework_flags',
            title: 'Flag 2',
          },
          {
            id: 'abcde',
            type: 'framework_flags',
            title: 'Flag 3',
          },
        ],
      }

      beforeEach(function () {
        move = {
          ...move,
          profile: {
            id: '12345',
            youth_risk_assessment: mockYouthRiskAssessment,
            requires_youth_risk_assessment: true,
          },
        }
      })

      context('when record is in progress', function () {
        beforeEach(function () {
          assessments = getAssessments(move)
        })

        it('should contain a youthRiskAssessment', function () {
          expect(assessments).to.have.property('youthRiskAssessment')
          expect(assessments.youthRiskAssessment).to.deep.equal(
            mockYouthRiskAssessment
          )
        })

        it('should use youth risk assessment for sections', function () {
          expect(assessments).to.have.property('assessmentSections')
          expect(assessments.assessmentSections).to.deep.equal([
            { key: 'one', order: 1, youth: true },
            { key: 'two', order: 2, youth: true },
            { key: 'three', order: 3, youth: true },
            { key: 'four', order: 4, youth: true },
            { key: 'five', order: 5, youth: true },
            { key: 'six', order: 6, youth: true },
          ])
        })
      })

      context('when record is confirmed', function () {
        beforeEach(function () {
          move.profile.youth_risk_assessment = {
            ...mockYouthRiskAssessment,
            status: 'confirmed',
          }
          assessments = getAssessments(move)
        })

        it('should contain a youthRiskAssessment', function () {
          expect(assessments).to.have.property('youthRiskAssessment')
          expect(assessments.youthRiskAssessment).to.deep.equal({
            ...mockYouthRiskAssessment,
            status: 'confirmed',
          })
        })

        it('should use youth risk assessment for sections', function () {
          expect(assessments).to.have.property('assessmentSections')
          expect(assessments.assessmentSections).to.deep.equal([
            { key: 'one', order: 1, youth: true },
            { key: 'two', order: 2, youth: true },
            { key: 'three', order: 3, youth: true },
            { key: 'four', order: 4, youth: true },
            { key: 'five', order: 5, youth: true },
            { key: 'six', order: 6, youth: true },
          ])
        })
      })

      context('when person escort record exists', function () {
        beforeEach(function () {
          move.profile.youth_risk_assessment = {
            ...mockYouthRiskAssessment,
            status: 'confirmed',
          }
          move.profile.person_escort_record = {
            ...mockYouthRiskAssessment,
            sections: [
              { key: 'one', order: 1 },
              { key: 'three', order: 3 },
              { key: 'two', order: 2 },
            ],
          }
          assessments = getAssessments(move)
        })

        it('should contain a youthRiskAssessment', function () {
          expect(assessments).to.have.property('youthRiskAssessment')
          expect(assessments.youthRiskAssessment).to.deep.equal({
            ...mockYouthRiskAssessment,
            status: 'confirmed',
          })
        })

        it('should merge assessment sections', function () {
          expect(assessments).to.have.property('assessmentSections')
          expect(assessments.assessmentSections).to.deep.equal([
            {
              key: 'one',
              order: 1,
              previousAssessment: {
                key: 'one',
                order: 1,
                youth: true,
              },
            },
            {
              key: 'two',
              order: 2,
              previousAssessment: {
                key: 'two',
                order: 2,
                youth: true,
              },
            },
            {
              key: 'three',
              order: 3,
              previousAssessment: {
                key: 'three',
                order: 3,
                youth: true,
              },
            },
            {
              key: 'four',
              order: 4,
              youth: true,
            },
            {
              key: 'five',
              order: 5,
              youth: true,
            },
            {
              key: 'six',
              order: 6,
              youth: true,
            },
          ])
        })
      })
    })

    context('when move doesn’t have a profile', function () {
      let assessments

      beforeEach(function () {
        assessmentAnswersByCategory.resetHistory()
        assessmentAnswersByCategory.returns([])
        move = {
          ...mockMove,
          profile: undefined,
        }

        assessments = getAssessments(move)
      })

      it('should call assessmentAnswersByCategory presenter with empty array', function () {
        expect(assessmentAnswersByCategory).to.be.calledWithExactly([])
      })

      it('should contain assessment param as empty array', function () {
        expect(assessments).to.have.property('assessment')
        expect(assessments.assessment).to.deep.equal([])
      })

      it('should contain courtSummary param as undefined', function () {
        expect(assessments).to.have.property('courtSummary')
        expect(assessments.courtSummary).to.be.undefined
      })
    })
  })
})
