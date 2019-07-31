const proxyquire = require('proxyquire')

const mockConfig = {
  BASE_URL: 'http://baseurl.com',
  AUTH_URL: 'http://baseurl.com/oauth/token',
  CLIENT_ID: 'clientid',
  SECRET: 'secret',
}
const auth = proxyquire('./auth', {
  '../../../config': {
    API: mockConfig,
  },
})

describe('Back-end authentication', function() {
  describe('#devourAuthMiddleware', function() {
    describe('#req', function() {
      let authUrl,
        authServiceMock,
        accessToken,
        accessTokenExpiry,
        tokenInfo,
        result,
        payload

      beforeEach(function() {
        authUrl = new URL(mockConfig.AUTH_URL)
        accessToken = 'test'
        accessTokenExpiry = 7200

        tokenInfo = JSON.stringify({
          access_token: accessToken,
          expires_in: accessTokenExpiry,
        })

        payload = {
          req: {
            headers: {},
          },
        }
      })

      context('when there is no access token', function() {
        beforeEach(function() {
          sinon
            .stub(auth, 'getAccessToken')
            .onFirstCall()
            .returns(null)
            .callThrough()
        })

        context('when the token request is unsuccessful', function() {
          beforeEach(function() {
            authServiceMock = nock(authUrl.origin)
              .post(authUrl.pathname)
              .query({
                grant_type: 'client_credentials',
              })
              .reply(401, '')
          })

          it('throws an Error', async function() {
            await expect(
              auth.devourAuthMiddleware.req(payload)
            ).to.be.rejectedWith(Error)
          })
        })

        context('when the token request is successful', function() {
          beforeEach(async function() {
            authServiceMock = nock(authUrl.origin)
              .post(authUrl.pathname)
              .query({
                grant_type: 'client_credentials',
              })
              .reply(200, tokenInfo)
            result = await auth.devourAuthMiddleware.req(payload)
          })

          it('requests a new access token from the back-end API', function() {
            expect(authServiceMock.isDone()).to.be.true
          })

          it('modifies the payload', function() {
            expect(result.req.headers.authorization).to.equal(
              `Bearer ${accessToken}`
            )
          })

          it('saves the new access token', function() {
            expect(auth.getAccessToken()).to.eq(accessToken)
          })

          it('saves the new access token expiry time', function() {
            expect(auth.getAccessTokenExpiry()).to.be.a('number')
          })
        })
      })

      context('when the access token has expired', function() {
        let oldExpiry

        beforeEach(function() {
          oldExpiry = Math.floor(new Date() / 1000) - 100

          sinon
            .stub(auth, 'getAccessToken')
            .onFirstCall()
            .returns('test-old')
            .callThrough()
          sinon
            .stub(auth, 'getAccessTokenExpiry')
            .onFirstCall()
            .returns(oldExpiry)
            .callThrough()
        })

        context('when the token request is unsuccessful', function() {
          beforeEach(function() {
            authServiceMock = nock(authUrl.origin)
              .post(authUrl.pathname)
              .query({
                grant_type: 'client_credentials',
              })
              .reply(401, '')
          })

          it('throws an Error', async function() {
            await expect(
              auth.devourAuthMiddleware.req(payload)
            ).to.be.rejectedWith(Error)
          })
        })

        context('when the token request is successful', function() {
          beforeEach(async function() {
            authServiceMock = nock(authUrl.origin)
              .post(authUrl.pathname)
              .query({
                grant_type: 'client_credentials',
              })
              .reply(200, tokenInfo)
            result = await auth.devourAuthMiddleware.req(payload)
          })

          it('requests a new access token from the back-end API', function() {
            expect(authServiceMock.isDone()).to.be.true
          })

          it('modifies the payload', function() {
            expect(result.req.headers.authorization).to.equal(
              `Bearer ${accessToken}`
            )
          })

          it('saves the new access token', function() {
            expect(auth.getAccessToken()).to.eq(accessToken)
          })

          it('saves the new access token expiry time', function() {
            expect(auth.getAccessTokenExpiry()).to.not.equal(oldExpiry)
          })
        })
      })

      context('when the access token is valid', function() {
        beforeEach(async function() {
          accessToken = 'test-new'
          sinon.stub(auth, 'getAccessToken').returns(accessToken)
          sinon
            .stub(auth, 'getAccessTokenExpiry')
            .returns(new Date() / 1000 + 1000)

          authServiceMock = nock(authUrl.origin)
            .post(authUrl.pathname)
            .query({
              grant_type: 'client_credentials',
            })
            .reply(200, tokenInfo)
          result = await auth.devourAuthMiddleware.req(payload)
        })

        it('does not request a new access token', function() {
          expect(authServiceMock.isDone()).to.be.false
        })

        it('modifies the payload', function() {
          expect(result.req.headers.authorization).to.equal(
            `Bearer ${accessToken}`
          )
        })
      })
    })
  })
})
