const middleware = require('./set-download-results.single-requests')

const mockMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]

describe('Moves middleware', function () {
  describe('#setDownloadResultsSingleRequests()', function () {
    let res
    let req
    let next
    let singleRequestService

    beforeEach(function () {
      singleRequestService = {
        getDownload: sinon.stub(),
      }
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
        services: {
          singleRequest: singleRequestService,
        },
      }
    })

    context('when service resolves', function () {
      beforeEach(async function () {
        singleRequestService.getDownload.resolves(mockMoves)
        await middleware(req, res, next)
      })

      it('should call the data service with request body', function () {
        expect(
          singleRequestService.getDownload
        ).to.have.been.calledOnceWithExactly(req, {
          status: 'proposed',
          createdAtDate: ['2019-01-01', '2019-01-07'],
          fromLocationId: '123',
        })
      })

      it('should set results on req', function () {
        expect(req).to.have.property('results')
        expect(req.results).to.deep.equal(mockMoves)
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when service rejects', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        singleRequestService.getDownload.rejects(mockError)
        await middleware(req, res, next)
      })

      it('should not request properties', function () {
        expect(req).not.to.have.property('results')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
