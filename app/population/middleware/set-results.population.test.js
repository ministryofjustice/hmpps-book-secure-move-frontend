const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

const middleware = require('./set-results.population')

const mockActiveMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]

const mockCancelledMoves = [
  { id: '5', cancelled1: 'cancelled1', status: 'cancelled' },
  {
    id: '6',
    cancelled2: 'cancelled2',
    status: 'cancelled',
    date: '2020-09-08',
  },
]

describe('Moves middleware', function () {
  describe('#setResultsSingleRequests()', function () {
    let res
    let req
    let next
    let singleRequestsToTableStub

    beforeEach(function () {
      singleRequestsToTableStub = sinon.stub().returnsArg(0)
      sinon.stub(singleRequestService, 'getAll')
      sinon.stub(singleRequestService, 'getCancelled')
      sinon
        .stub(presenters, 'singleRequestsToTableComponent')
        .returns(singleRequestsToTableStub)
      next = sinon.stub()
      res = {}
      req = {
        body: {
          requested: {
            status: 'proposed',
            createdAtDate: ['2019-01-01', '2019-01-07'],
            fromLocationId: '123',
          },
        },
      }
    })

    context('when service resolves', function () {
      beforeEach(async function () {
        singleRequestService.getAll.resolves(mockActiveMoves)
        singleRequestService.getCancelled.resolves(mockCancelledMoves)
        await middleware(req, res, next)
      })

      it('should call the data service with request body', function () {
        expect(singleRequestService.getAll).to.have.been.calledOnceWithExactly({
          status: 'proposed',
          createdAtDate: ['2019-01-01', '2019-01-07'],
          fromLocationId: '123',
        })
        expect(
          singleRequestService.getCancelled
        ).to.have.been.calledOnceWithExactly({
          status: 'proposed',
          createdAtDate: ['2019-01-01', '2019-01-07'],
          fromLocationId: '123',
        })
      })

      it('should set resultsAsTable on req', function () {
        expect(req).to.have.property('resultsAsTable')
        expect(req.resultsAsTable).to.deep.equal({
          active: mockActiveMoves,
          cancelled: [],
        })
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
        expect(req).not.to.have.property('results')
        expect(req).not.to.have.property('resultsAsTable')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })

    context(
      'should call singleRequestsToTableComponent presenter',
      function () {
        beforeEach(function () {
          singleRequestService.getAll.resolves(mockActiveMoves)
          singleRequestService.getCancelled.resolves(mockCancelledMoves)
        })

        it('with pending status', async function () {
          req.body.requested.status = 'pending'
          await middleware(req, res, next)
          expect(req.resultsAsTable).to.deep.equal({
            active: mockActiveMoves,
            cancelled: [mockCancelledMoves[0]],
          })
        })

        it('with approved status', async function () {
          req.body.requested.status = 'approved'
          await middleware(req, res, next)
          expect(req.resultsAsTable).to.deep.equal({
            active: mockActiveMoves,
            cancelled: [mockCancelledMoves[1]],
          })
        })

        it('with rejected status', async function () {
          req.body.requested.status = 'rejected'
          await middleware(req, res, next)
          expect(req.resultsAsTable).to.deep.equal({
            active: mockActiveMoves,
            cancelled: [],
          })
        })
      }
    )
  })
})
