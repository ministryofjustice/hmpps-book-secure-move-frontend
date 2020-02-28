const { decodeAccessToken } = require('./access-token')

describe('Access token library', function() {
  describe('#decodeAccessToken', function() {
    context('supplied with a properly encoded token', function() {
      it('returns a Javascript object of the token payload', function() {
        const payload = { test: 'test' }
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
          'base64'
        )
        const token = `test.${encodedPayload}.test`

        expect(decodeAccessToken(token)).to.deep.equal(payload)
      })
    })

    context('with undefined token', function() {
      it('should return an empty object', function() {
        expect(decodeAccessToken()).to.deep.equal({})
      })
    })
  })
})
