import { expect } from 'chai'
import sinon from 'sinon'

// @ts-ignore // TODO: convert to ts
import presenters from '../../../../../common/presenters'
import { BasmRequest } from '../../../../../common/types/basm_request'

import middleware from './locals.move-details'

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsMoveDetails()', function () {
      let req: BasmRequest, res: any, nextSpy: any

      beforeEach(function () {
        req = {
          canAccess: sinon.stub(),
          move: {
            id: '12345',
            is_lockout: false,
            profile: { id: 'profile', person: {} },
            status: 'in_transit',
            from_location: {
              key: 'key',
              title: 'Title',
              id: 'id',
              type: 'locations',
              location_type: 'prison',
            },
            move_type: 'prison_transfer',
            important_events: [
              {
                id: 'lodging-end',
                event_type: 'MoveLodgingEnd',
                classification: 'classification',
                occurred_at: '2020-10-10T14:20:00Z',
                recorded_at: '2020-10-10T14:20:00Z',
                notes: null,
                created_by: null,
                details: {},
              },
            ],
            _canEdit: true,
            _isPerLocked: false,
          },
          journeys: [],
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)

        middleware(req, res, nextSpy)
      })

      it('should call presenter', function () {
        expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
          req.move,
          req.journeys
        )
      })

      it('should set move details on locals', function () {
        expect(res.locals).to.be.deep.equal({
          isPerLocked: false,
          moveLodgingStarted: false,
          moveLodgingEnded: true,
          moveDetails: {
            id: '12345',
            is_lockout: false,
            profile: { id: 'profile', person: {} },
            status: 'in_transit',
            from_location: {
              key: 'key',
              title: 'Title',
              id: 'id',
              type: 'locations',
              location_type: 'prison',
            },
            move_type: 'prison_transfer',
            important_events: [
              {
                id: 'lodging-end',
                event_type: 'MoveLodgingEnd',
                classification: 'classification',
                occurred_at: '2020-10-10T14:20:00Z',
                recorded_at: '2020-10-10T14:20:00Z',
                notes: null,
                created_by: null,
                details: {},
              },
            ],
            _canEdit: true,
            _isPerLocked: false,
          },
          moveId: '12345',
          moveIsEditable: true,
          moveIsLockout: false,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
