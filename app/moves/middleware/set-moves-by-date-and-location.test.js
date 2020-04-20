const moveService = require('../../../common/services/move')

const middleware = require('./set-moves-by-date-and-location')

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
const errorStub = new Error('Problem')

describe('Moves middleware', function() {
  describe('#setMovesByDateAndLocation()', function() {
    let res, nextSpy
    const mockCurrentLocation = '5555'

    beforeEach(async function() {
      sinon.stub(moveService, 'getActive')
      sinon.stub(moveService, 'getCancelled')
      nextSpy = sinon.spy()
      res = { locals: {} }
    })

    context('when no move date exists', function() {
      beforeEach(async function() {
        await middleware({}, res, nextSpy)
      })

      it('should call next with no argument', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move date', function() {
        expect(moveService.getActive).not.to.be.called
        expect(moveService.getCancelled).not.to.be.called
      })

      it('should not set response data to locals object', function() {
        expect(res.locals).not.to.have.property('movesByDate')
      })
    })

    context('when move date exists', function() {
      beforeEach(function() {
        res = {
          locals: {
            dateRange: ['2010-10-10', '2010-10-11'],
          },
        }
      })

      context('when API call returns successfully', function() {
        beforeEach(function() {
          moveService.getActive.resolves(mockActiveMoves)
          moveService.getCancelled.resolves(mockCancelledMoves)
        })

        context('with location ID', function() {
          beforeEach(async function() {
            res.locals.fromLocationId = mockCurrentLocation
            await middleware({}, res, nextSpy)
          })

          it('should call API with move date and location ID', function() {
            expect(moveService.getActive).to.be.calledOnceWithExactly({
              dateRange: res.locals.dateRange,
              fromLocationId: res.locals.fromLocationId,
            })
            expect(moveService.getCancelled).to.be.calledOnceWithExactly({
              dateRange: res.locals.dateRange,
              fromLocationId: res.locals.fromLocationId,
            })
          })

          it('should set requested moves on locals', function() {
            expect(res.locals).to.have.property('activeMovesByDate')
            expect(res.locals.activeMovesByDate).to.deep.equal(mockActiveMoves)
          })

          it('should set cancelled moves on locals', function() {
            expect(res.locals).to.have.property('cancelledMovesByDate')
            expect(res.locals.cancelledMovesByDate).to.deep.equal(
              mockCancelledMoves
            )
          })

          it('should call next with no argument', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })

      context('when API call returns an error', function() {
        beforeEach(async function() {
          moveService.getActive.throws(errorStub)
          await middleware({}, res, nextSpy)
        })

        it('should not set locals properties', function() {
          expect(res.locals).not.to.have.property('activeMovesByDate')
          expect(res.locals).not.to.have.property('cancelledMovesByDate')
        })

        it('should send error to next function', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
