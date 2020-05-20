const middleware = require('./set-primary-navigation')

describe('#setPrimaryNavigation()', function() {
  let req, res, nextSpy

  beforeEach(function() {
    nextSpy = sinon.spy()
    req = {
      path: '',
      session: {
        user: {
          permissions: [],
        },
      },
      t: sinon.stub().returnsArg(0),
    }
    res = {
      locals: {},
    }
  })

  context('with no permissions', function() {
    beforeEach(function() {
      middleware(req, res, nextSpy)
    })

    it('should set navigation to empty array', function() {
      expect(res.locals.primaryNavigation).to.deep.equal([])
    })

    it('should call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  context('with permissions', function() {
    beforeEach(function() {
      req.session.user.permissions = [
        'dashboard:view',
        'allocations:view',
        'moves:view:proposed',
        'moves:view:outgoing',
      ]
    })

    describe('navigation items', function() {
      beforeEach(function() {
        middleware(req, res, nextSpy)
      })

      it('should set items correctly', function() {
        expect(res.locals.primaryNavigation).to.deep.equal([
          {
            active: false,
            href: '/',
            text: 'primary_navigation.home',
          },
          {
            active: false,
            href: '/moves/requested',
            text: 'primary_navigation.single_requests',
          },
          {
            active: false,
            href: '/allocations',
            text: 'primary_navigation.allocations',
          },
          {
            active: false,
            href: '/moves/outgoing',
            text: 'primary_navigation.outgoing',
          },
        ])
      })
    })

    describe('active state', function() {
      context('on home page', function() {
        beforeEach(function() {
          req.path = '/'
          middleware(req, res, nextSpy)
        })

        it('should set active state', function() {
          expect(res.locals.primaryNavigation).to.deep.equal([
            {
              active: true,
              href: '/',
              text: 'primary_navigation.home',
            },
            {
              active: false,
              href: '/moves/requested',
              text: 'primary_navigation.single_requests',
            },
            {
              active: false,
              href: '/allocations',
              text: 'primary_navigation.allocations',
            },
            {
              active: false,
              href: '/moves/outgoing',
              text: 'primary_navigation.outgoing',
            },
          ])
        })
      })

      context('on requested page', function() {
        beforeEach(function() {
          req.path = '/moves/day/2020-04-16/requested'
          middleware(req, res, nextSpy)
        })

        it('should set active state', function() {
          expect(res.locals.primaryNavigation).to.deep.equal([
            {
              active: false,
              href: '/',
              text: 'primary_navigation.home',
            },
            {
              active: true,
              href: '/moves/requested',
              text: 'primary_navigation.single_requests',
            },
            {
              active: false,
              href: '/allocations',
              text: 'primary_navigation.allocations',
            },
            {
              active: false,
              href: '/moves/outgoing',
              text: 'primary_navigation.outgoing',
            },
          ])
        })
      })

      context('on allocations page', function() {
        beforeEach(function() {
          req.path = '/allocations/week/2020-04-16/outgoing'
          middleware(req, res, nextSpy)
        })

        it('should set active state', function() {
          expect(res.locals.primaryNavigation).to.deep.equal([
            {
              active: false,
              href: '/',
              text: 'primary_navigation.home',
            },
            {
              active: false,
              href: '/moves/requested',
              text: 'primary_navigation.single_requests',
            },
            {
              active: true,
              href: '/allocations',
              text: 'primary_navigation.allocations',
            },
            {
              active: false,
              href: '/moves/outgoing',
              text: 'primary_navigation.outgoing',
            },
          ])
        })
      })

      context('on outgoing page', function() {
        beforeEach(function() {
          req.path = '/moves/day/2020-04-16/outgoing'
          middleware(req, res, nextSpy)
        })

        it('should set active state', function() {
          expect(res.locals.primaryNavigation).to.deep.equal([
            {
              active: false,
              href: '/',
              text: 'primary_navigation.home',
            },
            {
              active: false,
              href: '/moves/requested',
              text: 'primary_navigation.single_requests',
            },
            {
              active: false,
              href: '/allocations',
              text: 'primary_navigation.allocations',
            },
            {
              active: true,
              href: '/moves/outgoing',
              text: 'primary_navigation.outgoing',
            },
          ])
        })
      })
    })

    it('should call next', function() {
      middleware(req, res, nextSpy)
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })
})
