const dateHelpers = require('../../../common/helpers/date')

const middleware = require('./set-body.allocations')

describe('Allocations middleware', function () {
  describe('#setBodyAllocations()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      sinon
        .stub(dateHelpers, 'getCurrentWeekAsRange')
        .returns(['2010-10-10', '2010-10-07'])
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        locations: ['1', '2', '3'],
        params: {},
        query: {
          status: 'pending',
          sortBy: 'moves_count',
          sortDirection: 'asc',
        },
        checkPermissions: sinon.stub().returns(false),
      }
    })

    context('without date range', function () {
      beforeEach(function () {
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should assign req.body correctly', function () {
        expect(mockReq.body.allocations).to.deep.equal({
          status: 'pending',
          moveDate: ['2010-10-10', '2010-10-07'],
          locations: mockReq.locations,
          sortBy: 'moves_count',
          sortDirection: 'asc',
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with date range', function () {
      beforeEach(function () {
        mockReq.params.dateRange = ['2020-10-10', '2020-10-10']
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should assign req.body correctly', function () {
        expect(mockReq.body.allocations).to.deep.equal({
          status: 'pending',
          moveDate: ['2020-10-10', '2020-10-10'],
          locations: mockReq.locations,
          sortBy: 'moves_count',
          sortDirection: 'asc',
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when user has assign role', function () {
      beforeEach(function () {
        mockReq.checkPermissions.returns(true)
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should use fromLocations rather than locations filter', function () {
        expect(mockReq.body.allocations).to.deep.equal({
          status: 'pending',
          moveDate: ['2010-10-10', '2010-10-07'],
          fromLocations: mockReq.locations,
          sortBy: 'moves_count',
          sortDirection: 'asc',
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
