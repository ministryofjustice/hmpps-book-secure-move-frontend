const proxyquire = require('proxyquire').noCallThru()

const configMock = {
  API: {
    BASE_URL: 'http://api.com/v1',
  },
}
const jsonApi = proxyquire('./json-api', {
  '../../../config': configMock,
})
const auth = require('./middleware/auth')

describe('Back-end API client', function() {
  describe('#find', function() {
    let apiMock

    beforeEach(async function() {
      const accessToken = 'foo'
      const path = 'tests'
      const id = 123

      sinon.stub(auth, 'getAccessToken').returns(accessToken)
      sinon
        .stub(auth, 'getAccessTokenExpiry')
        .returns(Math.floor(new Date() / 1000) + 100)

      const { API } = configMock
      apiMock = nock(API.BASE_URL, {
        reqheaders: {
          authorization: `Bearer ${accessToken}`,
        },
      })
        .get(`/${path}/${id}`)
        .reply(200)

      await jsonApi.find(path, id)
    })

    it('adds the access token to the headers of the request', function() {
      expect(apiMock.isDone()).to.be.true
    })
  })
})
