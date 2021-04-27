const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('map')

describe('Map component', function () {
  context('by default', function () {
    let $component

    beforeEach(function () {
      const $ = renderComponentHtmlToCheerio('map', examples.default)
      $component = $('.app-map')
    })

    it('should render component', function () {
      expect($component.get(0).tagName).to.equal('div')
    })

    it('should render module data attribute', function () {
      expect($component.attr('data-module')).to.equal('app-map')
    })

    it('should render module viewport', function () {
      expect($component.find('.app-map__viewport').length).to.equal(1)
    })
  })

  context('with tile URL', function () {
    it('should render tile URL as data attribute', function () {
      const $ = renderComponentHtmlToCheerio('map', {
        tileUrl: 'http://tiles.com',
      })
      const $component = $('.app-map')

      expect($component.attr('data-tile-url')).to.exist
      expect($component.attr('data-tile-url')).to.equal('http://tiles.com')
    })
  })

  context('with data lines', function () {
    it('should render lines as data attribute', function () {
      const $ = renderComponentHtmlToCheerio('map', {
        geoData: {
          lines: JSON.stringify({ foo: 'bar', fiz: ['buzz'] }),
        },
      })
      const $component = $('.app-map')

      expect($component.attr('data-lines')).to.exist
      expect($component.attr('data-lines')).to.equal(
        '{"foo":"bar","fiz":["buzz"]}'
      )
    })
  })

  context('with data points', function () {
    it('should render points as data attribute', function () {
      const $ = renderComponentHtmlToCheerio('map', {
        geoData: {
          points: JSON.stringify({ fiz: 'buzz', foo: ['bar'] }),
        },
      })
      const $component = $('.app-map')

      expect($component.attr('data-points')).to.exist
      expect($component.attr('data-points')).to.equal(
        '{"fiz":"buzz","foo":["bar"]}'
      )
    })
  })
})
