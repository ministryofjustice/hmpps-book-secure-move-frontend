const setBreadcrumb = require('./set-breadcrumb')

describe('Person app', function () {
  describe('Middleware', function () {
    describe('#setBreadcrumb()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = { baseUrl: '/base-url' }
        res = { breadcrumb: sinon.spy() }
        nextSpy = sinon.spy()
      })

      context('when req has a person', function () {
        beforeEach(function () {
          req.person = { _fullname: 'DOE, JOHN' }
          setBreadcrumb(req, res, nextSpy)
        })

        it('should set breadcrumb', function () {
          expect(res.breadcrumb).to.calledOnceWithExactly({
            text: 'DOE, JOHN',
            href: '/base-url',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when req does not have a person', function () {
        beforeEach(function () {
          req.person = null
          setBreadcrumb(req, res, nextSpy)
        })

        it('should not set breadcrumb', function () {
          expect(res.breadcrumb).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
