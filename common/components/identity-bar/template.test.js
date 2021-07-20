const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('identity-bar')

describe('Identity bar component', function () {
  context('by default', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('identity-bar', examples.default)
      $component = $('.app-identity-bar')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render heading', function () {
      expect(
        $component.find('.app-identity-bar__heading').text().trim()
      ).to.equal('Identity bar heading')
    })
  })

  context('with caption', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('identity-bar', examples['with caption'])
      $component = $('.app-identity-bar')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render heading', function () {
      expect(
        $component.find('.app-identity-bar__heading').text().trim()
      ).to.equal('Identity bar with caption')
    })

    it('should render caption', function () {
      expect(
        $component.find('.app-identity-bar__caption').text().trim()
      ).to.equal('Page caption')
    })
  })

  context('with summary', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio(
        'identity-bar',
        examples['with summary text']
      )
      $component = $('.app-identity-bar')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render heading', function () {
      expect(
        $component.find('.app-identity-bar__heading').text().trim()
      ).to.equal('Identity bar with summary')
    })

    it('should render caption', function () {
      expect(
        $component.find('.app-identity-bar__summary').text().trim()
      ).to.equal('A short summary of this item')
    })
  })

  context('with actions', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('identity-bar', examples['with actions'])
      $component = $('.app-identity-bar')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render correct number of actions', function () {
      const items = $component.find('.app-identity-bar__action-item')
      expect(items.length).to.equal(2)
    })

    describe('items', function () {
      let items

      beforeEach(function () {
        items = $component.find('.app-identity-bar__action-item')
      })

      it('should render items correctly', function () {
        expect($(items[0]).text().trim()).to.equal('Action one')
        expect($(items[1]).text().trim()).to.equal('Action two')
      })
    })
  })

  context('when html is passed to text', function () {
    it('should render escaped html', function () {
      const $ = renderComponentHtmlToCheerio('identity-bar', {
        heading: {
          text: 'A title with <strong>bold text</strong>',
        },
        caption: {
          text: 'A caption with <strong>bold text</strong>',
        },
        summary: {
          text: 'A summary with <strong>bold text</strong>',
        },
      })

      const $component = $('.app-identity-bar')
      expect($component.html()).to.contain(
        'A title with &lt;strong&gt;bold text&lt;/strong&gt;'
      )
      expect($component.html()).to.contain(
        'A caption with &lt;strong&gt;bold text&lt;/strong&gt;'
      )
      expect($component.html()).to.contain(
        'A summary with &lt;strong&gt;bold text&lt;/strong&gt;'
      )
    })
  })

  context('when html is passed to html', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('identity-bar', {
        heading: {
          html: 'A title with <strong>bold text</strong>',
        },
        caption: {
          html: 'A caption with <strong>bold text</strong>',
        },
        summary: {
          html: 'A summary with <strong>bold text</strong>',
        },
      })

      const $component = $('.app-identity-bar')
      expect($component.html()).to.contain(
        'A title with <strong>bold text</strong>'
      )
      expect($component.html()).to.contain(
        'A caption with <strong>bold text</strong>'
      )
      expect($component.html()).to.contain(
        'A summary with <strong>bold text</strong>'
      )
    })
  })

  context('when both html and text params are used', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('identity-bar', {
        heading: {
          html: 'A title with <strong>bold text</strong>',
          text: 'A title with <strong>bold text</strong>',
        },
        caption: {
          html: 'A caption with <strong>bold text</strong>',
          text: 'A caption with <strong>bold text</strong>',
        },
        summary: {
          html: 'A summary with <strong>bold text</strong>',
          text: 'A summary with <strong>bold text</strong>',
        },
      })

      const $component = $('.app-identity-bar')
      expect($component.html()).to.contain(
        'A title with <strong>bold text</strong>'
      )
      expect($component.html()).to.contain(
        'A caption with <strong>bold text</strong>'
      )
      expect($component.html()).to.contain(
        'A summary with <strong>bold text</strong>'
      )
    })
  })
})
