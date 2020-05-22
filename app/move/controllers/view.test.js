const proxyquire = require('proxyquire')

const presenters = require('../../../common/presenters')

const getUpdateUrls = sinon.stub()
const getUpdateLinks = sinon.stub()

const updateSteps = []
Object.defineProperty(updateSteps, '@noCallThru', { value: true })
const controller = proxyquire('./view', {
  '../steps/update': updateSteps,
  './view/view.update.urls': getUpdateUrls,
  './view/view.update.links': getUpdateLinks,
})

const mockMove = {
  id: 'moveId',
  status: 'requested',
  person: {
    assessment_answers: [],
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

getUpdateUrls.returns(mockUrls)
getUpdateLinks.returns(mockUpdateLinks)

describe('Move controllers', function() {
  describe('#view()', function() {
    let req, res
    const userPermissions = ['permA']

    beforeEach(function() {
      getUpdateUrls.resetHistory()
      getUpdateLinks.resetHistory()
      sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
      sinon.stub(presenters, 'personToSummaryListComponent').returnsArg(0)
      sinon.stub(presenters, 'assessmentToTagList').returnsArg(0)
      sinon.stub(presenters, 'assessmentAnswersByCategory').returnsArg(0)
      sinon.stub(presenters, 'assessmentCategoryToPanelComponent').returnsArg(0)
      sinon.stub(presenters, 'assessmentToSummaryListComponent').returnsArg(0)
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
      }
      res = {
        render: sinon.spy(),
        locals: {
          move: mockMove,
        },
      }
    })

    context('by default', function() {
      beforeEach(function() {
        controller(req, res)
      })

      it('should render a template', function() {
        expect(res.render.calledOnce).to.be.true
      })

      it('should call moveToMetaListComponent presenter with correct args', function() {
        expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
          mockMove,
          mockUpdateLinks
        )
      })

      it('should contain a move summary param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('moveSummary')
        expect(params.moveSummary).to.equal(mockMove)
      })

      it('should call personToSummaryListComponent presenter with correct args', function() {
        expect(
          presenters.personToSummaryListComponent
        ).to.be.calledOnceWithExactly(mockMove.person)
      })

      it('should contain personal details summary param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('personalDetailsSummary')
        expect(params.personalDetailsSummary).to.equal(mockMove.person)
      })

      it('should call assessmentToTagList presenter with correct args', function() {
        expect(presenters.assessmentToTagList).to.be.calledOnceWithExactly(
          mockMove.person.assessment_answers
        )
      })

      it('should contain tag list param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('tagList')
        expect(params.tagList).to.equal(mockMove.person.assessment_answers)
      })

      it('should call assessmentAnswersByCategory presenter with correct args', function() {
        expect(
          presenters.assessmentAnswersByCategory
        ).to.be.calledOnceWithExactly(mockMove.person.assessment_answers)
      })

      it('should contain assessment param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('assessment')
        expect(params.assessment).to.deep.equal(
          mockMove.person.assessment_answers
        )
      })

      it('should call assessmentToSummaryListComponent presenter with correct args', function() {
        expect(
          presenters.assessmentToSummaryListComponent
        ).to.be.calledOnceWithExactly(
          mockMove.person.assessment_answers,
          'court'
        )
      })

      it('should contain court hearings param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('courtHearings')
      })

      it('should order court hearings by start time', function() {
        const params = res.render.args[0][1]
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

      it('should call courtHearingToSummaryListComponent for each hearing', function() {
        expect(presenters.courtHearingToSummaryListComponent).to.be.callCount(
          mockMove.court_hearings.length
        )
      })

      it('should contain court summary param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('courtSummary')
        expect(params.courtSummary).to.equal(mockMove.person.assessment_answers)
      })

      it('should contain message title param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('messageTitle')
        expect(params.messageTitle).to.equal(undefined)
      })

      it('should contain message content param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('messageContent')
        expect(params.messageContent).to.equal('statuses::description')
      })

      describe('update urls and links', function() {
        it('should call getUpdateUrls with expected args', function() {
          expect(getUpdateUrls).to.be.calledOnceWithExactly(
            updateSteps,
            'moveId',
            userPermissions
          )
        })

        it('should call getUpdateLinks with expected args', function() {
          expect(getUpdateLinks).to.be.calledOnceWithExactly(
            updateSteps,
            mockUrls
          )
        })

        it('should pass update urls in locals to render', function() {
          const urls = res.render.args[0][1].urls
          expect(urls).to.have.property('update')
        })

        it('should pass update links in locals to render', function() {
          const updateLinks = res.render.args[0][1].updateLinks
          expect(updateLinks).to.deep.equal(mockUpdateLinks)
        })
      })
    })

    context('when move is cancelled', function() {
      let params

      beforeEach(function() {
        req.t.returns('__translated__')
        res.locals.move = {
          ...mockMove,
          status: 'cancelled',
          cancellation_reason: 'made_in_error',
          cancellation_reason_comment: 'Reason for cancelling comments',
        }

        controller(req, res)
        params = res.render.args[0][1]
      })

      it('should contain a message title param', function() {
        expect(params).to.have.property('messageTitle')
      })

      it('should call correct translation', function() {
        expect(req.t).to.be.calledWithExactly('statuses::description', {
          context: 'made_in_error',
          comment: 'Reason for cancelling comments',
        })
      })

      it('should contain a message content param', function() {
        expect(params).to.have.property('messageContent')
        expect(params.messageContent).to.equal('statuses::description')
      })
    })

    context('when move doesn’t have a person', function() {
      let params

      beforeEach(function() {
        res.locals.move = {
          ...mockMove,
          person: undefined,
        }

        controller(req, res)
        params = res.render.args[0][1]
      })

      it('should call personToSummaryListComponent presenter with undefined', function() {
        expect(
          presenters.personToSummaryListComponent
        ).to.be.calledOnceWithExactly(undefined)
      })

      it('should contain undefined personal details summary param', function() {
        expect(params).to.have.property('personalDetailsSummary')
        expect(params.personalDetailsSummary).to.equal(undefined)
      })

      it('should call assessmentToTagList presenter with empty array', function() {
        expect(presenters.assessmentToTagList).to.be.calledOnceWithExactly([])
      })

      it('should contain tag list param', function() {
        expect(params).to.have.property('tagList')
        expect(params.tagList).to.deep.equal([])
      })

      it('should call assessmentAnswersByCategory presenter with empty array', function() {
        expect(
          presenters.assessmentAnswersByCategory
        ).to.be.calledOnceWithExactly([])
      })

      it('should contain assessment param as empty array', function() {
        expect(params).to.have.property('assessment')
        expect(params.assessment).to.deep.equal([])
      })

      it('should call assessmentToSummaryListComponent presenter with empty array', function() {
        expect(
          presenters.assessmentToSummaryListComponent
        ).to.be.calledOnceWithExactly([], 'court')
      })
    })
  })
})
