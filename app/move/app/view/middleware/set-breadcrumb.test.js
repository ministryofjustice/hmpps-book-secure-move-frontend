const middleware = require('./set-breadcrumb')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#setBreadcrumb()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          baseUrl: '/base-url',
          move: {
            id: '12345',
            reference: 'ABCDEF',
          },
        }
        res = {
          breadcrumb: sinon.spy(),
        }
        nextSpy = sinon.spy()
      })

      context('when move has person', function () {
        beforeEach(function () {
          req.move.profile = {
            person: {
              _fullname: 'DOE, JOHN',
            },
          }
          middleware(req, res, nextSpy)
        })

        it('should set breadcrumb', function () {
          expect(res.breadcrumb).to.calledOnceWithExactly({
            text: 'ABCDEF (DOE, JOHN)',
            href: '/base-url',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when move does not have a person', function () {
        beforeEach(function () {
          req.move.profile = null
          middleware(req, res, nextSpy)
        })

        it('should set breadcrumb', function () {
          expect(res.breadcrumb).to.calledOnceWithExactly({
            text: 'ABCDEF',
            href: '/base-url',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without move', function () {
        beforeEach(function () {
          delete req.move
          middleware(req, res, nextSpy)
        })

        it('should set breadcrumb', function () {
          expect(res.breadcrumb).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
