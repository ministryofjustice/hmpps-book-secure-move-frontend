const { render, getExamples } = require('../../../test/unit/component-helpers')

const examples = getExamples('time')

describe('Time component', () => {
  context('by default', () => {
    let $component

    beforeEach(() => {
      const $ = render('time', examples.default)
      $component = $('time')
    })

    it('should render', () => {
      expect($component.length).to.equal(1)
    })

    it('should contain a datetime attribute', () => {
      const $datetimeAttr = $component.attr('datetime')
      expect($datetimeAttr).to.equal('2019-01-10')
    })

    it('should use the datetime as element text', () => {
      expect($component.text().trim()).to.equal('2019-01-10')
    })
  })

  context('with classes', () => {
    it('should render classes', () => {
      const $ = render('time', {
        classes: 'custom-class',
      })

      const $component = $('time')
      expect($component.hasClass('custom-class')).to.be.true
    })
  })

  context('with custom text', () => {
    let $component

    beforeEach(() => {
      const $ = render('time', {
        datetime: '2019-01-10',
        text: 'Today',
      })

      $component = $('time')
    })

    it('should contain a datetime attribute', () => {
      const $datetimeAttr = $component.attr('datetime')
      expect($datetimeAttr).to.equal('2019-01-10')
    })

    it('should contain custom text', () => {
      expect($component.text().trim()).to.equal('Today')
    })
  })
})
