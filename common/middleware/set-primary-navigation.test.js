const middleware = require('./set-primary-navigation')

describe('#setPrimaryNavigation()', function() {
  let req, res, nextSpy

  beforeEach(function() {
    nextSpy = sinon.spy()
    req = {
      session: {
        user: {
          permissions: [],
        },
      },
      t: sinon.stub().returnsArg(0),
    }
    res = {
      locals: {
        TODAY: new Date(2020, 4, 10),
        REQUEST_PATH: '',
      },
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
        'moves:view:dashboard',
        'moves:view:proposed',
        'moves:view:outgoing',
      ]
    })

    context('with location', function() {
      beforeEach(function() {
        res.locals.CURRENT_LOCATION = {
          id: '12345',
        }
      })

      describe('navigation items', function() {
        beforeEach(function() {
          middleware(req, res, nextSpy)
        })

        it('should set items correctly', function() {
          expect(res.locals.primaryNavigation).to.deep.equal([
            {
              active: false,
              href: '/moves',
              text: 'primary_navigation.home',
            },
            {
              active: false,
              href: '/moves/week/2020-05-10/12345/pending',
              text: 'primary_navigation.single_requests',
            },
            {
              active: false,
              href: '/moves/day/2020-05-10/12345/outgoing',
              text: 'primary_navigation.outgoing',
            },
          ])
        })
      })

      describe('active state', function() {
        context('on home page', function() {
          beforeEach(function() {
            res.locals.REQUEST_PATH =
              '/moves/day/2020-04-16/8fadb516-f10a-45b1-91b7-a256196829f9'
            middleware(req, res, nextSpy)
          })

          it('should set active state', function() {
            expect(res.locals.primaryNavigation).to.deep.equal([
              {
                active: true,
                href: '/moves',
                text: 'primary_navigation.home',
              },
              {
                active: false,
                href: '/moves/week/2020-05-10/12345/pending',
                text: 'primary_navigation.single_requests',
              },
              {
                active: false,
                href: '/moves/day/2020-05-10/12345/outgoing',
                text: 'primary_navigation.outgoing',
              },
            ])
          })
        })

        const statuses = ['pending', 'accepted', 'rejected']
        statuses.forEach(status => {
          context(`on ${status} page`, function() {
            beforeEach(function() {
              res.locals.REQUEST_PATH = `/moves/day/2020-04-16/8fadb516-f10a-45b1-91b7-a256196829f9/${status}`
              middleware(req, res, nextSpy)
            })

            it('should set active state', function() {
              expect(res.locals.primaryNavigation).to.deep.equal([
                {
                  active: false,
                  href: '/moves',
                  text: 'primary_navigation.home',
                },
                {
                  active: true,
                  href: '/moves/week/2020-05-10/12345/pending',
                  text: 'primary_navigation.single_requests',
                },
                {
                  active: false,
                  href: '/moves/day/2020-05-10/12345/outgoing',
                  text: 'primary_navigation.outgoing',
                },
              ])
            })
          })
        })

        context('on outgoing page', function() {
          beforeEach(function() {
            res.locals.REQUEST_PATH =
              '/moves/day/2020-04-16/8fadb516-f10a-45b1-91b7-a256196829f9/outgoing'
            middleware(req, res, nextSpy)
          })

          it('should set active state', function() {
            expect(res.locals.primaryNavigation).to.deep.equal([
              {
                active: false,
                href: '/moves',
                text: 'primary_navigation.home',
              },
              {
                active: false,
                href: '/moves/week/2020-05-10/12345/pending',
                text: 'primary_navigation.single_requests',
              },
              {
                active: true,
                href: '/moves/day/2020-05-10/12345/outgoing',
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

    context('without location', function() {
      describe('navigation items', function() {
        beforeEach(function() {
          middleware(req, res, nextSpy)
        })

        it('should set items correctly', function() {
          expect(res.locals.primaryNavigation).to.deep.equal([
            {
              active: false,
              href: '/moves',
              text: 'primary_navigation.home',
            },
            {
              active: false,
              href: '/moves/week/2020-05-10/pending',
              text: 'primary_navigation.single_requests',
            },
            {
              active: false,
              href: '/moves/day/2020-05-10/outgoing',
              text: 'primary_navigation.outgoing',
            },
          ])
        })
      })

      describe('active state', function() {
        context('on home page', function() {
          beforeEach(function() {
            res.locals.REQUEST_PATH = '/moves/day/2020-04-16'
            middleware(req, res, nextSpy)
          })

          it('should set active state', function() {
            expect(res.locals.primaryNavigation).to.deep.equal([
              {
                active: true,
                href: '/moves',
                text: 'primary_navigation.home',
              },
              {
                active: false,
                href: '/moves/week/2020-05-10/pending',
                text: 'primary_navigation.single_requests',
              },
              {
                active: false,
                href: '/moves/day/2020-05-10/outgoing',
                text: 'primary_navigation.outgoing',
              },
            ])
          })
        })

        context('on proposed page', function() {
          beforeEach(function() {
            res.locals.REQUEST_PATH = '/moves/day/2020-04-16/pending'
            middleware(req, res, nextSpy)
          })

          it('should set active state', function() {
            expect(res.locals.primaryNavigation).to.deep.equal([
              {
                active: false,
                href: '/moves',
                text: 'primary_navigation.home',
              },
              {
                active: true,
                href: '/moves/week/2020-05-10/pending',
                text: 'primary_navigation.single_requests',
              },
              {
                active: false,
                href: '/moves/day/2020-05-10/outgoing',
                text: 'primary_navigation.outgoing',
              },
            ])
          })
        })

        context('on outgoing page', function() {
          beforeEach(function() {
            res.locals.REQUEST_PATH = '/moves/day/2020-04-16/outgoing'
            middleware(req, res, nextSpy)
          })

          it('should set active state', function() {
            expect(res.locals.primaryNavigation).to.deep.equal([
              {
                active: false,
                href: '/moves',
                text: 'primary_navigation.home',
              },
              {
                active: false,
                href: '/moves/week/2020-05-10/pending',
                text: 'primary_navigation.single_requests',
              },
              {
                active: true,
                href: '/moves/day/2020-05-10/outgoing',
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
})
