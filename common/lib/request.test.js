const requestLib = require('./request')

describe('Request library', function () {
  describe('#getQueryString()', function () {
    context('when existing query is empty', () => {
      it('should return a merged object as a query string', () => {
        const requestQuery = {}
        const newQuery = {
          foo: 'bar',
        }

        const querystring = requestLib.getQueryString(requestQuery, newQuery)

        expect(querystring).to.equal('?foo=bar')
      })
    })

    context('when existing query is not empty', () => {
      context('when no properties clash', () => {
        it('should return a merged object as a query string', () => {
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

      context('when properties clash', () => {
        it('should return a merged object as a query string', () => {
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
