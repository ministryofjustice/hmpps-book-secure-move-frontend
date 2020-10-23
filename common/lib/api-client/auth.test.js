const path = require('path')

const axios = require('axios')
const proxyquire = require('proxyquire')

const clientMetrics = require('./client-metrics')

const getDuration = sinon.stub().callsFake(() => {
  return 23
})
const timer = () => getDuration

describe('API Client', function () {
  describe('Auth library', function () {
    let authInstance
    let secondAuthInstance
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

    describe('when instantiated', function () {
      context('with options', function () {
        beforeEach(function () {
          authInstance = requireUncached(path.join(__dirname, 'auth'))(
            mockOptions
          )
          secondAuthInstance = require('./auth')()
        })

        it('should set options as config', function () {
          expect(authInstance.config).to.deep.equal(mockOptions)
        })

        it('second instance should match first', function () {
          expect(authInstance).to.deep.equal(secondAuthInstance)
        })

        it('second instance config should match first instance config', function () {
          expect(secondAuthInstance.config).to.deep.equal(mockOptions)
        })
      })

      context('without options', function () {
        beforeEach(function () {
          authInstance = requireUncached(path.join(__dirname, 'auth'))({})
        })

        it('should set default config', function () {
          expect(authInstance.config).to.deep.equal({
            timeout: 10000,
            authUrl: undefined,
            username: undefined,
            password: undefined,
          })
        })
      })
    })

    describe('#getAccessToken()', function () {
      let accessToken

      beforeEach(function () {
        authInstance = requireUncached(path.join(__dirname, 'auth'))({})
        authInstance.accessToken = 'mockToken'
        authInstance.isExpired = sinon.stub()
        authInstance.refreshAccessToken = sinon.stub()
      })

      context('when expired', function () {
        beforeEach(async function () {
          authInstance.refreshAccessToken.resolves(mockTokenResponse)
          authInstance.isExpired.returns(true)

          accessToken = await authInstance.getAccessToken()
        })

        it('should refresh the token', function () {
          expect(authInstance.refreshAccessToken).to.be.calledOnce
        })

        it('should set the access token', function () {
          expect(authInstance.accessToken).to.be.equal('newMockToken')
        })

        it('should return access token', function () {
          expect(accessToken).to.equal('newMockToken')
        })
      })

      context('when not expired', function () {
        beforeEach(async function () {
          authInstance.isExpired.returns(false)
          accessToken = await authInstance.getAccessToken()
        })

        it('should not refresh access token', function () {
          expect(authInstance.refreshAccessToken).not.to.be.called
        })

        it('should return access token', function () {
          expect(accessToken).to.equal('mockToken')
        })
      })
    })

    describe('#refreshAccessToken()', function () {
      let refreshedToken
      const mockResponse = {
        data: mockTokenResponse,
      }
      beforeEach(async function () {
        sinon.stub(axios, 'post').resolves(mockResponse)
        sinon.stub(clientMetrics, 'recordSuccess')
        sinon.stub(clientMetrics, 'recordError')

        authInstance = proxyquire('./auth', {
          './client-metrics': clientMetrics,
          '../timer': timer,
        })(mockOptions)
      })

      describe('when calling method', function () {
        beforeEach(async function () {
          await authInstance.refreshAccessToken()
        })

        it('should correctly post to auth token endpoint', function () {
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
      })

      describe('when endpoint returns successfully', function () {
        beforeEach(async function () {
          refreshedToken = await authInstance.refreshAccessToken()
        })

        it('should return response data', function () {
          expect(refreshedToken).to.deep.equal(mockTokenResponse)
        })

        it('should record metrics for the call', function () {
          expect(clientMetrics.recordSuccess).to.be.calledOnceWithExactly(
            {
              url: mockOptions.authUrl,
              method: 'POST',
            },
            mockResponse,
            23
          )
        })
      })

      describe('when endpoint returns an error', function () {
        const error = new Error()
        let thrownError

        beforeEach(async function () {
          axios.post.rejects(error)
          await authInstance.refreshAccessToken().catch(e => {
            thrownError = e
          })
        })

        it('should rethrow error', function () {
          expect(thrownError).to.equal(error)
        })

        it('should record metrics for the failed call', function () {
          expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
            {
              url: mockOptions.authUrl,
              method: 'POST',
            },
            error,
            23
          )
        })
      })
    })

    describe('#isExpired()', function () {
      beforeEach(function () {
        authInstance = requireUncached(path.join(__dirname, 'auth'))({})
      })

      context('when no access token is set', function () {
        it('should return true', function () {
          expect(authInstance.isExpired()).to.be.true
        })
      })

      context('when no token expiry is set', function () {
        it('should return true', function () {
          expect(authInstance.isExpired()).to.be.true
        })
      })

      context('when token expiry is set', function () {
        beforeEach(function () {
          authInstance.accessToken = 'token'
          authInstance.tokenExpiresAt = new Date('2017-08-09').getTime() / 1000
        })

        context('when token is out of date', function () {
          beforeEach(function () {
            this.clock = sinon.useFakeTimers(new Date('2017-08-10').getTime())
          })

          afterEach(function () {
            this.clock.restore()
          })

          it('should return true', function () {
            expect(authInstance.isExpired()).to.be.true
          })
        })

        context('when token is not out of date', function () {
          beforeEach(function () {
            this.clock = sinon.useFakeTimers(new Date('2017-08-08').getTime())
          })

          afterEach(function () {
            this.clock.restore()
          })

          it('should return false', function () {
            expect(authInstance.isExpired()).to.be.false
          })
        })
      })
    })

    describe('#getAuthorizationHeader()', function () {
      let authorizationHeader

      beforeEach(async function () {
        authInstance = requireUncached(path.join(__dirname, 'auth'))({})
        sinon.stub(authInstance, 'getAccessToken').resolves('mockToken')
        authorizationHeader = await authInstance.getAuthorizationHeader()
      })

      it('', function () {
        expect(authorizationHeader).to.deep.equal({
          Authorization: 'Bearer mockToken',
        })
      })
    })
  })
})
