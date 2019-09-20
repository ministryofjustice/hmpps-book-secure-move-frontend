const axios = require('axios')

const Auth = require('./auth')

describe('API Client', function() {
  describe('Auth library', function() {
    let auth
    const mockOptions = {
      timeout: 1000,
      authUrl: 'http://auth-url.com/token',
      username: 'user-id',
      password: 'asecret',
    }
    const mockTokenResponse = {
      access_token: 'newMockToken',
      expires_in: 60,
    }

    describe('when instantiated', function() {
      context('with options', function() {
        beforeEach(function() {
          auth = new Auth(mockOptions)
        })

        it('should set options as config', function() {
          expect(auth.config).to.deep.equal(mockOptions)
        })
      })

      context('without options', function() {
        beforeEach(function() {
          auth = new Auth()
        })

        it('should set default config', function() {
          expect(auth.config).to.deep.equal({
            timeout: 10000,
            authUrl: undefined,
            username: undefined,
            password: undefined,
          })
        })
      })
    })

    describe('#getAccessToken()', function() {
      let accessToken

      beforeEach(function() {
        auth = new Auth()
        auth.accessToken = 'mockToken'
        auth.isExpired = sinon.stub()
        auth.refreshAccessToken = sinon.stub()
      })

      context('when expired', function() {
        beforeEach(async function() {
          auth.refreshAccessToken.resolves(mockTokenResponse)
          auth.isExpired.returns(true)

          accessToken = await auth.getAccessToken()
        })

        it('should refresh the token', function() {
          expect(auth.refreshAccessToken).to.be.calledOnce
        })

        it('should set the access token', function() {
          expect(auth.accessToken).to.be.equal('newMockToken')
        })

        it('should return access token', function() {
          expect(accessToken).to.equal('newMockToken')
        })
      })

      context('when not expired', function() {
        beforeEach(async function() {
          auth.isExpired.returns(false)
          accessToken = await auth.getAccessToken()
        })

        it('should not refresh access token', function() {
          expect(auth.refreshAccessToken).not.to.be.called
        })

        it('should return access token', function() {
          expect(accessToken).to.equal('mockToken')
        })
      })
    })

    describe('#refreshAccessToken()', function() {
      let refreshedToken
      const mockResponse = {
        data: mockTokenResponse,
      }

      beforeEach(async function() {
        sinon.stub(axios, 'post').resolves(mockResponse)

        auth = new Auth(mockOptions)
        refreshedToken = await auth.refreshAccessToken()
      })

      it('should correctly post to auth token endpoint', function() {
        expect(axios.post).to.be.calledOnceWithExactly(
          mockOptions.authUrl,
          {
            grant_type: 'client_credentials',
          },
          {
            timeout: mockOptions.timeout,
            auth: {
              username: mockOptions.username,
              password: mockOptions.password,
            },
          }
        )
      })

      it('should return response data', function() {
        expect(refreshedToken).to.deep.equal(mockTokenResponse)
      })
    })

    describe('#isExpired()', function() {
      beforeEach(function() {
        auth = new Auth()
      })

      context('when no access token is set', function() {
        it('should return true', function() {
          expect(auth.isExpired()).to.be.true
        })
      })

      context('when no token expiry is set', function() {
        it('should return true', function() {
          expect(auth.isExpired()).to.be.true
        })
      })

      context('when token expiry is set', function() {
        beforeEach(function() {
          auth.accessToken = 'token'
          auth.tokenExpiresAt = new Date('2017-08-09').getTime() / 1000
        })

        context('when token is out of date', function() {
          beforeEach(function() {
            this.clock = sinon.useFakeTimers(new Date('2017-08-10').getTime())
          })

          afterEach(function() {
            this.clock.restore()
          })

          it('should return true', function() {
            expect(auth.isExpired()).to.be.true
          })
        })

        context('when token is not out of date', function() {
          beforeEach(function() {
            this.clock = sinon.useFakeTimers(new Date('2017-08-08').getTime())
          })

          afterEach(function() {
            this.clock.restore()
          })

          it('should return false', function() {
            expect(auth.isExpired()).to.be.false
          })
        })
      })
    })
  })
})
