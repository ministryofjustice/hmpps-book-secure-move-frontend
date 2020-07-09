const i18n = require('../../../config/i18n')
const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('framework-response')

describe('Framework Response component', function () {
  let $component

  context('with `string` response', function () {
    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio(
        'framework-response',
        examples.string
      )
      $component = $('body')
    })

    it('should not render a parent element', function () {
      expect($component.children().first().get(0)).to.be.undefined
    })

    it('should render value', function () {
      expect($component.text().trim()).to.equal('Example string response')
    })
  })

  context('with `object` response', function () {
    context('without details', function () {
      beforeEach(function () {
        const $ = renderComponentHtmlToCheerio(
          'framework-response',
          examples.object
        )
        $component = $('body')
      })

      it('should not render a parent element', function () {
        expect($component.children().first().get(0)).to.be.undefined
      })

      it('should render value', function () {
        expect($component.text().trim()).to.equal('Yes')
      })
    })

    context('with details', function () {
      beforeEach(function () {
        const $ = renderComponentHtmlToCheerio(
          'framework-response',
          examples['object with details']
        )
        $component = $('body')
      })

      it('should not render a parent element', function () {
        expect($component.children().first().get(0)).to.be.undefined
      })

      it('should render value', function () {
        expect($component.text().trim()).to.equal(
          'Yes — Example further details for this response'
        )
      })
    })
  })

  context('with `array response', function () {
    const example = examples.array

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('framework-response', example)
      $component = $('body')
    })

    it('should render a parent ul', function () {
      expect($component.children().first().get(0).tagName).to.equal('ul')
    })

    it('should contain correct ul classes', function () {
      expect($component.children().first().attr('class')).to.equal(
        'govuk-list govuk-list--bullet govuk-list--spaced govuk-!-margin-top-0 govuk-!-font-size-16'
      )
    })

    it('should render list item for each item', function () {
      expect($component.find('li').length).to.equal(example.value.length)
    })

    it('should render text of each item', function () {
      example.value.forEach((option, idx) => {
        expect($component.find('li').eq(idx).text().trim()).to.equal(option)
      })
    })
  })

  context('with `collection response', function () {
    context('without details', function () {
      const example = examples.collection

      beforeEach(function () {
        const $ = renderComponentHtmlToCheerio('framework-response', example)
        $component = $('body')
      })

      it('should render a parent ul', function () {
        expect($component.children().first().get(0).tagName).to.equal('ul')
      })

      it('should contain correct ul classes', function () {
        expect($component.children().first().attr('class')).to.equal(
          'govuk-list govuk-list--bullet govuk-list--spaced govuk-!-margin-top-0 govuk-!-font-size-16'
        )
      })

      it('should render list item for each item', function () {
        expect($component.find('li').length).to.equal(example.value.length)
      })

      it('should render text of each item', function () {
        example.value.forEach((item, idx) => {
          expect($component.find('li').eq(idx).text().trim()).to.contain(
            item.option
          )
        })
      })
    })

    context('with details', function () {
      const example = examples['collection with details']

      beforeEach(function () {
        const $ = renderComponentHtmlToCheerio('framework-response', example)
        $component = $('body')
      })

      it('should render a parent ul', function () {
        expect($component.children().first().get(0).tagName).to.equal('ul')
      })

      it('should contain correct ul classes', function () {
        expect($component.children().first().attr('class')).to.equal(
          'govuk-list govuk-list--bullet govuk-list--spaced govuk-!-margin-top-0 govuk-!-font-size-16'
        )
      })

      it('should render list item for each item', function () {
        expect($component.find('li').length).to.equal(example.value.length)
      })

      it('should render text of each item', function () {
        example.value.forEach((item, idx) => {
          expect($component.find('li').eq(idx).text().trim()).to.equal(
            `${item.option} — ${item.details}`
          )
        })
      })
    })
  })

  context('unanswered', function () {
    const example = examples.unanswered

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)

      const $ = renderComponentHtmlToCheerio('framework-response', example)
      $component = $('body')
    })

    it('should render a parent anchor', function () {
      expect($component.children().first().get(0).tagName).to.equal('a')
    })

    it('should contain correct href for anchor', function () {
      expect($component.children().first().attr('href')).to.equal(
        '/step-url#question-id'
      )
    })

    it('should translate text', function () {
      expect(i18n.t).to.be.calledOnceWithExactly('actions::answer_question')
    })

    it('should contain correct href for anchor', function () {
      expect($component.children().first().text().trim()).to.equal(
        'actions::answer_question'
      )
    })
  })

  context('without value', function () {
    const example = examples.unanswered

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)

      const $ = renderComponentHtmlToCheerio('framework-response', {
        ...example,
        valueType: 'string',
      })
      $component = $('body')
    })

    it('should render a parent anchor', function () {
      expect($component.children().first().get(0).tagName).to.equal('a')
    })

    it('should contain correct href for anchor', function () {
      expect($component.children().first().attr('href')).to.equal(
        '/step-url#question-id'
      )
    })

    it('should translate text', function () {
      expect(i18n.t).to.be.calledOnceWithExactly('actions::answer_question')
    })

    it('should contain correct href for anchor', function () {
      expect($component.children().first().text().trim()).to.equal(
        'actions::answer_question'
      )
    })
  })

  context('without valueType', function () {
    const example = examples.unanswered

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)

      const $ = renderComponentHtmlToCheerio('framework-response', {
        ...example,
        value: 'String value',
      })
      $component = $('body')
    })

    it('should render a parent anchor', function () {
      expect($component.children().first().get(0).tagName).to.equal('a')
    })

    it('should contain correct href for anchor', function () {
      expect($component.children().first().attr('href')).to.equal(
        '/step-url#question-id'
      )
    })

    it('should translate text', function () {
      expect(i18n.t).to.be.calledOnceWithExactly('actions::answer_question')
    })

    it('should contain correct href for anchor', function () {
      expect($component.children().first().text().trim()).to.equal(
        'actions::answer_question'
      )
    })
  })
})
