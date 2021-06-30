const proxyquire = require('proxyquire')

const setLocals = proxyquire('./locals', {
  'date-fns': {
    startOfTomorrow: sinon.stub().returns('tomorrow'),
  },
})

const now = new Date()

describe('Locals', function () {
  describe('#setLocals', function () {
    let clock
    let req
    let res
    let next
    beforeEach(function () {
      clock = sinon.useFakeTimers(now.getTime())
      req = {
        encrypted: 'true',
        protocol: 'gopher',
        path: '/foo',
        get: sinon.stub().withArgs('host').returns('hostname'),
        user: 'USER',
        session: {
          currentLocation: 'current-location',
          currentRegion: 'current-region',
          movesUrl: 'moves-url',
        },
        flash: sinon.stub().returns('flash-messages'),
      }
      res = {
        locals: {
          foo: 'bar',
        },
      }
      next = sinon.spy()
    })
    afterEach(function () {
      clock.restore()
    })

    context('When invoked', function () {
      beforeEach(function () {
        setLocals(req, res, next)
      })

      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })

      it('should set CANONICAL_URL', function () {
        expect(res.locals.CANONICAL_URL).to.equal('https://hostname/foo')
      })

      it('should set TODAY', function () {
        expect(res.locals.TODAY.getTime()).to.equal(now.getTime())
      })

      it('should set TOMORROW', function () {
        expect(res.locals.TOMORROW).to.equal('tomorrow')
      })

      it('should set REQUEST_PATH', function () {
        expect(res.locals.REQUEST_PATH).to.equal('/foo')
      })

      it('should set USER', function () {
        expect(res.locals.USER).to.equal('USER')
      })

      it('should set CURRENT_LOCATION', function () {
        expect(res.locals.CURRENT_LOCATION).to.equal('current-location')
      })

      it('should set CURRENT_REGION', function () {
        expect(res.locals.CURRENT_REGION).to.equal('current-region')
      })

      it('should set MOVES_URL', function () {
        expect(res.locals.MOVES_URL).to.equal('moves-url')
      })

      it('should set SERVICE_NAME', function () {
        expect(res.locals.SERVICE_NAME).to.equal('Book a secure move')
      })

      it('should create getLocal method', function () {
        expect(res.locals.getLocal('foo')).to.equal('bar')
      })

      it('should create getMessages method', function () {
        expect(res.locals.getMessages()).to.equal('flash-messages')
      })

      it('should maintain existing properties on res.locals', function () {
        expect(res.locals.foo).to.equal('bar')
      })
    })

    context('When request not encrypted', function () {
      beforeEach(function () {
        req.encrypted = false
        setLocals(req, res, next)
      })

      it('should set CANONICAL_URL', function () {
        expect(res.locals.CANONICAL_URL).to.equal('gopher://hostname/foo')
      })
    })

    context('When invoking canAccess', function () {
      it('should return false if no canAccess on the req object', function () {
        setLocals(req, res, next)
        expect(res.locals.canAccess('required_permission')).to.be.false
      })

      context('and canAccess exists on the req object', function () {
        let checked
        beforeEach(function () {
          req.canAccess = sinon.stub().returns('checked-permission')
          setLocals(req, res, next)
          checked = res.locals.canAccess('required_permission')
        })

        it('should call canAccess with the permission', function () {
          expect(req.canAccess).to.be.calledOnceWithExactly(
            'required_permission'
          )
        })

        it('should return the expected result', function () {
          expect(checked).to.equal('checked-permission')
        })
      })
    })

    context('getBreadcrumbs', function () {
      beforeEach(function () {
        setLocals(req, res, next)
      })

      it('should do something if breadcrumbs have not been initialised', function () {
        delete res.breadcrumb

        expect(res.locals.getBreadcrumbs()).to.deep.equal([])
      })

      it('return breadcrumbs data', function () {
        res.breadcrumb = sinon.stub().returns([
          { text: 'A', href: '/a' },
          { text: 'B', href: '/b' },
        ])

        expect(res.locals.getBreadcrumbs()).to.deep.equal([
          { text: 'A', href: '/a' },
          { text: 'B', href: null },
        ])
      })
    })

    context('getPageTitle', function () {
      beforeEach(function () {
        setLocals(req, res, next)
      })

      it('return return breadcrumb text in reverse with service name', function () {
        res.breadcrumb = sinon.stub().returns([
          { text: 'A', href: '/a' },
          { text: 'B', href: '/b' },
        ])

        expect(res.locals.getPageTitle()).to.deep.equal([
          'B',
          'A',
          'Book a secure move',
        ])
      })

      context('if breadcrumbs have not been initialised', function () {
        it('should return empty array', function () {
          delete res.breadcrumb

          expect(res.locals.getPageTitle()).to.deep.equal([])
        })
      })

      context('with home item', function () {
        it('should filter home item out', function () {
          res.breadcrumb = sinon.stub().returns([
            { text: 'Home', href: '/', _home: true },
            { text: 'A', href: '/a' },
            { text: 'B', href: '/b' },
          ])

          expect(res.locals.getPageTitle()).not.to.contain('Home')
        })
      })
    })
  })
})
