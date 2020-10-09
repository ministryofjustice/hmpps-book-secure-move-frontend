const proxyquire = require('proxyquire')
const prohibitions = {
  prohibitionsByLocationType: {
    forbidden_planet: ['required_permission'],
  },
}

const middleware = proxyquire('./permissions', {
  '../lib/prohibitions': prohibitions,
})

describe('Permissions middleware', function () {
  describe('#check()', function () {
    let permit

    context('when required permission is missing', function () {
      beforeEach(function () {
        permit = middleware.check('required_permission', ['user_permission_1'])
      })

      it('should return false', function () {
        expect(permit).to.be.false
      })
    })

    context('when required permission exists', function () {
      beforeEach(function () {
        permit = middleware.check(
          'required_permission',
          ['user_permission_1', 'user_permission_2', 'required_permission'],
          'somewhere'
        )
      })

      it('should return true', function () {
        expect(permit).to.be.true
      })
    })

    context(
      'when required permission exists but location type prohibits it',
      function () {
        beforeEach(function () {
          permit = middleware.check(
            'required_permission',
            ['required_permission'],
            'forbidden_planet'
          )
        })

        it('should return false', function () {
          expect(permit).to.be.false
        })
      }
    )

    describe('when multiple permissions are possible', function () {
      let permit

      context('and all required permissions are missing', function () {
        beforeEach(function () {
          permit = middleware.check(['perm1', 'perm2'], ['permZ'])
        })

        it('should return false', function () {
          expect(permit).to.be.false
        })
      })

      context('and some of the required permissions are missing', function () {
        beforeEach(function () {
          permit = middleware.check(['perm1', 'perm2'], ['perm1', 'permZ'])
        })

        it('should return true', function () {
          expect(permit).to.be.true
        })
      })

      context('and all the required permissions exist', function () {
        beforeEach(function () {
          permit = middleware.check(
            ['perm1', 'perm2'],
            ['perm1', 'perm2', 'permZ']
          )
        })

        it('should return true', function () {
          expect(permit).to.be.true
        })
      })
    })
  })

  describe('#setCheckPermissions()', function () {
    let req, next, allowed

    beforeEach(function () {
      next = sinon.spy()
      req = {
        session: {
          currentLocation: {
            location_type: 'somewhere',
          },
          user: {
            permissions: ['required_permission'],
          },
        },
      }
    })

    context('when invoked', function () {
      beforeEach(function () {
        middleware.setCheckPermissions(req, {}, next)
      })

      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })

    context('when the method on the request object is invoked', function () {
      context('and the user does not have the permission', function () {
        beforeEach(function () {
          middleware.setCheckPermissions(req, {}, next)
          allowed = req.checkPermissions('missing_permission')
        })

        it('should return false', function () {
          expect(allowed).to.be.false
        })
      })

      context('and the user has the permission', function () {
        beforeEach(function () {
          middleware.setCheckPermissions(req, {}, next)
          allowed = req.checkPermissions('required_permission')
        })

        it('should return true', function () {
          expect(allowed).to.be.true
        })
      })

      context(
        'and the user has the permission but the location prohibits the action',
        function () {
          beforeEach(function () {
            req.session.currentLocation.location_type = 'forbidden_planet'
            middleware.setCheckPermissions(req, {}, next)
            allowed = req.checkPermissions('required_permission')
          })

          it('should return false', function () {
            expect(allowed).to.be.false
          })
        }
      )
    })
  })

  describe('#protectRoute()', function () {
    let req, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      req = {
        session: {},
      }
    })

    context('when no user in session', function () {
      beforeEach(function () {
        middleware.protectRoute('required_permission')(req, {}, nextSpy)
      })

      it('should call next with 403 error', function () {
        const error = nextSpy.args[0][0]
        expect(nextSpy).to.be.calledOnce
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal(
          "Forbidden. Missing permission: 'required_permission'"
        )
        expect(error.statusCode).to.equal(403)
      })
    })

    context('when user is missing required permission', function () {
      beforeEach(function () {
        req.session.user = {
          permissions: ['user_permission_1'],
        }
        middleware.protectRoute('required_permission')(req, {}, nextSpy)
      })

      it('should call next with 403 error', function () {
        const error = nextSpy.args[0][0]
        expect(nextSpy).to.be.calledOnce
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal(
          "Forbidden. Missing permission: 'required_permission'"
        )
        expect(error.statusCode).to.equal(403)
      })
    })

    context('when user has required permission', function () {
      beforeEach(function () {
        req.session.user = {
          permissions: ['user_permission_1', 'required_permission'],
        }
        middleware.protectRoute('required_permission')(req, {}, nextSpy)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('when multiple permissions are possible', function () {
      context('and user does not have any required permissions', function () {
        beforeEach(function () {
          req.session.user = {
            permissions: ['user_permission_1', 'user_permission_2'],
          }
          middleware.protectRoute([
            'required_permission_1',
            'required_permission_2',
          ])(req, {}, nextSpy)
        })

        it('should call next without error', function () {
          const error = nextSpy.args[0][0]
          expect(nextSpy).to.be.calledOnce
          expect(error).to.be.an.instanceOf(Error)
          expect(error.message).to.equal(
            "Forbidden. Missing permission: 'required_permission_1,required_permission_2'"
          )
          expect(error.statusCode).to.equal(403)
        })
      })

      context('and user has some of the required permissions', function () {
        beforeEach(function () {
          req.session.user = {
            permissions: ['user_permission_1', 'required_permission_1'],
          }
          middleware.protectRoute([
            'required_permission_1',
            'required_permission_2',
          ])(req, {}, nextSpy)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('and user has all required permissions', function () {
        beforeEach(function () {
          req.session.user = {
            permissions: [
              'user_permission_1',
              'required_permission_1',
              'required_permission_2',
            ],
          }
          middleware.protectRoute([
            'required_permission_1',
            'required_permission_2',
          ])(req, {}, nextSpy)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
