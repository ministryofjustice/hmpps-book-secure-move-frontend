const timeoutMiddleware = require('./request-timeout')

describe('API Client', function () {
  describe('Timeout middleware', function () {
    describe('#timeout()', function () {
      context('when payload does not contain a request', function () {
        it('should not set timeout', function () {
          const payload = timeoutMiddleware().req({})
          expect(payload).to.deep.equal({})
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
