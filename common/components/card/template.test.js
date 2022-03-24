const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('card')

describe('Card component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('card', examples.default)
      $component = $('.app-card')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render title', function () {
      const $title = $component.find('.app-card__title')
      expect($title.text().trim()).to.equal('Card title')
    })

    it('should not render image', function () {
      const $image = $component.find('.app-card__image')
      expect($image.length).to.equal(0)
    })

    it('should not render caption', function () {
      const $caption = $component.find('.app-card__caption')
      expect($caption.length).to.equal(0)
    })

    it('should not render as link', function () {
      const $link = $component.find('.app-card__link')
      expect($link.length).to.equal(0)
    })

    it('should not render meta data', function () {
      const $metaList = $component.find('.app-card__meta-list')
      expect($metaList.length).to.equal(0)
    })

    it('should not render tags', function () {
      const $tagList = $component.find('.app-card__tag-list')
      expect($tagList.length).to.equal(0)
    })
  })

  context('with image', function () {
    let $image

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('card', examples['with image'])
      $image = $('.app-card__image')
    })

    it('should render image', function () {
      expect($image.length).to.equal(1)
      expect($image.attr('src')).to.equal('/images/person-fallback.png')
    })

    it('should include image alt text', function () {
      expect($image.length).to.equal(1)
      expect($image.attr('alt')).to.equal('Example alt text')
    })
  })

  context('with classes param', function () {
    it('should render classes', function () {
      const $ = renderComponentHtmlToCheerio('card', {
        title: { text: 'Title' },
        classes: 'app-card--compact',
      })

      const $component = $('.app-card')
      expect($component.hasClass('app-card--compact')).to.be.true
    })
  })

  context('with caption', function () {
    context('when html is passed to text', function () {
      it('should render escaped html', function () {
        const $ = renderComponentHtmlToCheerio('card', {
          title: { text: 'Title' },
          caption: {
            text: '<span>Reference</span>',
          },
        })

        const $caption = $('.app-card__caption')
        expect($caption.html().trim()).to.equal(
          '&lt;span&gt;Reference&lt;/span&gt;'
        )
      })
    })

    context('when html is passed to html', function () {
      it('should render unescaped html', function () {
        it('should render escaped html', function () {
          const $ = renderComponentHtmlToCheerio('card', {
            title: { text: 'Title' },
            caption: {
              html: '<span>Reference</span>',
            },
          })

          const $caption = $('.app-card__caption')
          expect($caption.html().trim()).to.equal('<span>Reference</span>')
        })
      })
    })

    context('when both html and text params are used', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('card', {
          title: { text: 'Title' },
          caption: {
            text: '<span>Reference</span>',
            html: '<span>Reference</span>',
          },
        })

        const $caption = $('.app-card__caption')
        expect($caption.html().trim()).to.equal('<span>Reference</span>')
      })
    })
  })

  context('with link', function () {
    it('should render link', function () {
      const $ = renderComponentHtmlToCheerio('card', examples['with link'])
      const $link = $('.app-card__link')

      expect($link.length).to.equal(1)
      expect($link.attr('href')).to.equal('http://google.com')
    })
  })

  context('with status', function () {
    it('should render status', function () {
      const $ = renderComponentHtmlToCheerio('card', examples['with status'])
      const $status = $('.app-card__badge')

      expect($status.length).to.equal(1)
      expect($status.text()).to.contain('Requested')
    })
  })

  context('with meta data', function () {
    context('with empty items array', function () {
      it('should not render meta', function () {
        const $ = renderComponentHtmlToCheerio('card', {
          title: { text: 'Title' },
          meta: { items: [] },
        })
        const $meta = $('.app-card__meta-list')

        expect($meta.length).to.equal(0)
      })
    })

    context('with items', function () {
      let $, $items

      beforeEach(function () {
        $ = renderComponentHtmlToCheerio('card', examples['with meta items'])
        const $meta = $('.app-card__meta-list')
        $items = $meta.find('.app-card__meta-list-item')
      })

      it('should render correct number of items', function () {
        expect($items.length).to.equal(3)
      })

      it('should render correct items', function () {
        const $item1 = $($items[0])
        const $item2 = $($items[1])
        const $item3 = $($items[2])

        expect($item1.text()).to.contain('Date of birth')
        expect($item1.text()).to.contain('10/10/1970')

        expect($item2.text()).to.contain('HTML')
        expect($item2.html()).to.contain('<em>Foo</em>')

        expect($item3.text()).to.contain('Escaped HTML')
        expect($item3.html()).to.contain('&lt;em&gt;Bar&lt;/em&gt;')
      })
    })
  })

  context('with tags', function () {
    context('with empty items array', function () {
      it('should not render tags', function () {
        const $ = renderComponentHtmlToCheerio('card', {
          title: { text: 'Title' },
          tags: [{ items: [] }],
        })
        const $tags = $('.app-card__tag-list')

        expect($tags.length).to.equal(0)
      })
    })

    context('with items', function () {
      it('should render correct number of items', function () {
        const $ = renderComponentHtmlToCheerio('card', examples['with tags'])
        const $meta = $('.app-card__tag-list')
        const $items = $meta.find('.app-card__tag-list-item')

        expect($items.length).to.equal(2)
      })
    })
  })

  context('with inset text', function () {
    it('should render inset text component', function () {
      const $ = renderComponentHtmlToCheerio(
        'card',
        examples['with inset text']
      )
      const $insetText = $('.govuk-inset-text')

      expect($insetText.length).to.equal(1)
      expect($insetText.text()).to.contain('A message about this card')
    })
  })

  context('with isLockout param', function () {
    it('should render warning text component', function () {
      const $ = renderComponentHtmlToCheerio(
        'card',
        examples['with isLockout param']
      )
      const $warningText = $('.card-warning-text')

      expect($warningText.length).to.equal(1)
      expect($warningText.text()).to.contain('Prison lockout')
    })
  })
})
