const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('link')

describe('Link component', function() {
  context('by default', function() {
    let $component

    beforeEach(function() {
      const $ = render('link', examples.default)
      $component = $('.app-link')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('span')
    })

    it('should render anchor', function() {
      const $anchor = $component.find('.app-link__anchor')
      expect($anchor.text().trim()).to.equal('Example text for anchor')
      expect($anchor.attr('href').trim()).to.equal('http://example/url')
      expect($anchor.id).to.be.undefined
    })

    it('should not render meta data', function() {
      const $meta = $component.find('.app-link__meta')
      expect($meta.length).to.equal(0)
    })

    it('should not render default hint', function() {
      const $hint = $component.find('.app-link__hint')
      expect($hint.length).to.equal(0)
    })
  })

  context('with hint', function() {
    let $component

    beforeEach(function() {
      const $ = render('link', examples['with hint'])
      $component = $('.app-link')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('span')
    })

    it('should render anchor', function() {
      const $anchor = $component.find('.app-link__anchor')
      expect($anchor.text().trim()).to.equal(
        'Example text for anchor with hint'
      )
      expect($anchor.attr('href').trim()).to.equal(
        'http://example/url/with/hint'
      )
      expect($anchor.attr('target').trim()).to.equal('_blank')
      expect($anchor.attr('aria-labelledby')).to.equal('example-hint-id-1')
    })

    it('should not render meta data', function() {
      const $meta = $component.find('.app-link__meta')
      expect($meta.length).to.equal(0)
    })

    it('should render default hint', function() {
      const $hint = $component.find('.app-link__hint')
      expect($hint.length).to.equal(1)
      expect($hint.text().trim()).to.equal('(Opens in a new window)')
    })
  })

  context('with hint and meta data', function() {
    let $component

    beforeEach(function() {
      const $ = render('link', examples['with hint and meta data'])
      $component = $('.app-link')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('span')
    })

    it('should render anchor', function() {
      const $anchor = $component.find('.app-link__anchor')
      expect($anchor.text().trim()).to.equal(
        'Example text for anchor with hint and meta data'
      )
      expect($anchor.attr('target').trim()).to.equal('_blank')
      expect($anchor.attr('href').trim()).to.equal(
        'http://example/url/with/hint/and/filesize'
      )
      expect($anchor.attr('aria-labelledby')).to.equal('example-hint-id-2')
    })

    it('should render meta data', function() {
      const $meta = $component.find('.app-link__meta')
      expect($meta.text().trim()).to.equal('(1.2 MB)')
    })

    it('should render default hint', function() {
      const $hint = $component.find('.app-link__hint')
      expect($hint.length).to.equal(1)
      expect($hint.text().trim()).to.equal('(Opens in a new window)')
    })
  })

  context('with hint, meta data and hint text', function() {
    let $component

    beforeEach(function() {
      const $ = render(
        'link',
        examples['with hint and meta data and hint text']
      )
      $component = $('.app-link')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('span')
    })

    it('should render anchor', function() {
      const $anchor = $component.find('.app-link__anchor')
      expect($anchor.text().trim()).to.equal(
        'Example text for anchor with hint and meta data and hint text'
      )
      expect($anchor.attr('target').trim()).to.equal('_blank')
      expect($anchor.attr('href').trim()).to.equal(
        'http://example/url/with/hint/and/filesize/and/hint-text'
      )
      expect($anchor.attr('aria-labelledby')).to.equal('example-hint-id-3')
    })

    it('should render meta data', function() {
      const $meta = $component.find('.app-link__meta')
      expect($meta.text().trim()).to.equal('(1 KB)')
    })

    it('should render custom hint', function() {
      const $hint = $component.find('.app-link__hint')
      expect($hint.length).to.equal(1)
      expect($hint.text().trim()).to.equal('(Hint text example)')
    })
  })
})
