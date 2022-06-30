const { expect } = require('chai')

const i18n = require('../../config/i18n').default

const filtersToCategoriesListComponent = require('./filters-to-categories-list-component')

describe('Presenters', function () {
  const pageUrl = '/page'
  const fields = {
    foo: {},
  }

  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
  })
  describe('#filtersToCategoriesListComponent()', function () {
    context('when passed a string value', function () {
      const values = {
        foo: 'bar',
      }
      let categories
      beforeEach(function () {
        categories = filtersToCategoriesListComponent(fields, values, pageUrl)
      })
      it('should perform the expected translations', function () {
        expect(i18n.t).to.be.calledTwice
        expect(i18n.t.firstCall).to.be.calledWithExactly(
          'filters::foo.legend',
          { context: 'display' }
        )
        expect(i18n.t.secondCall).to.be.calledWithExactly(
          'filters::foo.bar.label'
        )
      })
      it('should return the expected categories ', function () {
        expect(categories).to.deep.equal([
          {
            heading: {
              text: 'filters::foo.legend',
            },
            items: [
              {
                href: '/page',
                text: 'filters::foo.bar.label',
              },
            ],
          },
        ])
      })
    })

    context('when passed an array value', function () {
      it('should return the expected categories ', function () {
        const values = {
          foo: ['bar', 'baz', 'fizz', 'buzz'],
        }
        const categories = filtersToCategoriesListComponent(
          fields,
          values,
          pageUrl
        )
        expect(categories).to.deep.equal([
          {
            heading: {
              text: 'filters::foo.legend',
            },
            items: [
              {
                href: '/page?foo=baz%2Cfizz%2Cbuzz',
                text: 'filters::foo.bar.label',
              },
              {
                href: '/page?foo=bar%2Cfizz%2Cbuzz',
                text: 'filters::foo.baz.label',
              },
              {
                href: '/page?foo=bar%2Cbaz%2Cbuzz',
                text: 'filters::foo.fizz.label',
              },
              {
                href: '/page?foo=bar%2Cbaz%2Cfizz',
                text: 'filters::foo.buzz.label',
              },
            ],
          },
        ])
      })
    })

    context('when passed an undefined value', function () {
      it('should return no categories ', function () {
        const values = {}
        const categories = filtersToCategoriesListComponent(
          fields,
          values,
          pageUrl
        )
        expect(categories).to.deep.equal([])
      })
    })

    context('when passed an explicit default value', function () {
      it('should return no categories ', function () {
        const values = {
          foo: 'default',
        }
        const categories = filtersToCategoriesListComponent(
          fields,
          values,
          pageUrl
        )
        expect(categories).to.deep.equal([])
      })
    })
  })
})
