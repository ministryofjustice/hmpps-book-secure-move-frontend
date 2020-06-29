const middleware = require('./middleware')

describe('Person escort record middleware', function () {
  describe('#setFramework()', function () {
    let mockRes, mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockRes = {}
      mockReq = {
        params: {},
      }
    })

    context('without framework', function () {
      beforeEach(function () {
        middleware.setFramework()(mockReq, mockRes, nextSpy)
      })

      it('should not set framework on request', function () {
        expect(mockReq.framework).to.be.undefined
      })
    })

    context('without current location', function () {
      const mockFramework = {
        sections: {
          one: 'bar',
        },
      }

      beforeEach(function () {
        middleware.setFramework(mockFramework)(mockReq, mockRes, nextSpy)
      })

      it('should set framework on request', function () {
        expect(mockReq.framework).to.deep.equal(mockFramework)
      })
    })
  })
})
