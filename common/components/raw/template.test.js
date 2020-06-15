const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('raw')

describe('Raw component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'raw',
        examples.default,
        false,
        'raw'
      )
      $component = $('body')
    })

    it('should render', function () {
      expect($component.html().trim()).to.equal('<p class="foo-bar">Hello</p>')
    })
  })
})
