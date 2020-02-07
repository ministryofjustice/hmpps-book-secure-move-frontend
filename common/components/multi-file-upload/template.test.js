const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('multi-file-upload')

describe('Multi file upload component', function() {
  context('by default', function() {
    let $component

    beforeEach(function() {
      const $ = renderComponentHtmlToCheerio(
        'multi-file-upload',
        examples.default
      )
      $component = $('[data-module="app-multi-file-upload"]')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should not render a heading', function() {
      expect(
        $component.find('.app-multi-file-upload__heading').length
      ).to.equal(0)
    })

    it('should render module data attribute', function() {
      expect($component.attr('data-module')).to.equal('app-multi-file-upload')
    })

    it('should render module URL data attribute', function() {
      expect($component.attr('data-url')).to.equal('/example/text/xhr-endpoint')
    })

    it('should render upload button', function() {
      expect($component.find('button[name="upload"]').length).to.equal(1)
    })

    it('should not render any files', function() {
      expect(
        $component.find('.app-multi-file-upload__list').children().length
      ).to.equal(0)
    })

    it('should hide preview container', function() {
      expect(
        $component
          .find('.app-multi-file-upload__list')
          .parent()
          .attr('class')
      ).to.equal('app-hidden')
    })
  })

  context('with uploaded files', function() {
    const mockData = examples['with files']
    let $component

    beforeEach(function() {
      const $ = renderComponentHtmlToCheerio('multi-file-upload', mockData)
      $component = $('[data-module="app-multi-file-upload"]')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render files', function() {
      expect(
        $component.find('.app-multi-file-upload__list').children().length
      ).to.equal(mockData.value.length)
    })

    it('should render first file', function() {
      expect(
        $component
          .find('.app-multi-file-upload__list')
          .children()
          .first()
          .text()
          .trim()
      ).to.contain(mockData.value[0].filename)
    })

    it('should render second file', function() {
      expect(
        $component
          .find('.app-multi-file-upload__list')
          .children()
          .last()
          .text()
          .trim()
      ).to.contain(mockData.value[1].filename)
    })

    it('should show preview container', function() {
      expect(
        $component
          .find('.app-multi-file-upload__list')
          .parent()
          .attr('class')
      ).to.equal('')
    })
  })
})
