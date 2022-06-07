const i18n = require('../../../config/i18n').default

const objectToTableHead = require('./object-to-table-head')

describe('table head presenter', function () {
  let output

  beforeEach(function () {
    sinon.stub(i18n, 't').callsFake(key => {
      return `${key} (translated)`
    })
  })

  context('with no args', function () {
    beforeEach(function () {
      output = objectToTableHead({})()
    })

    it('should return undefined', function () {
      expect(output).to.be.undefined
    })

    it('should not translate anything', function () {
      expect(i18n.t).not.to.be.called
    })
  })

  context('with html', function () {
    beforeEach(function () {
      output = objectToTableHead()({
        head: {
          html: 'move_type::label',
        },
      })
    })

    it('should return correct header', function () {
      expect(output).to.deep.equal({
        html: 'move_type::label (translated)',
      })
    })

    it('should translate label', function () {
      expect(i18n.t).to.be.calledOnceWithExactly('move_type::label')
    })
  })

  context('with text', function () {
    beforeEach(function () {
      output = objectToTableHead()({
        head: {
          text: 'move_type::label',
        },
      })
    })

    it('should return correct header', function () {
      expect(output).to.deep.equal({
        text: 'move_type::label (translated)',
      })
    })

    it('should translate label', function () {
      expect(i18n.t).to.be.calledOnceWithExactly('move_type::label')
    })
  })

  context('with attributes', function () {
    beforeEach(function () {
      output = objectToTableHead()({
        head: {
          html: 'move_type::label',
          attributes: {
            width: 1,
          },
        },
      })
    })

    it('should return correct header', function () {
      expect(output).to.deep.equal({
        html: 'move_type::label (translated)',
        attributes: {
          width: 1,
        },
      })
    })

    it('should translate label', function () {
      expect(i18n.t).to.be.calledOnceWithExactly('move_type::label')
    })
  })

  context('with neither html nor test', function () {
    beforeEach(function () {
      output = objectToTableHead()({})
    })

    it('should return undefined', function () {
      expect(output).to.be.undefined
    })

    it('should not translate anything', function () {
      expect(i18n.t).not.to.be.called
    })
  })

  context('with both html and text', function () {
    beforeEach(function () {
      output = objectToTableHead()({
        head: {
          html: 'move_type::label-html',
          text: 'move_type::label-text',
        },
      })
    })

    it('should return correct header', function () {
      expect(output).to.deep.equal({
        html: 'move_type::label-html (translated)',
        text: 'move_type::label-text (translated)',
      })
    })

    it('should translate both label', function () {
      expect(i18n.t).to.be.calledWithExactly('move_type::label-html')
      expect(i18n.t).to.be.calledWithExactly('move_type::label-text')
    })

    it('should translate correct number of times', function () {
      expect(i18n.t.callCount).to.equal(2)
    })
  })
  context('with isSortable', function () {
    context('with current column sorted', function () {
      beforeEach(function () {
        output = objectToTableHead({
          sortBy: 'moves_count',
          sortDirection: 'desc',
          status: 'proposed',
        })({
          head: {
            isSortable: true,
            sortKey: 'moves_count',
            html: 'moves_count::label-html',
          },
        })
      })
      it('outputs the aria sort attribute set to the current sorting', function () {
        expect(output.attributes).to.deep.equal({
          'aria-sort': 'descending',
        })
      })
      it('outputs a link', function () {
        expect(output.html).to.equal(
          '<a aria-label="sort (translated)" class="sortable-table__button" role="button" href="?sortBy=moves_count&sortDirection=asc&status=proposed">moves_count::label-html (translated)</a>'
        )
      })
      it('conserves the existing attributes', function () {
        expect(output.isSortable).to.be.true
        expect(output.sortKey).to.equal('moves_count')
      })
    })
    context('with another column sorted', function () {
      beforeEach(function () {
        output = objectToTableHead({
          sortBy: 'date',
          sortDirection: 'asc',
          status: 'proposed',
        })({
          head: {
            isSortable: true,
            sortKey: 'moves_count',
            html: 'moves_count::label-html',
          },
        })
      })
      it('outputs the aria sort attribute set to none', function () {
        expect(output.attributes).to.deep.equal({
          'aria-sort': 'none',
        })
      })
      it('outputs a link', function () {
        expect(output.html).to.equal(
          '<a aria-label="sort (translated)" class="sortable-table__button" role="button" href="?sortBy=moves_count&sortDirection=desc&status=proposed">moves_count::label-html (translated)</a>'
        )
      })
    })

    context('with existing query containing `page`', function () {
      beforeEach(function () {
        output = objectToTableHead({
          sortBy: 'date',
          sortDirection: 'asc',
          status: 'proposed',
          page: 2,
        })({
          head: {
            isSortable: true,
            sortKey: 'moves_count',
            html: 'moves_count::label-html',
          },
        })
      })

      it('should omit page number', function () {
        expect(output.html).to.equal(
          '<a aria-label="sort (translated)" class="sortable-table__button" role="button" href="?sortBy=moves_count&sortDirection=desc&status=proposed">moves_count::label-html (translated)</a>'
        )
      })
    })
  })
  context('with isSortable set to false', function () {
    beforeEach(function () {
      output = objectToTableHead({
        sortBy: 'date',
        sortDirection: 'desc',
        status: 'proposed',
      })({
        head: {
          isSortable: false,
          html: 'moves_count::label-html',
        },
      })
    })
    it('outputs the translated html', function () {
      expect(output.html).to.equal('moves_count::label-html (translated)')
    })
    it('does not introduce spurious properties', function () {
      expect(output.isSortable).to.be.undefined
      expect(output.sortKey).to.be.undefined
    })
  })
})
