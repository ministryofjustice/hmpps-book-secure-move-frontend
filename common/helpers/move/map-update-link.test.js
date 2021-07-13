const i18n = require('../../../config/i18n')

const mapUpdateLink = require('./map-update-link')

describe('Move helpers', function () {
  describe('#mapUpdateLink', function () {
    let mockCategory, response

    beforeEach(function () {
      mockCategory = 'mock-category'
      sinon.stub(i18n, 't').returns(undefined)

      i18n.t
        .withArgs(`moves::update_link.categories.${mockCategory}`)
        .returnsArg(0)
        .withArgs('moves::update_link.link_text')
        .returnsArg(0)
    })

    context('without args', function () {
      it('should return undefined', function () {
        expect(mapUpdateLink()).to.be.undefined
      })
    })

    context('with category that exists', function () {
      beforeEach(function () {
        response = mapUpdateLink('/link', mockCategory)
      })

      it('should call translations', function () {
        expect(i18n.t).to.be.calledWithExactly(
          `moves::update_link.categories.${mockCategory}`
        )

        expect(i18n.t).to.be.calledWithExactly('moves::update_link.link_text', {
          context: 'with_category',
          category: `moves::update_link.categories.${mockCategory}`,
        })
      })

      it('should return mapped object', function () {
        expect(response).to.deep.equal({
          category: mockCategory,
          attributes: {
            'data-update-link': mockCategory,
          },
          href: '/link',
          html: 'moves::update_link.link_text',
        })
      })
    })

    context('with category that does not exist', function () {
      it('should return undefined', function () {
        expect(mapUpdateLink('/link', 'missing')).to.be.undefined
      })
    })
  })
})
