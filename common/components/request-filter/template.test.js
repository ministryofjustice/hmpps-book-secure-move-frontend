const i18n = require('../../../config/i18n').default
const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('request-filter')

describe('Request filters component', function () {
  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
  })

  context('with filters', function () {
    let $component
    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'request-filter',
        examples['with filters']
      )
      $component = $('.moj-filter__selected')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    context('filter heading', function () {
      let $filterHeading
      beforeEach(function () {
        $filterHeading = $component.find('.moj-filter__selected-heading')
      })

      it('should set the filter heading content', function () {
        expect($filterHeading.text().trim()).to.equal(
          'filters::selected_filters.heading'
        )
      })
    })

    context('category headings', function () {
      let $categoryHeading
      beforeEach(function () {
        $categoryHeading = $component.find(
          '.app-filter-request__category-heading'
        )
      })

      it('should add the expected number of category headings', function () {
        expect($categoryHeading.length).to.equal(2)
      })

      it('should add the category heading element', function () {
        expect($categoryHeading.get(0).tagName).to.equal('h3')
      })

      it('should set category headings content', function () {
        expect($categoryHeading.eq(0).text()).to.equal('Filter by species')
        expect($categoryHeading.eq(1).text()).to.equal('Filter by colour')
      })
    })

    context('category items', function () {
      let $categories
      let $categoryItemsSpecies
      let $categoryItemsColour

      beforeEach(function () {
        $categories = $component.find('.moj-filter-tags')
        $categoryItemsSpecies = $categories.eq(0).find('.moj-filter__tag')
        $categoryItemsColour = $categories.eq(1).find('.moj-filter__tag')
      })

      it('should add the expected number of categories', function () {
        expect($categories.length).to.equal(2)
      })

      it('should add the category element', function () {
        expect($categories.get(0).tagName).to.equal('ul')
      })

      it('should add the expected number of category items', function () {
        expect($categoryItemsSpecies.length).to.equal(2)
        expect($categoryItemsColour.length).to.equal(1)
      })

      it('should set the category items href', function () {
        expect($categoryItemsSpecies.eq(0).attr('href')).to.equal(
          '/monkey/remove'
        )
        expect($categoryItemsSpecies.eq(1).attr('href')).to.equal('/dog/remove')
        expect($categoryItemsColour.eq(0).attr('href')).to.equal(
          '/brown/remove'
        )
      })

      it('should set the category items content', function () {
        const hidden =
          '<span class="govuk-visually-hidden">Remove this filter</span>'
        const tidyString = str => str.trim().replace(/\n\s*/g, '')
        expect(tidyString($categoryItemsSpecies.eq(0).html())).to.equal(
          `${hidden}Monkey`
        )
        expect(tidyString($categoryItemsSpecies.eq(1).html())).to.equal(
          `${hidden}Dog`
        )
        expect(tidyString($categoryItemsColour.eq(0).html())).to.equal(
          `${hidden}Brown`
        )
      })
    })

    context('edit link', function () {
      let $editLink
      beforeEach(function () {
        $editLink = $component.find('.app-filter-requests__edit-filters')
      })

      it('should add the edit link element', function () {
        expect($editLink.get(0).tagName).to.equal('a')
      })

      it('should set the edit link href', function () {
        expect($editLink.attr('href')).to.equal('/edit/filters')
      })

      it('should set the edit link to have the link class', function () {
        expect($editLink.hasClass('govuk-link')).to.be.true
      })

      it('should set the edit link to have no-visited state', function () {
        expect($editLink.hasClass('govuk-link--no-visited-state')).to.be.true
      })

      it('should set the edit link content', function () {
        expect($editLink.text()).to.equal('filters::selected_filters.edit_link')
      })
    })

    context('clear link', function () {
      let $clearLink
      beforeEach(function () {
        $clearLink = $component.find('.app-filter-requests__clear-filters')
      })

      it('should add the clear link element', function () {
        expect($clearLink.get(0).tagName).to.equal('a')
      })

      it('should set the clear link href', function () {
        expect($clearLink.attr('href')).to.equal('/clear/filters')
      })

      it('should set the clear link to have the link class', function () {
        expect($clearLink.hasClass('govuk-link')).to.be.true
      })

      it('should set the clear link to have no-visited state', function () {
        expect($clearLink.hasClass('govuk-link--no-visited-state')).to.be.true
      })

      it('should set the clear link content', function () {
        expect($clearLink.text()).to.equal(
          'filters::selected_filters.clear_link'
        )
      })
    })
  })

  context('without filters', function () {
    let $component
    let $editLink

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'request-filter',
        examples['without filters']
      )
      $component = $('.moj-filter__none-selected')
      $editLink = $component.find('.app-filter-requests__edit-filters')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('p')
    })

    it('should add the edit link element', function () {
      expect($editLink.get(0).tagName).to.equal('a')
    })

    it('should set the edit link href', function () {
      expect($editLink.attr('href')).to.equal('/edit/filters')
    })

    it('should set the edit link to have the link class', function () {
      expect($editLink.hasClass('govuk-link')).to.be.true
    })

    it('should set the edit link to have no-visited state', function () {
      expect($editLink.hasClass('govuk-link--no-visited-state')).to.be.true
    })

    it('should set the edit link content', function () {
      expect($editLink.text()).to.equal('filters::edit_link')
    })
  })

  context('skipped', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('request-filter', {})
      $component = $('body')
    })

    it('should not render component', function () {
      expect($component.html()).to.equal('')
    })
  })
})
