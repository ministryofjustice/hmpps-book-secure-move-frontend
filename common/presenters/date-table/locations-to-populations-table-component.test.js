const { cloneDeep } = require('lodash')

const i18n = require('../../../config/i18n')
const tablePresenters = require('../table')

const {
  locationsToPopulationTable: presenter,
  freeSpaceCellContent,
  dayConfig,
} = require('./locations-to-population-table-component')

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

  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
  })

  afterEach(function () {
    i18n.t.restore()
  })

  describe('freeSpaceCellContent', function () {
    beforeEach(function () {
      output = presenter({
        startDate: new Date('2020-06-01'),
        focusDate: new Date('2020-06-04'),
      })(mockLocations)
    })

    let result
    context('with population count', function () {
      beforeEach(function () {
        result = freeSpaceCellContent({
          date: new Date(2020, 5, 1),
          populationIndex: 1,
        })(mockLocations[0])
      })
      it('should display as spaces_with_count', function () {
        expect(result).to.contain('>population::spaces_with_count<')
      })
      it('should link to daily overview page', function () {
        expect(result).to.contain(
          `a href="/population/day/2020-06-01/${mockLocations[0].id}"`
        )
      })
    })

    context('without population count', function () {
      beforeEach(function () {
        result = freeSpaceCellContent({
          date: new Date(2020, 5, 1),
          populationIndex: 4,
        })(mockLocations[0])
      })

      it('should display as add_space', function () {
        expect(result).to.contain('>population::add_space<')
      })
      it('should link to daily edit page', function () {
        expect(result).to.contain(
          `a href="/population/day/2020-06-01/${mockLocations[0].id}/edit"`
        )
      })
    })
    context('with invalid population', function () {
      beforeEach(function () {
        result = freeSpaceCellContent({
          date: new Date(2020, 5, 1),
          populationIndex: 4,
        })({
          ...mockLocations[0],
          meta: {},
        })
      })

      it('should display as add_space', function () {
        expect(result).to.contain('>population::add_space<')
      })
      it('should link to daily edit page', function () {
        expect(result).to.contain(
          `a href="/population/day/2020-06-01/${mockLocations[0].id}/edit"`
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

        const renderedResult = result.row.html(mockLocations[0])
        expect(renderedResult).to.contain('>population::spaces_with_count<')
      })
      it('should display as spaces_with_count', function () {})
    })
  })

  describe('locationsToPopulationTable', function () {
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
            attributes: { width: '220' },
          })
        })

        it('should have 5 day columns starting from "today"', function () {
          expect(output.head[1])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-08-12'))
          expect(output.head[2])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-08-13'))
          expect(output.head[3])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-08-14'))
          expect(output.head[4])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-08-15'))
          expect(output.head[5])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-08-16'))
        })
      })

      context('with startDate', function () {
        beforeEach(function () {
          output = presenter({
            startDate: new Date('2020-06-01'),
          })()
        })

        it('returns have an establishment column', function () {
          expect(output.head.length).to.equal(6)

          expect(output.head[0]).to.deep.include({
            html: 'population::labels.establishment',
            attributes: {
              width: '220',
            },
          })
        })

        it('should have 5 day columns starting from startDate', function () {
          expect(output.head[1])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-06-01'))
          expect(output.head[2])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-06-02'))
          expect(output.head[3])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-06-03'))
          expect(output.head[4])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-06-04'))
          expect(output.head[5])
            .to.have.property('date')
            .that.deep.equals(new Date('2020-06-05'))
        })

        it('should have day cells with other properties', function () {
          expect(output.head[1]).to.deep.include({
            text: 'Day 1',
            attributes: {
              width: '80',
            },
          })
          expect(output.head[2]).to.deep.include({
            text: 'Day 2',
            attributes: {
              width: '80',
            },
          })
          expect(output.head[3]).to.deep.include({
            text: 'Day 3',
            attributes: {
              width: '80',
            },
          })
          expect(output.head[4]).to.deep.include({
            text: 'Day 4',
            attributes: {
              width: '80',
            },
          })
          expect(output.head[5]).to.deep.include({
            text: 'Day 5',
            attributes: {
              width: '80',
            },
          })
        })
      })
    })

    describe('its behaviour', function () {
      beforeEach(function () {
        output = presenter({
          startDate: new Date('2020-06-01'),
          focusDate: new Date('2020-06-04'),
        })(mockLocations)
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
          expect(output.rows[0][1].html).to.include(
            'population::spaces_with_count'
          )
          expect(i18n.t).to.have.been.calledWith(
            'population::spaces_with_count',
            {
              count: 2,
            }
          )
        })

        it('returns the second capacity for Tuesday', function () {
          expect(output.rows[0][2].html).to.include(
            'population::spaces_with_count'
          )
          expect(i18n.t).to.have.been.calledWith(
            'population::spaces_with_count',
            {
              count: -1,
            }
          )
        })

        it('returns the third capacity for Wednesday', function () {
          expect(output.rows[0][3].html).to.include(
            'population::spaces_with_count'
          )
          expect(i18n.t).to.have.been.calledWith(
            'population::spaces_with_count',
            {
              count: 0,
            }
          )
        })

        it('returns the fourth capacity for Thursday', function () {
          expect(output.rows[0][4].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith(
            'population::spaces_with_count',
            {
              count: 2,
            }
          )
        })

        it('returns the fifth capacity for Friday', function () {
          expect(output.rows[0][5].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith(
            'population::spaces_with_count',
            {
              count: 2,
            }
          )
        })
      })

      context('with missing population data', function () {
        beforeEach(function () {
          const missingData = cloneDeep(mockLocations)

          delete missingData[0].meta.populations[1].id
          delete missingData[0].meta.populations[2].free_spaces
          delete missingData[0].meta.populations[3].id
          delete missingData[0].meta.populations[3].free_spaces
          missingData[0].meta.populations[4] = undefined
          delete missingData[0].meta.populations[5]

          output = presenter({
            query: {
              sortBy: 'date',
              status: 'approved',
            },
          })(missingData)
        })

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
          expect(output.rows[0][1].html).to.include(
            'population::spaces_with_count'
          )
          expect(i18n.t).to.have.been.calledWith(
            'population::spaces_with_count',
            {
              count: 2,
            }
          )
        })

        it('returns the second capacity for Tuesday', function () {
          expect(output.rows[0][2].html).to.include(
            'population::spaces_with_count'
          )
          expect(i18n.t).to.have.been.calledWith(
            'population::spaces_with_count',
            {
              count: -1,
            }
          )
        })

        it('returns the third capacity for Wednesday', function () {
          expect(output.rows[0][3].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })

        it('returns the fourth capacity for Thursday', function () {
          expect(output.rows[0][4].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })

        it('returns the fifth capacity for Friday', function () {
          expect(output.rows[0][5].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })
      })

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
})
