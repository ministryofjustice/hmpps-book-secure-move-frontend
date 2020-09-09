const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('add-another')

describe('Add another component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('add-another', examples.default)
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

  context('with items', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('add-another', examples['with items'])
      $component = $('body')
    })

    describe('fieldsets', function () {
      let $fieldsets, $item1, $item2

      beforeEach(function () {
        $fieldsets = $component.find('fieldset')
        $item1 = $($fieldsets[0])
        $item2 = $($fieldsets[1])
      })

      it('should render fieldsets correct number of fieldsets', function () {
        expect($fieldsets.length).to.equal(2)
      })

      it('should render item content', function () {
        expect($item1.text()).to.contain('Item 1 content')

        expect($item2.text()).to.contain('Item 2 content')
        expect($item2.html()).to.contain('Item <strong>2</strong> content')
      })

      it('should render legends', function () {
        expect($item1.find('legend').text().trim()).to.equal('Item 1')
        expect($item2.find('legend').text().trim()).to.equal('Item 2')
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
        examples['with item name']
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
      $ = renderComponentHtmlToCheerio('add-another', examples['with minItems'])
      $component = $('body')
    })

    describe('fieldsets', function () {
      let $fieldsets, $item1

      beforeEach(function () {
        $fieldsets = $component.find('fieldset')
        $item1 = $($fieldsets[0])
      })

      it('should not render remove buttons', function () {
        expect($item1.find('button').length).to.equal(0)
      })
    })
  })

  context('with minItems set to zero', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio(
        'add-another',
        examples['with minItems set to zero']
      )
      $component = $('body')
    })

    describe('fieldsets', function () {
      let $fieldsets, $item1

      beforeEach(function () {
        $fieldsets = $component.find('fieldset')
        $item1 = $($fieldsets[0])
      })

      it('should render remove buttons', function () {
        expect($item1.find('button').length).to.equal(1)
      })
    })
  })
})
