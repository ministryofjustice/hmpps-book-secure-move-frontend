const middleware = require('./middleware')

describe('Home middleware', function() {
  describe('#overrideBodySingleRequests()', function() {
    let mockRes, mockReq, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        body: {
          requested: {
            foo: 'bar',
            fizz: 'buzz',
            fromLocationId: '12345',
          },
          allocations: {
            foo: 'bar',
            fizz: 'buzz',
            fromLocationId: '12345',
          },
        },
      }
    })

    context('without current location', function() {
      beforeEach(function() {
        middleware.overrideBodySingleRequests(mockReq, mockRes, nextSpy)
      })

      it('should override requested values correctly', function() {
        expect(mockReq.body.requested).to.deep.equal({
          foo: 'bar',
          fizz: 'buzz',
          fromLocationId: undefined,
        })
      })

      it('should override allocation values correctly', function() {
        expect(mockReq.body.allocations).to.deep.equal({
          foo: 'bar',
          fizz: 'buzz',
          fromLocationId: undefined,
        })
      })
    })

    context('without current location', function() {
      beforeEach(function() {
        mockReq.session = {
          currentLocation: {
            id: '67890',
          },
        }
        middleware.overrideBodySingleRequests(mockReq, mockRes, nextSpy)
      })

      it('should override requested values correctly', function() {
        expect(mockReq.body.requested).to.deep.equal({
          foo: 'bar',
          fizz: 'buzz',
          fromLocationId: '67890',
        })
      })

      it('should override allocation values correctly', function() {
        expect(mockReq.body.allocations).to.deep.equal({
          foo: 'bar',
          fizz: 'buzz',
          fromLocationId: '67890',
        })
      })
    })
  })
})
