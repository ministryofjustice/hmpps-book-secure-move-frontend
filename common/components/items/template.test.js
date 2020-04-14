const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('items')
const getComponent = example => {
  const $ = renderComponentHtmlToCheerio('items', examples[example])
  return $('.app-items')
}
const getItems = $component => $component.find('> *')
const getItemsText = $item => $item.text().replace(/\s/g, '')

describe('Items component', function() {
  describe('default', function() {
    let $component

    beforeEach(function() {
      $component = getComponent('default')
    })

    context('when rendering component', function() {
      it('should create the expected element', function() {
        expect($component.get(0).tagName).to.equal('div')
      })
    })

    context('when rendering items', function() {
      let $items

      beforeEach(function() {
        $items = getItems($component)
      })
      it('should create the expected number of items', function() {
        expect($items.length).to.equal(2)
      })

      it('should output the expected value for the items', function() {
        expect(getItemsText($items.eq(0))).to.equal('detailsSummarydetailsHtml')
        expect(getItemsText($items.eq(1))).to.equal(
          'detailsSummaryBdetailsHtmlB'
        )
      })
    })
  })

  describe('with no items', function() {
    let $component

    beforeEach(function() {
      $component = getComponent('with no items')
    })

    it('should not output anything', function() {
      expect($component.get(0)).to.not.exist
    })
  })

  describe('with classes', function() {
    let $component

    beforeEach(function() {
      $component = getComponent('with classes')
    })

    context('when rendering component', function() {
      it('should add the custom classes', function() {
        expect($component.hasClass('items-class')).to.be.true
      })
    })
  })
})
