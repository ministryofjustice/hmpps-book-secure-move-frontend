const locationToMetaToSpacesLink = require('./location-meta-to-spaces-link')

let result

describe('Presenters', function () {
  describe('#locationToMetaSpacesLink()', function () {
    context('with includeLink enabled', function () {
      beforeEach(function () {
        result = locationToMetaToSpacesLink({
          hrefPrefix: '/population/week/2020-01-01',
          id: 'FACEFEED',
          space: 1,
        })
      })

      it('should render with all properties', function () {
        expect(result).to.equal(
          '<a href="/population/week/2020-01-01">1 space</a>'
        )
      })
    })

    context('formatting spaces', function () {
      it('should format 1 as 1 space', function () {
        result = locationToMetaToSpacesLink({ id: '', space: 1 })

        expect(result).to.contain('1 space')
      })

      it('should format 2 as 2 space', function () {
        result = locationToMetaToSpacesLink({ id: '', space: 2 })

        expect(result).to.contain('2 spaces')
      })

      it('should format -1 as -1 space', function () {
        result = locationToMetaToSpacesLink({ id: '', space: -1 })

        expect(result).to.contain('-1 space')
      })

      it('should format 0 as Add', function () {
        result = locationToMetaToSpacesLink({ id: '', space: 0 })

        expect(result).to.contain('0 spaces')
      })

      it('should format undefined as Add', function () {
        result = locationToMetaToSpacesLink({ id: '', space: undefined })

        expect(result).to.contain('Add')
      })
    })
  })
})
