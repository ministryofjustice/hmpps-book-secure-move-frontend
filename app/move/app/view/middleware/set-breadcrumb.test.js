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
          session: {},
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

        it('should set master breadcrumb', function () {
          expect(res.breadcrumb).to.calledWithExactly({
            text: 'Results',
            href: '/moves',
          })
        })

        it('should set detail breadcrumb', function () {
          expect(res.breadcrumb).to.calledWithExactly({
            text: 'DOE, JOHN (ABCDEF)',
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

        it('should set master breadcrumb', function () {
          expect(res.breadcrumb).to.calledWithExactly({
            text: 'Results',
            href: '/moves',
          })
        })

        it('should set breadcrumb', function () {
          expect(res.breadcrumb).to.calledWithExactly({
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

        it('should set master breadcrumb', function () {
          expect(res.breadcrumb).to.calledOnceWithExactly({
            text: 'Results',
            href: '/moves',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with outgoing dashboard', function () {
        beforeEach(function () {
          req.session.movesUrl = '/moves/outgoing'
          middleware(req, res, nextSpy)
        })

        it('should set master breadcrumb', function () {
          expect(res.breadcrumb).to.calledWithExactly({
            text: 'Outgoing moves',
            href: '/moves/outgoing',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with incoming dashboard', function () {
        beforeEach(function () {
          req.session.movesUrl = '/moves/incoming'
          middleware(req, res, nextSpy)
        })

        it('should set master breadcrumb', function () {
          expect(res.breadcrumb).to.calledWithExactly({
            text: 'Incoming moves',
            href: '/moves/incoming',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with single requests dashboard', function () {
        beforeEach(function () {
          req.session.movesUrl = '/moves/requested'
          middleware(req, res, nextSpy)
        })

        it('should set master breadcrumb', function () {
          expect(res.breadcrumb).to.calledWithExactly({
            text: 'Single requests',
            href: '/moves/requested',
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
