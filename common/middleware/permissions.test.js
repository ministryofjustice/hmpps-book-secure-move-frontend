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

    describe('when multiple permissions are required', function() {
      let permit
      context('and all required permissions are missing', function() {
        beforeEach(function() {
          permit = middleware.check(['perm1', 'perm2'], ['permZ'])
        })
        it('should return false', function() {
          expect(permit).to.be.false
        })
      })
      context('and some of the required permissions are missing', function() {
        beforeEach(function() {
          permit = middleware.check(['perm1', 'perm2'], ['perm1', 'permZ'])
        })
        it('should return false', function() {
          expect(permit).to.be.false
        })
      })
      context('and the required permissions exist', function() {
        beforeEach(function() {
          permit = middleware.check(
            ['perm1', 'perm2'],
            ['perm1', 'perm2', 'permZ']
          )
        })
        it('should return true', function() {
          expect(permit).to.be.true
        })
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

    describe('when there multiple permissions are required', function() {
      context('and user does not have all required permissions', function() {
        beforeEach(function() {
          req.session.user = {
            permissions: ['user_permission_1', 'required_permission'],
          }
          middleware.protectRoute([
            'required_permission',
            'required_permission_2',
          ])(req, {}, nextSpy)
        })

        it('should call next without error', function() {
          const error = nextSpy.args[0][0]
          expect(nextSpy).to.be.calledOnce
          expect(error).to.be.an.instanceOf(Error)
          expect(error.message).to.equal(
            "Forbidden. Missing permission: 'required_permission,required_permission_2'"
          )
          expect(error.statusCode).to.equal(403)
        })
      })

      context('and user has all required permissions', function() {
        beforeEach(function() {
          req.session.user = {
            permissions: ['user_permission_1', 'required_permission'],
          }
          middleware.protectRoute(['user_permission_1', 'required_permission'])(
            req,
            {},
            nextSpy
          )
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
