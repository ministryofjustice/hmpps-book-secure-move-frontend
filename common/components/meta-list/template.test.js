const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('meta-list')

describe('Meta list component', () => {
  context('default', () => {
    let $, $component, $items

    beforeEach(() => {
      $ = render('meta-list', examples.default)
      $component = $('.app-meta-list')
      $items = $component.find('.app-meta-list__item')
    })

    it('should render', () => {
      expect($component.length).to.equal(1)
    })

    it('should render correct number of items', () => {
      expect($items.length).to.equal(2)
    })
  })

  context('with classes', () => {
    it('should render classes', () => {
      const $ = render('meta-list', {
        classes: 'app-meta-list--custom-class',
      })

      const $component = $('.app-meta-list')
      expect($component.hasClass('app-meta-list--custom-class')).to.be.true
    })
  })

  context('items with text', () => {
    let $, $items

    beforeEach(() => {
      $ = render('meta-list', {
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

    it('should render text', () => {
      const $item1 = $($items[0])
      const $key = $item1.find('.app-meta-list__key')
      const $value = $item1.find('.app-meta-list__value')

      expect($key.html().trim()).to.equal('From')
      expect($value.html().trim()).to.equal('Home')
    })

    it('should escape HTML', () => {
      const $item2 = $($items[1])
      const $key = $item2.find('.app-meta-list__key')
      const $value = $item2.find('.app-meta-list__value')

      expect($key.html().trim()).to.equal('&lt;span&gt;To&lt;/span&gt;')
      expect($value.html().trim()).to.equal('&lt;em&gt;Work&lt;/em&gt;')
    })
  })

  context('items with html', () => {
    let $, $items

    beforeEach(() => {
      $ = render('meta-list', {
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

    it('should render HTML', () => {
      const $item1 = $($items[0])
      const $key = $item1.find('.app-meta-list__key')
      const $value = $item1.find('.app-meta-list__value')

      expect($key.html().trim()).to.equal('<span>To</span>')
      expect($value.html().trim()).to.equal('<em>Work</em>')
    })
  })
})
