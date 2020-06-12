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
        params: {
          locationId: '7ebc8717-ff5b-4be0-8515-3e308e92700f',
        },
        query: {
          status: 'pending',
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
          fromLocationId: '7ebc8717-ff5b-4be0-8515-3e308e92700f',
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
          fromLocationId: '7ebc8717-ff5b-4be0-8515-3e308e92700f',
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
