const proxyquire = require('proxyquire')

const BASE_URL = 'http://localhost:8080'
const config = {
  API: {
    BASE_URL,
  },
}

const axiosStub = sinon.stub().resolves({ data: '#response' })
const getAuthorizationHeaderStub = sinon
  .stub()
  .resolves({ Authorization: 'Bearer foo' })
const getRequestHeadersStub = sinon
  .stub()
  .returns({ DefaultHeaders: 'header value' })

const restClient = proxyquire('./rest-client', {
  '../../../config': config,
  './auth': () => ({ getAuthorizationHeader: getAuthorizationHeaderStub }),
  './request-headers': getRequestHeadersStub,
  axios: axiosStub,
})

describe('API Client', function () {
  describe('Rest client', function () {
    beforeEach(function () {
      axiosStub.resetHistory()
      getAuthorizationHeaderStub.resetHistory()
      getRequestHeadersStub.resetHistory()
    })

    context('when calling the API', function () {
      let data

      beforeEach(async function () {
        data = await restClient({}, '/foo')
      })

      it('should get the authorization header', function () {
        expect(getAuthorizationHeaderStub).to.be.calledOnceWithExactly()
      })

      it('should get the default client headers', function () {
        expect(getRequestHeadersStub).to.be.calledOnceWithExactly({}, undefined)
      })

      it('should make the expected request', function () {
        expect(axiosStub).to.be.calledOnceWithExactly(
          'http://localhost:8080/foo',
          {
            headers: {
              Authorization: 'Bearer foo',
              DefaultHeaders: 'header value',
            },
          }
        )
      })

      it('should return the response data', function () {
        expect(data).to.equal('#response')
      })
    })

    context('when calling the API with params', function () {
      beforeEach(async function () {
        await restClient({}, '/foo', { bar: 'baz' })
      })

      it('should make the expected request', function () {
        expect(axiosStub).to.be.calledOnceWithExactly(
          'http://localhost:8080/foo',
          {
            params: { bar: 'baz' },
            headers: {
              Authorization: 'Bearer foo',
              DefaultHeaders: 'header value',
            },
          }
        )
      })
    })

    context('when calling the API as a post with no data', function () {
      beforeEach(async function () {
        await restClient({}, '/foo', null, { method: 'post' })
      })

      it('should make the expected request', function () {
        expect(axiosStub).to.be.calledOnceWithExactly(
          'http://localhost:8080/foo',
          {
            headers: {
              Authorization: 'Bearer foo',
              DefaultHeaders: 'header value',
            },
            method: 'post',
          }
        )
      })
    })

    context('when calling the API as a post with data', function () {
      beforeEach(async function () {
        await restClient({}, '/foo', { bar: 'baz' }, { method: 'post' })
      })

      it('should make the expected request', function () {
        expect(axiosStub).to.be.calledOnceWithExactly(
          'http://localhost:8080/foo',
          {
            data: { bar: 'baz' },
            headers: {
              Authorization: 'Bearer foo',
              DefaultHeaders: 'header value',
            },
            method: 'post',
          }
        )
      })
    })

    context('when calling the API - format', function () {
      beforeEach(async function () {
        await restClient(
          {},
          '/foo',
          { bar: 'baz' },
          { format: 'application/foo' }
        )
      })

      it('should pass the expected format to the method that returns the default client headers', function () {
        expect(getRequestHeadersStub).to.be.calledOnceWithExactly(
          {},
          'application/foo'
        )
      })
    })

    context('when using get method', function () {
      beforeEach(async function () {
        await restClient.get({}, '/foo', { bar: 'baz' })
      })

      it('should make the expected request', function () {
        expect(axiosStub).to.be.calledOnceWithExactly(
          'http://localhost:8080/foo',
          {
            params: { bar: 'baz' },
            headers: {
              Authorization: 'Bearer foo',
              DefaultHeaders: 'header value',
            },
          }
        )
      })
    })

    context('when using post method', function () {
      beforeEach(async function () {
        await restClient.post({}, '/foo', { bar: 'baz' })
      })

      it('should make the expected request', function () {
        expect(axiosStub).to.be.calledOnceWithExactly(
          'http://localhost:8080/foo',
          {
            data: { bar: 'baz' },
            headers: {
              Authorization: 'Bearer foo',
              DefaultHeaders: 'header value',
            },
            method: 'post',
          }
        )
      })
    })
  })
})
