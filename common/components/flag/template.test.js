const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('tag')

describe('Tag component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('tag', examples.default)
      $component = $('.app-tag')
    })

    it('should render with strong element', function () {
      expect($component.get(0).tagName).to.equal('strong')
    })

    it('should render text', function () {
      expect($component.text()).to.contain('alpha')
    })
  })

  context('with classes param', function () {
    it('should render classes', function () {
      const $ = renderComponentHtmlToCheerio('tag', {
        classes: 'app-tag--inactive',
        text: 'alpha',
      })

      const $component = $('.app-tag')
      expect($component.hasClass('app-tag--inactive')).to.be.true
    })
  })

  context('with href param', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('tag', {
        text: 'alpha',
        href: '/a-link',
      })
      $component = $('.app-tag')
    })

    it('should render with anchor element', function () {
      expect($component.get(0).tagName).to.equal('a')
    })

    it('should render href attribute', function () {
      expect($component.attr('href')).to.equal('/a-link')
    })
  })

  context('when html is passed to text', function () {
    it('should render escaped html', function () {
      const $ = renderComponentHtmlToCheerio('tag', {
        text: '<span>alpha</span>',
      })

      const $component = $('.app-tag')
      expect($component.html()).to.contain('&lt;span&gt;alpha&lt;/span&gt;')
    })
  })

  context('when html is passed to html', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('tag', {
        html: '<span>alpha</span>',
      })

      const $component = $('.app-tag')
      expect($component.html()).to.contain('<span>alpha</span>')
    })
  })

  context('when both html and text params are used', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('tag', {
        html: '<span>alpha</span>',
        text: '<span>alpha</span>',
      })

      const $component = $('.app-tag')
      expect($component.html()).to.contain('<span>alpha</span>')
    })
  })
})
