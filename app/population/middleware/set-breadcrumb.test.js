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
        date: '2020-07-29',
        location: {
          title: 'Lorem Ipsum',
          id: 'ABADCAFE',
        },
        params: {
          period: 'week',
        },
        t: sinon.stub().returnsArg(0),
      }

      breadcrumbSpy.returns(res)
    })

    context('week is current week', function () {
      beforeEach(function () {
        this.clock = sinon.useFakeTimers(new Date('2020-07-28').getTime())
      })

      afterEach(function () {
        this.clock.restore()
      })

      it('should format create first breadcrumb as relative week', function () {
        middleware(req, res, next)
        expect(breadcrumbSpy.firstCall).to.have.been.calledWithExactly({
          href: '/population/week/2020-07-27',
          text: 'population::breadcrumbs.home (this week)',
        })
      })
    })

    context('week is any other week', function () {
      it('should format create first breadcrumb start of week', function () {
        middleware(req, res, next)
        expect(breadcrumbSpy.firstCall).to.have.been.calledWithExactly({
          href: '/population/week/2020-07-27',
          text: 'population::breadcrumbs.home (27 Jul 2020)',
        })
      })
    })

    it('should format create second breadcrumb with location', function () {
      middleware(req, res, next)
      expect(breadcrumbSpy.secondCall).to.have.been.calledWithExactly({
        href: '/population/week/2020-07-27/ABADCAFE',
        text: req.location.title,
      })
    })

    describe('period is week', function () {
      it('should not create third breadcrumb', function () {
        middleware(req, res, next)

        expect(breadcrumbSpy).to.have.been.calledTwice
      })
    })

    describe('period is day', function () {
      it('should create third breadcrumb with date', function () {
        req.params.period = 'day'
        middleware(req, res, next)

        expect(breadcrumbSpy.thirdCall).to.have.been.calledWith({
          href: '/population/day/2020-07-29/ABADCAFE',
          text: 'Wednesday 29 July',
        })
      })
    })

    it('should call next', function () {
      middleware(req, res, next)
      expect(next).to.have.been.calledWith()
    })
  })
})
