const proxyquire = require('proxyquire')

const eventToTimelineItemComponent = sinon
  .stub()
  .callsFake((_, val) => val + val)

const moveToTimelineComponent = proxyquire('./move-to-timeline-component', {
  './event-to-timeline-item-component': eventToTimelineItemComponent,
})

describe('Presenters', function () {
  describe('#moveToTimelineComponent()', function () {
    let transformedResponse
    const move = {
      timeline_events: ['a', 'b'],
    }

    beforeEach(async function () {
      eventToTimelineItemComponent.resetHistory()
      transformedResponse = await moveToTimelineComponent('token', move)
    })

    it('should transform the events into items', function () {
      expect(eventToTimelineItemComponent.callCount).to.equal(2)
      expect(eventToTimelineItemComponent.firstCall).to.be.calledWithExactly(
        'token',
        'a',
        move
      )
      expect(eventToTimelineItemComponent.secondCall).to.be.calledWithExactly(
        'token',
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
