const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('results')

describe('Results component', function() {
  context('by default', function() {
    let $component, $items, $

    beforeEach(function() {
      $ = render('results', examples.default)
      $component = $('.app-results')

      const $itemsList = $('.app-results__list')
      $items = $itemsList.find('.app-results__list-item')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render correct number of items', function() {
      expect($items.length).to.equal(3)
    })

    it('should render correct items', function() {
      const $item1 = $($items[0])
      const $item2 = $($items[1])
      const $item3 = $($items[2])

      expect($item1.text()).to.contain('Date of birth')
      expect($item1.text()).to.contain('10/10/1970')

      expect($item2.text()).to.contain('HTML')
      expect($item2.html()).to.contain('<em>Foo</em>')

      expect($item3.text()).to.contain('Escaped HTML')
      expect($item3.html()).to.contain('&lt;em&gt;Bar&lt;/em&gt;')
    })
  })

  context('with empty items array', function() {
    it('should not render items', function() {
      const $ = render('results', {
        items: [],
      })
      const $itemsList = $('.app-results__list')

      expect($itemsList.length).to.equal(0)
    })
  })
})
