const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('message')

describe('Message component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('message', examples.default)
      $component = $('.app-message')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render a heading', function () {
      expect($component.find('.app-message__heading').text().trim()).to.equal(
        'Notification message'
      )
    })

    it('should render module data attribute', function () {
      expect($component.attr('data-module')).to.equal('app-message')
    })

    it('should render dismissable attribute', function () {
      expect($component.attr('data-allow-dismiss')).to.exist
    })

    it('should not render focus attribute', function () {
      expect($component.attr('data-focus')).not.to.exist
    })
  })

  context('with classes', function () {
    it('should render classes', function () {
      const $ = renderComponentHtmlToCheerio('message', examples.success)
      const $component = $('.app-message')

      expect($component.hasClass('app-message--success')).to.be.true
    })
  })

  context('with a title', function () {
    context('when no content is passed', function () {
      it('should not render element', function () {
        const $ = renderComponentHtmlToCheerio('message', {})

        const $component = $('.app-message')
        expect($component.find('.app-message__heading').length).to.equal(0)
      })
    })

    context('when html is passed to text', function () {
      it('should render escaped html', function () {
        const $ = renderComponentHtmlToCheerio('message', {
          title: {
            text: 'A title with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-message')
        expect($component.html()).to.contain(
          'A title with &lt;strong&gt;bold text&lt;/strong&gt;'
        )
      })
    })

    context('when html is passed to html', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('message', {
          title: {
            html: 'A title with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-message')
        expect($component.html()).to.contain(
          'A title with <strong>bold text</strong>'
        )
      })
    })

    context('when both html and text params are used', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('message', {
          title: {
            html: 'A title with <strong>bold text</strong>',
            text: 'A title with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-message')
        expect($component.html()).to.contain(
          'A title with <strong>bold text</strong>'
        )
      })
    })
  })

  context('with content', function () {
    context('when no content is passed', function () {
      it('should not render element', function () {
        const $ = renderComponentHtmlToCheerio('message', {})

        const $component = $('.app-message')
        expect($component.find('.app-message__content').length).to.equal(0)
      })
    })

    context('when html is passed to text', function () {
      it('should render escaped html', function () {
        const $ = renderComponentHtmlToCheerio('message', {
          content: {
            text: 'A message with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-message')
        expect($component.html()).to.contain(
          'A message with &lt;strong&gt;bold text&lt;/strong&gt;'
        )
      })
    })

    context('when html is passed to html', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('message', {
          content: {
            html: 'A message with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-message')
        expect($component.html()).to.contain(
          'A message with <strong>bold text</strong>'
        )
      })
    })

    context('when both html and text params are used', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('message', {
          content: {
            html: 'A message with <strong>bold text</strong>',
            text: 'A message with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-message')
        expect($component.html()).to.contain(
          'A message with <strong>bold text</strong>'
        )
      })
    })

    context('with content classes', function () {
      it('should render class attribute', function () {
        const $ = renderComponentHtmlToCheerio('message', {
          content: {
            classes: 'an-example-class',
            html: 'A message with <strong>bold text</strong>',
          },
        })

        const $component = $('.app-message')
        expect($component.html()).to.contain(
          'A message with <strong>bold text</strong>'
        )
        expect($('.app-message__content').hasClass('an-example-class')).to.be
          .true
      })
    })

    context('when dismiss is prevented', function () {
      it('should not render dismissable attribute', function () {
        const $ = renderComponentHtmlToCheerio(
          'message',
          examples['without dismiss']
        )
        expect($('.app-message').attr('data-allow-dismiss')).not.to.exist
      })
    })

    context('when focus on load is set', function () {
      it('should render focus attribute', function () {
        const $ = renderComponentHtmlToCheerio(
          'message',
          examples['focused on load']
        )
        expect($('.app-message').attr('data-focus')).to.exist
      })
    })
  })
})
