const requestLib = require('./request')

describe('Request library', function () {
  describe('#getQueryString()', function () {
    context('when existing query is empty', function () {
      it('should return a merged object as a query string', function () {
        const requestQuery = {}
        const newQuery = {
          foo: 'bar',
        }

        const querystring = requestLib.getQueryString(requestQuery, newQuery)

        expect(querystring).to.equal('?foo=bar')
      })
    })

    context('when existing query is not empty', function () {
      context('when no properties clash', function () {
        it('should return a merged object as a query string', function () {
          const requestQuery = {
            hello: 'world',
          }
          const newQuery = {
            foo: 'bar',
          }

          const querystring = requestLib.getQueryString(requestQuery, newQuery)

          expect(querystring).to.equal('?foo=bar&hello=world')
        })
      })

      context('when properties clash', function () {
        it('should return a merged object as a query string', function () {
          const target = {
            hello: 'world',
            foo: 'bar',
          }
          const source = {
            foo: 'world',
          }

          const querystring = requestLib.getQueryString(target, source)

          expect(querystring).to.equal('?foo=world&hello=world')
        })
      })
    })
  })
})
