const proxyquire = require('proxyquire')

const eventHelpers = {
  getFlag: sinon.stub(),
  getHeading: sinon.stub().returns('heading'),
  getHeaderClasses: sinon.stub().returns('headerClasses'),
  getContainerClasses: sinon.stub().returns('containerClasses'),
  getLabelClasses: sinon.stub().returns('labelClasses'),
  getDescription: sinon.stub().returns('description'),
  setEventDetails: sinon.stub().callsFake(event => ({
    ...event,
    details: 'details',
  })),
}

const componentService = {
  getComponent: sinon.stub().returns('component output'),
}

const eventToTimelineItemComponent = proxyquire(
  './event-to-timeline-item-component',
  {
    '../helpers/events': eventHelpers,
    '../services/component': componentService,
  }
)

describe('Presenters', function () {
  describe('#eventsToTimelineComponent()', function () {
    let transformedResponse
    const mockMove = { id: 'moveId' }
    const mockEvent = {
      id: 'eventId',
      occurred_at: 'timestamp',
      created_by: 'TUSER',
    }

    const eventWithDetails = {
      id: 'eventId',
      occurred_at: 'timestamp',
      details: 'details',
      created_by: 'TUSER',
    }

    beforeEach(function () {
      eventHelpers.setEventDetails.resetHistory()
      eventHelpers.getFlag.resetHistory()
      eventHelpers.getHeading.resetHistory()
      eventHelpers.getHeaderClasses.resetHistory()
      eventHelpers.getContainerClasses.resetHistory()
      eventHelpers.getLabelClasses.resetHistory()
      eventHelpers.getDescription.resetHistory()
      componentService.getComponent.resetHistory()
    })

    context('when event is a standard event', function () {
      beforeEach(async function () {
        transformedResponse = await eventToTimelineItemComponent(
          'token',
          mockEvent,
          mockMove
        )
      })

      it('should set the event details', function () {
        expect(eventHelpers.setEventDetails).to.be.calledOnceWithExactly(
          mockEvent,
          mockMove
        )
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

      it('should not get the header classes', function () {
        expect(eventHelpers.getHeaderClasses).to.not.be.called
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
          'token',
          eventWithDetails
        )
      })

      it('should not render the heading with the tag component', function () {
        expect(componentService.getComponent).to.not.be.called
      })

      it('should return a transformed response in the expected structure', function () {
        expect(transformedResponse).to.deep.equal({
          id: 'eventId',
          container: { classes: 'containerClasses' },
          label: { classes: 'labelClasses', html: 'heading' },
          html: 'description',
          datetime: { timestamp: 'timestamp', type: 'datetime' },
          byline: { html: 'TUSER' },
        })
      })
    })

    context('when event is an important event', function () {
      beforeEach(async function () {
        eventHelpers.getFlag.returns({ html: 'flag html' })
        transformedResponse = await eventToTimelineItemComponent(
          'token',
          mockEvent,
          mockMove
        )
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
          'token',
          eventWithDetails
        )
      })

      it('should render the heading with the tag component', function () {
        expect(componentService.getComponent).to.be.calledOnceWithExactly(
          'appTag',
          {
            html: 'heading',
            flag: { html: 'flag html' },
            classes: 'headerClasses',
          }
        )
      })

      it('should return a transformed response in the expected structure', function () {
        expect(transformedResponse).to.deep.equal({
          id: 'eventId',
          container: { classes: 'containerClasses' },
          label: { classes: 'labelClasses', html: 'component output' },
          html: 'description',
          datetime: { timestamp: 'timestamp', type: 'datetime' },
          byline: { html: 'TUSER' },
        })
      })
    })
  })
})
