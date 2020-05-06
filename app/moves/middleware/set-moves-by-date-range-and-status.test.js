const singleRequestService = require('../../../common/services/single-request')

const middleware = require('./set-moves-by-date-range-and-status')

describe('Moves middleware', function() {
  describe('#setMovesByDateRangeAndStatus()', function() {
    let res
    let req
    let next

    beforeEach(function() {
      sinon.stub(singleRequestService, 'getAll')
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

      it('returns next', function() {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('with date range', function() {
      beforeEach(function() {
        res.locals.dateRange = ['2019-01-01', '2019-01-07']
      })

      context('when service resolves', function() {
        beforeEach(async function() {
          singleRequestService.getAll.resolves({})
          await middleware(req, res, next)
        })

        it('interrogates the data service', function() {
          expect(
            singleRequestService.getAll
          ).to.have.been.calledOnceWithExactly({
            status: 'proposed',
            createdAtDate: ['2019-01-01', '2019-01-07'],
            fromLocationId: '123',
          })
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

        it('should call next with error', function() {
          expect(next).to.have.been.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
