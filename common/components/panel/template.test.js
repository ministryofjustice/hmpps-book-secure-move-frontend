const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('panel')

describe('Panel component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('panel', examples.default)
      $component = $('.app-panel')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render text', function () {
      expect($component.html().trim()).to.equal(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi odit, aut architecto molestias omnis iure et suscipit blanditiis impedit, quisquam incidunt cumque. Quo facere, magni quia dolorum odio provident impedit!'
      )
    })

    it('should not render tag component', function () {
      expect($component.find('.app-tag').length).to.equal(0)
    })

    it('should not render tabindex', function () {
      expect($component.attr('tabindex')).not.to.exist
    })
  })

  context('with classes param', function () {
    it('should render classes', function () {
      const $ = renderComponentHtmlToCheerio('panel', {
        classes: 'app-panel--inactive',
      })

      const $component = $('.app-panel')
      expect($component.hasClass('app-panel--inactive')).to.be.true
    })
  })

  context('with focusable option', function () {
    it('should render add tabindex', function () {
      const $ = renderComponentHtmlToCheerio('panel', {
        isFocusable: true,
      })

      const $component = $('.app-panel')
      expect($component.attr('tabindex')).to.equal('-1')
    })
  })

  context('with attributes param', function () {
    it('should render attributes', function () {
      const $ = renderComponentHtmlToCheerio('panel', {
        attributes: {
          'data-attribute': 'my data value',
        },
      })

      const $component = $('.app-panel')
      expect($component.attr('data-attribute')).to.equal('my data value')
    })
  })

  context('when html is passed to text', function () {
    it('should render escaped html', function () {
      const $ = renderComponentHtmlToCheerio('panel', {
        text: 'Content with <strong>bold text</strong>',
      })

      const $component = $('.app-panel')
      expect($component.html()).to.contain(
        'Content with &lt;strong&gt;bold text&lt;/strong&gt;'
      )
    })
  })

  context('when html is passed to html', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('panel', {
        html: 'Content with <strong>bold text</strong>',
      })

      const $component = $('.app-panel')
      expect($component.html()).to.contain(
        'Content with <strong>bold text</strong>'
      )
    })
  })

  context('when both html and text params are used', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('panel', {
        html: 'Content with <strong>bold text</strong>',
        text: 'Content with <strong>bold text</strong>',
      })

      const $component = $('.app-panel')
      expect($component.html()).to.contain(
        'Content with <strong>bold text</strong>'
      )
    })
  })

  context('when tag component is added', function () {
    let $, $component
    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('panel', examples['with tag'])
      $component = $('.app-panel')
    })

    it('should render a tag component', function () {
      const $tag = $component.find('.app-tag')

      expect($tag.length).to.equal(1)
      expect($tag.html().trim()).to.equal('An example tag')
    })

    it('should render content', function () {
      expect($component.html()).to.contain(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi odit, aut architecto molestias omnis iure et suscipit blanditiis impedit, quisquam incidunt cumque. Quo facere, magni quia dolorum odio provident impedit!'
      )
    })
  })
})
