const presenters = require('../../../common/presenters')

const middleware = require('./set-results.moves')

const mockActiveMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]
const mockBodyKey = 'outgoing'
const mockLocationKey = 'from_location'
const errorStub = new Error('Problem')

describe('Moves middleware', function () {
  describe('#setResultsMoves()', function () {
    let req, res, nextSpy, moveToCardComponentMapStub, moveService

    beforeEach(async function () {
      moveService = {
        getActive: sinon.stub(),
      }
      moveToCardComponentMapStub = sinon.stub().returnsArg(0)
      sinon.stub(presenters, 'movesByVehicle').returnsArg(0)
      sinon.stub(presenters, 'movesByLocation').returnsArg(0)
      sinon
        .stub(presenters, 'moveToCardComponent')
        .returns(moveToCardComponentMapStub)
      nextSpy = sinon.spy()
      res = {}
      req = {
        query: {},
        canAccess: sinon.stub().returns(false),
        body: {
          [mockBodyKey]: {
            dateRange: ['2010-10-10', '2010-10-11'],
            locationId: '5555',
          },
        },
        location: {
          location_type: 'prison',
        },
        services: {
          move: moveService,
        },
      }
    })

    context('when API call returns successfully', function () {
      beforeEach(function () {
        moveService.getActive.resolves(mockActiveMoves)
      })

      context('without current location', function () {
        beforeEach(async function () {
          req.location = undefined
          await middleware(mockBodyKey, mockLocationKey)(req, res, nextSpy)
        })

        it('should not fetch the active moves', function () {
          expect(moveService.getActive).to.not.be.called
        })

        it('should not call movesByLocation presenter', function () {
          expect(presenters.movesByLocation).to.not.be.called
        })

        it('should not call movesByVehicle presenter', function () {
          expect(presenters.movesByVehicle).to.not.be.called
        })
      })

      context('without `locationKey`', function () {
        beforeEach(async function () {
          await middleware(mockBodyKey)(req, res, nextSpy)
        })

        it('should call API with req body', function () {
          expect(moveService.getActive).to.be.calledOnceWithExactly(
            req.body[mockBodyKey]
          )
        })

        it('should set resultsAsCards on req', function () {
          expect(req).to.have.property('resultsAsCards')
          expect(req.resultsAsCards).to.deep.equal(mockActiveMoves)
        })

        it('should call movesByLocation presenter without locationKey', function () {
          expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
            mockActiveMoves,
            undefined,
            'prison'
          )
        })

        it('should not call movesByVehicle presenter', function () {
          expect(presenters.movesByVehicle).to.not.be.called
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
            'prison'
          )
        })

        it('should not call movesByVehicle presenter', function () {
          expect(presenters.movesByVehicle).to.not.be.called
        })
      })

      context('with group by vehicle', function () {
        beforeEach(function () {
          req.query.group_by = 'vehicle'
        })

        context('without location key', function () {
          beforeEach(async function () {
            await middleware(mockBodyKey)(req, res, nextSpy)
          })

          it('should call movesByVehicle presenter with locationKey', function () {
            expect(presenters.movesByVehicle).to.be.calledOnceWithExactly({
              moves: mockActiveMoves,
              context: 'outgoing',
              showLocations: false,
              locationType: 'prison',
            })
          })

          it('should not call movesByLocation presenter', function () {
            expect(presenters.movesByLocation).to.not.be.called
          })
        })

        context('with from_location key', function () {
          beforeEach(async function () {
            await middleware(mockBodyKey, 'from_location')(req, res, nextSpy)
          })
          it('should call movesByVehicle presenter with locationKey', function () {
            expect(presenters.movesByVehicle).to.be.calledOnceWithExactly({
              moves: mockActiveMoves,
              context: 'incoming',
              showLocations: false,
              locationType: 'prison',
            })
          })
        })
      })
    })

    context('when API call returns an error', function () {
      beforeEach(async function () {
        req.services.move.getActive = sinon.stub().throws(errorStub)
        await middleware(mockBodyKey)(req, res, nextSpy)
      })

      it('should not request properties', function () {
        expect(req).not.to.have.property('resultsAsCards')
      })

      it('should send error to next function', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
      })
    })
  })
})
