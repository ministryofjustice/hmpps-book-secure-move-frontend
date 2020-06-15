const ensureBodyProcessed = require('./process-original-request-body')

const sessionWithOriginalRequestBody = () => ({
  originalRequestBody: {
    foo: 'bar',
  },
})

describe('Body processing after reauthentication middleware', function () {
  describe('#ensureBodyProcessed()', function () {
    let res, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      res = {
        redirect: sinon.spy(),
      }
    })
    context('when originalRequestBody is present in session', function () {
      const req = {
        url: '/foo',
        session: sessionWithOriginalRequestBody(),
      }

      beforeEach(function () {
        ensureBodyProcessed()(req, res, nextSpy)
      })

      it('should set the request body to the originalRequestBody', function () {
        expect(req.body).to.deep.equal({ foo: 'bar' })
      })

      it('should set the request method to POST', function () {
        expect(req.method).to.equal('POST')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })
    })

    context('when no originalRequestBody is present in session', function () {
      const req = {
        url: '/foo',
        session: {},
      }

      beforeEach(function () {
        ensureBodyProcessed()(req, res, nextSpy)
      })

      it('should leave request body unchanged', function () {
        expect(req.body).to.equal(undefined)
      })

      it('should leave the request method unchanged', function () {
        expect(req.method).to.equal(undefined)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })
    })

    context('when an auth route is matched', function () {
      const req = {
        url: '/myauth/callback',
        session: sessionWithOriginalRequestBody(),
      }

      beforeEach(function () {
        ensureBodyProcessed('/myauth')(req, res, nextSpy)
      })

      it('should leave request body unchanged', function () {
        expect(req.body).to.equal(undefined)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })
    })
  })
})
