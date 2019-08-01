const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('_panel')

describe('Panel component', function() {
  context('by default', function() {
    let $component

    beforeEach(function() {
      const $ = render('_panel', examples.default)
      $component = $('.app-panel')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render text', function() {
      expect($component.html().trim()).to.equal('Panel contents')
    })

    it('should not render tag component', function() {
      expect($component.find('.app-tag').length).to.equal(0)
    })
  })

  context('with classes param', function() {
    it('should render classes', function() {
      const $ = render('_panel', {
        classes: 'app-panel--inactive',
      })

      const $component = $('.app-panel')
      expect($component.hasClass('app-panel--inactive')).to.be.true
    })
  })

  context('with attributes param', function() {
    it('should render attributes', function() {
      const $ = render('_panel', {
        attributes: {
          'data-attribute': 'my data value',
        },
      })

      const $component = $('.app-panel')
      expect($component.attr('data-attribute')).to.equal('my data value')
    })
  })

  context('when html is passed to text', function() {
    it('should render escaped html', function() {
      const $ = render('_panel', {
        text: 'Content with <strong>bold text</strong>',
      })

      const $component = $('.app-panel')
      expect($component.html()).to.contain(
        'Content with &lt;strong&gt;bold text&lt;/strong&gt;'
      )
    })
  })

  context('when html is passed to html', function() {
    it('should render unescaped html', function() {
      const $ = render('_panel', {
        html: 'Content with <strong>bold text</strong>',
      })

      const $component = $('.app-panel')
      expect($component.html()).to.contain(
        'Content with <strong>bold text</strong>'
      )
    })
  })

  context('when both html and text params are used', function() {
    it('should render unescaped html', function() {
      const $ = render('_panel', {
        html: 'Content with <strong>bold text</strong>',
        text: 'Content with <strong>bold text</strong>',
      })

      const $component = $('.app-panel')
      expect($component.html()).to.contain(
        'Content with <strong>bold text</strong>'
      )
    })
  })

  context('when tag component is added', function() {
    let $, $component
    beforeEach(function() {
      $ = render('_panel', examples['with tag'])
      $component = $('.app-panel')
    })

    it('should render a tag component', function() {
      const $tag = $component.find('.app-tag')

      expect($tag.length).to.equal(1)
      expect($tag.html().trim()).to.equal('An example tag')
    })

    it('should render content', function() {
      expect($component.html()).to.contain('Panel contents')
    })
  })
})
