const i18n = require('../../../config/i18n')

const addTriggeredEvents = require('./add-triggered-events')

const mockEvents = [
  { event_type: 'foo', value: 1 },
  { event_type: 'bar', value: 2 },
  { event_type: 'baz', value: 3 },
]

describe('Timeline events', function () {
  describe('#addTriggeredEvents', function () {
    let events
    beforeEach(function () {
      events = {}
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(i18n, 'exists').returns(false)
    })

    context('When there are no triggered events', function () {
      beforeEach(function () {
        events = addTriggeredEvents(mockEvents)
      })
      it('should leave the events untouched', function () {
        expect(events).to.deep.equal(mockEvents)
      })
    })

    context('When there are triggered events', function () {
      beforeEach(function () {
        i18n.exists.returns(true)
        events = addTriggeredEvents(mockEvents)
      })
      it('should insert the triggered events', function () {
        expect(events).to.deep.equal([
          { event_type: 'foo', value: 1 },
          { event_type: 'events::foo.triggers', value: 1 },
          { event_type: 'bar', value: 2 },
          { event_type: 'events::bar.triggers', value: 2 },
          { event_type: 'baz', value: 3 },
          { event_type: 'events::baz.triggers', value: 3 },
        ])
      })
    })

    context('When there are some triggered events', function () {
      beforeEach(function () {
        i18n.exists.onCall(1).returns(true)
        events = addTriggeredEvents(mockEvents)
      })
      it('should insert the triggered events only for the necessary corresponding events', function () {
        expect(events).to.deep.equal([
          { event_type: 'foo', value: 1 },
          { event_type: 'bar', value: 2 },
          { event_type: 'events::bar.triggers', value: 2 },
          { event_type: 'baz', value: 3 },
        ])
      })
    })
  })
})
