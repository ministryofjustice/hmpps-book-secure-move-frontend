const {
  renderComponentHtmlToCheerio,
  getExamples,
} = require('../../../test/unit/component-helpers')

const examples = getExamples('timeline')

describe('Timeline component', function () {
  let example

  let $component
  let $timeline
  let $item
  let $header
  let $content
  let $title
  let $description
  let $date
  let $time
  let $byline
  let $additional

  beforeEach(function () {
    const $ = renderComponentHtmlToCheerio('timeline', example)
    $component = $('body')
    $timeline = $component.find('.moj-timeline')
    $item = $component.find('.moj-timeline__item')
    $content = $component.find('.moj-timeline__content')
    $header = $component.find('.moj-timeline__header')
    $title = $component.find('.moj-timeline__title')
    $description = $component.find('.moj-timeline__description')
    $date = $component.find('.moj-timeline__date')
    $time = $component.find('time')
    $byline = $component.find('.moj-timeline__byline')
    $additional = $component.find('.moj-timeline__additional')
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

    it('should not contain content container', function () {
      expect($content.length).to.equal(0)
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

    it('should not contain any bylines', function () {
      expect($byline.length).to.equal(0)
    })

    it('should not contain any additional content', function () {
      expect($additional.length).to.equal(0)
    })

    it('should have correct structure', function () {
      expect($header.next().hasClass('moj-timeline__date')).to.equal(true)
      expect($date.next().hasClass('moj-timeline__description')).to.equal(true)
    })
  })

  context('container classes', function () {
    before(function () {
      example = examples['container classes']
    })

    it('should add expected classes', function () {
      expect($timeline.hasClass('container-class')).to.be.true
    })
  })

  context('container attributes', function () {
    before(function () {
      example = examples['container attributes']
    })

    it('should add expected attributes', function () {
      expect($timeline.attr('data-attr')).to.equal('container-value')
    })
  })

  context('heading level', function () {
    before(function () {
      example = examples['heading level']
    })

    it('should set the heading level', function () {
      expect($title.get(0).name).to.equal('h4')
    })
  })

  context('description with html params', function () {
    before(function () {
      example = examples['description with html params']
    })

    it('should output expected description', function () {
      expect($description.html().trim()).to.equal(
        '<b>Explanation</b> of what happened'
      )
    })
  })

  context('description with text params', function () {
    before(function () {
      example = examples['description with text params']
    })

    it('should output expected description escaping any html', function () {
      expect($description.html().trim()).to.equal(
        '&lt;b&gt;Explanation&lt;/b&gt; of what happened'
      )
    })
  })

  context('item classes', function () {
    before(function () {
      example = examples['item classes']
    })

    it('should add expected classes', function () {
      expect($item.hasClass('item-class')).to.be.true
    })
  })

  context('item attributes', function () {
    before(function () {
      example = examples['item attributes']
    })

    it('should add expected attributes', function () {
      expect($item.attr('data-attr')).to.equal('item-value')
    })
  })

  context('label with html params', function () {
    before(function () {
      example = examples['label with html params']
    })

    it('should output expected heading', function () {
      expect($title.html().trim()).to.equal('<b>Something</b> happened')
    })
  })

  context('label with text params', function () {
    before(function () {
      example = examples['label with text params']
    })

    it('should output expected heading escaping any html', function () {
      expect($title.html().trim()).to.equal(
        '&lt;b&gt;Something&lt;/b&gt; happened'
      )
    })
  })

  context('label classes', function () {
    before(function () {
      example = examples['label classes']
    })

    it('should add expected classes', function () {
      expect($title.hasClass('label-class')).to.be.true
    })
  })

  context('date using shortdatetime type', function () {
    before(function () {
      example = examples['date using shortdatetime type']
    })

    it('should output expected shortdatetime', function () {
      expect($time.html().trim()).to.equal('14 Jun 2019 at 3:01pm')
    })
  })

  context('date using date type', function () {
    before(function () {
      example = examples['date using date type']
    })

    it('should output expected date', function () {
      expect($time.html().trim()).to.equal('14 June 2019')
    })
  })

  context('date using shortdate type', function () {
    before(function () {
      example = examples['date using shortdate type']
    })

    it('should output expected shortdate', function () {
      expect($time.html().trim()).to.equal('14 Jun 2019')
    })
  })

  context('date using time type', function () {
    before(function () {
      example = examples['date using time type']
    })

    it('should output expected time', function () {
      expect($time.html().trim()).to.equal('3:01pm')
    })
  })

  context('date using format', function () {
    before(function () {
      example = examples['date using format']
    })

    it('should output expected time', function () {
      expect($time.html().trim()).to.equal('2019-06-14 / 14 Friday June 15:01')
    })
  })

  context('byline with html params', function () {
    before(function () {
      example = examples['byline with html params']
    })

    it('should output expected byline', function () {
      expect($byline.html().trim()).to.equal('by <b>Agent</b> Smith')
    })
  })

  context('byline with text params', function () {
    before(function () {
      example = examples['byline with text params']
    })

    it('should output expected byline escaping any html', function () {
      expect($byline.html().trim()).to.equal(
        'by &lt;b&gt;Agent&lt;/b&gt; Smith'
      )
    })
  })

  context('byline with text params', function () {
    before(function () {
      example = examples['byline with text params']
    })

    it('should output expected byline escaping any html', function () {
      expect($byline.html().trim()).to.equal(
        'by &lt;b&gt;Agent&lt;/b&gt; Smith'
      )
    })
  })

  context('component', function () {
    before(function () {
      example = examples.component
    })

    it('should render', function () {
      expect($component.length).to.equal(1)
    })

    it('should contain content container', function () {
      expect($content.length).to.equal(1)
    })

    it('should have correct structure', function () {
      expect($header.next().hasClass('moj-timeline__content')).to.equal(true)
      expect($description.parent().hasClass('moj-timeline__content')).to.equal(
        true
      )
      expect($description.next().hasClass('moj-timeline__date')).to.equal(true)
    })
  })

  context('additional with html params', function () {
    before(function () {
      example = examples['additional with html params']
    })

    it('should output expected additional info', function () {
      expect($additional.html().trim()).to.equal(
        '<b>Additional</b> information'
      )
    })
  })

  context('additional with text params', function () {
    before(function () {
      example = examples['additional with text params']
    })

    it('should output expected additional info escaping any html', function () {
      expect($additional.html().trim()).to.equal(
        '&lt;b&gt;Additional&lt;/b&gt; information'
      )
    })
  })
})
