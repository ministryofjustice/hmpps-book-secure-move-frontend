const middleware = require('./set-section-breadcrumb')

describe('Framework middleware', function () {
  describe('#setSectionBreadcrumb', function () {
    let mockReq, mockRes, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockReq = {
        baseUrl: '/base-url',
        frameworkSection: {
          name: 'Framework name',
        },
      }
      mockRes = {
        breadcrumb: sinon.stub().returnsThis(),
      }
      middleware(mockReq, mockRes, nextSpy)
    })

    it('should set breadcrumb item', function () {
      expect(mockRes.breadcrumb).to.have.been.calledOnceWithExactly({
        text: 'Framework name',
        href: '/base-url',
      })
    })

    it('should call next without error', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })
})
