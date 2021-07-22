const proxyquire = require('proxyquire')

function MockAuth() {}

MockAuth.prototype.getAuthorizationHeader = sinon.stub()

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

    context('when payload includes a response', function () {
      it('should return payload as is', async function () {
        const payloadWithRes = { res: {} }
        const result = await authMiddleware.req(payloadWithRes)
        expect(result).to.equal(payloadWithRes)
      })
    })

    context('when access token resolves', function () {
      const token = '1234567890'

      beforeEach(async function () {
        MockAuth.prototype.getAuthorizationHeader.resolves({
          mockAuthHeader: token,
        })
        await authMiddleware.req(payload)
      })

      it('should call auth library', function () {
        expect(MockAuth.prototype.getAuthorizationHeader).to.be.calledOnce
      })

      it('should contain authorization header', function () {
        expect(payload.req.headers).to.contain.property('mockAuthHeader')
      })

      it('should set authorization header', function () {
        expect(payload.req.headers.mockAuthHeader).to.equal(token)
      })
    })

    context('when access token rejects', function () {
      beforeEach(function () {
        MockAuth.prototype.getAuthorizationHeader.rejects(new Error())
      })

      it('should reject with error', function () {
        return expect(
          authMiddleware.req(payload)
        ).to.be.eventually.rejectedWith(Error)
      })
    })
  })
})
