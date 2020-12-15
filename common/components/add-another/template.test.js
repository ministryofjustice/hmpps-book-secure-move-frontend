const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('add-another')

describe('Add another component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('add-another', {
        name: 'add-another-field',
      })
      $component = $('body')
    })

    it('should not render fieldsets', function () {
      expect($component.find('fieldset').length).to.equal(0)
    })

    it('should render a button element last', function () {
      const $addItem = $component.find('.app-add-another__add-item')
      const $button = $addItem.find('button')

      expect($addItem.get(0).tagName).to.equal('div')
      expect($addItem.hasClass('app-border-top-1')).to.be.false

      expect($button.text().trim()).to.equal('Add item')
      expect($button.attr('value')).to.equal('add::add-another-field')
    })
  })

  context('with hint', function () {
    context('when html is passed to text', function () {
      it('should render escaped html', function () {
        const $ = renderComponentHtmlToCheerio('add-another', {
          title: { text: 'Title' },
          hint: {
            text: '<span>Reference</span>',
          },
        })

        const $component = $('body')
        expect($component.html().trim()).to.contain(
          '&lt;span&gt;Reference&lt;/span&gt;'
        )
      })
    })

    context('when html is passed to html', function () {
      it('should render unescaped html', function () {
        const $ = renderComponentHtmlToCheerio('add-another', {
          title: { text: 'Title' },
          hint: {
            html: '<span>Reference</span>',
          },
        })

        const $component = $('body')
        expect($component.html().trim()).to.contain('<span>Reference</span>')
      })
    })
  })

  context('with items', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('add-another', examples['with items'])
      $component = $('body')
    })

    describe('fieldsets', function () {
      let $fieldsets, $item1, $item2, $item3

      beforeEach(function () {
        $fieldsets = $component.find('fieldset')
        $item1 = $($fieldsets[0])
        $item2 = $($fieldsets[1])
        $item3 = $($fieldsets[2])
      })

      it('should render fieldsets correct number of fieldsets', function () {
        expect($fieldsets.length).to.equal(3)
      })

      it('should render item content', function () {
        expect($item1.html()).to.contain('Item <strong>1</strong> content')
        expect($item2.html()).to.contain('Item <strong>2</strong> content')
        expect($item3.html()).to.contain('Item <strong>3</strong> content')
      })

      it('should render legends', function () {
        expect($item1.find('legend').text().trim()).to.equal('Item 1')
        expect($item2.find('legend').text().trim()).to.equal('Item 2')
        expect($item3.find('legend').text().trim()).to.equal('Item 3')
      })

      it('should render remove buttons', function () {
        expect($item1.find('button').text().trim()).to.equal('Remove item 1')
        expect($item1.find('button').attr('value')).to.equal(
          'remove::add-another-field::0'
        )
        expect($item2.find('button').text().trim()).to.equal('Remove item 2')
        expect($item2.find('button').attr('value')).to.equal(
          'remove::add-another-field::1'
        )
        expect($item3.find('button').text().trim()).to.equal('Remove item 3')
        expect($item3.find('button').attr('value')).to.equal(
          'remove::add-another-field::2'
        )
      })
    })

    it('should render a button element last', function () {
      const $addItem = $component.find('.app-add-another__add-item')
      const $button = $addItem.find('button')

      expect($addItem.get(0).tagName).to.equal('div')
      expect($addItem.hasClass('app-border-top-1')).to.be.true

      expect($button.text().trim()).to.equal('Add another item')
      expect($button.attr('value')).to.equal('add::add-another-field')
    })
  })

  context('with item name', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio(
        'add-another',
        examples['with custom item name']
      )
      $component = $('body')
    })

    describe('fieldsets', function () {
      let $fieldsets, $item1

      beforeEach(function () {
        $fieldsets = $component.find('fieldset')
        $item1 = $($fieldsets[0])
      })

      it('should render fieldsets correct number of fieldsets', function () {
        expect($fieldsets.length).to.equal(1)
      })

      it('should render item content', function () {
        expect($item1.text()).to.contain('Person 1 content')
      })

      it('should render legends', function () {
        expect($item1.find('legend').text().trim()).to.equal('Person 1')
      })

      it('should render remove buttons', function () {
        expect($item1.find('button').text().trim()).to.equal('Remove person 1')
        expect($item1.find('button').attr('value')).to.equal(
          'remove::add-another-field::0'
        )
      })
    })

    it('should render a button element last', function () {
      const $addItem = $component.find('.app-add-another__add-item')
      const $button = $addItem.find('button')

      expect($button.text().trim()).to.equal('Add another person')
    })
  })

  context('with minItems', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio(
        'add-another',
        examples['with minimum number of items']
      )
      $component = $('body')
    })

    describe('fieldsets', function () {
      let $fieldsets, $item1

      beforeEach(function () {
        $fieldsets = $component.find('fieldset')
        $item1 = $($fieldsets[0])
      })

      it('should render fieldsets correct number of fieldsets', function () {
        expect($fieldsets.length).to.equal(2)
      })

      it('should not render remove buttons', function () {
        expect($item1.find('button').length).to.equal(0)
      })
    })
  })

  context('with minItems set to zero', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('add-another', {
        ...examples['with minimum number of items'],
        minItems: 0,
      })
      $component = $('body')
    })

    describe('fieldsets', function () {
      let $fieldsets, $item1

      beforeEach(function () {
        $fieldsets = $component.find('fieldset')
        $item1 = $($fieldsets[0])
      })

      it('should render fieldsets correct number of fieldsets', function () {
        expect($fieldsets.length).to.equal(2)
      })

      it('should render remove buttons', function () {
        expect($item1.find('button').length).to.equal(1)
      })
    })
  })
})
