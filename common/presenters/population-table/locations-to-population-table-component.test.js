const proxyquire = require('proxyquire')

const i18n = require('../../../config/i18n')
const tablePresenters = require('../table')

const mockLocations = [
  {
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
          id: '18a46696-f6ff-4c4e-8fe8-bc3177845a4a',
          free_spaces: undefined,
        },
        {
          id: 'abccd8db-29fe-47cf-b463-4f71cbea5416',
          free_spaces: undefined,
        },
      ],
    },
  },
]

describe('#locationToPopulationTableComponent()', function () {
  let output
  let presenter

  before(function () {
    presenter = proxyquire('./locations-to-population-table-component', {})
  })

  beforeEach(function () {
    sinon
      .stub(tablePresenters, 'objectToTableHead')
      .returns(sinon.stub().callsFake(arg => arg.head))
    output = presenter()([])
  })

  it('returns an object with population heads', function () {
    expect(output.head).to.exist
    expect(output.head).to.be.an('array')
  })

  it('returns an object with populations', function () {
    expect(output.rows).to.exist
    expect(output.rows).to.be.an('array')
  })

  describe('table headers', function () {
    context('with no table data', function () {
      beforeEach(function () {
        this.clock = sinon.useFakeTimers(new Date('2020-08-12').getTime())

        output = presenter()()
      })

      afterEach(function () {
        this.clock.restore()
      })

      it('should only have table headers', function () {
        expect(output.rows.length).to.equal(0)
      })

      it('should have 6 columns', function () {
        expect(output.head.length).to.equal(6)
      })

      it('should have a establishment column', function () {
        expect(output.head[0]).to.deep.equal({
          html: 'population::labels.establishment',
          isSortable: false,
          sortKey: 'title',
          attributes: { width: '220' },
        })
      })

      it('should have 5 day columns', function () {
        expect(output.head[1]).to.deep.include({
          classes: 'focus-table__tr--day',
        })
        expect(output.head[2]).to.deep.include({
          classes: 'focus-table__tr--day',
        })
        expect(output.head[3]).to.deep.include({
          classes: 'focus-table__tr--day',
        })
        expect(output.head[4]).to.deep.include({
          classes: 'focus-table__tr--day',
        })
        expect(output.head[5]).to.deep.include({
          classes: 'focus-table__tr--day',
        })
      })
    })

    context('only startDate and no focusDate', function () {
      beforeEach(function () {
        output = presenter({
          startDate: new Date('2020-06-01'),
        })()
      })

      it('returns one head row with all the cells', function () {
        expect(output.head.length).to.equal(6)

        expect(output.head[0]).to.deep.include({
          html: 'population::labels.establishment',
          isSortable: false,
          sortKey: 'title',
          attributes: {
            width: '220',
          },
        })
        expect(output.head[1]).to.deep.include({
          text: 'Mon 01',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
        expect(output.head[2]).to.deep.include({
          text: 'Tue 02',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
        expect(output.head[3]).to.deep.include({
          text: 'Wed 03',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
        expect(output.head[4]).to.deep.include({
          text: 'Thu 04',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
        expect(output.head[5]).to.deep.include({
          text: 'Fri 05',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
      })
    })

    context('with startDate and focusDate', function () {
      beforeEach(function () {
        output = presenter({
          startDate: new Date('2020-06-01'),
          focusDate: new Date('2020-06-02'),
        })()
      })

      it('returns one head row with all the cells', function () {
        expect(output.head.length).to.equal(6)

        expect(output.head[0]).to.deep.include({
          html: 'population::labels.establishment',
          isSortable: false,
          sortKey: 'title',
          attributes: {
            width: '220',
          },
        })
        expect(output.head[1]).to.deep.include({
          text: 'Mon 01',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
        expect(output.head[2]).to.deep.include({
          text: 'Tue 02',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day focus-table__tr--focus',
        })
        expect(output.head[3]).to.deep.include({
          text: 'Wed 03',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
        expect(output.head[4]).to.deep.include({
          text: 'Thu 04',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
        expect(output.head[5]).to.deep.include({
          text: 'Fri 05',
          attributes: {
            width: '80',
          },
          classes: 'focus-table__tr--day',
        })
      })
    })
  })

  describe('its behaviour', function () {
    let t
    beforeEach(function () {
      t = sinon.stub(i18n, 't').returnsArg(0)

      output = presenter({
        startDate: new Date('2020-06-01'),
        focusDate: new Date('2020-06-04'),
      })(mockLocations)
    })

    afterEach(function () {
      t.restore()
    })

    context('with no options', function () {
      it('returns one head row with all the cells', function () {
        expect(output.head.length).to.equal(6)
      })

      it('returns one data row ', function () {
        expect(output.rows.length).to.equal(1)
      })

      it('returns one data row with all the cells', function () {
        expect(output.rows[0].length).to.equal(6)
      })

      it('returns establishment on first cell', function () {
        expect(output.rows[0][0]).to.deep.equal({
          attributes: {
            scope: 'row',
          },
          html: '<a>WETHERBY (HMPYOI)</a>',
        })
      })

      it('returns the first capacity for Monday', function () {
        expect(output.rows[0][1]).to.deep.include({
          html: '<a>population::spaces_with_count</a>',
        })
        expect(t).to.have.been.calledWith('population::spaces_with_count', {
          count: 2,
        })
      })

      it('returns the second capacity for Tuesday', function () {
        expect(output.rows[0][2]).to.deep.include({
          html: '<a>population::spaces_with_count</a>',
        })
        expect(t).to.have.been.calledWith('population::spaces_with_count', {
          count: -1,
        })
      })

      it('returns the third capacity for Wednesday', function () {
        expect(output.rows[0][3]).to.deep.include({
          html: '<a>population::spaces_with_count</a>',
        })
        expect(t).to.have.been.calledWith('population::spaces_with_count', {
          count: 0,
        })
      })

      it('returns the fourth capacity for Thursday', function () {
        expect(output.rows[0][4]).to.deep.include({
          html: '<a>population::add_space</a>',
        })
        expect(t).to.have.been.calledWith('population::spaces_with_count', {
          count: 2,
        })
      })

      it('returns the fifth capacity for Friday', function () {
        expect(output.rows[0][5]).to.deep.include({
          html: '<a>population::add_space</a>',
        })
        expect(t).to.have.been.calledWith('population::spaces_with_count', {
          count: 2,
        })
      })
    })

    context('with missing population data', function () {})

    context('with query', function () {
      beforeEach(function () {
        output = presenter({
          query: {
            sortBy: 'date',
            status: 'approved',
          },
        })(mockLocations)
      })
      it('passes the query to objectToTableHead', function () {
        expect(
          tablePresenters.objectToTableHead
        ).to.have.been.calledWithExactly({
          sortBy: 'date',
          status: 'approved',
        })
      })
    })
  })
})
