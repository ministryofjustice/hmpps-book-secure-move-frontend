const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('card')

describe('Card component', () => {
  context('by default', () => {
    let $component

    beforeEach(() => {
      const $ = render('card', examples.default)
      $component = $('.app-card')
    })

    it('should render component', () => {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render title', () => {
      const $title = $component.find('.app-card__title')
      expect($title.text().trim()).to.equal('Card title')
    })

    it('should not render image', () => {
      const $image = $component.find('.app-card__image')
      expect($image.length).to.equal(0)
    })

    it('should not render caption', () => {
      const $caption = $component.find('.app-card__caption')
      expect($caption.length).to.equal(0)
    })

    it('should not render as link', () => {
      const $link = $component.find('.app-card__link')
      expect($link.length).to.equal(0)
    })

    it('should not render meta data', () => {
      const $metaList = $component.find('.app-card__meta-list')
      expect($metaList.length).to.equal(0)
    })

    it('should not render tags', () => {
      const $tagList = $component.find('.app-card__tag-list')
      expect($tagList.length).to.equal(0)
    })
  })

  context('with image', () => {
    it('should render image', () => {
      const $ = render('card', examples['with image'])
      const $image = $('.app-card__image')

      expect($image.length).to.equal(1)
      expect($image.attr('src')).to.equal('https://via.placeholder.com/80x105.png')
    })
  })

  context('with classes param', () => {
    it('should render classes', () => {
      const $ = render('card', {
        title: { text: 'Title' },
        classes: 'app-card--compact',
      })

      const $component = $('.app-card')
      expect($component.hasClass('app-card--compact')).to.be.true
    })
  })

  context('with caption', () => {
    context('when html is passed to text', () => {
      it('should render escaped html', () => {
        const $ = render('card', {
          title: { text: 'Title' },
          caption: {
            text: '<span>Reference</span>',
          },
        })

        const $caption = $('.app-card__caption')
        expect($caption.html().trim()).to.equal('&lt;span&gt;Reference&lt;/span&gt;')
      })
    })

    context('when html is passed to html', () => {
      it('should render unescaped html', () => {
        it('should render escaped html', () => {
          const $ = render('card', {
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

    context('when both html and text params are used', () => {
      it('should render unescaped html', () => {
        const $ = render('card', {
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

  context('with link', () => {
    it('should render link', () => {
      const $ = render('card', examples['with link'])
      const $link = $('.app-card__link')

      expect($link.length).to.equal(1)
      expect($link.attr('href')).to.equal('http://google.com')
    })
  })

  context('with meta data', () => {
    context('with empty items array', () => {
      it('should not render meta', () => {
        const $ = render('card', {
          title: { text: 'Title' },
          meta: { items: [] },
        })
        const $meta = $('.app-card__meta-list')

        expect($meta.length).to.equal(0)
      })
    })

    context('with items', () => {
      let $, $items

      beforeEach(() => {
        $ = render('card', examples['with meta items'])
        const $meta = $('.app-card__meta-list')
        $items = $meta.find('.app-card__meta-list-item')
      })

      it('should render correct number of items', () => {
        expect($items.length).to.equal(3)
      })

      it('should render correct items', () => {
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

  context('with tags', () => {
    context('with empty items array', () => {
      it('should not render tags', () => {
        const $ = render('card', {
          title: { text: 'Title' },
          tags: { items: [] },
        })
        const $tags = $('.app-card__tag-list')

        expect($tags.length).to.equal(0)
      })
    })

    context('with items', () => {
      it('should render correct number of items', () => {
        const $ = render('card', examples['with tags'])
        const $meta = $('.app-card__tag-list')
        const $items = $meta.find('.app-card__tag-list-item')

        expect($items.length).to.equal(2)
      })
    })
  })
})
