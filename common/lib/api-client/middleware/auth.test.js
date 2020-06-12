const proxyquire = require('proxyquire')

function MockAuth() {}

MockAuth.prototype.getAccessToken = sinon.stub()

const authMiddleware = proxyquire('./auth', {
  '../auth': () => new MockAuth(),
})

describe('API Client', function () {
  describe('Auth middleware', function () {
    let payload

    beforeEach(function () {
      payload = {
        req: {
          headers: {},
        },
      }
    })

    context('when access token resolves', function () {
      const token = '1234567890'

      beforeEach(async function () {
        MockAuth.prototype.getAccessToken.resolves(token)
        await authMiddleware.req(payload)
      })

      it('should call auth library', function () {
        expect(MockAuth.prototype.getAccessToken).to.be.calledOnce
      })

      it('should contain authorization header', function () {
        expect(payload.req.headers).to.contain.property('authorization')
      })

      it('should set authorization header', function () {
        expect(payload.req.headers.authorization).to.equal(`Bearer ${token}`)
      })
    })

    context('when access token rejects', function () {
      beforeEach(async function () {
        MockAuth.prototype.getAccessToken.rejects(new Error())
      })

      it('should reject with error', function () {
        return expect(
          authMiddleware.req(payload)
        ).to.be.eventually.rejectedWith(Error)
      })
    })
  })
})
