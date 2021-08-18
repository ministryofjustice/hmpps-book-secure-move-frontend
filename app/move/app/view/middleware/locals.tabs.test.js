const middleware = require('./locals.tabs')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsTabs()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          originalUrl: '/',
        }
        res = {
          locals: {
            urls: {
              move: {
                warnings: '/base-url/warnings',
                details: '/base-url/details',
                timeline: '/base-url/timeline',
              },
            },
          },
        }
        nextSpy = sinon.spy()
      })

      context('with other URL', function () {
        it('should contain no active tabs', function () {
          middleware(req, res, nextSpy)

          expect(res.locals).to.deep.equal({
            urls: res.locals.urls,
            tabs: [
              {
                text: 'moves::tabs.warnings',
                url: '/base-url/warnings',
                isActive: false,
              },
              {
                text: 'moves::tabs.details',
                url: '/base-url/details',
                isActive: false,
              },
              {
                text: 'moves::tabs.timeline',
                url: '/base-url/timeline',
                isActive: false,
              },
            ],
          })
        })
      })

      context('with URL from tabs', function () {
        it('should contain correct active tab', function () {
          req.originalUrl = '/base-url/warnings'
          middleware(req, res, nextSpy)

          expect(res.locals).to.deep.equal({
            urls: res.locals.urls,
            tabs: [
              {
                text: 'moves::tabs.warnings',
                url: '/base-url/warnings',
                isActive: true,
              },
              {
                text: 'moves::tabs.details',
                url: '/base-url/details',
                isActive: false,
              },
              {
                text: 'moves::tabs.timeline',
                url: '/base-url/timeline',
                isActive: false,
              },
            ],
          })
        })
      })

      it('should call next', function () {
        middleware(req, res, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
