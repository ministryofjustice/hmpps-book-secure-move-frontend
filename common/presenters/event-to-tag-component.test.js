const proxyquire = require('proxyquire')

const eventHelpers = {
  getFlag: sinon.stub().returns({ flag: 'flag' }),
  getHeading: sinon.stub().returns('heading'),
  getHeaderClasses: sinon.stub().returns('headerClasses'),
}
const componentService = {
  getComponent: sinon.stub().returns('component output'),
}

const eventToTagComponent = proxyquire('./event-to-tag-component', {
  '../helpers/events/event': eventHelpers,
  '../services/component': componentService,
})

describe('Presenters', function () {
  describe('#eventToTagComponent()', function () {
    let transformedResponse
    const event = {
      id: 'eventId',
    }
    const moveId = 'moveId'
    beforeEach(function () {
      eventHelpers.getFlag.resetHistory()
      eventHelpers.getHeading.resetHistory()
      eventHelpers.getHeaderClasses.resetHistory()
      componentService.getComponent.resetHistory()
      transformedResponse = eventToTagComponent(event, moveId)
    })

    it('should get the flag values', function () {
      expect(eventHelpers.getFlag).to.be.calledOnceWithExactly(event)
    })

    it('should get the heading', function () {
      expect(eventHelpers.getHeading).to.be.calledOnceWithExactly(event)
    })

    it('should render the flag', function () {
      expect(componentService.getComponent).to.be.calledOnceWithExactly(
        'appFlag',
        {
          flag: 'flag',
          html: 'heading',
        }
      )
    })

    it('should get the header classes', function () {
      expect(eventHelpers.getHeaderClasses).to.be.calledOnceWithExactly(event)
    })

    it('should return a transformed response in the expected structure', function () {
      expect(transformedResponse).to.deep.equal({
        id: 'eventId',
        href: '/move/moveId/timeline#eventId',
        html: 'component output',
        classes: 'headerClasses',
      })
    })
  })
})
