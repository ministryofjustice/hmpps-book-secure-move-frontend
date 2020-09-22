const dateHelpers = require('../../../common/helpers/date')

const middleware = require('./set-body.single-requests')

describe('Moves middleware', function () {
  describe('#setBodySingleRequests()', function () {
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
          sortBy: 'createdAtDate',
          sortDirection: 'asc',
        },
      }
    })

    context('without date range', function () {
      beforeEach(function () {
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should assign req.body correctly', function () {
        expect(mockReq.body.requested).to.deep.equal({
          status: 'pending',
          createdAtDate: ['2010-10-10', '2010-10-07'],
          fromLocationId: mockReq.locations,
          sortBy: 'createdAtDate',
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
        expect(mockReq.body.requested).to.deep.equal({
          status: 'pending',
          createdAtDate: ['2020-10-10', '2020-10-10'],
          fromLocationId: mockReq.locations,
          sortBy: 'createdAtDate',
          sortDirection: 'asc',
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
