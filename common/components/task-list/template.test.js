const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('task-list')

describe('Task list component', function () {
  context('by default', function () {
    let $, $component, items

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('task-list', examples.default)
      $component = $('.app-task-list__items')
      items = $component.find('.app-task-list__item')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('ul')
    })

    describe('items', function () {
      it('should render correct number of items', function () {
        expect(items.length).to.equal(3)
      })

      it('should render items correctly', function () {
        expect($(items[0]).text().trim()).to.equal('Task one')
        expect($(items[1]).text().trim()).to.equal('Task two')
        expect($(items[2]).text().trim()).to.equal('Task three')
      })
    })

    describe('links', function () {
      it('should contain correct hrefs', function () {
        expect($(items[0]).find('a').attr('href')).to.equal('/task-one')
        expect($(items[1]).find('a').attr('href')).to.equal('/task-two')
        expect($(items[2]).find('a').attr('href')).to.equal('/task-three')
      })

      it('should contain aria described by', function () {
        expect($(items[0]).find('a').attr('aria-described-by')).to.equal(
          'Task%20one-status'
        )
        expect($(items[1]).find('a').attr('aria-described-by')).to.equal(
          'Task%20two-status'
        )
        expect($(items[2]).find('a').attr('aria-described-by')).to.equal(
          'Task%20three-status'
        )
      })
    })
  })

  context('with tags', function () {
    let $, $component

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('task-list', examples['with tags'])
      $component = $('.app-task-list__items')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('ul')
    })

    it('should render correct number of items', function () {
      const items = $component.find('.app-task-list__item')
      expect(items.length).to.equal(4)
    })

    describe('items', function () {
      let items

      beforeEach(function () {
        items = $component.find('.app-task-list__task-name')
      })

      it('should render items correctly', function () {
        expect($(items[0]).text().trim()).to.equal('Your details')
        expect($(items[1]).text().trim()).to.equal('Read declaration')
        expect($(items[2]).text().trim()).to.equal('Company information')
        expect($(items[3]).text().trim()).to.equal('Provide financial evidence')
      })
    })

    describe('links', function () {
      let links

      beforeEach(function () {
        links = $component.find('.app-task-list__task-name a')
      })

      it('should contain hrefs for items with href attribute', function () {
        expect(links.length).to.equal(3)
      })

      it('should not contain hrefs for items without href attribute', function () {
        const items = $component.find('.app-task-list__task-name')
        expect($(items[4]).find('a').length).to.equal(0)
      })
    })

    describe('tags', function () {
      let tags

      beforeEach(function () {
        tags = $component.find('.app-task-list__item .govuk-tag')
      })

      it('should contain correct number of tags', function () {
        expect(tags.length).to.equal(4)
      })

      it('should render tag text', function () {
        expect($(tags[0]).text().trim()).to.equal('Not started')
        expect($(tags[1]).text().trim()).to.equal('Incomplete')
        expect($(tags[2]).text().trim()).to.equal('Complete')
        expect($(tags[3]).text().trim()).to.equal('Cannot start yet')
      })

      it('should render tag classes', function () {
        expect($(tags[0]).attr('class')).to.equal(
          'govuk-tag govuk-tag--grey app-task-list__tag'
        )
        expect($(tags[1]).attr('class')).to.equal(
          'govuk-tag govuk-tag--blue app-task-list__tag'
        )
        expect($(tags[2]).attr('class')).to.equal(
          'govuk-tag  app-task-list__tag'
        )
        expect($(tags[3]).attr('class')).to.equal(
          'govuk-tag govuk-tag--grey app-task-list__tag'
        )
      })

      it('should render tag ids', function () {
        expect($(tags[0]).attr('id')).to.equal('Your%20details-status')
        expect($(tags[1]).attr('id')).to.equal('Read%20declaration-status')
        expect($(tags[2]).attr('id')).to.equal('Company%20information-status')
        expect($(tags[3]).attr('id')).to.equal(
          'Provide%20financial%20evidence-status'
        )
      })
    })
  })

  context('when html is passed to text', function () {
    it('should render escaped html', function () {
      const $ = renderComponentHtmlToCheerio('task-list', {
        items: [
          {
            text: 'A title with <strong>bold text</strong>',
          },
        ],
      })

      const $component = $('.app-task-list__items')
      expect($component.html()).to.contain(
        'A title with &lt;strong&gt;bold text&lt;/strong&gt;'
      )
    })
  })

  context('when html is passed to html', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('task-list', {
        items: [
          {
            html: 'A title with <strong>bold text</strong>',
          },
        ],
      })

      const $component = $('.app-task-list__items')
      expect($component.html()).to.contain(
        'A title with <strong>bold text</strong>'
      )
    })
  })

  context('when both html and text params are used', function () {
    it('should render unescaped html', function () {
      const $ = renderComponentHtmlToCheerio('task-list', {
        items: [
          {
            html: 'A title with <strong>bold text</strong>',
            text: 'A title with <strong>bold text</strong>',
          },
        ],
      })

      const $component = $('.app-task-list__items')
      expect($component.html()).to.contain(
        'A title with <strong>bold text</strong>'
      )
    })
  })

  context('with sections', function () {
    let $, $component, $sections

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('task-list', examples['with sections'])
      $component = $('.app-task-list')
      $sections = $component.find('.app-task-list__section')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('ol')
    })

    describe('sections', function () {
      let sectionHeadings

      beforeEach(function () {
        sectionHeadings = $component.find('.app-task-list__section-heading')
      })

      it('should render correct number of sections', function () {
        expect($sections.length).to.equal(2)
      })

      it('should render sections headings correctly', function () {
        expect($(sectionHeadings[0]).text().trim()).to.equal(
          '1. Request a move'
        )
        expect($(sectionHeadings[1]).text().trim()).to.equal(
          '2. Complete assessment'
        )
      })
    })

    describe('items', function () {
      let items

      beforeEach(function () {
        items = $component.find(
          '.app-task-list__section .app-task-list__task-name'
        )
      })

      it('should render correct number of items', function () {
        expect(items.length).to.equal(5)
      })

      it('should render items correctly', function () {
        expect($(items[0]).text().trim()).to.equal('Personal details')
        expect($(items[1]).text().trim()).to.equal(
          'Provide booking information'
        )
        expect($(items[2]).text().trim()).to.equal('Health information')
        expect($(items[3]).text().trim()).to.equal('Risk information')
        expect($(items[4]).text().trim()).to.equal('Confirm answers')
      })
    })

    describe('links', function () {
      let links

      beforeEach(function () {
        links = $component.find(
          '.app-task-list__section .app-task-list__task-name a'
        )
      })

      it('should contain hrefs for items with href attribute', function () {
        expect(links.length).to.equal(4)
      })

      it('should not contain hrefs for items without href attribute', function () {
        const items = $component.find('.app-task-list__task-name')
        expect($(items[4]).find('a').length).to.equal(0)
      })
    })

    describe('tags', function () {
      let tags

      beforeEach(function () {
        tags = $component.find(
          '.app-task-list__section .app-task-list__item .govuk-tag'
        )
      })

      it('should contain correct number of tags', function () {
        expect(tags.length).to.equal(5)
      })

      it('should render tag text', function () {
        expect($(tags[0]).text().trim()).to.equal('Completed')
        expect($(tags[1]).text().trim()).to.equal('Completed')
        expect($(tags[2]).text().trim()).to.equal('Incomplete')
        expect($(tags[3]).text().trim()).to.equal('Not started')
        expect($(tags[4]).text().trim()).to.equal('Cannot start yet')
      })

      it('should render tag classes', function () {
        expect($(tags[0]).attr('class')).to.equal(
          'govuk-tag  app-task-list__tag'
        )
        expect($(tags[1]).attr('class')).to.equal(
          'govuk-tag  app-task-list__tag'
        )
        expect($(tags[2]).attr('class')).to.equal(
          'govuk-tag govuk-tag--blue app-task-list__tag'
        )
        expect($(tags[3]).attr('class')).to.equal(
          'govuk-tag govuk-tag--grey app-task-list__tag'
        )
        expect($(tags[4]).attr('class')).to.equal(
          'govuk-tag govuk-tag--grey app-task-list__tag'
        )
      })

      it('should render tag ids', function () {
        expect($(tags[0]).attr('id')).to.equal('Personal%20details-status')
        expect($(tags[1]).attr('id')).to.equal(
          'Provide%20booking%20information-status'
        )
        expect($(tags[2]).attr('id')).to.equal('Health%20information-status')
        expect($(tags[3]).attr('id')).to.equal('Risk%20information-status')
        expect($(tags[4]).attr('id')).to.equal('Confirm%20answers-status')
      })
    })
  })

  context('with sections and items', function () {
    let $, $component, $sections, $itemLists, $items

    beforeEach(function () {
      $ = renderComponentHtmlToCheerio('task-list', {
        sections: [
          {
            heading: {
              text: 'A section heading',
            },
            items: [
              {
                text: 'A section item title',
              },
              {
                text: 'Another section item title',
              },
            ],
          },
          {
            heading: {
              text: 'Another section heading',
            },
            items: [
              {
                text: 'Second section item title',
              },
              {
                text: 'Another second section item title',
              },
              {
                text: 'A third, second section item title',
              },
            ],
          },
        ],
        items: [
          {
            text: 'An item title',
          },
          {
            text: 'Another item title',
          },
        ],
      })
      $component = $('.app-task-list')
      $sections = $component.find('.app-task-list__section')
      $itemLists = $component.find(
        '.app-task-list__section .app-task-list__items'
      )
      $items = $component.find('.app-task-list__section .app-task-list__item')
    })

    it('should render task list component', function () {
      expect($component.get(0).tagName).to.equal('ol')
    })

    it('should render correct number of sections', function () {
      expect($sections.length).to.equal(2)
    })

    it('should render correct number of item lists', function () {
      expect($itemLists.length).to.equal(2)
    })

    it('should render correct number of items', function () {
      expect($items.length).to.equal(5)
    })
  })
})
