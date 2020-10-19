const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

const middleware = require('./set-results.moves')

const mockActiveMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]
const mockCancelledMoves = [
  { id: '5', foo: 'bar', status: 'cancelled' },
  { id: '6', fizz: 'buzz', status: 'cancelled' },
]
const mockBodyKey = 'outgoing'
const mockLocationKey = 'from_location'
const errorStub = new Error('Problem')

describe('Moves middleware', function () {
  describe('#setResultsMoves()', function () {
    let req, res, nextSpy, moveToCardComponentMapStub

    beforeEach(async function () {
      sinon.stub(moveService, 'getActive')
      sinon.stub(moveService, 'getCancelled')
      moveToCardComponentMapStub = sinon.stub().returnsArg(0)
      sinon.stub(presenters, 'movesByLocation').returnsArg(0)
      sinon
        .stub(presenters, 'moveToCardComponent')
        .returns(moveToCardComponentMapStub)
      nextSpy = sinon.spy()
      res = {}
      req = {
        canAccess: sinon.stub().returns(false),
        body: {
          [mockBodyKey]: {
            dateRange: ['2010-10-10', '2010-10-11'],
            locationId: '5555',
          },
        },
        session: {
          currentLocation: '#location',
          featureFlags: {
            PERSON_ESCORT_RECORD: true,
          },
        },
      }
    })

    context('when API call returns successfully', function () {
      beforeEach(function () {
        moveService.getActive.resolves(mockActiveMoves)
        moveService.getCancelled.resolves(mockCancelledMoves)
      })

      context('without current location', function () {
        beforeEach(async function () {
          req.session.currentLocation = undefined
          await middleware(mockBodyKey, mockLocationKey, true)(
            req,
            res,
            nextSpy
          )
        })

        it('should not fetch the active moves', function () {
          expect(moveService.getActive).to.not.be.called
        })

        it('should not fetch the cancelled moves', function () {
          expect(moveService.getCancelled).to.not.be.called
        })

        it('should not call movesByLocation presenter', function () {
          expect(presenters.movesByLocation).to.not.be.called
        })
      })

      context('without `locationKey`', function () {
        beforeEach(async function () {
          await middleware(mockBodyKey)(req, res, nextSpy)
        })

        it('should call API with move date and location ID', function () {
          expect(moveService.getActive).to.be.calledOnceWithExactly(
            req.body[mockBodyKey]
          )
          expect(moveService.getCancelled).to.be.calledOnceWithExactly(
            req.body[mockBodyKey]
          )
        })

        it('should set resultsAsCards on req', function () {
          expect(req).to.have.property('resultsAsCards')
          expect(req.resultsAsCards).to.deep.equal({
            active: mockActiveMoves,
            cancelled: mockCancelledMoves,
          })
        })

        it('should call movesByLocation presenter without locationKey', function () {
          expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
            mockActiveMoves,
            undefined,
            undefined
          )
        })

        it('should call moveToCardComponent presenter', function () {
          expect(presenters.moveToCardComponent).to.be.calledOnceWithExactly({
            showMeta: false,
            showTags: false,
            showImage: false,
          })
          expect(moveToCardComponentMapStub.callCount).to.equal(
            mockCancelledMoves.length
          )
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with `locationKey`', function () {
        beforeEach(async function () {
          await middleware(mockBodyKey, mockLocationKey)(req, res, nextSpy)
        })

        it('should call movesByLocation presenter with locationKey', function () {
          expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
            mockActiveMoves,
            mockLocationKey,
            undefined
          )
        })
      })

      context('with `personEscortRecordFeature` enabled', function () {
        context('with correct user permission', function () {
          beforeEach(async function () {
            req.canAccess.withArgs('person_escort_record:view').returns(true)
            await middleware(mockBodyKey, mockLocationKey, true)(
              req,
              res,
              nextSpy
            )
          })

          it('should call movesByLocation presenter with locationKey', function () {
            expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
              mockActiveMoves,
              mockLocationKey,
              'personEscortRecord'
            )
          })
        })

        context('without correct user permission', function () {
          beforeEach(async function () {
            await middleware(mockBodyKey, mockLocationKey)(req, res, nextSpy)
          })

          it('should call movesByLocation presenter with locationKey', function () {
            expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
              mockActiveMoves,
              mockLocationKey,
              undefined
            )
          })
        })
      })
    })

    context('with `personEscortRecordFeature` disabled', function () {
      context('with correct user permission', function () {
        let previousPerFlag
        beforeEach(async function () {
          previousPerFlag = req.session.featureFlags.PERSON_ESCORT_RECORD
          req.session.featureFlags.PERSON_ESCORT_RECORD = false

          req.canAccess.withArgs('person_escort_record:view').returns(true)
          await middleware(mockBodyKey, mockLocationKey)(req, res, nextSpy)
        })

        afterEach(function () {
          req.session.featureFlags.PERSON_ESCORT_RECORD = previousPerFlag
        })

        it('should call movesByLocation presenter with locationKey', function () {
          expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
            mockActiveMoves,
            mockLocationKey,
            undefined
          )
        })
      })

      context('without correct user permission', function () {
        beforeEach(async function () {
          await middleware(mockBodyKey, mockLocationKey, true)(
            req,
            res,
            nextSpy
          )
        })

        it('should call movesByLocation presenter with locationKey', function () {
          expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
            mockActiveMoves,
            mockLocationKey,
            undefined
          )
        })
      })
    })

    context('when API call returns an error', function () {
      beforeEach(async function () {
        moveService.getActive.throws(errorStub)
        await middleware(mockBodyKey)(req, res, nextSpy)
      })

      it('should not request properties', function () {
        expect(req).not.to.have.property('results')
        expect(req).not.to.have.property('resultsAsCards')
      })

      it('should send error to next function', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
      })
    })
  })
})
