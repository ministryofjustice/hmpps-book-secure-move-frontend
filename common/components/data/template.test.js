const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('data')

describe('Data component', () => {
  context('by default', () => {
    let $component

    beforeEach(() => {
      const $ = render('data', examples.default)
      $component = $('.app-data')
    })

    it('should render a div', () => {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render value', () => {
      expect($component.find('.app-data__value').text().trim()).to.equal('25')
    })

    it('should render label', () => {
      expect($component.find('.app-data__label').text().trim()).to.equal('emails sent')
    })

    it('should render value first', () => {
      expect($component.children().first().hasClass('app-data__value')).to.be.true
    })

    it('should render label second', () => {
      expect($component.children().last().hasClass('app-data__label')).to.be.true
    })
  })

  context('inverted', () => {
    let $component

    beforeEach(() => {
      const $ = render('data', examples.inverted)
      $component = $('.app-data')
    })

    it('should render label first', () => {
      expect($component.children().first().hasClass('app-data__label')).to.be.true
    })

    it('should render value second', () => {
      expect($component.children().last().hasClass('app-data__value')).to.be.true
    })
  })

  context('with classes', () => {
    it('should render classes', () => {
      const $ = render('data', examples['extra large variation'])
      const $component = $('.app-data')

      expect($component.hasClass('app-data--xl')).to.be.true
    })
  })

  context('with custom element', () => {
    it('should render custom element', () => {
      const $ = render('data', examples['with heading as element'])
      const $component = $('.app-data')

      expect($component.get(0).tagName).to.equal('h2')
    })
  })
})
