const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('filter')

describe('Results component', function() {
  context('by default', function() {
    let component, items, $

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('filter', examples.default)

      component = $('.app-filter')
      items = component.find('.app-filter__list-item')
    })

    it('should render component', function() {
      expect(component.get(0).name).to.equal('nav')
    })

    it('should render a list', function() {
      expect(component.find('ul').length).to.equal(1)
    })

    it('should render correct number of items', function() {
      expect(items.length).to.equal(3)
    })

    it('should render correct items', function() {
      const item1 = $(items[0])
      const item2 = $(items[1])
      const item3 = $(items[2])

      expect(item1.html()).to.contain('Moves proposed')
      expect(item2.html()).to.contain('Moves requested')
      expect(item3.html()).to.contain('Moves rejected')
    })
    it('has link on the non active items', function() {
      const item1 = $(items[0]).find('a')
      const item3 = $(items[2]).find('a')
      expect(item1.length).to.equal(1)
      expect(item3.length).to.equal(1)
    })
    it('has no link on the active item', function() {
      const item2 = $(items[1]).find('a')
      expect(item2.length).to.equal(0)
    })
    it('renders the value span', function() {
      const valueSpan = $(items[0]).find('.app-filter__value')
      expect(valueSpan.length).to.equal(1)
      expect(valueSpan.html()).to.equal('4')
    })
    it('renders the label span', function() {
      const valueSpan = $(items[0]).find('.app-filter__label')
      expect(valueSpan.length).to.equal(1)
      expect(valueSpan.html()).to.equal('Moves proposed')
    })
    it('incorporates the classes passed to it', function() {
      expect(component.get(0).attribs.class).to.equal(
        'app-filter app-filter-stacked'
      )
    })
  })
  context('without value', function() {
    let component, items, $

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('filter', examples.withoutValue)

      component = $('.app-filter')
      items = component.find('.app-filter__list-item')
    })
    it('does not render the value span', function() {
      const valueSpan = $(items[0]).find('.app-filter__value')
      expect(valueSpan.length).to.equal(0)
    })
    it('renders the label span', function() {
      const valueSpan = $(items[0]).find('.app-filter__label')
      expect(valueSpan.length).to.equal(1)
      expect(valueSpan.html()).to.equal('Moves proposed')
    })
  })
  context('without label', function() {
    let component, items, $

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('filter', examples.withoutLabel)

      component = $('.app-filter')
      items = component.find('.app-filter__list-item')
    })
    it('renders the value span', function() {
      const valueSpan = $(items[0]).find('.app-filter__value')
      expect(valueSpan.length).to.equal(1)
      expect(valueSpan.html()).to.equal('1')
    })
    it('does not render the label span', function() {
      const valueSpan = $(items[0]).find('.app-filter__label')
      expect(valueSpan.length).to.equal(0)
    })
  })
})
