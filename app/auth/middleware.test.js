const proxyquire = require('proxyquire')

const referenceDataService = require('../../common/services/reference-data')

function UserStub(token) {
  this.user_name = token.user_name
}

const authentication = proxyquire('./middleware', {
  '../../common/lib/user': UserStub,
})

const expiryTime = 1000
const payload = {
  user_name: 'test',
  test: 'test',
  authorities: ['test'],
  exp: expiryTime,
}
const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
const mockLocations = [
  {
    id: '1111',
  },
  {
    id: '2222',
  },
  {
    id: '3333',
  },
]

describe('Authentication middleware', function() {
  describe('#processAuthResponse', function() {
    let req, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {
        session: {
          id: '123',
          postAuthRedirect: '/test',
          regenerate: sinon.stub(),
        },
      }
    })

    context('when there is no grant response', function() {
      beforeEach(function() {
        authentication.processAuthResponse()(req, {}, nextSpy)
      })

      it('returns next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('doesn’t regenerate the session', function() {
        expect(req.session.regenerate).not.to.be.called
      })
    })

    context('when there is a grant response', function() {
      beforeEach(function() {
        sinon.stub(referenceDataService, 'getLocationsById')
        req.session.grant = {
          response: {
            access_token: `test.${encodedPayload}.test`,
          },
        }
      })

      context('when getLocationsById rejects', function() {
        const errorMock = new Error('Session Error')

        beforeEach(async function() {
          referenceDataService.getLocationsById.rejects(errorMock)

          await authentication.processAuthResponse()(req, {}, nextSpy)
        })

        it('call next with error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0] instanceof Error).to.be.true
          expect(nextSpy.args[0][0].message).to.equal('Session Error')
        })

        it('doesn’t regenerate the session', function() {
          expect(req.session.regenerate).not.to.be.called
        })
      })

      context('when getLocationsById resolves', function() {
        beforeEach(function() {
          referenceDataService.getLocationsById.resolves(mockLocations)
        })

        context('when session regeneration throws an error', function() {
          const errorMock = new Error('Session Error')

          beforeEach(async function() {
            req.session.regenerate = callback => callback(errorMock)
            await authentication.processAuthResponse()(req, {}, nextSpy)
          })

          it('should call next with error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })
        })

        context('when default locations are set', function() {
          const locations = ['1', '2', '3']

          beforeEach(async function() {
            await authentication.processAuthResponse(
              locations
            )(req, {}, nextSpy)
          })

          it('should call reference data with locations', function() {
            expect(
              referenceDataService.getLocationsById
            ).to.be.calledWithExactly(locations)
          })
        })

        context('when no default locations are set', function() {
          beforeEach(async function() {
            await authentication.processAuthResponse()(req, {}, nextSpy)
          })

          it('should call reference with empty array', function() {
            expect(
              referenceDataService.getLocationsById
            ).to.be.calledWithExactly([])
          })
        })

        context('when session regenerates successfully', function() {
          let user

          beforeEach(async function() {
            // Stub the express-session #regenerate function which takes a callback
            req.session.regenerate = callback => {
              req.session = {
                id: '456',
              }
              callback()
            }

            user = new UserStub({
              user_name: payload.user_name,
            })

            await authentication.processAuthResponse()(req, {}, nextSpy)
          })

          it('regenerates the session', function() {
            expect(req.session.id).to.equal('456')
          })

          it('sets the auth expiry time on the session', function() {
            expect(req.session.authExpiry).to.equal(expiryTime)
          })

          it('sets the user info on the session', function() {
            expect(req.session.user).to.deep.equal(user)
          })

          it('sets the redirect URL in the session', function() {
            expect(req.session.postAuthRedirect).to.equal('/test')
          })

          it('calls the next action', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })
  })
})
