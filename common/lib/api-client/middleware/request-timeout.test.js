const timeoutMiddleware = require('./request-timeout')

describe('API Client', function () {
  describe('Timeout middleware', function () {
    describe('#timeout()', function () {
      context('when payload includes a response', function () {
        it('should return payload as is', function () {
          const payload = { req: {}, res: {} }
          expect(timeoutMiddleware().req(payload)).to.equal(payload)
        })
      })

      context('when payload contains a request', function () {
        const timeout = 30000
        let payload

        beforeEach(function () {
          payload = timeoutMiddleware(timeout).req({
            req: {},
          })
        })

        it('should set timeout on request', function () {
          expect(payload.req).to.have.property('timeout')
        })

        it('should set correct timeout value', function () {
          expect(payload.req.timeout).to.equal(timeout)
        })
      })
    })
  })
})
