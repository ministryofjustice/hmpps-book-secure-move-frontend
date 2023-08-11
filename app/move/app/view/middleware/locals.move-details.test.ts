import { expect } from 'chai'
import sinon from 'sinon'

// @ts-ignore // TODO: convert to ts
import presenters from '../../../../../common/presenters'
import { BasmRequest } from '../../../../../common/types/basm_request'
import I18n from '../../../../../config/i18n'
import { GenericEventFactory } from '../../../../../factories/generic_event'
import { JourneyFactory } from '../../../../../factories/journey'

import middleware from './locals.move-details'

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsMoveDetails()', function () {
      let req: BasmRequest, res: any, nextSpy: any

      beforeEach(function () {
        req = {
          canAccess: sinon.stub(),
          move: {
            date: '2023-03-27',
            id: '12345',
            is_lockout: false,
            is_lodging: false,
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
          t: I18n.t,
          form: { options: { fields: {}, next: '' }, values: {} },
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
            is_lodging: false,
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
            date: '2023-03-27',
          },
          moveId: '12345',
          moveIsEditable: true,
          moveIsLockout: false,
          moveIsLodging: false,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      context('when the move is a lockout', function () {
        beforeEach(function () {
          req.move.is_lockout = true
        })

        context('when req has 1 journey', function () {
          beforeEach(function () {
            req.journeys = [JourneyFactory.build({ state: 'completed' })]
          })

          context('when the move has no PerHandover', function () {
            beforeEach(function () {
              middleware(req, res, nextSpy)
            })

            it('should set moveLockoutHandover with recorded: false', function () {
              expect(res.locals.moveLockoutHandover).to.not.be.undefined
              expect(res.locals.moveLockoutHandover.recorded).to.be.false
            })
          })

          context('when the move has a PerHandover', function () {
            beforeEach(function () {
              // @ts-ignore
              req.move.important_events.push(
                GenericEventFactory.build({
                  event_type: 'PerHandover',
                  // @ts-ignore
                  location: req.journeys[0].from_location,
                })
              )

              middleware(req, res, nextSpy)
            })

            it('should set moveLockoutHandover with recorded: true', function () {
              expect(res.locals.moveLockoutHandover).to.not.be.undefined
              expect(res.locals.moveLockoutHandover.recorded).to.be.true
            })
          })
        })
      })

      context('when the move is a lodging', function () {
        beforeEach(function () {
          req.move.is_lodging = true
        })

        context('when req has 1 journey', function () {
          beforeEach(function () {
            req.journeys = [JourneyFactory.build({ state: 'completed' })]
          })

          context('when the move has no PerHandover', function () {
            beforeEach(function () {
              middleware(req, res, nextSpy)
            })

            it('should set moveLodgingHandover with recorded: false', function () {
              expect(res.locals.moveLodgingHandover).to.not.be.undefined
              expect(res.locals.moveLodgingHandover.recorded).to.be.false
            })
          })

          context('when the move has a PerHandover', function () {
            beforeEach(function () {
              // @ts-ignore
              req.move.important_events.push(
                GenericEventFactory.build({
                  event_type: 'PerHandover',
                  // @ts-ignore
                  location: req.journeys[0].from_location,
                })
              )

              middleware(req, res, nextSpy)
            })

            it('should set moveLodgingHandover with recorded: true', function () {
              expect(res.locals.moveLodgingHandover).to.not.be.undefined
              expect(res.locals.moveLodgingHandover.recorded).to.be.true
            })
          })
        })
      })
    })
  })
})
