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
      it('should return false if no checkPermissions on the req object', function () {
        setLocals(req, res, next)
        expect(res.locals.canAccess('required_permission')).to.be.false
      })

      context('and checkPermissions exists on the req object', function () {
        let checked
        beforeEach(function () {
          req.checkPermissions = sinon.stub().returns('checked-permission')
          setLocals(req, res, next)
          checked = res.locals.canAccess('required_permission')
        })

        it('should call checkPermissions with the permission', function () {
          expect(req.checkPermissions).to.be.calledOnceWithExactly(
            'required_permission'
          )
        })

        it('should return the expected result', function () {
          expect(checked).to.equal('checked-permission')
        })
      })
    })
  })
})
