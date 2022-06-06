const proxyquire = require('proxyquire')

const i18n = require('../../../config/i18n').default

const {
  getMoveDetails,
  getEventAgency,
  getEventContext,
  getEventRelationships,
  getEventableDetails,
  getEventProperties,
} = proxyquire('./event-details-helpers', {
  '../../../common/lib/api-client/models': {
    event: {
      fields: {
        event_type: '',
        prop_a: '',
        prop_b: '',
        details: '',
        eventable: {
          jsonApi: 'hasOne',
        },
        rel_a: {
          jsonApi: 'hasOne',
          type: 'rel_as',
        },
        rel_b: {
          jsonApi: 'hasOne',
          type: 'rel_bs',
        },
      },
    },
  },
})

describe('Timeline events', function () {
  describe('Event details helpers', function () {
    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(i18n, 'exists').returns(false)
    })

    describe('#getMoveDetails', function () {
      it('should return the move and person', function () {
        const mockMove = { id: 'move', profile: { person: { id: 'person' } } }
        const details = getMoveDetails(mockMove)
        expect(details).to.deep.equal({
          move: mockMove,
          person: mockMove.profile.person,
        })
      })

      it('should return just the move if it has no profile', function () {
        const mockMove = { id: 'move' }
        const details = getMoveDetails(mockMove)
        expect(details).to.deep.equal({
          move: mockMove,
          person: {},
        })
      })
    })

    describe('#getEventAgency', function () {
      describe('when the event has a supplier', function () {
        it('should return supplier as the agency', function () {
          const mockEvent = {
            supplier: 'supplier',
          }
          const details = getEventAgency(mockEvent)
          expect(details).to.deep.equal({
            agency: 'supplier',
          })
        })
      })

      describe('when the event has no supplier but has a default agency', function () {
        const mockEvent = { event_type: 'foo' }
        let details
        beforeEach(function () {
          i18n.exists.returns(true)
          details = getEventAgency(mockEvent)
        })
        it('should lookup the default agency for the event type', function () {
          expect(i18n.exists).to.be.calledOnceWithExactly(
            'events::foo.default_agency'
          )
        })

        it('should get default agency for event type', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::foo.default_agency'
          )
        })

        it('should return the event default as the agency', function () {
          expect(details).to.deep.equal({
            agency: 'events::foo.default_agency',
          })
        })
      })

      describe('when the event has no supplier and no default agency', function () {
        const mockEvent = { event_type: 'foo' }
        let details
        beforeEach(function () {
          details = getEventAgency(mockEvent)
        })
        it('should lookup the default agency for the event type', function () {
          expect(i18n.exists).to.be.calledOnceWithExactly(
            'events::foo.default_agency'
          )
        })

        it('should get the base default agency', function () {
          expect(i18n.t).to.be.calledOnceWithExactly('events::default_agency')
        })

        it('should return base default agency as the agency', function () {
          expect(details).to.deep.equal({
            agency: 'events::default_agency',
          })
        })
      })
    })

    describe('#getEventContext', function () {
      describe('when the event has no context key', function () {
        it('should return undefined for the context', function () {
          const mockEvent = {
            event_type: 'foo',
            details: {
              'events::foo.contextKey': 'bar',
            },
          }
          const details = getEventContext(mockEvent)
          expect(details).to.deep.equal({
            context: undefined,
          })
        })
      })

      describe('when the event has a context key and a value for that property', function () {
        beforeEach(function () {
          i18n.exists.returns(true)
        })
        it('should return the property value as the context', function () {
          const mockEvent = {
            event_type: 'foo',
            details: {
              'events::foo.contextKey': 'bar',
            },
          }
          const details = getEventContext(mockEvent)
          expect(details).to.deep.equal({
            context: 'bar',
          })
        })
      })

      describe('when the event has a context key but no value for that property', function () {
        beforeEach(function () {
          i18n.exists.returns(true)
        })
        it('should return undefined for the context', function () {
          const mockEvent = {
            event_type: 'foo',
          }
          const details = getEventContext(mockEvent)
          expect(details).to.deep.equal({
            context: undefined,
          })
        })
      })
    })

    describe('#getEventRelationships', function () {
      it('should only return relationships defined in model', function () {
        const mockEvent = {
          rel_a: 'rel_a',
          rel_b: 'rel_b',
          eventable: 'eventable',
          prop_a: 'prop_a',
          prop_b: 'prop_b',
          details: {},
        }
        const details = getEventRelationships(mockEvent)
        expect(details).to.deep.equal({
          rel_a: 'rel_a',
          rel_b: 'rel_b',
          eventable: 'eventable',
        })
      })
    })

    describe('#getEventableDetails', function () {
      it('should return the eventable as a property named as its singularised type', function () {
        const mockEvent = {
          eventable: {
            id: 'bar',
            type: 'foos',
          },
        }
        const details = getEventableDetails(mockEvent)
        expect(details).to.deep.equal({
          foo: {
            id: 'bar',
            type: 'foos',
          },
        })
      })

      it('should return not the eventable as a property if it has no type', function () {
        const mockEvent = {
          eventable: {
            id: 'bar',
          },
        }
        const details = getEventableDetails(mockEvent)
        expect(details).to.deep.equal({})
      })
    })

    describe('#getEventProperties', function () {
      it('should return the notes and timestamp', function () {
        const mockEvent = {
          notes: 'notes',
          occurred_at: 'timestamp',
          foo: 'foo',
          details: { bar: 'baz' },
          created_by: 'TUSER',
        }
        const details = getEventProperties(mockEvent)
        expect(details).to.deep.equal({
          notes: 'notes',
          occurred_at: 'timestamp',
          created_by: 'TUSER',
        })
      })
    })
  })
})
