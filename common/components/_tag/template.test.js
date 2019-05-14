const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('_tag')

describe('Tag component', () => {
  context('by default', () => {
    let $component

    beforeEach(() => {
      const $ = render('_tag', examples.default)
      $component = $('.app-tag')
    })

    it('should render with strong element', () => {
      expect($component.get(0).tagName).to.equal('strong')
    })

    it('should render text', () => {
      expect($component.text()).to.contain('alpha')
    })
  })

  context('with classes param', () => {
    it('should render classes', () => {
      const $ = render('_tag', {
        classes: 'app-tag--inactive',
        text: 'alpha',
      })

      const $component = $('.app-tag')
      expect($component.hasClass('app-tag--inactive')).to.be.true
    })
  })

  context('with href param', () => {
    let $component

    beforeEach(() => {
      const $ = render('_tag', {
        text: 'alpha',
        href: '/a-link',
      })
      $component = $('.app-tag')
    })

    it('should render with anchor element', () => {
      expect($component.get(0).tagName).to.equal('a')
    })

    it('should render href attribute', () => {
      expect($component.attr('href')).to.equal('/a-link')
    })
  })

  context('when html is passed to text', () => {
    it('should render escaped html', () => {
      const $ = render('_tag', {
        text: '<span>alpha</span>',
      })

      const $component = $('.app-tag')
      expect($component.html()).to.contain('&lt;span&gt;alpha&lt;/span&gt;')
    })
  })

  context('when html is passed to html', () => {
    it('should render unescaped html', () => {
      const $ = render('_tag', {
        html: '<span>alpha</span>',
      })

      const $component = $('.app-tag')
      expect($component.html()).to.contain('<span>alpha</span>')
    })
  })

  context('when both html and text params are used', () => {
    it('should render unescaped html', () => {
      const $ = render('_tag', {
        html: '<span>alpha</span>',
        text: '<span>alpha</span>',
      })

      const $component = $('.app-tag')
      expect($component.html()).to.contain('<span>alpha</span>')
    })
  })
})
