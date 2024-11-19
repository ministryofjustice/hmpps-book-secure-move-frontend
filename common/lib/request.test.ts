import { expect } from 'chai'

import { getQueryString, getUrl } from './request'

describe('Request library', function () {
  describe('#getQueryString()', function () {
    context('when both queries are empty', function () {
      it('should return a merged object as an empty string', function () {
        const requestQuery = {}
        const newQuery = {}

        const querystring = getQueryString(requestQuery, newQuery)

        expect(querystring).to.equal('')
      })
    })

    context('when existing query is empty', function () {
      it('should return a merged object as a query string', function () {
        const requestQuery = {}
        const newQuery = {
          foo: 'bar',
        }

        const querystring = getQueryString(requestQuery, newQuery)

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

          const querystring = getQueryString(requestQuery, newQuery)

          expect(querystring).to.equal('?hello=world&foo=bar')
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

          const querystring = getQueryString(target, source)

          expect(querystring).to.equal('?hello=world&foo=world')
        })
      })
    })
  })

  describe('#getUrl()', function () {
    context('when called without query params', function () {
      it('should output expected url', function () {
        const url = getUrl('/foo', {})
        expect(url).to.equal('/foo')
      })
    })

    context('when called with query params', function () {
      it('should output expected url', function () {
        const url = getUrl('/foo', { bar: 'baz' })
        expect(url).to.equal('/foo?bar=baz')
      })
    })
  })
})
