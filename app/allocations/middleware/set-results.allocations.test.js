const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

const middleware = require('./set-results.allocations')

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

describe('Allocations middleware', function() {
  describe('#setResultsAllocations()', function() {
    let res
    let req
    let next
    let allocationsToTableStub

    beforeEach(function() {
      allocationsToTableStub = sinon.stub().returnsArg(0)
      sinon.stub(allocationService, 'getActive')
      sinon.stub(allocationService, 'getCancelled')
      sinon
        .stub(permissions, 'check')
        .returns(false)
        .withArgs('allocation:person:assign', ['allocation:person:assign'])
        .returns(true)
      sinon
        .stub(presenters, 'allocationsToTableComponent')
        .returns(allocationsToTableStub)
      next = sinon.stub()
      res = {}
      req = {
        session: {},
        query: {
          status: 'approved',
        },
        body: {
          allocations: {
            status: 'proposed',
            moveDate: ['2019-01-01', '2019-01-07'],
            fromLocationId: '123',
          },
        },
      }
    })

    context('when services resolve', function() {
      beforeEach(function() {
        allocationService.getActive.resolves(mockActiveMoves)
        allocationService.getCancelled.resolves(mockCancelledMoves)
      })

      context('by default', function() {
        beforeEach(async function() {
          await middleware(req, res, next)
        })

        it('should call the data service with request body', function() {
          expect(
            allocationService.getActive
          ).to.have.been.calledOnceWithExactly({
            fromLocationId: '123',
            moveDate: ['2019-01-01', '2019-01-07'],
            status: 'proposed',
          })
        })

        it('should call the data service with request body', function() {
          expect(
            allocationService.getCancelled
          ).to.have.been.calledOnceWithExactly({
            fromLocationId: '123',
            moveDate: ['2019-01-01', '2019-01-07'],
            status: 'proposed',
          })
        })

        it('should set results on req', function() {
          expect(req).to.have.property('results')
          expect(req.results).to.deep.equal({
            active: mockActiveMoves,
            cancelled: mockCancelledMoves,
          })
        })

        it('should set resultsAsTable on req', function() {
          expect(req).to.have.property('resultsAsTable')
          expect(req.resultsAsTable).to.deep.equal({
            active: mockActiveMoves,
            cancelled: mockCancelledMoves,
          })
        })

        it('should call presenter correct number of times', function() {
          expect(presenters.allocationsToTableComponent).to.be.calledTwice
        })

        it('should call presenter with correct config', function() {
          expect(
            presenters.allocationsToTableComponent
          ).to.be.calledWithExactly({
            query: { status: 'approved' },
            showRemaining: false,
            showFromLocation: true,
          })
        })

        it('should call presenter for active moves', function() {
          expect(allocationsToTableStub).to.have.been.calledWithExactly(
            mockActiveMoves
          )
        })

        it('should call presenter for cancelled moves', function() {
          expect(allocationsToTableStub).to.have.been.calledWithExactly(
            mockCancelledMoves
          )
        })

        it('should call next', function() {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      })

      context('when single location is selected', function() {
        beforeEach(async function() {
          req.session.currentLocation = {
            id: '123',
          }
          await middleware(req, res, next)
        })

        it('should call presenter with correct config', function() {
          expect(
            presenters.allocationsToTableComponent
          ).to.be.calledWithExactly({
            query: { status: 'approved' },
            showRemaining: false,
            showFromLocation: false,
          })
        })
      })

      context(
        'when user has permissions to assign a person to a move',
        function() {
          beforeEach(async function() {
            req.session.user = {
              permissions: ['allocation:person:assign'],
            }
            await middleware(req, res, next)
          })

          it('should call presenter with correct config', function() {
            expect(
              presenters.allocationsToTableComponent
            ).to.be.calledWithExactly({
              query: { status: 'approved' },
              showRemaining: true,
              showFromLocation: true,
            })
          })
        }
      )
    })

    context('when service rejects', function() {
      const mockError = new Error('Error!')

      beforeEach(async function() {
        allocationService.getActive.rejects(mockError)
        await middleware(req, res, next)
      })

      it('should not request properties', function() {
        expect(req).not.to.have.property('results')
        expect(req).not.to.have.property('resultsAsTable')
      })

      it('should call next with error', function() {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
