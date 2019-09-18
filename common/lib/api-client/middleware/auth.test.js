const proxyquire = require('proxyquire')

const mockConfig = {
  AUTH_URL: 'http://baseurl.com/oauth/token',
  CLIENT_ID: 'clientid',
  SECRET: 'secret',
  TIMEOUT: 10000,
}
function MockAuth() {}
MockAuth.prototype.getAccessToken = sinon.stub()

const auth = proxyquire('./auth', {
  '../../../../config': {
    API: mockConfig,
  },
  '../auth': MockAuth,
})

describe('API Client', function() {
  describe('Auth middleware', function() {
    let payload

    beforeEach(function() {
      payload = {
        req: {
          headers: {},
        },
      }
    })

    context('when access token resolves', function() {
      const token = '1234567890'

      beforeEach(async function() {
        MockAuth.prototype.getAccessToken.resolves(token)
        await auth.req(payload)
      })

      it('should call auth library', function() {
        expect(MockAuth.prototype.getAccessToken).to.be.calledOnce
      })

      it('should contain authorization header', function() {
        expect(payload.req.headers).to.contain.property('authorization')
      })

      it('should set authorization header', function() {
        expect(payload.req.headers.authorization).to.equal(`Bearer ${token}`)
      })
    })

    context('when access token rejects', function() {
      beforeEach(async function() {
        MockAuth.prototype.getAccessToken.rejects(new Error())
      })

      it('should reject with error', function() {
        return expect(auth.req(payload)).to.be.eventually.rejectedWith(Error)
      })
    })
  })
})
