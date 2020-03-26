const ensureAuthenticated = require('./ensure-authenticated')

const provider = 'sso_provider'

describe('Authentication middleware', function() {
  describe('#ensureAuthenticated()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      const headerStub = sinon.stub()
      headerStub.returns('')
      nextSpy = sinon.spy()
      req = {
        url: '/url',
        originalUrl: '/test',
        session: {
          authExpiry: null,
        },
        header: headerStub,
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
          req.header = sinon.stub()
          req.header.returns('multipart/form-data; boundary=xxxx')
          res.status = sinon.spy()
          res.send = sinon.spy()
          req.t = sinon.stub()
          req.t.returns('multipartErrorString')
          ensureAuthenticated({ provider })(req, res, nextSpy)
        })

        it('should get the correct error string', function() {
          expect(req.t).to.be.calledWith('validation::MULTIPART_FAILED_AUTH')
        })

        it('should send the error string as the response', function() {
          expect(res.send).to.be.calledWith('multipartErrorString')
        })

        it('should emit the correct status', function() {
          expect(res.status).to.be.calledWith(401)
        })

        it('should not call next', function() {
          expect(nextSpy).not.to.be.called
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.be.called
        })
      })

      context('method is xhr', function() {
        beforeEach(function() {
          req.method = 'POST'
          req.xhr = true
          req.header = sinon.stub()
          req.header.returns('')
          res.status = sinon.spy()
          res.send = sinon.spy()
          req.t = sinon.stub()
          req.t.returns('xhrErrorString')
          ensureAuthenticated({ provider })(req, res, nextSpy)
        })

        it('should get the correct error string', function() {
          expect(req.t).to.be.calledWith('validation::DELETE_FAILED_AUTH')
        })

        it('should send the error string as the response', function() {
          expect(res.send).to.be.calledWith('xhrErrorString')
        })

        it('should emit the correct status', function() {
          expect(res.status).to.be.calledWith(401)
        })

        it('should not call next', function() {
          expect(nextSpy).not.to.be.called
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
