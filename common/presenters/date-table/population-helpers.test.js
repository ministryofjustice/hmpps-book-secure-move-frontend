const i18n = require('../../../config/i18n')

const { dayConfig, freeSpaceCellContent } = require('./population-helpers')

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

  describe('freeSpaceCellContent', function () {
    let result
    context('with population count', function () {
      beforeEach(function () {
        result = freeSpaceCellContent({
          date: new Date(2020, 5, 1),
          populationIndex: 1,
        })(mockLocation)
      })
      it('should display as spaces_with_count', function () {
        expect(result).to.contain('>population::spaces_with_count<')
      })
      it('should link to daily overview page', function () {
        expect(result).to.contain(
          `a href="/population/day/2020-06-01/${mockLocation.id}"`
        )
      })
    })

    context('without population count', function () {
      beforeEach(function () {
        result = freeSpaceCellContent({
          date: new Date(2020, 5, 1),
          populationIndex: 4,
        })(mockLocation)
      })

      it('should display as add_space', function () {
        expect(result).to.contain('>population::add_space<')
      })
      it('should link to daily edit page', function () {
        expect(result).to.contain(
          `a href="/population/day/2020-06-01/${mockLocation.id}/edit"`
        )
      })
    })
    context('with invalid population', function () {
      beforeEach(function () {
        result = freeSpaceCellContent({
          date: new Date(2020, 5, 1),
          populationIndex: 4,
        })({
          ...mockLocation,
          meta: {},
        })
      })

      it('should display as add_space', function () {
        expect(result).to.contain('>population::add_space<')
      })
      it('should link to daily edit page', function () {
        expect(result).to.contain(
          `a href="/population/day/2020-06-01/${mockLocation.id}/edit"`
        )
      })
    })
  })

  describe('dayConfig', function () {
    let result
    beforeEach(function () {
      result = dayConfig({ date: '2020-01-01', populationIndex: 0 })
    })
    context('head', function () {
      it('should contain a date', function () {
        expect(result.head.date).to.equal('2020-01-01')
      })
      it('should contain other table properties', function () {
        expect(result.head).to.deep.include({
          attributes: {
            width: '80',
          },
          text: 'Day 1',
        })
      })
    })
    context('row', function () {
      it('should contain a date', function () {
        expect(result.row.date).to.equal('2020-01-01')
      })
      it('should contain html render', function () {
        expect(result.row.html).to.be.a('function')
      })

      it('should render cell content with html', function () {
        result = dayConfig({ date: new Date(2020, 0, 1), populationIndex: 0 })

        const renderedResult = result.row.html(mockLocation)
        expect(renderedResult).to.contain('>population::spaces_with_count<')
      })
      it('should display as spaces_with_count', function () {})
    })
  })
})
