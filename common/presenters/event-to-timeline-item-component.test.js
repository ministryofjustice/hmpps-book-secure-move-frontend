const proxyquire = require('proxyquire')

const eventHelpers = {
  getFlag: sinon.stub().returns({ flag: 'flag' }),
  getHeading: sinon.stub().returns('heading'),
  getHeaderClasses: sinon.stub().returns('headerClasses'),
  getContainerClasses: sinon.stub().returns('containerClasses'),
  getLabelClasses: sinon.stub().returns('labelClasses'),
  getDescription: sinon.stub().returns('description'),
}

const setEventDetails = sinon.stub().callsFake(event => ({
  ...event,
  details: 'details',
}))

const eventToTimelineItemComponent = proxyquire(
  './event-to-timeline-item-component',
  {
    '../helpers/events/event': eventHelpers,
    '../helpers/events/set-event-details': setEventDetails,
  }
)

describe('Presenters', function () {
  describe('#eventsToTimelineComponent()', function () {
    let transformedResponse
    const mockMove = { id: 'moveId' }
    const mockEvent = { id: 'eventId', occurred_at: 'timestamp' }

    beforeEach(function () {
      setEventDetails.resetHistory()
      eventHelpers.getFlag.resetHistory()
      eventHelpers.getHeading.resetHistory()
      eventHelpers.getHeaderClasses.resetHistory()
      eventHelpers.getContainerClasses.resetHistory()
      eventHelpers.getLabelClasses.resetHistory()
      eventHelpers.getDescription.resetHistory()
    })

    context('woo', function () {
      const eventWithDetails = {
        id: 'eventId',
        occurred_at: 'timestamp',
        details: 'details',
      }
      beforeEach(function () {
        transformedResponse = eventToTimelineItemComponent(mockEvent, mockMove)
      })

      it('should get the flag values', function () {
        expect(eventHelpers.getFlag).to.be.calledOnceWithExactly(
          eventWithDetails
        )
      })

      it('should get the container classes', function () {
        expect(eventHelpers.getContainerClasses).to.be.calledOnceWithExactly(
          eventWithDetails
        )
      })

      it('should get the header classes', function () {
        expect(eventHelpers.getHeaderClasses).to.be.calledOnceWithExactly(
          eventWithDetails
        )
      })

      it('should get the heading', function () {
        expect(eventHelpers.getHeading).to.be.calledOnceWithExactly(
          eventWithDetails
        )
      })

      it('should get the label classes', function () {
        expect(eventHelpers.getLabelClasses).to.be.calledOnceWithExactly(
          eventWithDetails
        )
      })

      it('should get the description', function () {
        expect(eventHelpers.getDescription).to.be.calledOnceWithExactly(
          eventWithDetails
        )
      })

      it('should return a transformed response in the expected structure', function () {
        transformedResponse // ?
        expect(transformedResponse).to.deep.equal({
          id: 'eventId',
          flag: { flag: 'flag' },
          container: { classes: 'containerClasses' },
          header: { classes: 'headerClasses' },
          label: { classes: 'labelClasses', html: 'heading' },
          html: 'description',
          datetime: { timestamp: 'timestamp', type: 'datetime' },
          byline: { html: '' },
        })
      })
    })
  })
})
