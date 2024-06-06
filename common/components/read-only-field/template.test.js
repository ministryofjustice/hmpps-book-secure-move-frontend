const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('read-only-field')

const getComponent = example => {
  const $ = renderComponentHtmlToCheerio('read-only-field', examples[example])
  return $('.app-read-only-field')
}

describe('Read only field component', function () {
  describe('default', function () {
    let $component

    beforeEach(function () {
      $component = getComponent('default')
    })

    context('when rendering component', function () {
      it('should create the expected element', function () {
        expect($component.get(0).tagName).to.equal('div')
      })
      it('should add the default class', function () {
        expect($component.hasClass('govuk-form-group')).to.be.true
      })
    })

    context('when rendering heading', function () {
      let $heading

      beforeEach(function () {
        $heading = $component.find('.app-read-only-field__heading')
      })
      it('should create the expected element', function () {
        expect($heading.get(0).tagName).to.equal('h2')
      })
      it('should add the default class', function () {
        expect($heading.hasClass('govuk-label')).to.be.true
      })
      it('should output heading', function () {
        expect($heading.text().trim()).to.equal('A text label')
      })
    })

    context('when rendering value', function () {
      let $value

      beforeEach(function () {
        $value = $component.find('.app-read-only-field__value')
      })
      it('should create the expected element', function () {
        expect($value.get(0).tagName).to.equal('p')
      })
      it('should add the default class', function () {
        expect($value.hasClass('govuk-template__body')).to.be.true
      })
      it('should output heading', function () {
        expect($value.text().trim()).to.equal('Display value')
      })
    })

    context('when rendering hidden input', function () {
      let $hidden

      beforeEach(function () {
        $hidden = $component.find('[type=hidden]')
      })

      it('should omit it', function () {
        expect($hidden.get(0)).to.not.exist
      })
    })

    context('when rendering nested items', function () {
      let $items

      beforeEach(function () {
        $items = $component.find('.app-read-only-field__items')
      })

      it('should omit it', function () {
        expect($items.get(0)).to.not.exist
      })
    })
  })

  describe('with html', function () {
    let $component

    beforeEach(function () {
      $component = getComponent('with html')
    })

    context('when rendering heading', function () {
      let $heading

      beforeEach(function () {
        $heading = $component.find('.app-read-only-field__heading')
      })

      it('should prefer html value for heading', function () {
        expect($heading.html().trim()).to.equal('A <strong>HTML</strong> label')
      })
    })
  })

  describe('with classes', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('read-only-field', {
        label: {
          classes: 'heading-class',
          text: 'Display text',
        },
        value: 'Display value',
        classes: 'display-class',
      })
      $component = $('.app-read-only-field')
    })

    context('when rendering component', function () {
      it('should add the custom class', function () {
        expect($component.hasClass('display-class')).to.be.true
      })
    })

    context('when rendering heading', function () {
      let $heading

      beforeEach(function () {
        $heading = $component.find('.app-read-only-field__heading')
      })

      it('should add the custom class', function () {
        expect($heading.hasClass('heading-class')).to.be.true
      })
    })
  })

  describe('with name', function () {
    let $component

    beforeEach(function () {
      $component = getComponent('with custom name')
    })

    context('when rendering hidden input', function () {
      let $hidden

      beforeEach(function () {
        $hidden = $component.find('[type=hidden]')
      })

      it('should add the expected name', function () {
        expect($hidden.attr('name')).to.equal('display')
      })

      it('should add the expected value', function () {
        expect($hidden.attr('value')).to.equal('Display value')
      })
    })
  })

  describe('with items', function () {
    let $component

    beforeEach(function () {
      $component = getComponent('with items')
    })

    context('when rendering items', function () {
      let $items
      let summaryText
      let detailsText

      beforeEach(function () {
        $items = $component.find('.app-read-only-field__items')
        summaryText = $items.find('.govuk-details__summary-text').text().trim()
        detailsText = $items.find('.govuk-details__text').text().trim()
      })

      it('should wrap the items', function () {
        expect($items.length).to.equal(1)
      })

      it('should output the items', function () {
        expect(summaryText).to.equal('summaryText')
        expect(detailsText).to.equal('detailsText')
      })
    })
  })
})
