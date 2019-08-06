const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('message')

describe('Message component', function() {
  context('by default', function() {
    let $component

    beforeEach(function() {
      const $ = render('message', examples.default)
      $component = $('.app-message')
    })

    it('should render component', function() {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render a heading', function() {
      expect(
        $component
          .find('.app-message__heading')
          .text()
          .trim()
      ).to.equal('Notification message')
    })

    it('should render module data attribute', function() {
      expect($component.attr('data-module')).to.equal('app-message')
    })
  })

  context('with classes', function() {
    it('should render classes', function() {
      const $ = render('message', examples.success)
      const $component = $('.app-message')

      expect($component.hasClass('app-message--success')).to.be.true
    })
  })

  context('with a title', function() {
    context('when no content is passed', function() {
      it('should not render element', function() {
        const $ = render('message', {})

        const $component = $('.app-message')
        expect($component.find('.app-message__heading').length).to.equal(0)
      })
    })

    context('when html is passed to text', function() {
      it('should render escaped html', function() {
        const $ = render('message', {
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

    context('when html is passed to html', function() {
      it('should render unescaped html', function() {
        const $ = render('message', {
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

    context('when both html and text params are used', function() {
      it('should render unescaped html', function() {
        const $ = render('message', {
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

  context('with content', function() {
    context('when no content is passed', function() {
      it('should not render element', function() {
        const $ = render('message', {})

        const $component = $('.app-message')
        expect($component.find('.app-message__content').length).to.equal(0)
      })
    })

    context('when html is passed to text', function() {
      it('should render escaped html', function() {
        const $ = render('message', {
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

    context('when html is passed to html', function() {
      it('should render unescaped html', function() {
        const $ = render('message', {
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

    context('when both html and text params are used', function() {
      it('should render unescaped html', function() {
        const $ = render('message', {
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

    context('when dismiss is prevented', function() {
      it('should render unescaped html', function() {
        const $ = render('message', examples['without dismiss'])
        expect($('.app-message').attr('data-module')).to.equal(undefined)
      })
    })
  })
})
