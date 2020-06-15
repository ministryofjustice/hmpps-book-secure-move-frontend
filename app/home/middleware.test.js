const middleware = require('./middleware')

describe('Home middleware', function () {
  describe('#overrideLocationId()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        params: {},
      }
    })

    context('without current location', function () {
      beforeEach(function () {
        middleware.overrideLocationId(mockReq, mockRes, nextSpy)
      })

      it('should not set a location ID', function () {
        expect(mockReq.params).to.deep.equal({
          locationId: undefined,
        })
      })
    })

    context('without current location', function () {
      beforeEach(function () {
        mockReq.session = {
          currentLocation: {
            id: '67890',
          },
        }
        middleware.overrideLocationId(mockReq, mockRes, nextSpy)
      })

      it('should set a location ID', function () {
        expect(mockReq.params).to.deep.equal({
          locationId: '67890',
        })
      })
    })
  })
})
