const middleware = require('./permissions')

describe('Permissions middleware', function() {
  describe('#check()', function() {
    let permit

    context('when required permission is missing', function() {
      beforeEach(function() {
        permit = middleware.check('required_permission', ['user_permission_1'])
      })

      it('should return false', function() {
        expect(permit).to.be.false
      })
    })

    context('when required permission exists', function() {
      beforeEach(function() {
        permit = middleware.check('required_permission', [
          'user_permission_1',
          'user_permission_2',
          'required_permission',
        ])
      })

      it('should return true', function() {
        expect(permit).to.be.true
      })
    })
  })

  describe('#protectRoute()', function() {
    let req, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {
        session: {},
      }
    })

    context('when no user in session', function() {
      beforeEach(function() {
        middleware.protectRoute('required_permission')(req, {}, nextSpy)
      })

      it('should call next with 403 error', function() {
        const error = nextSpy.args[0][0]
        expect(nextSpy).to.be.calledOnce
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal(
          "Forbidden. Missing permission: 'required_permission'"
        )
        expect(error.statusCode).to.equal(403)
      })
    })

    context('when user is missing required permission', function() {
      beforeEach(function() {
        req.session.user = {
          permissions: ['user_permission_1'],
        }
        middleware.protectRoute('required_permission')(req, {}, nextSpy)
      })

      it('should call next with 403 error', function() {
        const error = nextSpy.args[0][0]
        expect(nextSpy).to.be.calledOnce
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal(
          "Forbidden. Missing permission: 'required_permission'"
        )
        expect(error.statusCode).to.equal(403)
      })
    })

    context('when user has required permission', function() {
      beforeEach(function() {
        req.session.user = {
          permissions: ['user_permission_1', 'required_permission'],
        }
        middleware.protectRoute('required_permission')(req, {}, nextSpy)
      })

      it('should call next without error', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
