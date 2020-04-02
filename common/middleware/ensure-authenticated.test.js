const ensureAuthenticated = require('./ensure-authenticated')

const provider = 'sso_provider'

describe('Authentication middleware', function() {
  describe('#ensureAuthenticated()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {
        url: '/url',
        originalUrl: '/test',
        session: {
          authExpiry: null,
        },
        get: sinon.stub(),
        t: sinon.stub().returns(''),
      }
      res = {
        redirect: sinon.spy(),
      }
    })

    context('when url is in the whitelist', function() {
      const whitelist = ['/url', '/bypass-url']

      beforeEach(function() {
        ensureAuthenticated({ provider, whitelist })(req, res, nextSpy)
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.be.called
      })
    })

    context('when there is no access token', function() {
      beforeEach(function() {
        ensureAuthenticated({ provider })(req, res, nextSpy)
      })

      it('should not call next', function() {
        expect(nextSpy).not.to.be.called
      })

      it('should redirect to the authentication URL', function() {
        expect(res.redirect).to.be.calledOnceWithExactly(`/connect/${provider}`)
      })

      it('should set the redirect URL in the session', function() {
        expect(req.session.originalRequestUrl).to.equal('/test')
      })
    })

    describe('when the access token has expired', function() {
      beforeEach(function() {
        req.session.authExpiry = Math.floor(new Date() / 1000) - 1000
      })

      context('method is GET', function() {
        beforeEach(function() {
          req.method = 'GET'
          ensureAuthenticated({ provider })(req, res, nextSpy)
        })

        it('should not call next', function() {
          expect(nextSpy).not.to.be.called
        })

        it('should redirect to the authentication URL', function() {
          expect(res.redirect).to.be.calledWith(`/connect/${provider}`)
        })

        it('should set the redirect URL in the session', function() {
          expect(req.session.originalRequestUrl).to.equal('/test')
        })
      })

      context('method is standard POST', function() {
        beforeEach(function() {
          req.method = 'POST'
          req.body = { foo: 'bar' }
          ensureAuthenticated({ provider })(req, res, nextSpy)
        })

        it('should set originalRequestBody property on session', function() {
          expect(req.session.originalRequestBody).to.deep.equal({ foo: 'bar' })
        })

        it('should not call next', function() {
          expect(nextSpy).not.to.be.called
        })

        it('should redirect to the authentication URL', function() {
          expect(res.redirect).to.be.calledWith(`/connect/${provider}`)
        })

        it('should set the redirect URL in the session', function() {
          expect(req.session.originalRequestUrl).to.equal('/test')
        })
      })

      context('method is multipart upload', function() {
        beforeEach(function() {
          req.method = 'POST'
          req.get.returns('multipart/form-data; boundary=xxxx')
          res.status = sinon.spy()
          req.t = sinon.stub().returns('multipartErrorString')
          ensureAuthenticated({ provider })(req, res, nextSpy)
        })

        it('should call locales lookup with correct args', function() {
          const localeArgs = req.t.getCall(0).args
          expect(localeArgs).to.deep.equal([
            'validation::AUTH_EXPIRED',
            { context: 'MULTIPART' },
          ])
        })

        it('should call next with the correct error object', function() {
          const { message, statusCode } = nextSpy.getCall(0).args[0]
          expect({ message, statusCode }).to.deep.equal({
            message: 'multipartErrorString',
            statusCode: 422,
          })
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.be.called
        })
      })

      context('method is xhr', function() {
        beforeEach(function() {
          req.method = 'POST'
          req.xhr = true
          res.status = sinon.spy()
          res.send = sinon.spy()
          req.t = sinon.stub().returns('xhrErrorString')
          ensureAuthenticated({ provider })(req, res, nextSpy)
        })

        it('should call locales lookup with correct args', function() {
          const localeArgs = req.t.getCall(0).args
          expect(localeArgs).to.deep.equal([
            'validation::AUTH_EXPIRED',
            { context: '' },
          ])
        })

        it('should call next with the correct error object', function() {
          const { message, statusCode } = nextSpy.getCall(0).args[0]
          expect({ message, statusCode }).to.deep.equal({
            message: 'xhrErrorString',
            statusCode: 422,
          })
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.be.called
        })
      })
    })

    const getExpire =
      'when the access token is about to expire and the request method is GET'
    context(getExpire, function() {
      beforeEach(function() {
        req.method = 'GET'
        req.session.authExpiry = Math.floor(new Date() / 1000) + 119
        ensureAuthenticated({ provider, expiryMargin: 120 })(req, res, nextSpy)
      })

      it('should not call next', function() {
        expect(nextSpy).not.to.be.called
      })

      it('should redirect to the authentication URL', function() {
        expect(res.redirect).to.be.calledWith(`/connect/${provider}`)
      })

      it('should set the redirect URL in the session', function() {
        expect(req.session.originalRequestUrl).to.equal('/test')
      })
    })

    const otherMethodExpire =
      'when the access token is about to expire and the request method is not GET'
    context(otherMethodExpire, function() {
      beforeEach(function() {
        req.session.authExpiry = Math.floor(new Date() / 1000) + 119
        ensureAuthenticated({ provider, expiryMargin: 120 })(req, res, nextSpy)
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.be.called
      })
    })

    context(
      'when the access token has expired and the method was POST',
      function() {
        beforeEach(function() {
          req.session.authExpiry = Math.floor(new Date() / 1000) - 1000
          req.method = 'POST'
          req.body = { foo: 'bar' }
          ensureAuthenticated({ provider })(req, res, nextSpy)
        })

        it('should set store the request body in the session', function() {
          expect(req.session.originalRequestBody).to.deep.equal({ foo: 'bar' })
        })
      }
    )

    context('when the access token has not expired', function() {
      beforeEach(function() {
        req.session.authExpiry = Math.floor(new Date() / 1000) + 1000
        ensureAuthenticated()(req, res, nextSpy)
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.be.called
      })
    })
  })
})
