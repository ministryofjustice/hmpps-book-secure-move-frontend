const proxyquire = require('proxyquire')

const eventHelpers = {
  getFlag: sinon.stub().returns({ flag: 'flag' }),
  getHeading: sinon.stub().returns('heading'),
  getHeaderClasses: sinon.stub().returns('headerClasses'),
}

const eventToTagComponent = proxyquire('./event-to-tag-component', {
  '../helpers/events/event': eventHelpers,
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
      transformedResponse = eventToTagComponent(event, moveId)
    })

    it('should get the flag values', function () {
      expect(eventHelpers.getFlag).to.be.calledOnceWithExactly(event)
    })

    it('should get the heading', function () {
      expect(eventHelpers.getHeading).to.be.calledOnceWithExactly(event)
    })

    it('should get the header classes', function () {
      expect(eventHelpers.getHeaderClasses).to.be.calledOnceWithExactly(event)
    })

    it('should return a transformed response in the expected structure', function () {
      transformedResponse // ?
      expect(transformedResponse).to.deep.equal({
        id: 'eventId',
        flag: { flag: 'flag' },
        href: '/move/moveId/timeline#eventId',
        html: 'heading',
        classes: 'headerClasses',
      })
    })
  })
})
