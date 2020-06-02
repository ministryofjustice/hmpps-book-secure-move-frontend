const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

const middleware = require('./set-results.outgoing')

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
const mockCurrentLocation = '5555'
const errorStub = new Error('Problem')

describe('Moves middleware', function() {
  describe('#setResultsOutgoing()', function() {
    let req, res, nextSpy, moveToCardComponentMapStub

    beforeEach(async function() {
      sinon.stub(moveService, 'getActive')
      sinon.stub(moveService, 'getCancelled')
      moveToCardComponentMapStub = sinon.stub().returnsArg(0)
      sinon.stub(presenters, 'movesByLocation').returnsArg(0)
      sinon
        .stub(presenters, 'moveToCardComponent')
        .callsFake(() => moveToCardComponentMapStub)
      nextSpy = sinon.spy()
      res = {}
      req = {
        session: {
          user: {},
        },
        params: {},
      }
    })

    context('when no move date exists', function() {
      beforeEach(async function() {
        await middleware(req, res, nextSpy)
      })

      it('should call next with no argument', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move date', function() {
        expect(moveService.getActive).not.to.be.called
      })

      it('should not request properties', function() {
        expect(req).not.to.have.property('results')
        expect(req).not.to.have.property('resultsAsCards')
      })
    })

    context('when move date exists', function() {
      beforeEach(function() {
        req.params.dateRange = ['2010-10-10', '2010-10-11']
      })

      context('when API call returns successfully', function() {
        beforeEach(function() {
          moveService.getActive.resolves(mockActiveMoves)
          moveService.getCancelled.resolves(mockCancelledMoves)
        })

        context('without location ID', function() {
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
                dateRange: req.params.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 40)
                  .join(','),
              })
              expect(moveService.getActive).to.be.calledWithExactly({
                dateRange: req.params.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(40)
                  .join(','),
              })

              expect(moveService.getCancelled).to.have.callCount(2)
              expect(moveService.getCancelled).to.be.calledWithExactly({
                dateRange: req.params.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(0, 40)
                  .join(','),
              })
              expect(moveService.getCancelled).to.be.calledWithExactly({
                dateRange: req.params.dateRange,
                fromLocationId: req.session.user.locations
                  .map(location => location.id)
                  .slice(40)
                  .join(','),
              })
            })

            it('should set results on req', function() {
              expect(req).to.have.property('results')
              expect(req.results).to.deep.equal({
                active: [...mockActiveMoves, ...mockActiveMoves],
                cancelled: [...mockCancelledMoves, ...mockCancelledMoves],
              })
            })

            it('should set resultsAsCards on req', function() {
              expect(req).to.have.property('resultsAsCards')
              expect(req.resultsAsCards).to.deep.equal({
                active: [...mockActiveMoves, ...mockActiveMoves],
                cancelled: [...mockCancelledMoves, ...mockCancelledMoves],
              })
            })

            it('should call movesByLocation presenter', function() {
              expect(presenters.movesByLocation).to.be.calledOnceWithExactly([
                ...mockActiveMoves,
                ...mockActiveMoves,
              ])
            })

            it('should call moveToCardComponent presenter', function() {
              expect(
                presenters.moveToCardComponent
              ).to.be.calledOnceWithExactly({
                showMeta: false,
                showTags: false,
                showImage: false,
              })
              expect(moveToCardComponentMapStub.callCount).to.equal(
                mockCancelledMoves.length * 2
              )
            })

            it('should call next with no argument', function() {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('with empty user locations', function() {
            beforeEach(async function() {
              req.session.user.locations = []
              await middleware(req, res, nextSpy)
            })

            it('should call next with no argument', function() {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })

            it('should not call API with move date', function() {
              expect(moveService.getActive).not.to.be.called
            })

            it('should not request properties', function() {
              expect(req).not.to.have.property('results')
              expect(req).not.to.have.property('resultsAsCards')
            })
          })
        })

        context('with location ID', function() {
          beforeEach(function() {
            moveService.getActive.resolves(mockActiveMoves)
            moveService.getCancelled.resolves(mockCancelledMoves)

            req.params.locationId = mockCurrentLocation
          })

          context('without user locations', function() {
            beforeEach(async function() {
              await middleware(req, res, nextSpy)
            })

            it('should call API with move date and location ID', function() {
              expect(moveService.getActive).to.be.calledOnceWithExactly({
                dateRange: req.params.dateRange,
                fromLocationId: mockCurrentLocation,
              })
              expect(moveService.getCancelled).to.be.calledOnceWithExactly({
                dateRange: req.params.dateRange,
                fromLocationId: mockCurrentLocation,
              })
            })

            it('should set results on req', function() {
              expect(req).to.have.property('results')
              expect(req.results).to.deep.equal({
                active: mockActiveMoves,
                cancelled: mockCancelledMoves,
              })
            })

            it('should set resultsAsCards on req', function() {
              expect(req).to.have.property('resultsAsCards')
              expect(req.resultsAsCards).to.deep.equal({
                active: mockActiveMoves,
                cancelled: mockCancelledMoves,
              })
            })

            it('should call movesByLocation presenter', function() {
              expect(presenters.movesByLocation).to.be.calledOnceWithExactly(
                mockActiveMoves
              )
            })

            it('should call moveToCardComponent presenter', function() {
              expect(
                presenters.moveToCardComponent
              ).to.be.calledOnceWithExactly({
                showMeta: false,
                showTags: false,
                showImage: false,
              })
              expect(moveToCardComponentMapStub.callCount).to.equal(
                mockCancelledMoves.length
              )
            })

            it('should call next with no argument', function() {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
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

            it('should call API with move date and location ID', function() {
              expect(moveService.getActive).to.be.calledOnceWithExactly({
                dateRange: req.params.dateRange,
                fromLocationId: mockCurrentLocation,
              })
              expect(moveService.getCancelled).to.be.calledOnceWithExactly({
                dateRange: req.params.dateRange,
                fromLocationId: mockCurrentLocation,
              })
            })

            it('should set new properties on req correctly', function() {
              expect(req).to.deep.equal({
                ...req,
                results: {
                  active: mockActiveMoves,
                  cancelled: mockCancelledMoves,
                },
                resultsAsCards: {
                  active: mockActiveMoves,
                  cancelled: mockCancelledMoves,
                },
              })
            })

            it('should call next with no argument', function() {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })
        })
      })

      context('when API call returns an error', function() {
        beforeEach(async function() {
          req.session.user = {
            locations: [{ id: 1, title: 'Test location' }],
          }
          moveService.getActive.throws(errorStub)
          await middleware(req, res, nextSpy)
        })

        it('should not request properties', function() {
          expect(req).not.to.have.property('results')
          expect(req).not.to.have.property('resultsAsCards')
        })

        it('should send error to next function', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
