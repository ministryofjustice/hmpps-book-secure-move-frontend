const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('meta-list')

describe('Meta list component', function() {
  context('default', function() {
    let $, $component, $items

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('meta-list', examples.default)
      $component = $('.app-meta-list')
      $items = $component.find('.app-meta-list__item')
    })

    it('should render', function() {
      expect($component.length).to.equal(1)
    })

    it('should render correct number of items', function() {
      expect($items.length).to.equal(2)
    })
  })

  context('with classes', function() {
    it('should render classes', function() {
      const $ = renderComponentHtmlToCheerio('meta-list', {
        classes: 'app-meta-list--custom-class',
      })

      const $component = $('.app-meta-list')
      expect($component.hasClass('app-meta-list--custom-class')).to.be.true
    })
  })

  context('items with text', function() {
    let $, $items

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('meta-list', {
        items: [
          {
            key: {
              text: 'From',
            },
            value: {
              text: 'Home',
            },
          },
          {
            key: {
              text: '<span>To</span>',
            },
            value: {
              text: '<em>Work</em>',
            },
          },
        ],
      })
      $items = $('.app-meta-list').find('.app-meta-list__item')
    })

    it('should render text', function() {
      const $item1 = $($items[0])
      const $key = $item1.find('.app-meta-list__key')
      const $value = $item1.find('.app-meta-list__value')

      expect($key.html().trim()).to.equal('From')
      expect($value.html().trim()).to.equal('Home')
    })

    it('should escape HTML', function() {
      const $item2 = $($items[1])
      const $key = $item2.find('.app-meta-list__key')
      const $value = $item2.find('.app-meta-list__value')

      expect($key.html().trim()).to.equal('&lt;span&gt;To&lt;/span&gt;')
      expect($value.html().trim()).to.equal('&lt;em&gt;Work&lt;/em&gt;')
    })
  })

  context('items with html', function() {
    let $, $items

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('meta-list', {
        items: [
          {
            key: {
              html: '<span>To</span>',
            },
            value: {
              html: '<em>Work</em>',
            },
          },
        ],
      })
      $items = $('.app-meta-list').find('.app-meta-list__item')
    })

    it('should render HTML', function() {
      const $item1 = $($items[0])
      const $key = $item1.find('.app-meta-list__key')
      const $value = $item1.find('.app-meta-list__value')

      expect($key.html().trim()).to.equal('<span>To</span>')
      expect($value.html().trim()).to.equal('<em>Work</em>')
    })
  })

  context('items with no key', function() {
    let $, $items

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('meta-list', {
        items: [
          {
            value: {
              text: 'Value',
            },
          },
        ],
      })
      $items = $('.app-meta-list').find('.app-meta-list__item')
    })

    it('should not render the key', function() {
      const $item1 = $($items[0])
      const $key = $item1.find('.app-meta-list__key')

      expect($key.length).to.equal(0)
    })

    it('should render the value', function() {
      const $item1 = $($items[0])
      const $value = $item1.find('.app-meta-list__value')

      expect($value.html().trim()).to.equal('Value')
    })
  })

  context('items with no value', function() {
    let $, $items

    beforeEach(function() {
      $ = renderComponentHtmlToCheerio('meta-list', {
        items: [
          {
            key: {
              text: 'Key',
            },
          },
        ],
      })
      $items = $('.app-meta-list').find('.app-meta-list__item')
    })

    it('should not render item', function() {
      expect($items.length).to.equal(0)
    })
  })
})
