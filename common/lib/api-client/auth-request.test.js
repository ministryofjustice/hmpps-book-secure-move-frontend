const proxyquire = require('proxyquire')
const axios = require('axios')

const mockToken = '1212121212'
const mockAPI = {
  BASE_URL: '/mock-url',
  TIMEOUT: 11000000,
}
const authRequest = proxyquire('./auth-request', {
  './auth': () => new MockAuth(),
  '../../../config': {
    API: mockAPI,
  },
})

function MockAuth() {}
MockAuth.prototype.getAccessToken = sinon.stub()

describe('Auth Request', function() {
  context('when creating an authorisedRequest', function() {
    beforeEach(async function() {
      sinon.spy(axios, 'create')
      MockAuth.prototype.getAccessToken.resolves(mockToken)

      await authRequest()
    })

    it('should call auth library', function() {
      expect(MockAuth.prototype.getAccessToken).to.be.calledOnce
    })

    it('should call axios create', function() {
      expect(axios.create).to.be.calledOnce
      expect(axios.create).to.be.calledWithExactly({
        baseURL: mockAPI.BASE_URL,
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        timeout: mockAPI.TIMEOUT,
      })
    })
  })

  context('when using authorisedRequest', function() {
    const mockRequestUrl = 'http://test.com'
    const mockRequestPath = '/user/me'
    const mockResponseMessage = {
      message: 'you have a response',
    }
    let authorisedRequest

    beforeEach(async function() {
      nock(mockRequestUrl)
        .get(mockRequestPath)
        .reply(200, JSON.stringify(mockResponseMessage))

      MockAuth.prototype.getAccessToken.resolves(mockToken)
      authorisedRequest = await authRequest()
    })

    it('should call get as expected', async function() {
      const response = await authorisedRequest.get(
        `${mockRequestUrl}${mockRequestPath}`
      )

      expect(response.data).to.deep.equal(mockResponseMessage)
    })

    it('get request should contain expected Bearer', async function() {
      const response = await authorisedRequest.get(
        `${mockRequestUrl}${mockRequestPath}`
      )

      expect(response.request.headers.authorization).to.equal(
        `Bearer ${mockToken}`
      )
    })
  })
})
