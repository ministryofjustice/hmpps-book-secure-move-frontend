const middleware = require('./set-breadcrumb')

describe('Population middleware', function () {
  describe('#setBreadcrumb()', function () {
    let res
    let req
    let next
    let breadcrumbSpy

    beforeEach(function () {
      breadcrumbSpy = sinon.stub()

      next = sinon.fake()

      res = {
        breadcrumb: breadcrumbSpy,
      }
      req = {
        baseUrl: '/url-path',
        locationName: 'Lorem Ipsum',
        date: '2020-07-29',
        t: sinon.stub().returnsArg(0),
      }

      breadcrumbSpy.returns(res)
    })

    it('should format create first breadcrumb with location and text', function () {
      middleware(req, res, next)
      expect(breadcrumbSpy.firstCall).to.have.been.calledWithExactly({
        href: '/population/week/2020-07-27',
        text: 'population::breadcrumbs.home (27 Jul 2020)',
      })
    })

    it('should format create second breadcrumb with location and text', function () {
      middleware(req, res, next)
      expect(breadcrumbSpy.secondCall).to.have.been.calledWithExactly({
        href: '',
        text: req.locationName,
      })
    })

    it('should create third breadcrumb with location and text', function () {
      middleware(req, res, next)

      expect(breadcrumbSpy.thirdCall).to.have.been.calledWith({
        href: req.baseUrl,
        text: 'Wednesday 29 July',
      })
    })

    it('should call next', function () {
      middleware(req, res, next)
      expect(next).to.have.been.calledWith()
    })
  })
})
