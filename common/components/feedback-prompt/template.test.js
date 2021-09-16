const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('feedback-prompt')

describe('Feedback prompt component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'feedback-prompt',
        examples.default
      )
      $component = $('.app-feedback-prompt')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render content', function () {
      expect(
        $component.find('.app-feedback-prompt__content').text().trim()
      ).to.equal(
        'This is a new feature — give us your feedback to help us improve it'
      )
    })
  })

  context('with classes', function () {
    it('should render classes', function () {
      const $ = renderComponentHtmlToCheerio('feedback-prompt', {
        classes: 'custom-class',
        content: {
          text: 'This is a new feature',
        },
      })
      const $component = $('.app-feedback-prompt')

      expect($component.hasClass('custom-class')).to.be.true
    })
  })

  context('with content', function () {
    context('when html is passed to text', function () {
      it('should render escaped html', function () {
        const $ = renderComponentHtmlToCheerio('feedback-prompt', {
          content: {
            text: 'A message with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-feedback-prompt')
        expect($component.html()).to.contain(
          'A message with &lt;strong&gt;bold text&lt;/strong&gt;'
        )
      })
    })

    context('when html is passed to html', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('feedback-prompt', {
          content: {
            html: 'A message with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-feedback-prompt')
        expect($component.html()).to.contain(
          'A message with <strong>bold text</strong>'
        )
      })
    })

    context('when both html and text params are used', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('feedback-prompt', {
          content: {
            html: 'A message with <strong>bold text</strong>',
            text: 'A message with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-feedback-prompt')
        expect($component.html()).to.contain(
          'A message with <strong>bold text</strong>'
        )
      })
    })

    context('when button is passed in', function () {
      it('should render the button html', function () {
        const $ = renderComponentHtmlToCheerio('feedback-prompt', {
          content: {
            text: 'Text',
          },
          button: {
            href: '/button',
            text: 'Label',
          },
        })

        const $component = $('.app-feedback-prompt')
        expect($component.html()).to.contain(
          '<a href="/button" class="govuk-button">'
        )
        expect($component.html()).to.contain('Label')
      })
    })
  })
})
