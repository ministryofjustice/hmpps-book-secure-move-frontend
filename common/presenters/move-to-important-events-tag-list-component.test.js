const proxyquire = require('proxyquire')

const eventToTagComponent = sinon.stub().callsFake(val => val + val)

const moveToImportantEventsTagListComponent = proxyquire(
  './move-to-important-events-tag-list-component',
  {
    './event-to-tag-component': eventToTagComponent,
  }
)

describe('Presenters', function () {
  describe('#moveToTimelineComponent()', function () {
    let transformedResponse
    const move = {
      id: '#move',
      important_events: ['a', 'b'],
    }
    beforeEach(function () {
      eventToTagComponent.resetHistory()
      transformedResponse = moveToImportantEventsTagListComponent(move)
    })

    it('should transform the events into items', function () {
      expect(eventToTagComponent.callCount).to.equal(2)
      expect(eventToTagComponent.firstCall).to.be.calledWithExactly(
        'a',
        '#move',
        false
      )
      expect(eventToTagComponent.secondCall).to.be.calledWithExactly(
        'b',
        '#move',
        false
      )
    })

    it('should return a transformed response in the expected structure', function () {
      expect(transformedResponse).to.deep.equal(['aa', 'bb'])
    })
  })
})
