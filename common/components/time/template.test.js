const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('time')

describe('Time component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = render('time', examples.default)
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
      const $ = render('time', {
        classes: 'custom-class',
      })

      const $component = $('time')
      expect($component.hasClass('custom-class')).to.be.true
    })
  })

  context('with custom text', function () {
    let $component

    beforeEach(function () {
      const $ = render('time', {
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
})
