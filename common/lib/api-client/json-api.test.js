const jsonApi = require('./json-api')
const auth = require('./auth')
const { API } = require('../../../config')

describe('Back-end API client', function () {
  describe('#find', function () {
    let apiMock

    beforeEach(async function () {
      const accessToken = 'poo'
      const path = 'tests'
      const id = 123

      sinon.stub(auth, 'getAccessToken').returns(accessToken)
      sinon.stub(auth, 'getAccessTokenExpiry').returns(Math.floor(new Date() / 1000) + 100)

      const baseUrl = new URL(API.BASE_URL)
      apiMock = nock(baseUrl.origin, {
        reqheaders: {
          authorization: `Bearer ${accessToken}`,
        },
      }).get(`${baseUrl.pathname}/${path}/${id}`).reply(200, 'test')

      await jsonApi.find(path, id)
    })

    it('adds the access token to the headers of the request', function () {
      expect(apiMock.isDone()).to.be.true
    })
  })
})
