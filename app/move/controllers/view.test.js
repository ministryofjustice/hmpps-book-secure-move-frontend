const proxyquire = require('proxyquire').noCallThru()

const permissionsMiddleware = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')

const getUpdateUrls = sinon.stub()
const getUpdateLinks = sinon.stub()

const updateSteps = []
const frameworkStub = {
  sections: [{ id: 'one' }],
}
const pathStubs = {
  '../../../config': {
    FEATURE_FLAGS: {
      PERSON_ESCORT_RECORD: true,
    },
  },
  '../steps/update': updateSteps,
  './view/view.update.urls': getUpdateUrls,
  './view/view.update.links': getUpdateLinks,
  '../../../common/services/frameworks': {
    getPersonEscortRecord: () => frameworkStub,
  },
}
const controller = proxyquire('./view', pathStubs)

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

const mockUrls = {
  somewhere: '/somewhere',
}
const mockUpdateLinks = {
  somewhere: {
    attributes: {
      'data-update-link': 'somewhere',
    },
    category: 'somewhere',
    html: 'Update somewhere',
    url: '/somewhere',
  },
}
const mockOriginalUrl = '/url-to-move'

getUpdateUrls.returns(mockUrls)
getUpdateLinks.returns(mockUpdateLinks)

describe('Move controllers', function () {
  describe('#view()', function () {
    let req, res, params
    const userPermissions = ['permA']

    beforeEach(function () {
      getUpdateUrls.resetHistory()
      getUpdateLinks.resetHistory()
      sinon.stub(permissionsMiddleware, 'check').returns(true)
      sinon
        .stub(presenters, 'moveToMetaListComponent')
        .returns('__moveToMetaListComponent__')
      sinon
        .stub(presenters, 'frameworkToTaskListComponent')
        .returns('__frameworkToTaskListComponent__')
      sinon
        .stub(presenters, 'frameworkFlagsToTagList')
        .returns('__frameworkFlagsToTagList__')
      sinon
        .stub(presenters, 'frameworkSectionToPanelList')
        .returns(sinon.stub().returns({}))
      sinon.stub(presenters, 'personToSummaryListComponent').returnsArg(0)
      sinon.stub(presenters, 'assessmentToTagList').returnsArg(0)
      sinon.stub(presenters, 'assessmentAnswersByCategory').returns([])
      sinon.stub(presenters, 'assessmentCategoryToPanelComponent').returnsArg(0)
      sinon
        .stub(presenters, 'assessmentCategoryToSummaryListComponent')
        .returnsArg(0)
      sinon
        .stub(presenters, 'courtHearingToSummaryListComponent')
        .callsFake(hearing => `summaryList__${hearing.id}`)

      req = {
        t: sinon.stub().returnsArg(0),
        session: {
          user: {
            permissions: userPermissions,
          },
        },
        move: mockMove,
        originalUrl: mockOriginalUrl,
      }
      res = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(function () {
        presenters.assessmentAnswersByCategory.returns(mockAssessmentByCategory)
        controller(req, res)
        params = res.render.args[0][1]
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })

      it('should pass correct number of locals to template', function () {
        expect(Object.keys(res.render.args[0][1])).to.have.length(21)
      })

      it('should call moveToMetaListComponent presenter with correct args', function () {
        expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
          mockMove,
          mockUpdateLinks
        )
      })

      it('should call frameworkToTaskListComponent presenter with correct args', function () {
        expect(
          presenters.frameworkToTaskListComponent
        ).to.be.calledOnceWithExactly({
          baseUrl: `${mockOriginalUrl}/person-escort-record/`,
          frameworkSections: frameworkStub.sections,
          sectionProgress: undefined,
        })
      })

      it('should contain a move param', function () {
        expect(params).to.have.property('move')
        expect(params.move).to.deep.equal(mockMove)
      })

      it('should contain a personEscortRecord param', function () {
        expect(params).to.have.property('personEscortRecord')
        expect(params.personEscortRecord).to.be.undefined
      })

      it('should contain a personEscortRecordIsEnabled param', function () {
        expect(params).to.have.property('personEscortRecordIsEnabled')
        expect(params.personEscortRecordIsEnabled).to.be.true
      })

      it('should contain a personEscortRecordIsConfirmed param', function () {
        expect(params).to.have.property('personEscortRecordIsConfirmed')
        expect(params.personEscortRecordIsCompleted).to.be.false
      })

      it('should contain a personEscortRecordIsCompleted param', function () {
        expect(params).to.have.property('personEscortRecordIsCompleted')
        expect(params.personEscortRecordIsCompleted).to.be.false
      })

      it('should contain a personEscortRecordUrl param', function () {
        expect(params).to.have.property('personEscortRecordUrl')
        expect(params.personEscortRecordUrl).to.equal(
          `${mockOriginalUrl}/person-escort-record`
        )
      })

      it('should contain a showPersonEscortRecordBanner param', function () {
        expect(params).to.have.property('showPersonEscortRecordBanner')
        expect(params.showPersonEscortRecordBanner).to.be.false
      })

      it('should contain a personEscortRecordtaskList param', function () {
        expect(params).to.have.property('personEscortRecordtaskList')
        expect(params.personEscortRecordtaskList).to.equal(
          '__frameworkToTaskListComponent__'
        )
      })

      it('should contain a personEscortRecordTagList param', function () {
        expect(params).to.have.property('personEscortRecordTagList')
        expect(params.personEscortRecordTagList).to.equal(
          '__frameworkFlagsToTagList__'
        )
      })

      it('should contain a assessmentSections param', function () {
        expect(params).to.have.property('assessmentSections')
      })

      it('should contain a move summary param', function () {
        expect(params).to.have.property('moveSummary')
        expect(params.moveSummary).to.equal('__moveToMetaListComponent__')
      })

      it('should call personToSummaryListComponent presenter with correct args', function () {
        expect(
          presenters.personToSummaryListComponent
        ).to.be.calledOnceWithExactly(mockMove.person)
      })

      it('should contain personal details summary param', function () {
        expect(params).to.have.property('personalDetailsSummary')
        expect(params.personalDetailsSummary).to.equal(mockMove.person)
      })

      it('should call assessmentToTagList presenter with correct args', function () {
        expect(presenters.assessmentToTagList).to.be.calledOnceWithExactly(
          mockAssessmentAnswers
        )
      })

      it('should contain tag list param', function () {
        expect(params).to.have.property('tagList')
        expect(params.tagList).to.equal(mockAssessmentAnswers)
      })

      it('should call assessmentAnswersByCategory presenter with correct args', function () {
        expect(presenters.assessmentAnswersByCategory).to.be.calledWithExactly(
          mockAssessmentAnswers
        )
      })

      it('should call assessmentCategoryToPanelComponent presenter with correct categories', function () {
        expect(presenters.assessmentCategoryToPanelComponent).to.be.calledTwice
        expect(presenters.assessmentCategoryToPanelComponent).to.be.calledWith(
          {
            answers: [],
            key: 'health',
          },
          1
        )
        expect(presenters.assessmentCategoryToPanelComponent).to.be.calledWith(
          {
            answers: [],
            key: 'risk',
          },
          0
        )
      })

      it('should contain assessment param', function () {
        expect(params).to.have.property('assessment')
        expect(params.assessment).to.deep.equal([
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
        expect(
          presenters.assessmentCategoryToSummaryListComponent
        ).to.be.calledOnce
        expect(
          presenters.assessmentCategoryToSummaryListComponent
        ).to.be.calledWith(
          {
            answers: [],
            key: 'court',
          },
          0
        )
      })

      it('should contain court summary param', function () {
        expect(params).to.have.property('courtSummary')
        expect(params.courtSummary).to.deep.equal({
          key: 'court',
          answers: [],
        })
      })

      it('should contain court hearings param', function () {
        expect(params).to.have.property('courtHearings')
      })

      it('should order court hearings by start time', function () {
        expect(params.courtHearings).to.deep.equal([
          {
            id: '3',
            start_time: '2020-10-20T09:00:00+00:00',
            case_number: 'S67890',
            summaryList: 'summaryList__3',
          },
          {
            id: '5',
            start_time: '2020-10-20T11:20:00+00:00',
            case_number: 'T66992277',
            summaryList: 'summaryList__5',
          },
          {
            id: '1',
            start_time: '2020-10-20T13:00:00+00:00',
            case_number: 'T12345',
            summaryList: 'summaryList__1',
          },
          {
            id: '4',
            start_time: '2020-10-20T16:30:00+00:00',
            case_number: 'T001144',
            summaryList: 'summaryList__4',
          },
          {
            id: '2',
            start_time: '2020-10-20T20:00:00+00:00',
            case_number: 'S12345',
            summaryList: 'summaryList__2',
          },
        ])
      })

      it('should call courtHearingToSummaryListComponent for each hearing', function () {
        expect(presenters.courtHearingToSummaryListComponent).to.be.callCount(
          mockMove.court_hearings.length
        )
      })

      it('should contain message title param', function () {
        expect(params).to.have.property('messageTitle')
        expect(params.messageTitle).to.equal(undefined)
      })

      it('should contain message content param', function () {
        expect(params).to.have.property('messageContent')
        expect(params.messageContent).to.equal('statuses::description')
      })

      describe('update urls and links', function () {
        it('should call getUpdateUrls with expected args', function () {
          expect(getUpdateUrls).to.be.calledOnceWithExactly(
            updateSteps,
            'moveId',
            userPermissions
          )
        })

        it('should call getUpdateLinks with expected args', function () {
          expect(getUpdateLinks).to.be.calledOnceWithExactly(
            updateSteps,
            mockUrls
          )
        })

        it('should pass update urls in locals to render', function () {
          const urls = res.render.args[0][1].urls
          expect(urls).to.have.property('update')
        })

        it('should pass update links in locals to render', function () {
          const updateLinks = res.render.args[0][1].updateLinks
          expect(updateLinks).to.deep.equal(mockUpdateLinks)
        })
      })
    })

    context('with null profile (allocation move)', function () {
      beforeEach(function () {
        req.move = {
          ...mockMove,
          profile: null,
        }
        controller(req, res)
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })
    })

    context('when move is cancelled', function () {
      let params

      beforeEach(function () {
        req.t.returns('__translated__')
        req.move = {
          ...mockMove,
          status: 'cancelled',
          cancellation_reason: 'made_in_error',
          cancellation_reason_comment: 'Reason for cancelling comments',
        }

        controller(req, res)
        params = res.render.args[0][1]
      })

      it('should contain a message title param', function () {
        expect(params).to.have.property('messageTitle')
      })

      it('should call correct translation', function () {
        expect(req.t).to.be.calledWithExactly('statuses::description', {
          context: 'made_in_error',
          comment: 'Reason for cancelling comments',
        })
      })

      it('should contain a message content param', function () {
        expect(params).to.have.property('messageContent')
        expect(params.messageContent).to.equal('statuses::description')
      })
    })

    context('when move doesn’t have a person', function () {
      let params

      beforeEach(function () {
        req.move = {
          ...mockMove,
          person: undefined,
        }

        controller(req, res)
        params = res.render.args[0][1]
      })

      it('should call personToSummaryListComponent presenter with undefined', function () {
        expect(
          presenters.personToSummaryListComponent
        ).to.be.calledOnceWithExactly(undefined)
      })

      it('should contain undefined personal details summary param', function () {
        expect(params).to.have.property('personalDetailsSummary')
        expect(params.personalDetailsSummary).to.equal(undefined)
      })

      it('should call assessmentToTagList presenter with empty array', function () {
        expect(presenters.assessmentToTagList).to.be.calledOnceWithExactly([])
      })

      it('should contain tag list param', function () {
        expect(params).to.have.property('tagList')
        expect(params.tagList).to.deep.equal([])
      })

      it('should call assessmentAnswersByCategory presenter with empty array', function () {
        expect(presenters.assessmentAnswersByCategory).to.be.calledWithExactly(
          []
        )
      })

      it('should contain assessment param as empty array', function () {
        expect(params).to.have.property('assessment')
        expect(params.assessment).to.deep.equal([])
      })

      it('should contain courtSummary param as undefined', function () {
        expect(params).to.have.property('courtSummary')
        expect(params.courtSummary).to.be.undefined
      })
    })

    context('with Person Escort Record', function () {
      const mockPersonEscortRecord = {
        id: '67890',
        status: 'not_started',
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
        req.move = {
          ...req.move,
          profile: {
            id: '12345',
            person_escort_record: mockPersonEscortRecord,
          },
        }
      })

      context('when record is not_started', function () {
        beforeEach(function () {
          controller(req, res)
          params = res.render.args[0][1]
        })

        it('should contain a personEscortRecord', function () {
          expect(params).to.have.property('personEscortRecord')
          expect(params.personEscortRecord).to.deep.equal(
            mockPersonEscortRecord
          )
        })

        it('should not show Person Escort Record as confirmed', function () {
          expect(params).to.have.property('personEscortRecordIsConfirmed')
          expect(params.personEscortRecordIsConfirmed).to.be.false
        })

        it('should not show Person Escort Record as complete', function () {
          expect(params).to.have.property('personEscortRecordIsCompleted')
          expect(params.personEscortRecordIsCompleted).to.be.false
        })

        it('should contain url to Person Escort Record', function () {
          expect(params).to.have.property('personEscortRecordUrl')
          expect(params.personEscortRecordUrl).to.equal(
            `${mockOriginalUrl}/person-escort-record`
          )
        })

        it('should call frameworkToTaskListComponent presenter with correct args', function () {
          expect(
            presenters.frameworkToTaskListComponent
          ).to.be.calledOnceWithExactly({
            baseUrl: `${mockOriginalUrl}/person-escort-record/`,
            frameworkSections: frameworkStub.sections,
            sectionProgress: mockPersonEscortRecord.meta.section_progress,
          })
        })

        it('should contain Person Escort Record tasklist', function () {
          expect(params).to.have.property('personEscortRecordtaskList')
          expect(params.personEscortRecordtaskList).to.equal(
            '__frameworkToTaskListComponent__'
          )
        })

        it('should show Person Escort Record banner', function () {
          expect(params).to.have.property('showPersonEscortRecordBanner')
          expect(params.showPersonEscortRecordBanner).to.be.true
        })
      })

      context('when record is in_progress', function () {
        beforeEach(function () {
          req.move.profile.person_escort_record = {
            ...mockPersonEscortRecord,
            status: 'in_progress',
          }
          controller(req, res)
          params = res.render.args[0][1]
        })

        it('should show Person Escort Record as not confirmed', function () {
          expect(params).to.have.property('personEscortRecordIsConfirmed')
          expect(params.personEscortRecordIsConfirmed).to.be.false
        })

        it('should show Person Escort Record as incomplete', function () {
          expect(params).to.have.property('personEscortRecordIsCompleted')
          expect(params.personEscortRecordIsCompleted).to.be.false
        })
      })

      context('when record is completed', function () {
        beforeEach(function () {
          req.move.profile.person_escort_record = {
            ...mockPersonEscortRecord,
            status: 'completed',
          }
          controller(req, res)
          params = res.render.args[0][1]
        })

        it('should contain a personEscortRecord', function () {
          expect(params).to.have.property('personEscortRecord')
          expect(params.personEscortRecord).to.deep.equal({
            ...mockPersonEscortRecord,
            status: 'completed',
          })
        })

        it('should show Person Escort Record as not confirmed', function () {
          expect(params).to.have.property('personEscortRecordIsConfirmed')
          expect(params.personEscortRecordIsConfirmed).to.be.false
        })

        it('should show Person Escort Record as completed', function () {
          expect(params).to.have.property('personEscortRecordIsCompleted')
          expect(params.personEscortRecordIsCompleted).to.be.true
        })

        it('should contain url to Person Escort Record', function () {
          expect(params).to.have.property('personEscortRecordUrl')
          expect(params.personEscortRecordUrl).to.equal(
            `${mockOriginalUrl}/person-escort-record`
          )
        })

        it('should call frameworkToTaskListComponent presenter with correct args', function () {
          expect(
            presenters.frameworkToTaskListComponent
          ).to.be.calledOnceWithExactly({
            baseUrl: `${mockOriginalUrl}/person-escort-record/`,
            frameworkSections: frameworkStub.sections,
            sectionProgress: mockPersonEscortRecord.meta.section_progress,
          })
        })

        it('should call frameworkFlagsToTagList presenter with correct args', function () {
          expect(
            presenters.frameworkFlagsToTagList
          ).to.be.calledOnceWithExactly(mockPersonEscortRecord.flags)
        })

        it('should contain Person Escort Record tasklist', function () {
          expect(params).to.have.property('personEscortRecordtaskList')
          expect(params.personEscortRecordtaskList).to.equal(
            '__frameworkToTaskListComponent__'
          )
        })

        it('should show Person Escort Record banner', function () {
          expect(params).to.have.property('showPersonEscortRecordBanner')
          expect(params.showPersonEscortRecordBanner).to.be.true
        })
      })

      context('when record is confirmed', function () {
        beforeEach(function () {
          req.move.profile.person_escort_record = {
            ...mockPersonEscortRecord,
            status: 'confirmed',
          }
          controller(req, res)
          params = res.render.args[0][1]
        })

        it('should show Person Escort Record as confirmed', function () {
          expect(params).to.have.property('personEscortRecordIsConfirmed')
          expect(params.personEscortRecordIsConfirmed).to.be.true
        })

        it('should not show Person Escort Record banner', function () {
          expect(params).to.have.property('showPersonEscortRecordBanner')
          expect(params.showPersonEscortRecordBanner).to.be.true
        })
      })

      context('when feature flag is disabled', function () {
        const controllerWithoutPER = proxyquire('./view', {
          ...pathStubs,
          '../../../config': {
            FEATURE_FLAGS: {
              PERSON_ESCORT_RECORD: false,
            },
          },
        })

        beforeEach(function () {
          controllerWithoutPER(req, res)
          params = res.render.args[0][1]
        })

        it('should set personEscortRecordIsEnabled to false', function () {
          expect(params).to.have.property('personEscortRecordIsEnabled')
          expect(params.personEscortRecordIsEnabled).to.be.false
        })

        it('should not show Person Escort Record banner', function () {
          expect(params).to.have.property('showPersonEscortRecordBanner')
          expect(params.showPersonEscortRecordBanner).to.be.false
        })
      })

      context('when user does not have permission', function () {
        beforeEach(function () {
          permissionsMiddleware.check.returns(false)
          controller(req, res)
          params = res.render.args[0][1]
        })

        it('should set personEscortRecordIsEnabled to false', function () {
          expect(params).to.have.property('personEscortRecordIsEnabled')
          expect(params.personEscortRecordIsEnabled).to.be.false
        })

        it('should not show Person Escort Record banner', function () {
          expect(params).to.have.property('showPersonEscortRecordBanner')
          expect(params.showPersonEscortRecordBanner).to.be.false
        })
      })
    })

    describe('cancelling a move', function () {
      let params

      beforeEach(function () {
        req.move = {
          ...mockMove,
          person: undefined,
        }
        req.session.user.permissions = []
      })

      context('with proposed state', function () {
        beforeEach(function () {
          req.move = {
            ...req.move,
            status: 'proposed',
          }
        })

        context('without permission to cancel proposed moves', function () {
          beforeEach(function () {
            controller(req, res)
            params = res.render.args[0][1]
          })

          it('should not be able to cancel move', function () {
            expect(params.canCancelMove).to.be.false
          })
        })

        context('with permission to cancel proposed moves', function () {
          beforeEach(function () {
            req.session.user.permissions = ['move:cancel:proposed']

            controller(req, res)
            params = res.render.args[0][1]
          })

          it('should be able to cancel move', function () {
            expect(params.canCancelMove).to.be.true
          })
        })
      })

      const cancellableStates = ['requested', 'booked']
      cancellableStates.forEach(status => {
        context(`with ${status} state`, function () {
          beforeEach(function () {
            req.move = {
              ...req.move,
              status,
            }
          })

          context('allocation move', function () {
            beforeEach(function () {
              req.move = {
                ...req.move,
                allocation: {
                  id: '123',
                },
              }
            })

            context('without permission to cancel move', function () {
              beforeEach(function () {
                controller(req, res)
                params = res.render.args[0][1]
              })

              it('should not be able to cancel move', function () {
                expect(params.canCancelMove).to.be.false
              })
            })

            context('with permission to cancel move', function () {
              beforeEach(function () {
                req.session.user.permissions = ['move:cancel']
                controller(req, res)
                params = res.render.args[0][1]
              })

              it('should not be able to cancel move', function () {
                expect(params.canCancelMove).to.be.false
              })
            })
          })

          context('non-allocation move', function () {
            context('without permission to cancel move', function () {
              beforeEach(function () {
                controller(req, res)
                params = res.render.args[0][1]
              })

              it('should not be able to cancel move', function () {
                expect(params.canCancelMove).to.be.false
              })
            })

            context('with permission to cancel move', function () {
              beforeEach(function () {
                req.session.user.permissions = ['move:cancel']
                controller(req, res)
                params = res.render.args[0][1]
              })

              it('should be able to cancel move', function () {
                expect(params.canCancelMove).to.be.true
              })
            })
          })
        })
      })

      context('with other state', function () {
        beforeEach(function () {
          req.move = {
            ...req.move,
            status: 'completed',
          }
        })

        context('without permission to cancel move', function () {
          beforeEach(function () {
            controller(req, res)
            params = res.render.args[0][1]
          })

          it('should not be able to cancel move', function () {
            expect(params.canCancelMove).to.be.false
          })
        })

        context('with permission to cancel move', function () {
          beforeEach(function () {
            req.session.user.permissions = ['move:cancel']
            controller(req, res)
            params = res.render.args[0][1]
          })

          it('should not be able to cancel move', function () {
            expect(params.canCancelMove).to.be.false
          })
        })
      })
    })
  })
})
