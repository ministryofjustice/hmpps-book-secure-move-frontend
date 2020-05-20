const presenters = require('../../../common/presenters')
const allocationService = require('../../../common/services/allocation')

const middleware = require('./set-results.allocations')

const mockActiveMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]

describe('Allocations middleware', function() {
  describe('#setResultsAllocations()', function() {
    let res
    let req
    let next

    beforeEach(function() {
      sinon.stub(allocationService, 'getByDateLocationAndStatus')
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
        allocationService.getByDateLocationAndStatus.resolves(mockActiveMoves)
        await middleware(req, res, next)
      })

      it('should call the data service with request body', function() {
        expect(
          allocationService.getByDateLocationAndStatus
        ).to.have.been.calledOnceWithExactly({
          status: 'proposed',
          moveDate: ['2019-01-01', '2019-01-07'],
          fromLocationId: '123',
        })
      })

      it('should set results on req', function() {
        expect(req).to.have.property('results')
        expect(req.results).to.deep.equal({
          active: mockActiveMoves,
          cancelled: [],
        })
      })

      it('should set resultsAsTable on req', function() {
        expect(req).to.have.property('resultsAsTable')
        expect(req.resultsAsTable).to.deep.equal({
          active: mockActiveMoves,
          cancelled: [],
        })
      })

      it('should call allocationsToTable presenter', function() {
        expect(presenters.allocationsToTable).to.be.calledOnceWithExactly(
          mockActiveMoves
        )
      })

      it('should call next', function() {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when service rejects', function() {
      const mockError = new Error('Error!')

      beforeEach(async function() {
        allocationService.getByDateLocationAndStatus.rejects(mockError)
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
