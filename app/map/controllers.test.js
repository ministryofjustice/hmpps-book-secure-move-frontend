const proxyquire = require('proxyquire')

const axiosStub = {}
const config = {
  MAPPING: {
    AUTH_URL: 'http://example.org/oauth/v1',
    API_KEY: 'secret',
    API_SECRET: 'squirrel',
  },
}
const controllers = proxyquire('./controllers', {
  axios: axiosStub,
  '../../config': config,
})

describe('Map controllers', function () {
  let req
  let res

  beforeEach(function () {
    axiosStub.request = sinon.stub()
    req = {}
    res = {
      json: sinon.stub(),
      send: sinon.stub(),
      status: sinon.stub(),
    }
  })

  describe('#token', function () {
    describe('on invocation', function () {
      beforeEach(async function () {
        axiosStub.request.resolves({})

        await controllers.token(req, res)
      })

      it('should call axios with auth url', function () {
        expect(axiosStub.request).to.have.been.calledOnce
        expect(axiosStub.request).to.have.been.calledWithMatch({
          url: 'http://example.org/oauth/v1',
        })
      })
      it('should call axios with auth params', function () {
        expect(axiosStub.request).to.have.been.calledOnce
        expect(axiosStub.request).to.have.been.calledWithMatch({
          auth: {
            username: 'secret',
            password: 'squirrel',
          },
        })
      })
      it('should call axios with form header content type', function () {
        expect(axiosStub.request).to.have.been.calledOnce
        expect(axiosStub.request).to.have.been.calledWithMatch({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      })
      it('should call axios with POST method', function () {
        expect(axiosStub.request).to.have.been.calledOnce
        expect(axiosStub.request).to.have.been.calledWithMatch({
          method: 'POST',
        })
      })
      it('should call axios with client credentials data', function () {
        expect(axiosStub.request).to.have.been.calledOnce
        expect(axiosStub.request).to.have.been.calledWithMatch({
          data: 'grant_type=client_credentials',
        })
      })
    })
    describe('with an oAuth response', function () {
      const oAuthToken = {
        access_token: 'bt0ua6JAOIJYKhAJkzaVD0GqrSL9',
        expires_in: '299',
        issued_at: '1614783646621',
        token_type: 'BearerToken',
      }
      beforeEach(async function () {
        axiosStub.request.resolves({ data: oAuthToken })

        await controllers.token(req, res)
      })

      it('should send status of 200', function () {
        expect(res.status).to.have.been.calledOnceWith(200)
      })

      it('should return auth token', function () {
        expect(res.json).to.have.been.calledOnceWith(oAuthToken)
      })
    })

    describe('with an oAuth error', function () {
      beforeEach(async function () {
        axiosStub.request.rejects(new Error('Server error'))

        await controllers.token(req, res)
      })

      it('should send status of 400', function () {
        expect(res.status).to.have.been.calledOnceWith(400)
      })

      it('should send json error message', function () {
        expect(res.json).to.have.been.calledOnce
        expect(res.json).to.have.been.calledOnceWith({
          error: 'Failed to get access token',
        })
      })
    })
  })
})
