const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('whats-new-banner')
describe('Whats new banner component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'whats-new-banner',
        examples.default
      )

      $component = $('[data-module="app-whats-new-banner"]')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })
  })

  context('will render the core html tags and content', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'whats-new-banner',
        examples.default
      )

      $component = $('[data-module="app-whats-new-banner"]')
    })

    it('should render title tag and content', function () {
      expect($component.html()).to.contain(
        'h1 class="govuk-heading-l">What\'s new</h1>'
      )
    })

    it('should render the body text and date tag and content', function () {
      expect($component.html()).to.contain(
        '<p class="govuk-body">4th March 2022: Some random banner text.</p>'
      )
    })
  })

  context('will render banner links and buttons', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'whats-new-banner',
        examples.default
      )

      $component = $('[data-module="app-whats-new-banner"]')
    })

    it('should render dismiss button', function () {
      expect($component.html()).to.contain(
        '<a href="#" id="dismiss-banner-button" class="govuk-link dismiss-button">Dismiss</a>'
      )
    })

    it('should render read more about these changes link', function () {
      expect($component.html()).to.contain(
        '<a href="/whats-new" id="whats-new-page-link" class="govuk-link">Read more about these changes.</a>'
      )
    })
  })
})
