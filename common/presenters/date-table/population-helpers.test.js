const i18n = require('../../../config/i18n').default

const { dayConfig, genericValueCellContent } = require('./population-helpers')

const mockLocation = {
  id: '54d1c8c3-699e-4198-9218-f923a7f18149',
  type: 'locations',
  key: 'wyi',
  title: 'WETHERBY (HMPYOI)',
  location_type: 'prison',
  meta: {
    populations: [
      {
        id: '1bf70844-6b85-4fa6-8437-1c3859f883ee',
        free_spaces: 2,
        transfers_in: 3,
        transfers_out: 4,
      },
      {
        id: '6318fafa-923d-468f-ab5f-dc9cbdd79198',
        free_spaces: -1,
      },
      {
        id: '06bb368a-d512-406c-9a3f-ef47d75a31c7',
        free_spaces: 0,
      },
      {
        id: undefined,
        free_spaces: undefined,
        transfers_in: 3,
        transfers_out: 4,
      },
      {
        id: null,
        free_spaces: null,
        transfers_in: 3,
        transfers_out: 4,
      },
    ],
  },
}

describe('population helpers', function () {
  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
  })

  afterEach(function () {
    i18n.t.restore()
  })

  describe('dayConfig', function () {
    let result
    beforeEach(function () {
      result = dayConfig({
        cellType: 'freeSpaces',
        date: '2020-01-01',
        populationIndex: 0,
      })
    })
    context('head', function () {
      it('should contain a date', function () {
        expect(result.head.date).to.equal('2020-01-01')
      })

      it('should contain numerated heading', function () {
        expect(result.head.text).to.equal('Day 1')
      })

      it('should contain attributes', function () {
        expect(result.head.attributes).to.deep.equal({
          width: '80',
          scope: 'col',
        })
      })
    })

    context('row', function () {
      it('should contain a date', function () {
        expect(result.row.date).to.equal('2020-01-01')
      })

      it('should contain attributes', function () {
        expect(result.row.attributes).to.deep.equal({
          scope: 'row',
          'data-cell-type': 'freeSpaces',
        })
      })

      it('should contain html render', function () {
        expect(result.row.html).to.be.a('function')
      })

      it('should render cell content with html', function () {
        result = dayConfig({
          cellType: 'freeSpaces',
          date: new Date(2020, 0, 1),
          populationIndex: 0,
        })

        const renderedResult = result.row.html(mockLocation)
        expect(renderedResult).to.contain('>population::spaces_with_count<')
      })
    })
  })

  describe('genericValueCellContent', function () {
    it('should return an empty string for an unknown cellType', function () {
      const cellRenderer = genericValueCellContent({
        cellType: 'unknown',
        date: new Date(2020, 0, 1),
        populationIndex: 0,
      })

      expect(cellRenderer({})).to.equal('')
    })

    it('should use cell renderer for known cellType', function () {
      const cellRenderer = genericValueCellContent({
        cellType: 'transfersIn',
        date: new Date(2020, 0, 1),
        populationIndex: 0,
      })

      expect(cellRenderer(mockLocation)).to.contain(
        'population::transfers_in_with_count'
      )
    })

    it('should not use link if no url generated', function () {
      const cellRenderer = genericValueCellContent({
        cellType: 'transfersIn',
        date: new Date(2020, 0, 1),
        populationIndex: 1,
      })

      expect(cellRenderer(mockLocation)).to.equal(
        '<span>population::no_transfers</span>'
      )
    })
  })
})
