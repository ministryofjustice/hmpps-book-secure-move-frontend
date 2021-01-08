const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('time')
const mockTimerDate = '2017-08-10'

describe('Time component', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers(new Date(mockTimerDate).getTime())
  })

  afterEach(function () {
    this.clock.restore()
  })

  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('time', examples.default)
      $component = $('time')
    })

    it('should render', function () {
      expect($component.length).to.equal(1)
    })

    it('should contain a datetime attribute', function () {
      const $datetimeAttr = $component.attr('datetime')
      expect($datetimeAttr).to.equal('2019-01-10')
    })

    it('should use the datetime as element text', function () {
      expect($component.text().trim()).to.equal('2019-01-10')
    })
  })

  context('with classes', function () {
    it('should render classes', function () {
      const $ = renderComponentHtmlToCheerio('time', {
        classes: 'custom-class',
      })

      const $component = $('time')
      expect($component.hasClass('custom-class')).to.be.true
    })
  })

  context('with custom text', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('time', {
        datetime: '2019-01-10',
        text: 'Today',
      })

      $component = $('time')
    })

    it('should contain a datetime attribute', function () {
      const $datetimeAttr = $component.attr('datetime')
      expect($datetimeAttr).to.equal('2019-01-10')
    })

    it('should contain custom text', function () {
      expect($component.text().trim()).to.equal('Today')
    })
  })

  context('with relative time', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('time', {
        datetime: '2019-01-10',
        relative: true,
      })

      $component = $('time')
    })

    it('should contain a datetime attribute', function () {
      const $datetimeAttr = $component.attr('datetime')
      expect($datetimeAttr).to.equal('2019-01-10')
    })

    it('should contain a display relative attribute', function () {
      expect($component.attr('data-display-relative')).to.equal('true')
    })
  })

  context('with imminent offset', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('time', {
        datetime: '2019-01-10',
        imminentOffset: 120,
      })

      $component = $('time')
    })

    it('should contain a datetime attribute', function () {
      const $datetimeAttr = $component.attr('datetime')
      expect($datetimeAttr).to.equal('2019-01-10')
    })

    it('should contain an imminent offset attribute', function () {
      expect($component.attr('data-imminent-offset')).to.equal('120')
    })
  })

  context('with display as tag', function () {
    let $component, $timeComponent

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('time', {
        datetime: '2019-01-10',
        displayAsTag: true,
      })

      $component = $('.govuk-tag')
      $timeComponent = $component.find('time')
    })

    it('should render GOVUK tag component', function () {
      expect($component.get(0).tagName).to.equal('strong')
      expect($component.hasClass('govuk-tag')).to.be.true
    })

    it('should contain correct tag attribute', function () {
      const $datetimeAttr = $timeComponent.attr('datetime')
      expect($datetimeAttr).to.equal('2019-01-10')
    })

    it('should contain a has tag attribute', function () {
      expect($timeComponent.attr('data-has-tag')).to.equal('true')
    })

    it('should use the datetime as element text', function () {
      expect($timeComponent.text().trim()).to.equal('2019-01-10')
    })
  })
})
