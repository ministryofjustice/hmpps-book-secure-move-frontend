const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('filter')

describe('Filter component', function () {
  context('by default', function () {
    let component, items, $

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('filter', examples.default)

      component = $('.app-filter')
      items = component.find('.app-filter__list-item')
    })

    it('should render component', function () {
      expect(component.get(0).name).to.equal('nav')
    })

    it('should render a list', function () {
      expect(component.find('ul').length).to.equal(1)
    })

    describe('items', function () {
      let item1
      let item2
      let item3

      beforeEach(function () {
        item1 = $(items[0])
        item2 = $(items[1])
        item3 = $(items[2])
      })

      it('should render correct number', function () {
        expect(items.length).to.equal(3)
      })

      it('should render correct labels', function () {
        expect(item1.find('.app-filter__label').text()).to.equal(
          'Moves proposed'
        )
        expect(item2.find('.app-filter__label').text()).to.equal(
          'Moves requested'
        )
        expect(item3.find('.app-filter__label').text()).to.equal(
          'Moves rejected'
        )
      })

      it('should render correct values', function () {
        expect(item1.find('.app-filter__value').text()).to.equal('4')
        expect(item2.find('.app-filter__value').text()).to.equal('3')
        expect(item3.find('.app-filter__value').text()).to.equal('5')
      })

      it('should render role attribute', function () {
        expect(item1.attr('role')).to.equal('link')
        expect(item2.attr('role')).to.equal('link')
        expect(item3.attr('role')).to.equal('link')
      })

      context('when not active', function () {
        it('should contain a link', function () {
          const item1 = $(items[0]).find('.app-filter__link')
          const item3 = $(items[2]).find('.app-filter__link')
          expect(item1.length).to.equal(1)
          expect(item3.length).to.equal(1)
        })

        it('should render correct href', function () {
          expect(item1.find('.app-filter__link').attr('href')).to.equal(
            '/moves/proposed'
          )
          expect(item3.find('.app-filter__link').attr('href')).to.equal(
            '/moves/rejected'
          )
        })

        it('should not contain a tabindex attribute', function () {
          expect(item1.attr('tabindex')).to.be.undefined
          expect(item3.attr('tabindex')).to.be.undefined
        })

        it('should set aria selected to false', function () {
          expect(item1.attr('aria-selected')).to.equal('false')
          expect(item3.attr('aria-selected')).to.equal('false')
        })
      })

      context('when active', function () {
        it('should not contain a link', function () {
          expect(item2.find('.app-filter__link').length).to.equal(0)
        })

        it('should contain a tabindex attribute', function () {
          expect(item2.attr('tabindex')).to.equal('0')
        })

        it('should set aria selected to true', function () {
          expect(item2.attr('aria-selected')).to.equal('true')
        })
      })
    })
  })

  context('with classes param', function () {
    it('should render classes', function () {
      const $ = renderComponentHtmlToCheerio('filter', {
        classes: 'app-filter--compact',
      })

      const $component = $('.app-filter')
      expect($component.hasClass('app-filter--compact')).to.be.true
    })
  })

  context('without value', function () {
    let component, items, $

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('filter', examples['without values'])

      component = $('.app-filter')
      items = component.find('.app-filter__list-item')
    })

    describe('items', function () {
      let item1
      let item2

      beforeEach(function () {
        item1 = $(items[0])
        item2 = $(items[1])
      })

      it('should render correct number', function () {
        expect(items.length).to.equal(2)
      })

      it('should render correct labels', function () {
        expect(item1.find('.app-filter__label').text()).to.equal(
          'Moves proposed'
        )
        expect(item2.find('.app-filter__label').text()).to.equal(
          'Moves requested'
        )
      })

      it('should not render values', function () {
        expect(item1.find('.app-filter__value').length).to.equal(0)
        expect(item2.find('.app-filter__value').length).to.equal(0)
      })
    })
  })
  context('without label', function () {
    let component, items, $

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('filter', examples['without labels'])

      component = $('.app-filter')
      items = component.find('.app-filter__list-item')
    })

    describe('items', function () {
      let item1
      let item2

      beforeEach(function () {
        item1 = $(items[0])
        item2 = $(items[1])
      })

      it('should render correct number', function () {
        expect(items.length).to.equal(2)
      })

      it('should not render labels', function () {
        expect(item1.find('.app-filter__label').length).to.equal(0)
        expect(item2.find('.app-filter__label').length).to.equal(0)
      })

      it('should render correct values', function () {
        expect(item1.find('.app-filter__value').text()).to.equal('1')
        expect(item2.find('.app-filter__value').text()).to.equal('2')
      })
    })
  })
})
