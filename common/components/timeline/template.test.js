const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('timeline')

const defaultItem = {
  label: {
    text: 'Something happened',
  },
  text: 'Explanation of what happened',
  datetime: {
    timestamp: '2019-06-14T14:01:00.000Z',
    type: 'datetime',
  },
}

describe('Timeline component', function () {
  let example

  let $component
  let $timeline
  let $item
  let $container
  let $header
  let $title
  let $description
  let $date
  let $time
  let $byline

  beforeEach(function () {
    const $ = renderComponentHtmlToCheerio('timeline', example)
    $component = $('body')
    $timeline = $component.find('.app-timeline')
    $item = $component.find('.app-timeline__item')
    $container = $component.find('.app-timeline__item__container')
    $header = $component.find('.app-timeline__header')
    $title = $component.find('.app-timeline__title')
    $description = $component.find('.app-timeline__description')
    $date = $component.find('.app-timeline__date')
    $time = $component.find('time')
    $byline = $component.find('.app-timeline__byline')
  })

  context('by default', function () {
    before(function () {
      example = examples.default
    })

    it('should render', function () {
      expect($component.length).to.equal(1)
    })

    it('should contain a timeline element', function () {
      expect($timeline.length).to.equal(1)
    })

    it('should contain an element for each item', function () {
      expect($item.length).to.equal(2)
    })

    it('should contain a container element for each item', function () {
      expect($container.length).to.equal(2)
    })

    it('should contain a heading element for each item', function () {
      expect($header.length).to.equal(2)
    })

    it('should contain the label content for each item', function () {
      expect($title.length).to.equal(2)
    })

    it('should use the default heading level', function () {
      expect($title.get(0).name).to.equal('h2')
    })

    it('should contain a date element for each item', function () {
      expect($date.length).to.equal(2)
    })

    it('should contain a time element for each item', function () {
      expect($time.length).to.equal(2)
    })

    it('should add the datetime attribute to the time elements', function () {
      expect($time.eq(0).attr('datetime')).to.equal('2019-06-14T14:01:00.000Z')
      expect($time.eq(1).attr('datetime')).to.equal('2019-06-14T15:01:00.000Z')
    })

    it('should not contain any byline content', function () {
      expect($byline.length).to.equal(0)
    })

    it('should have correct structure', function () {
      expect($item.parent().hasClass('app-timeline'))
      expect($container.parent().hasClass('app-timeline__item'))
      expect($header.parent().hasClass('app-timeline__item__container'))
      expect($header.next().hasClass('app-timeline__description')).to.equal(
        true
      )
      expect($description.next().hasClass('app-timeline__date')).to.equal(true)
      expect($time.parent().hasClass('app-timeline__date'))
    })
  })

  context('container classes', function () {
    before(function () {
      example = {
        classes: 'container-class',
        items: [defaultItem],
      }
    })

    it('should add expected classes', function () {
      expect($timeline.hasClass('container-class')).to.be.true
    })
  })

  context('container attributes', function () {
    before(function () {
      example = {
        attributes: {
          'data-attr': 'container-value',
        },
        items: [defaultItem],
      }
    })

    it('should add expected attributes', function () {
      expect($timeline.attr('data-attr')).to.equal('container-value')
    })
  })

  context('heading level', function () {
    before(function () {
      example = {
        headingLevel: 4,
        items: [defaultItem],
      }
    })

    it('should set the heading level', function () {
      expect($title.get(0).name).to.equal('h4')
    })
  })

  context('description with html params', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            html: '<b>Explanation</b> of what happened',
          },
        ],
      }
    })

    it('should output expected description', function () {
      expect($description.html().trim()).to.equal(
        '<b>Explanation</b> of what happened'
      )
    })
  })

  context('description with text params', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            text: '<b>Explanation</b> of what happened',
          },
        ],
      }
    })

    it('should output expected description escaping any html', function () {
      expect($description.html().trim()).to.equal(
        '&lt;b&gt;Explanation&lt;/b&gt; of what happened'
      )
    })
  })

  context('item classes', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            classes: 'item-class',
          },
        ],
      }
    })

    it('should add expected classes', function () {
      expect($item.hasClass('item-class')).to.be.true
    })
  })

  context('item attributes', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            attributes: {
              'data-attr': 'item-value',
            },
          },
        ],
      }
    })

    it('should add expected attributes', function () {
      expect($item.attr('data-attr')).to.equal('item-value')
    })
  })

  context('label with html params', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            label: {
              html: '<b>Something</b> happened',
            },
          },
        ],
      }
    })

    it('should output expected heading', function () {
      expect($title.html().trim()).to.equal('<b>Something</b> happened')
    })
  })

  context('label with text params', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            label: {
              text: '<b>Something</b> happened',
            },
          },
        ],
      }
    })

    it('should output expected heading escaping any html', function () {
      expect($title.html().trim()).to.equal(
        '&lt;b&gt;Something&lt;/b&gt; happened'
      )
    })
  })

  context('label classes', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            label: {
              text: 'Something happened',
              classes: 'label-class',
            },
          },
        ],
      }
    })

    it('should add expected classes', function () {
      expect($title.hasClass('label-class')).to.be.true
    })
  })

  context('date with type', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            datetime: {
              timestamp: '2019-06-14T14:01:00.000Z',
              type: 'shortdatetime',
            },
          },
        ],
      }
    })

    it('should output expected shortdatetime', function () {
      expect($time.html().trim()).to.equal('14 June 2019 at 15:01')
    })
  })

  context('byline with html params', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            byline: {
              html: '<b>Agent</b> Smith',
            },
          },
        ],
      }
    })

    it('should output expected byline info', function () {
      expect($byline.html().trim()).to.equal('by <b>Agent</b> Smith')
    })

    it('should have correct structure', function () {
      expect($date.next().hasClass('app-timeline__byline')).to.equal(true)
    })
  })

  context('byline with text params', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            byline: {
              text: '<b>Agent</b> Smith',
            },
          },
        ],
      }
    })

    it('should output expected byline info escaping any html', function () {
      expect($byline.html().trim()).to.equal(
        'by &lt;b&gt;Agent&lt;/b&gt; Smith'
      )
    })
  })

  context('item container classes', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            container: {
              classes: 'item-container-class',
            },
          },
        ],
      }
    })

    it('should set the class on the item container', function () {
      expect($container.hasClass('item-container-class')).to.equal(true)
    })
  })

  context('item header classes', function () {
    before(function () {
      example = {
        items: [
          {
            ...defaultItem,
            header: {
              classes: 'item-header-class',
            },
          },
        ],
      }
    })

    it('should set the class on the header container', function () {
      expect($header.hasClass('item-header-class')).to.equal(true)
    })
  })
})
