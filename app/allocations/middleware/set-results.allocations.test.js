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

    beforeEach(function() {
      sinon.stub(allocationService, 'getActiveAllocations')
      sinon.stub(allocationService, 'getCancelledAllocations')
      sinon.stub(presenters, 'allocationsToTable').returnsArg(0)
      next = sinon.stub()
      res = {}
      req = {
        body: {
          allocations: {
            status: 'proposed',
            moveDate: ['2019-01-01', '2019-01-07'],
            fromLocationId: '123',
          },
        },
      }
    })

    context('when service resolves', function() {
      beforeEach(async function() {
        allocationService.getActiveAllocations.resolves(mockActiveMoves)
        allocationService.getCancelledAllocations.resolves(mockCancelledMoves)
        await middleware(req, res, next)
      })

      it('should call the data service with request body', function() {
        expect(
          allocationService.getActiveAllocations
        ).to.have.been.calledOnceWithExactly({
          fromLocationId: '123',
          moveDate: ['2019-01-01', '2019-01-07'],
          status: 'proposed',
        })
        expect(
          allocationService.getCancelledAllocations
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

      it('should call allocationsToTable presenter', function() {
        expect(presenters.allocationsToTable).to.be.calledTwice
      })
      it('should call allocationsToTable presenter for active moves', function() {
        expect(presenters.allocationsToTable.firstCall.firstArg).to.deep.equal(
          mockActiveMoves
        )
      })
      it('should call allocationsToTable presenter for cancelled moves', function() {
        expect(presenters.allocationsToTable.secondCall.firstArg).to.deep.equal(
          mockCancelledMoves
        )
      })

      it('should call next', function() {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when service rejects', function() {
      const mockError = new Error('Error!')

      beforeEach(async function() {
        allocationService.getActiveAllocations.rejects(mockError)
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
