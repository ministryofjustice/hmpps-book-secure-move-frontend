const {
  renderComponentHtmlToCheerio,
} = require('../../../test/unit/component-helpers')

describe('Raw component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'raw',
        { html: '<p class="foo-bar">Hello</p>' },
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
