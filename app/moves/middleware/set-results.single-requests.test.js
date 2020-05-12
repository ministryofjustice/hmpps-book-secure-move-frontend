const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')

const middleware = require('./set-results.single-requests')

const mockActiveMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]

describe('Moves middleware', function() {
  describe('#setResultsSingleRequests()', function() {
    let res
    let req
    let next

    beforeEach(function() {
      sinon.stub(singleRequestService, 'getAll')
      sinon.stub(presenters, 'singleRequestsToTableComponent').returnsArg(0)
      next = sinon.stub()
      res = {
        locals: {
          status: 'proposed',
        },
      }
      req = {
        params: {
          status: 'proposed',
          locationId: '123',
        },
      }
    })

    context('with no date range', function() {
      beforeEach(async function() {
        await middleware(req, res, next)
      })

      it('should not call service', function() {
        expect(singleRequestService.getAll).not.to.have.been.called
      })

      it('should not request properties', function() {
        expect(req).not.to.have.property('results')
        expect(req).not.to.have.property('resultsAsTable')
      })

      it('should call next', function() {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('with date range', function() {
      beforeEach(function() {
        res.locals.dateRange = ['2019-01-01', '2019-01-07']
      })

      context('when service resolves', function() {
        beforeEach(async function() {
          singleRequestService.getAll.resolves(mockActiveMoves)
          await middleware(req, res, next)
        })

        it('should call the data service', function() {
          expect(
            singleRequestService.getAll
          ).to.have.been.calledOnceWithExactly({
            status: 'proposed',
            createdAtDate: ['2019-01-01', '2019-01-07'],
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

        it('should call singleRequestsToTableComponent presenter', function() {
          expect(
            presenters.singleRequestsToTableComponent
          ).to.be.calledOnceWithExactly(mockActiveMoves)
        })

        it('should call next', function() {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      })

      context('when service rejects', function() {
        const mockError = new Error('Error!')

        beforeEach(async function() {
          singleRequestService.getAll.rejects(mockError)
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
})
