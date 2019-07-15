const proxyquire = require('proxyquire').noCallThru()

describe('URL helpers', function () {
  describe('#buildUrl()', function () {
    let buildUrl, result

    const host = 'test'

    const getHelper = function (production = false) {
      const mockConfig = {
        IS_PRODUCTION: production,
        SERVER_HOST: host,
      }

      const helpers = proxyquire('./url', {
        '../../config': mockConfig,
      })

      return helpers.buildUrl
    }

    beforeEach(function () {
      buildUrl = getHelper()
    })

    context('with no parameters', function () {
      beforeEach(function () {
        result = buildUrl()
      })

      it('returns the root URL for the host specified in the SERVER_HOST environment variable', function () {
        expect(result).to.equal(`http://${host}/`)
      })

      context('in a non-production mode', function () {
        it('returns HTTP protocol', function () {
          expect(result).to.equal(`http://${host}/`)
        })
      })

      context('in production mode', function () {
        beforeEach(function () {
          buildUrl = getHelper(true)
          result = buildUrl()
        })

        it('returns HTTPS protocol', function () {
          expect(result).to.equal(`https://${host}/`)
        })
      })
    })

    context('with path parameter', function () {
      beforeEach(function () {
        result = buildUrl('test')
      })

      it('returns a URL with the supplied path appended', function () {
        expect(result).to.equal(`http://${host}/test`)
      })
    })

    context('with domain parameter', function () {
      beforeEach(function () {
        result = buildUrl('test', 'test123')
      })

      it('returns a URL for the supplied domain', function () {
        expect(result).to.equal('http://test123/test')
      })
    })

    context('with secure parameter', function () {
      context('which is falsy', function () {
        beforeEach(function () {
          result = buildUrl('test', 'test123', false)
        })

        it('returns HTTP protocol', function () {
          expect(result).to.equal('http://test123/test')
        })
      })

      context('which is truthy', function () {
        beforeEach(function () {
          result = buildUrl('test', 'test123', true)
        })

        it('returns HTTP protocol', function () {
          expect(result).to.equal('https://test123/test')
        })
      })
    })
  })
})
