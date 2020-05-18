const middleware = require('./middleware')

describe('Home middleware', function() {
  describe('#overrideBodySingleRequests()', function() {
    const mockDate = '2017-08-10'
    let mockRes, mockReq, nextSpy

    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
    })

    afterEach(function() {
      this.clock.restore()
    })

    beforeEach(function() {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        body: {
          requested: {
            foo: 'bar',
            fizz: 'buzz',
            createdAtDate: ['2020-10-10', '2020-10-16'],
            fromLocationId: '12345',
          },
        },
      }
    })

    context('without current location', function() {
      beforeEach(function() {
        middleware.overrideBodySingleRequests(mockReq, mockRes, nextSpy)
      })

      it('should override values correctly', function() {
        middleware.overrideBodySingleRequests(mockReq, mockRes, nextSpy)

        expect(mockReq.body.requested).to.deep.equal({
          foo: 'bar',
          fizz: 'buzz',
          createdAtDate: ['2017-08-07', '2017-08-13'],
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

      it('should override values correctly', function() {
        middleware.overrideBodySingleRequests(mockReq, mockRes, nextSpy)

        expect(mockReq.body.requested).to.deep.equal({
          foo: 'bar',
          fizz: 'buzz',
          createdAtDate: ['2017-08-07', '2017-08-13'],
          fromLocationId: '67890',
        })
      })
    })
  })
})
