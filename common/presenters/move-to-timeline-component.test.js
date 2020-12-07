const proxyquire = require('proxyquire')

const addTriggeredEvents = sinon.stub()
const eventToTimelineItemComponent = sinon.stub().callsFake(val => val + val)

const moveToTimelineComponent = proxyquire('./move-to-timeline-component', {
  '../../common/helpers/events/add-triggered-events': addTriggeredEvents,
  './event-to-timeline-item-component': eventToTimelineItemComponent,
})

describe('Presenters', function () {
  describe('#moveToTimelineComponent()', function () {
    let transformedResponse
    const move = {
      timeline_events: ['a', 'b'],
    }
    beforeEach(function () {
      addTriggeredEvents.resetHistory()
      eventToTimelineItemComponent.resetHistory()
      transformedResponse = moveToTimelineComponent(move)
    })

    it('should add any triggered events ', function () {
      expect(addTriggeredEvents).to.be.calledOnceWithExactly(
        move.timeline_events
      )
    })

    it('should transform the events into items', function () {
      expect(eventToTimelineItemComponent.callCount).to.equal(2)
      expect(eventToTimelineItemComponent.firstCall).to.be.calledWithExactly(
        'a',
        move
      )
      expect(eventToTimelineItemComponent.secondCall).to.be.calledWithExactly(
        'b',
        move
      )
    })

    it('should return a transformed response in the expected structure', function () {
      expect(transformedResponse).to.deep.equal({
        items: ['bb', 'aa'],
      })
    })
  })
})
