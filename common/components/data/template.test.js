const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('data')

describe('Data component', function() {
  context('by default', function() {
    let $component

    beforeEach(function() {
      const $ = render('data', examples.default)
      $component = $('.app-data')
    })

    it('should render a div', function() {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render value', function() {
      expect(
        $component
          .find('.app-data__value')
          .text()
          .trim()
      ).to.equal('25')
    })

    it('should render label', function() {
      expect(
        $component
          .find('.app-data__label')
          .text()
          .trim()
      ).to.equal('emails sent')
    })

    it('should render value first', function() {
      expect(
        $component
          .children()
          .first()
          .hasClass('app-data__value')
      ).to.be.true
    })

    it('should render label second', function() {
      expect(
        $component
          .children()
          .last()
          .hasClass('app-data__label')
      ).to.be.true
    })
  })

  context('inverted', function() {
    let $component

    beforeEach(function() {
      const $ = render('data', examples.inverted)
      $component = $('.app-data')
    })

    it('should render label first', function() {
      expect(
        $component
          .children()
          .first()
          .hasClass('app-data__label')
      ).to.be.true
    })

    it('should render value second', function() {
      expect(
        $component
          .children()
          .last()
          .hasClass('app-data__value')
      ).to.be.true
    })
  })

  context('with classes', function() {
    it('should render classes', function() {
      const $ = render('data', examples['extra large variation'])
      const $component = $('.app-data')

      expect($component.hasClass('app-data--xl')).to.be.true
    })
  })

  context('with custom element', function() {
    it('should render custom element', function() {
      const $ = render('data', examples['with heading as element'])
      const $component = $('.app-data')

      expect($component.get(0).tagName).to.equal('h2')
    })
  })
})
