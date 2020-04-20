const moveService = require('../../../common/services/move')

const middleware = require('./set-moves-by-date-all-locations')

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
  describe('#setMovesByDateAllLocations()', function() {
    let res, nextSpy

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

        context('without location ID', function() {
          let req

          beforeEach(function() {
            req = {
              session: {
                user: {},
              },
            }
          })

          context('with user locations', function() {
            beforeEach(async function() {
              req.session.user.locations = Array(75)
                .fill()
                .map((v, i) => {
                  return { id: i, title: `Mock location ${i}` }
                })

              await middleware(req, res, nextSpy)
            })
            it('should call the API with batches of 40 locations by default', function() {
              expect(req.session.user.locations).to.have.length(75)
              expect(moveService.getActive).to.have.callCount(2)
              expect(moveService.getActive).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 40)
                  .join(','),
              })
              expect(moveService.getActive).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(40)
                  .join(','),
              })

              expect(moveService.getCancelled).to.have.callCount(2)
              expect(moveService.getCancelled).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 40)
                  .join(','),
              })
              expect(moveService.getCancelled).to.be.calledWithExactly({
                dateRange: res.locals.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(40)
                  .join(','),
              })
            })

            it('should set active moves on locals', function() {
              expect(res.locals).to.have.property('activeMovesByDate')
              expect(res.locals.activeMovesByDate).to.deep.equal([
                ...mockActiveMoves,
                ...mockActiveMoves,
              ])
            })

            it('should set cancelled moves on locals', function() {
              expect(res.locals).to.have.property('cancelledMovesByDate')
              expect(res.locals.cancelledMovesByDate).to.deep.equal([
                ...mockCancelledMoves,
                ...mockCancelledMoves,
              ])
            })
          })
        })
      })

      context('when API call returns an error', function() {
        beforeEach(async function() {
          const req = {
            session: {
              user: {
                locations: [{ id: 1, title: 'Test location' }],
              },
            },
          }
          moveService.getActive.throws(errorStub)
          await middleware(req, res, nextSpy)
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
