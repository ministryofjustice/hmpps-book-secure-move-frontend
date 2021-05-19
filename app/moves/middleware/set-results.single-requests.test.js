const presenters = require('../../../common/presenters')

const middleware = require('./set-results.single-requests')

const mockActiveMoves = {
  data: [
    { id: '1', foo: 'bar', status: 'requested' },
    { id: '2', fizz: 'buzz', status: 'requested' },
    { id: '3', foo: 'bar', status: 'completed' },
    { id: '4', fizz: 'buzz', status: 'completed' },
  ],
  meta: {
    pagination: {
      total_pages: 2,
    },
  },
}

describe('Moves middleware', function () {
  describe('#setResultsSingleRequests()', function () {
    let res
    let req
    let next
    let singleRequestsToTableStub
    let singleRequestService

    beforeEach(function () {
      singleRequestsToTableStub = sinon.stub().returnsArg(0)
      singleRequestService = {
        getAll: sinon.stub().resolves(mockActiveMoves),
      }
      sinon
        .stub(presenters, 'singleRequestsToTableComponent')
        .returns(singleRequestsToTableStub)
      next = sinon.stub()
      res = {}
      req = {
        query: { status: 'filled' },
        body: {
          requested: {
            status: 'proposed',
            createdAtDate: ['2019-01-01', '2019-01-07'],
            fromLocationId: '123',
          },
        },
        services: {
          singleRequest: singleRequestService,
        },
        session: {
          currentLocation: {
            location_type: 'prison',
          },
        },
      }
    })

    context('when service resolves', function () {
      beforeEach(async function () {
        await middleware(req, res, next)
      })

      it('should call the data service with request body', function () {
        expect(singleRequestService.getAll).to.have.been.calledOnceWithExactly({
          status: 'proposed',
          createdAtDate: ['2019-01-01', '2019-01-07'],
          fromLocationId: '123',
        })
      })

      it('should set results on req', function () {
        expect(req).to.have.property('results')
        expect(req.results).to.deep.equal(mockActiveMoves)
      })

      it('should set resultsAsTable on req', function () {
        expect(req).to.have.property('resultsAsTable')
        expect(req.resultsAsTable).to.deep.equal(mockActiveMoves.data)
      })

      it('should call presenter with correct config', function () {
        expect(
          presenters.singleRequestsToTableComponent
        ).to.be.calledWithExactly({ query: { status: 'filled' } })

        expect(singleRequestsToTableStub).to.be.calledWithExactly(
          mockActiveMoves.data
        )
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when service rejects', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        singleRequestService.getAll.rejects(mockError)
        await middleware(req, res, next)
      })

      it('should not request properties', function () {
        expect(req).not.to.have.property('resultsAsTable')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
