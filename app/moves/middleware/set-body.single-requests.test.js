const middleware = require('./set-body.single-requests')

describe('Moves middleware', function() {
  describe('#setBodySingleRequests()', function() {
    let mockRes, mockReq, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      mockRes = {
        locals: {
          dateRange: ['2020-10-10', '2020-10-10'],
        },
      }
      mockReq = {
        params: {
          locationId: '7ebc8717-ff5b-4be0-8515-3e308e92700f',
        },
        query: {
          status: 'pending',
        },
      }

      middleware(mockReq, mockRes, nextSpy)
    })

    it('should assign req.body correctly', function() {
      expect(mockReq.body).to.deep.equal({
        status: 'pending',
        createdAtDate: ['2020-10-10', '2020-10-10'],
        fromLocationId: '7ebc8717-ff5b-4be0-8515-3e308e92700f',
      })
    })

    it('should call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })
})
