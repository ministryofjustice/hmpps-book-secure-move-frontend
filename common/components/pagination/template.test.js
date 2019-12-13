const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('pagination')

describe('Pagination component', function() {
  context('default', function() {
    it('should render previous link', function() {
      const $ = renderComponentHtmlToCheerio('pagination', examples.default)

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--prev')
      const $itemText = $item.find('.app-pagination__link-text')
      const $itemLink = $item.find('a')

      expect($itemText.text()).to.equal('Previous')
      expect($itemLink.attr('href')).to.equal('/previous-page')
    })

    it('should render next link', function() {
      const $ = renderComponentHtmlToCheerio('pagination', examples.default)

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--next')
      const $itemText = $item.find('.app-pagination__link-text')
      const $itemLink = $item.find('a')

      expect($itemText.text()).to.equal('Next')
      expect($itemLink.attr('href')).to.equal('/next-page')
    })
  })

  context('without next or previous', function() {
    it('should not render previous link', function() {
      const $ = renderComponentHtmlToCheerio('pagination', {})

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--prev')
      expect($item.length).to.equal(0)
    })

    it('should not render next link', function() {
      const $ = renderComponentHtmlToCheerio('pagination', {})

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--next')
      expect($item.length).to.equal(0)
    })
  })

  context('with classes', function() {
    it('should render classes', function() {
      const $ = renderComponentHtmlToCheerio('pagination', {
        classes: 'app-pagination--custom-class',
      })

      const $component = $('.app-pagination')
      expect($component.hasClass('app-pagination--custom-class')).to.be.true
    })
  })

  context('with labels', function() {
    it('should render previous label', function() {
      const $ = renderComponentHtmlToCheerio('pagination', {
        previous: {
          href: '/page-1',
          label: '1 of 300',
        },
      })

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--prev')
      const $itemLabel = $item.find('.app-pagination__link-label')
      const $itemLink = $item.find('a')

      expect($itemLabel.text().trim()).to.equal('1 of 300')
      expect($itemLink.attr('href')).to.equal('/page-1')
    })

    it('should render next label', function() {
      const $ = renderComponentHtmlToCheerio('pagination', {
        next: {
          href: '/page-3',
          label: '3 of 300',
        },
      })

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--next')
      const $itemLabel = $item.find('.app-pagination__link-label')
      const $itemLink = $item.find('a')

      expect($itemLabel.text().trim()).to.equal('3 of 300')
      expect($itemLink.attr('href')).to.equal('/page-3')
    })
  })

  context('with custom text', function() {
    it('should render previous text', function() {
      const $ = renderComponentHtmlToCheerio('pagination', {
        previous: {
          href: '/previous-day',
          text: 'Previous day',
        },
      })

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--prev')
      const $itemText = $item.find('.app-pagination__link-text')
      const $itemLink = $item.find('a')

      expect($itemText.text().trim()).to.equal('Previous day')
      expect($itemLink.attr('href')).to.equal('/previous-day')
    })

    it('should render next label', function() {
      const $ = renderComponentHtmlToCheerio('pagination', {
        next: {
          href: '/next-day',
          text: 'Next day',
        },
      })

      const $component = $('.app-pagination')
      const $item = $component.find('.app-pagination__list-item--next')
      const $itemText = $item.find('.app-pagination__link-text')
      const $itemLink = $item.find('a')

      expect($itemText.text().trim()).to.equal('Next day')
      expect($itemLink.attr('href')).to.equal('/next-day')
    })
  })

  context('with items', function() {
    let $, $component, items

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('pagination', examples['with items'])
      $component = $('.app-pagination')
      items = $component.find('.app-pagination__list-item')
    })

    it('should render correct number of items', function() {
      const $items = $component.find('.app-pagination__list-item')
      expect($items.length).to.equal(5)
    })

    it('should render previous label', function() {
      const $item = $component.find('.app-pagination__list-item--prev')
      expect($item.length).to.equal(1)
    })

    it('should render next label', function() {
      const $item = $component.find('.app-pagination__list-item--next')
      expect($item.length).to.equal(1)
    })

    it('should render first item', function() {
      const $item = $(items[1])
      const $itemText = $item.find('.app-pagination__link-text')
      const $itemLink = $item.find('a')

      expect($itemText.text().trim()).to.equal('one')
      expect($itemLink.attr('href')).to.equal('/page-1')
    })

    it('should render second item', function() {
      const $item = $(items[2])
      const $itemText = $item.find('.app-pagination__link-text')
      const $itemLink = $item.find('a')

      expect($itemText.text().trim()).to.equal('two')
      expect($itemLink.attr('href')).to.equal('/page-2')
    })

    it('should render third item', function() {
      const $item = $(items[3])
      const $itemText = $item.find('.app-pagination__link-text')
      const $itemLink = $item.find('a')

      expect($itemText.text().trim()).to.equal('three')
      expect($itemLink.attr('href')).to.equal('/page-3')
    })
  })
})
