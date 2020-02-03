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

    it('should render a heading', function() {
      expect(
        $component
          .find('h2')
          .text()
          .trim()
      ).to.equal('example default heading')
    })

    it('should render module data attribute', function() {
      expect($component.attr('data-module')).to.equal('app-multi-file-upload')
    })

    it('should render module xhrUrl data attribute', function() {
      expect($component.attr('data-xhr-url')).to.equal(
        '/example/text/xhr-endpoint'
      )
    })

    it('should render upload button', function() {
      expect(
        $component
          .find('button[name="upload"]')
          .text()
          .trim()
      ).to.equal('Upload')
    })

    it('should render upload hint', function() {
      expect(
        $component
          .find('.govuk-hint')
          .text()
          .trim()
      ).to.equal(
        'You can upload Word, Excel, PDF and JPEG documents up to 50MB.'
      )
    })

    it('should not render any documents', function() {
      expect($component.find('.js-upload-row').length).to.equal(0)
    })
  })

  context('with uploaded documents', function() {
    const mockData = examples['with document uploads']
    let $component

    beforeEach(function() {
      const $ = renderComponentHtmlToCheerio('multi-file-upload', mockData)
      $component = $('[data-module="app-multi-file-upload"]')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render documents', function() {
      expect($component.find('.js-upload-row').length).to.equal(
        mockData.documents.length
      )
    })

    it('should render first document', function() {
      const documentMockData = mockData.documents[0]
      const $document = $component.find(
        `[data-document-id="${documentMockData.id}"]`
      )

      expect(
        $document
          .find('.app-row__key')
          .text()
          .trim()
      ).to.equal(documentMockData.filename)
    })

    it('should render second document', function() {
      const documentMockData = mockData.documents[1]
      const $document = $component.find(
        `[data-document-id="${documentMockData.id}"]`
      )

      expect(
        $document
          .find('.app-row__key')
          .text()
          .trim()
      ).to.equal(documentMockData.filename)
    })
  })
})
