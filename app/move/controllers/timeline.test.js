const proxyquire = require('proxyquire')

const populateResources = sinon.stub()
const presenters = {
  moveToMetaListComponent: sinon.stub().returns('moveToMetaListComponentArgs'),
  assessmentToTagList: sinon.stub().returns('assessmentToTagListArgs'),
  eventsToTimelineComponent: sinon
    .stub()
    .returns('eventsToTimelineComponentArgs'),
}
const moveService = {
  getById: sinon.stub().resolves({ id: 'moveId' }),
}
const getTabsUrls = sinon.stub().returns('tab_urls')

const timelineController = proxyquire('./timeline', {
  '../../../common/lib/populate-resources': populateResources,
  '../../../common/presenters': presenters,
  '../../../common/services/move': moveService,
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
      moveService.getById.resetHistory()
      moveService.getById.resolves(mockMove)
      populateResources.resetHistory()
      getTabsUrls.resetHistory()
      req = {
        params: {
          id: 'moveId',
        },
      }
    })

    context('', function () {
      beforeEach(async function () {
        await timelineController(req, res)
      })

      it('should get the tab urls', function () {
        expect(getTabsUrls).to.be.calledOnceWithExactly(mockMove)
      })

      it('should fetch timeline events for move', function () {
        expect(moveService.getById).to.be.calledOnceWithExactly(mockMove.id, {
          include: [
            'profile',
            'profile.person',
            'from_location',
            'to_location',
            'timeline_events',
            'timeline_events.eventable',
          ],
          populateResources: true,
        })
      })

      it('should populate resources', function () {
        expect(populateResources).to.be.calledOnceWithExactly(
          mockMove.timeline_events
        )
      })

      it('should transform the data for presentation', function () {
        expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
          mockMove
        )
        expect(presenters.assessmentToTagList).to.be.calledOnceWithExactly(
          mockMove.profile.assessment_answers
        )
        expect(
          presenters.eventsToTimelineComponent
        ).to.be.calledOnceWithExactly(mockMove.timeline_events, mockMove)
      })

      it('should render the timeline', function () {
        expect(res.render).to.be.calledOnceWithExactly('move/views/timeline', {
          move: mockMove,
          moveSummary: 'moveToMetaListComponentArgs',
          tagList: 'assessmentToTagListArgs',
          timeline: 'eventsToTimelineComponentArgs',
          urls: {
            tabs: 'tab_urls',
          },
        })
      })
    })
  })
})
