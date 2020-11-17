const proxyquire = require('proxyquire')

const presenters = {
  moveToMetaListComponent: sinon.stub().returns('moveToMetaListComponentArgs'),
  assessmentToTagList: sinon.stub().returns('assessmentToTagListArgs'),
  eventsToTimelineComponent: sinon
    .stub()
    .returns('eventsToTimelineComponentArgs'),
}

const getTabsUrls = sinon.stub().returns('tab_urls')

const getViewLocals = sinon.stub().returns({
  locals: 'view.locals',
})

const timelineController = proxyquire('./timeline', {
  '../../../common/presenters': presenters,
  './view/view.locals': getViewLocals,
  './view/view.tabs.urls': getTabsUrls,
})

describe('Move controllers', function () {
  describe('Timeline controller', function () {
    const res = { render: sinon.stub() }
    let req
    const mockMove = {
      id: 'moveId',
      profile: {
        id: 'profileId',
        assessment_answers: ['answerA', 'answerB'],
      },
      timeline_events: [{ woo: 'haa' }],
    }
    beforeEach(function () {
      res.render.resetHistory()
      presenters.moveToMetaListComponent.resetHistory()
      presenters.assessmentToTagList.resetHistory()
      presenters.eventsToTimelineComponent.resetHistory()
      getViewLocals.resetHistory()
      getTabsUrls.resetHistory()
      req = {
        move: mockMove,
      }
    })

    context('', function () {
      beforeEach(async function () {
        await timelineController(req, res)
      })

      it('should get the tab urls', function () {
        expect(getTabsUrls).to.be.calledOnceWithExactly(mockMove)
      })

      it('should transform the data for presentation', function () {
        expect(getViewLocals).to.be.calledOnceWithExactly(req)
      })

      it('should render the timeline', function () {
        expect(res.render).to.be.calledOnceWithExactly('move/views/timeline', {
          locals: 'view.locals',
          timeline: 'eventsToTimelineComponentArgs',
          urls: {
            tabs: 'tab_urls',
          },
        })
      })
    })
  })
})
