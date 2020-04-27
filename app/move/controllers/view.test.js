const proxyquire = require('proxyquire')

const presenters = require('../../../common/presenters')

const updateSteps = [
  { '/foo': {} },
  { '/bar-details': {} },
  { '/baz-information': {} },
]
Object.defineProperty(updateSteps, '@noCallThru', { value: true })
const controller = proxyquire('./view', {
  '../steps/update': updateSteps,
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

describe('Move controllers', function() {
  describe('#view()', function() {
    let req, res

    beforeEach(function() {
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
          mockMove
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
        expect(params.messageTitle).to.equal('statuses::requested')
      })

      it('should contain message content param', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('messageContent')
        expect(params.messageContent).to.equal('statuses::description')
      })

      describe('update urls', function() {
        let update
        beforeEach(function() {
          update = res.render.args[0][1].urls.update
        })

        it('should contain update urls', function() {
          const urls = res.render.args[0][1].urls
          expect(urls).to.have.property('update')
        })

        it('should contain expected url values', function() {
          expect(update.foo).to.equal('/move/moveId/edit/foo')
          expect(update.bar_details).to.equal('/move/moveId/edit/bar-details')
          expect(update.baz_information).to.equal(
            '/move/moveId/edit/baz-information'
          )
          expect(update.baz).to.equal('/move/moveId/edit/baz-information')
        })
      })
    })

    context('when move is cancelled', function() {
      let params

      beforeEach(function() {
        res.locals.move = {
          ...mockMove,
          status: 'cancelled',
          cancellation_reason: 'made_in_error',
        }
      })

      context('when cancellation reason is not "other"', function() {
        beforeEach(function() {
          req.t.returns('__translated__')

          controller(req, res)
          params = res.render.args[0][1]
        })

        it('should contain a message title param', function() {
          expect(params).to.have.property('messageTitle')
        })

        it('should contain a message content param', function() {
          expect(params).to.have.property('messageContent')
          expect(params.messageContent).to.equal('statuses::description')
        })

        it('should call correct translation', function() {
          expect(req.t.thirdCall).to.be.calledWithExactly(
            'statuses::description',
            {
              context: 'cancelled',
              reason: 'fields::cancellation_reason.items.made_in_error.label',
            }
          )
        })
      })

      context('when cancellation reason is "other"', function() {
        beforeEach(function() {
          res.locals.move = {
            ...mockMove,
            status: 'cancelled',
            cancellation_reason: 'other',
            cancellation_reason_comments: 'Another reason for cancelling',
          }

          controller(req, res)
          params = res.render.args[0][1]
        })

        it('should contain a message title param', function() {
          expect(params).to.have.property('messageTitle')
        })

        it('should contain a message content param', function() {
          expect(params).to.have.property('messageContent')
          expect(params.messageContent).to.equal('statuses::description')
        })
      })
    })
  })
})
