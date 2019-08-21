const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('internal-header')

describe('Internal header component', function() {
  it('has a role of `banner`', function() {
    const $ = render('internal-header', {})

    const $component = $('.app-header')
    expect($component.attr('role')).to.equal('banner')
  })

  it('renders attributes correctly', function() {
    const $ = render('internal-header', {
      attributes: {
        'data-test-attribute': 'value',
        'data-test-attribute-2': 'value-2',
      },
    })

    const $component = $('.app-header')
    expect($component.attr('data-test-attribute')).to.equal('value')
    expect($component.attr('data-test-attribute-2')).to.equal('value-2')
  })

  it('renders classes', function() {
    const $ = render('internal-header', {
      classes: 'app-header--custom-modifier',
    })

    const $component = $('.app-header')
    expect($component.hasClass('app-header--custom-modifier')).to.be.true
  })

  it('renders custom container classes', function() {
    const $ = render('internal-header', {
      containerClasses: 'app-width-container',
    })

    const $component = $('.app-header')
    const $container = $component.find('.app-header__container')

    expect($container.hasClass('app-width-container')).to.be.true
  })

  it('renders home page URL', function() {
    const $ = render('internal-header', {
      homepageUrl: '/',
    })

    const $component = $('.app-header')
    const $homepageLink = $component.find('.app-header__link--homepage')
    expect($homepageLink.attr('href')).to.equal('/')
  })

  describe('with product name', function() {
    it('renders product name', function() {
      const $ = render('internal-header', examples['full width'])

      const $component = $('.app-header')
      const $productName = $component.find('.app-header__product-name')
      expect($productName.text().trim()).to.equal('Product Name')
    })
  })

  describe('with service name', function() {
    it('renders service name', function() {
      const $ = render('internal-header', examples['with service name'])

      const $component = $('.app-header')
      const $serviceName = $component.find('.app-header__link--service-name')
      expect($serviceName.text().trim()).to.equal('Service Name')
    })
  })

  describe('with navigation', function() {
    it('renders navigation', function() {
      const $ = render('internal-header', examples['with navigation'])

      const $component = $('.app-header')
      const $list = $component.find('ul.app-header__navigation')
      const $items = $list.find('li.app-header__navigation-item')
      const $firstItem = $items.find('a.app-header__link:first-child')
      expect($items.length).to.equal(4)
      expect($firstItem.attr('href')).to.equal('#1')
      expect($firstItem.text()).to.contain('Navigation item 1')
    })

    it('renders navigation item anchor with attributes', function() {
      const $ = render('internal-header', {
        navigation: [
          {
            text: 'Item',
            href: '/link',
            attributes: {
              'data-attribute': 'my-attribute',
              'data-attribute-2': 'my-attribute-2',
            },
          },
        ],
      })

      const $navigationLink = $('.app-header__navigation-item a')
      expect($navigationLink.attr('data-attribute')).to.equal('my-attribute')
      expect($navigationLink.attr('data-attribute-2')).to.equal(
        'my-attribute-2'
      )
    })

    it('renders navigation items with text only', function() {
      const $ = render('internal-header', {
        navigation: [
          {
            text: 'Item 1',
          },
          {
            text: 'Item 2',
          },
        ],
      })

      const $component = $('.app-header')
      const $list = $component.find('ul.app-header__navigation')
      const $firstItem = $list.find('li.app-header__navigation-item').first()
      const $lastItem = $list.find('li.app-header__navigation-item').last()

      expect($firstItem.html().trim()).to.equal('Item 1')
      expect($firstItem.find('a').length).to.equal(0)

      expect($lastItem.html().trim()).to.equal('Item 2')
      expect($lastItem.find('a').length).to.equal(0)
    })

    describe('menu button', function() {
      it('has an explicit type="button" so it does not act as a submit button', function() {
        const $ = render('internal-header', examples['with navigation'])

        const $button = $('.app-header__menu-button')

        expect($button.attr('type')).to.equal('button')
      })
    })
  })

  describe('SVG logo', function() {
    const $ = render('internal-header', {})
    const $svg = $('.app-header__logotype-crest')

    it('sets focusable="false" so that IE does not treat it as an interactive element', function() {
      expect($svg.attr('focusable')).to.equal('false')
    })

    it('sets role="presentation" so that it is ignored by assistive technologies', function() {
      expect($svg.attr('focusable')).to.equal('false')
    })

    describe('fallback PNG', function() {
      const $fallbackImage = $('.app-header__logotype-crest-fallback-image')

      it('uses the <image> tag which is a valid SVG element', function() {
        expect($fallbackImage[0].tagName).to.equal('image')
      })

      it('sets a blank xlink:href to prevent IE from downloading both the SVG and the PNG', function() {
        // Cheerio converts xhref to href - https://github.com/cheeriojs/cheerio/issues/1101
        expect($fallbackImage.attr('href')).to.equal('')
      })
    })
  })
})
