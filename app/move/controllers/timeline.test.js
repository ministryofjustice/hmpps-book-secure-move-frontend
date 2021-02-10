const proxyquire = require('proxyquire')

const presenters = {
  moveToMetaListComponent: sinon.stub().returns('moveToMetaListComponentArgs'),
  assessmentToTagList: sinon.stub().returns('assessmentToTagListArgs'),
  moveToTimelineComponent: sinon.stub().returns('moveToTimelineComponentArgs'),
}

const getTabsUrls = sinon.stub().returns('tab_urls')

const getLocals = sinon.stub().returns({
  locals: 'view.locals',
})

const timelineController = proxyquire('./timeline', {
  '../../../common/helpers/move': {
    getLocals,
    getTabsUrls,
  },
  '../../../common/presenters': presenters,
})

describe('Move controllers', function () {
  describe('Timeline controller', function () {
    const res = { render: sinon.stub() }
    let req
    beforeEach(function () {
      res.render.resetHistory()
      presenters.moveToMetaListComponent.resetHistory()
      presenters.assessmentToTagList.resetHistory()
      presenters.moveToTimelineComponent.resetHistory()
      getLocals.resetHistory()
      getTabsUrls.resetHistory()
      req = {}
    })

    context('by default', function () {
      beforeEach(function () {
        timelineController(req, res)
      })

      it('should get the tab urls', function () {
        expect(getTabsUrls).to.be.calledOnceWithExactly({})
      })

      it('should transform the data for presentation', function () {
        expect(getLocals).to.be.calledOnceWithExactly(req)
      })

      it('should render the timeline', function () {
        expect(res.render).to.be.calledOnceWithExactly('move/views/timeline', {
          locals: 'view.locals',
          timeline: 'moveToTimelineComponentArgs',
          urls: {
            tabs: 'tab_urls',
          },
        })
      })
    })

    context('when move is rejected single request', function () {
      const mockMove = {
        status: 'cancelled',
        cancellation_reason: 'rejected',
        timeline_events: [
          {
            event_type: 'MoveReject',
            details: {
              rebook: true,
            },
          },
        ],
      }
      beforeEach(function () {
        req.move = mockMove
        timelineController(req, res)
      })

      it('should get the tab urls', function () {
        expect(getTabsUrls).to.be.calledOnceWithExactly(mockMove)
      })

      it('should copy rebook property from MoveReject event to move', function () {
        expect(req.move.rebook).to.be.true
      })
    })
  })
})
