const ensureUserLocation = require('./ensure-user-location')

describe('Location middleware', function() {
  describe('#ensureUserLocation()', function() {
    let req, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {
        session: {
          user: {},
        },
      }
    })

    context('when no user in session', function() {
      it('should call next with 403 error', function() {
        ensureUserLocation(req, {}, nextSpy)

        const error = nextSpy.args[0][0]
        expect(nextSpy).to.be.calledOnce
        expect(error).to.be.an.instanceOf(Error)
        expect(error.message).to.equal('No locations found for user')
        expect(error.statusCode).to.equal(403)
      })
    })

    context('when user has no locations', function() {
      context('when the user has role PECS_ROLE_SUPPLIER', function() {
        beforeEach(function() {
          req.session.user = {
            locations: [],
            roles: ['PECS_ROLE_SUPPLIER'],
          }

          ensureUserLocation(req, {}, nextSpy)
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when the user has role PECS_ROLE_POLICE', function() {
        beforeEach(function() {
          req.session.user = {
            locations: [],
            roles: ['PECS_ROLE_POLICE'],
          }

          ensureUserLocation(req, {}, nextSpy)
        })

        it('should call next with 403 error', function() {
          const error = nextSpy.args[0][0]
          expect(nextSpy).to.be.calledOnce
          expect(error).to.be.an.instanceOf(Error)
          expect(error.message).to.equal('No locations found for user')
          expect(error.statusCode).to.equal(403)
        })
      })
    })

    context('when user has a location', function() {
      beforeEach(function() {
        req.session.user = {
          locations: [{ id: 'test' }],
        }

        ensureUserLocation(req, {}, nextSpy)
      })

      it('should call next without error', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
