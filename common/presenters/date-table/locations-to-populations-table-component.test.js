const { cloneDeep } = require('lodash')

const i18n = require('../../../config/i18n')
const tablePresenters = require('../table')

const {
  locationsToPopulationTable,
  locationsToPopulationAndTransfersTables,
} = require('./locations-to-population-table-component')

const mockGroupedLocations = {
  'Category Sigma': [
    {
      id: '54d1c8c3-699e-4198-9218-f923a7f18149',
      type: 'locations',
      key: 'lor',
      title: 'Lorem',
      location_type: 'prison',
      meta: {
        populations: [
          {
            id: '1bf70844-6b85-4fa6-8437-1c3859f883ee',
            free_spaces: 2,
            transfers_in: 4,
            transfers_out: 1,
          },
          {
            id: '6318fafa-923d-468f-ab5f-dc9cbdd79198',
            free_spaces: -1,
            transfers_in: 3,
            transfers_out: 8,
          },
          {
            id: '06bb368a-d512-406c-9a3f-ef47d75a31c7',
            free_spaces: 0,
            transfers_in: 2,
            transfers_out: 9,
          },
          {
            id: '18a46696-f6ff-4c4e-8fe8-bc3177845a4a',
            free_spaces: undefined,
            transfers_in: undefined,
            transfers_out: undefined,
          },
          {
            id: 'abccd8db-29fe-47cf-b463-4f71cbea5416',
            free_spaces: undefined,
            transfers_in: undefined,
            transfers_out: undefined,
          },
        ],
      },
    },
  ],
  'Category Tau': [
    {
      id: '34d1c8c3-699e-4198-9218-f923a7f18149',
      type: 'locations',
      key: 'ips',
      title: 'Ipsum',
      location_type: 'prison',
      meta: {
        populations: [
          {
            id: '3bf70844-6b85-4fa6-8437-1c3859f883ee',
            free_spaces: 9,
            transfers_in: 11,
            transfers_out: 21,
          },
          {
            id: '3318fafa-923d-468f-ab5f-dc9cbdd79198',
            free_spaces: 8,
            transfers_in: 12,
            transfers_out: 22,
          },
          {
            id: '36bb368a-d512-406c-9a3f-ef47d75a31c7',
            free_spaces: 7,
            transfers_in: 13,
            transfers_out: 23,
          },
          {
            id: '18a46696-f6ff-4c4e-8fe8-bc3177845a4a',
            free_spaces: 6,
            transfers_in: 14,
            transfers_out: 24,
          },
          {
            id: '3bccd8db-29fe-47cf-b463-4f71cbea5416',
            free_spaces: 5,
            transfers_in: 15,
            transfers_out: 25,
          },
        ],
      },
    },
  ],
}

describe('#locationToPopulationTableComponent()', function () {
  let output

  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
    i18n.t.resetHistory()

    const mockDate = new Date('2020-06-07')
    this.clock = sinon.useFakeTimers(mockDate.getTime())
  })

  afterEach(function () {
    i18n.t.restore()

    this.clock.restore()
  })

  describe('locationsToPopulationTable', function () {
    beforeEach(function () {
      sinon
        .stub(tablePresenters, 'objectToTableHead')
        .returns(sinon.stub().callsFake(arg => arg.head))
    })

    context('with no categories', function () {
      output = locationsToPopulationTable()({})
      expect(output).to.deep.equal([])
    })

    context('with an empty category', function () {
      beforeEach(function () {
        this.clock = sinon.useFakeTimers(new Date('2020-08-12').getTime())

        output = locationsToPopulationTable()({ Empty: [] })
      })

      afterEach(function () {
        this.clock.restore()
      })

      it('returns an object with population heads', function () {
        expect(output[0].head).to.exist
        expect(output[0].head).to.be.an('array')
      })

      it('returns an object with populations', function () {
        expect(output[0].rows).to.exist
        expect(output[0].rows).to.be.an('array')
      })

      describe('table headers', function () {
        context('with no table data', function () {
          beforeEach(function () {
            output = locationsToPopulationTable()({ Empty: [] })
          })

          it('should only have table headers', function () {
            expect(output[0].rows.length).to.equal(0)
          })

          it('should have 6 columns', function () {
            expect(output[0].head.length).to.equal(6)
          })

          it('should have a establishment column', function () {
            expect(output[0].head[0]).to.deep.equal({
              html: 'population::labels.establishment',
              attributes: { width: '220', scope: 'col' },
            })
          })

          it('should have 5 day columns starting from "today"', function () {
            expect(output[0].head[1])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-12'))
            expect(output[0].head[2])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-13'))
            expect(output[0].head[3])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-14'))
            expect(output[0].head[4])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-15'))
            expect(output[0].head[5])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-16'))
          })
        })

        context('with startDate', function () {
          beforeEach(function () {
            output = locationsToPopulationTable({
              startDate: new Date('2020-06-01'),
            })({ Empty: [] })
          })

          it('returns have an establishment column', function () {
            expect(output[0].head.length).to.equal(6)

            expect(output[0].head[0]).to.deep.include({
              html: 'population::labels.establishment',
              attributes: {
                width: '220',
                scope: 'col',
              },
            })
          })

          it('should have 5 day columns starting from startDate', function () {
            expect(output[0].head[1])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-01'))
            expect(output[0].head[2])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-02'))
            expect(output[0].head[3])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-03'))
            expect(output[0].head[4])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-04'))
            expect(output[0].head[5])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-05'))
          })

          it('should have day cells with other properties', function () {
            expect(output[0].head[1]).to.deep.include({
              text: 'Day 1',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[2]).to.deep.include({
              text: 'Day 2',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[3]).to.deep.include({
              text: 'Day 3',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[4]).to.deep.include({
              text: 'Day 4',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[5]).to.deep.include({
              text: 'Day 5',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
          })
        })
      })
    })

    describe('its behaviour', function () {
      beforeEach(function () {
        i18n.t.resetHistory()

        output = locationsToPopulationTable({
          startDate: new Date('2020-06-01'),
          focusDate: new Date('2020-06-04'),
        })(mockGroupedLocations)
      })

      context('with no options', function () {
        it('returns two tables', function () {
          expect(output.length).to.be.equal(2)
        })

        context('first table', function () {
          it('returns one head row with all the cells', function () {
            expect(output[0].head.length).to.equal(6)
          })

          it('returns one data row ', function () {
            expect(output[0].rows.length).to.equal(1)
          })

          it('returns one data row with all the cells', function () {
            expect(output[0].rows[0].length).to.equal(6)
          })

          it('returns establishment on first cell', function () {
            expect(output[0].rows[0][0]).to.deep.equal({
              attributes: {
                scope: 'row',
                'data-cell-type': 'establishment',
              },
              html: '<a href="/population/week/2020-06-01/54d1c8c3-699e-4198-9218-f923a7f18149">Lorem</a>',
            })
          })

          it('assigns data-cell-types for all cells', function () {
            expect(output[0].rows[0][0].attributes['data-cell-type']).to.equal(
              'establishment'
            )
            expect(output[0].rows[0][1].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[0].rows[0][2].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[0].rows[0][3].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[0].rows[0][4].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[0].rows[0][5].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
          })

          it('returns the first capacity for Monday', function () {
            expect(output[0].rows[0][1].html).to.include(
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
            expect(output[0].rows[0][2].html).to.include(
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
            expect(output[0].rows[0][3].html).to.include(
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
            expect(output[0].rows[0][4].html).to.include(
              'population::add_space'
            )
            expect(i18n.t).to.have.been.calledWith(
              'population::spaces_with_count',
              {
                count: 2,
              }
            )
          })

          it('returns the fifth capacity for Friday', function () {
            expect(output[0].rows[0][5].html).to.include(
              'population::add_space'
            )
            expect(i18n.t).to.have.been.calledWith(
              'population::spaces_with_count',
              {
                count: 2,
              }
            )
          })
        })

        context('second table', function () {
          it('returns one head row with all the cells', function () {
            expect(output[1].head.length).to.equal(6)
          })

          it('returns one data row ', function () {
            expect(output[1].rows.length).to.equal(1)
          })

          it('returns one data row with all the cells', function () {
            expect(output[1].rows[0].length).to.equal(6)
          })

          it('returns establishment on first cell', function () {
            expect(output[1].rows[0][0]).to.deep.equal({
              attributes: {
                scope: 'row',
                'data-cell-type': 'establishment',
              },
              html: '<a href="/population/week/2020-06-01/34d1c8c3-699e-4198-9218-f923a7f18149">Ipsum</a>',
            })
          })

          it('assigns data-cell-types for all cells', function () {
            expect(output[1].rows[0][0].attributes['data-cell-type']).to.equal(
              'establishment'
            )
            expect(output[1].rows[0][1].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[1].rows[0][2].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[1].rows[0][3].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[1].rows[0][4].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
            expect(output[1].rows[0][5].attributes['data-cell-type']).to.equal(
              'freeSpaces'
            )
          })
          it('returns the first capacity for Monday', function () {
            expect(output[1].rows[0][1].html).to.include(
              'population::spaces_with_count'
            )
            expect(i18n.t).to.have.been.calledWith(
              'population::spaces_with_count',
              {
                count: 9,
              }
            )
          })

          it('returns the second capacity for Tuesday', function () {
            expect(output[1].rows[0][2].html).to.include(
              'population::spaces_with_count'
            )
            expect(i18n.t).to.have.been.calledWith(
              'population::spaces_with_count',
              {
                count: 8,
              }
            )
          })

          it('returns the third capacity for Wednesday', function () {
            expect(output[1].rows[0][3].html).to.include(
              'population::spaces_with_count'
            )
            expect(i18n.t).to.have.been.calledWith(
              'population::spaces_with_count',
              {
                count: 7,
              }
            )
          })

          it('returns the fourth capacity for Thursday', function () {
            expect(output[1].rows[0][4].html).to.include(
              'population::spaces_with_count'
            )
            expect(i18n.t).to.have.been.calledWith(
              'population::spaces_with_count',
              {
                count: 2,
              }
            )
          })

          it('returns the fifth capacity for Friday', function () {
            expect(output[1].rows[0][5].html).to.include(
              'population::spaces_with_count'
            )
            expect(i18n.t).to.have.been.calledWith(
              'population::spaces_with_count',
              {
                count: 6,
              }
            )
          })
        })
      })

      context('with missing population data', function () {
        beforeEach(function () {
          const missingGroupedData = cloneDeep(mockGroupedLocations)
          const missingLocationData = missingGroupedData['Category Sigma']

          delete missingLocationData[0].meta.populations[1].id
          delete missingLocationData[0].meta.populations[2].free_spaces
          delete missingLocationData[0].meta.populations[3].id
          delete missingLocationData[0].meta.populations[3].free_spaces
          missingLocationData[0].meta.populations[4] = undefined
          delete missingLocationData[0].meta.populations[5]

          output = locationsToPopulationTable({
            query: {
              sortBy: 'date',
              status: 'approved',
            },
          })(missingGroupedData)
        })

        it('returns one head row with all the cells', function () {
          expect(output[0].head.length).to.equal(6)
        })

        it('returns one data row ', function () {
          expect(output[0].rows.length).to.equal(1)
        })

        it('returns one data row with all the cells', function () {
          expect(output[0].rows[0].length).to.equal(6)
        })

        it('returns establishment on first cell', function () {
          expect(output[0].rows[0][0]).to.deep.equal({
            attributes: {
              scope: 'row',
              'data-cell-type': 'establishment',
            },
            html: '<a href="/population/week/2020-06-07/54d1c8c3-699e-4198-9218-f923a7f18149">Lorem</a>',
          })
        })

        it('returns the first capacity for Monday', function () {
          expect(output[0].rows[0][1].html).to.include(
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
          expect(output[0].rows[0][2].html).to.include(
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
          expect(output[0].rows[0][3].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })

        it('returns the fourth capacity for Thursday', function () {
          expect(output[0].rows[0][4].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })

        it('returns the fifth capacity for Friday', function () {
          expect(output[0].rows[0][5].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })
      })

      context('with query', function () {
        beforeEach(function () {
          output = locationsToPopulationTable({
            query: {
              sortBy: 'date',
              status: 'approved',
            },
          })(mockGroupedLocations)
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

  describe('locationsToPopulationAndTransferTables', function () {
    beforeEach(function () {
      sinon
        .stub(tablePresenters, 'objectToTableHead')
        .returns(sinon.stub().callsFake(arg => arg.head))
    })

    context('with no categories', function () {
      output = locationsToPopulationAndTransfersTables()({})
      expect(output).to.deep.equal([])
    })

    context('with an empty category', function () {
      beforeEach(function () {
        this.clock = sinon.useFakeTimers(new Date('2020-08-12').getTime())

        output = locationsToPopulationAndTransfersTables()({ Empty: [] })
      })

      afterEach(function () {
        this.clock.restore()
      })

      it('returns an object with population heads', function () {
        expect(output[0].head).to.exist
        expect(output[0].head).to.be.an('array')
      })

      it('returns an object with populations', function () {
        expect(output[0].rows).to.exist
        expect(output[0].rows).to.be.an('array')
      })

      describe('table headers', function () {
        context('with no table data', function () {
          beforeEach(function () {
            output = locationsToPopulationAndTransfersTables()({ Empty: [] })
          })

          it('should only have table headers', function () {
            expect(output[0].rows.length).to.equal(0)
          })

          it('should have 6 columns', function () {
            expect(output[0].head.length).to.equal(6)
          })

          // FIXME col should be row
          it('should have any empty first column', function () {
            expect(output[0].head[0]).to.deep.equal({
              text: '',
              attributes: { width: '220', scope: 'row' },
            })
          })

          it('should have 5 day columns starting from "today"', function () {
            expect(output[0].head[1])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-12'))
            expect(output[0].head[2])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-13'))
            expect(output[0].head[3])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-14'))
            expect(output[0].head[4])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-15'))
            expect(output[0].head[5])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-08-16'))
          })
        })

        context('with startDate', function () {
          beforeEach(function () {
            output = locationsToPopulationAndTransfersTables({
              startDate: new Date('2020-06-01'),
            })({ Empty: [] })
          })

          // FIXME col should be row
          it('should have any empty first column', function () {
            expect(output[0].head[0]).to.deep.equal({
              text: '',
              attributes: { width: '220', scope: 'row' },
            })
          })

          it('should have 5 day columns starting from startDate', function () {
            expect(output[0].head[1])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-01'))
            expect(output[0].head[2])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-02'))
            expect(output[0].head[3])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-03'))
            expect(output[0].head[4])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-04'))
            expect(output[0].head[5])
              .to.have.property('date')
              .that.deep.equals(new Date('2020-06-05'))
          })

          it('should have day cells with other properties', function () {
            expect(output[0].head[1]).to.deep.include({
              text: 'Day 1',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[2]).to.deep.include({
              text: 'Day 2',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[3]).to.deep.include({
              text: 'Day 3',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[4]).to.deep.include({
              text: 'Day 4',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
            expect(output[0].head[5]).to.deep.include({
              text: 'Day 5',
              attributes: {
                width: '80',
                scope: 'col',
              },
            })
          })
        })
      })
    })

    describe('its behaviour', function () {
      let table
      let row

      beforeEach(function () {
        i18n.t.resetHistory()

        output = locationsToPopulationAndTransfersTables({
          startDate: new Date('2020-06-01'),
          focusDate: new Date('2020-06-04'),
        })(mockGroupedLocations)
      })

      context('with no options', function () {
        it('returns two tables', function () {
          expect(output.length).to.be.equal(2)
        })

        context('first table', function () {
          beforeEach(function () {
            table = output[0]
          })

          it('returns one head row with all the cells', function () {
            expect(table.head.length).to.equal(6)
          })

          it('returns three data rows ', function () {
            expect(table.rows.length).to.equal(3)
          })

          context('first data row (freeSpaces)', function () {
            beforeEach(function () {
              row = table.rows[0]
            })

            it('returns data row with all the cells', function () {
              expect(row.length).to.equal(6)
            })

            it('assigns data-cell-types for cells', function () {
              expect(row[0].attributes['data-cell-type']).to.be.undefined

              expect(row[1].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[2].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[3].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[4].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[5].attributes['data-cell-type']).to.equal('freeSpaces')
            })

            it('returns Free spaces heading on first cell', function () {
              expect(row[0]).to.deep.equal({
                attributes: {
                  scope: 'row',
                },
                html: 'Free spaces',
              })
            })

            it('returns the first capacity for Monday', function () {
              expect(row[1].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the second capacity for Tuesday', function () {
              expect(row[2].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: -1,
                }
              )
            })

            it('returns the third capacity for Wednesday', function () {
              expect(row[3].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 0,
                }
              )
            })

            it('returns the fourth capacity for Thursday', function () {
              expect(row[4].html).to.include('population::add_space')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the fifth capacity for Friday', function () {
              expect(row[5].html).to.include('population::add_space')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })
          })

          context('second data row (transfersIn)', function () {
            beforeEach(function () {
              row = table.rows[1]
            })

            it('returns data row with all the cells', function () {
              expect(row.length).to.equal(6)
            })

            it('assigns data-cell-types for cells', function () {
              expect(row[0].attributes['data-cell-type']).to.be.undefined

              expect(row[1].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[2].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[3].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[4].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[5].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
            })

            it('returns Transfers in heading on first cell', function () {
              expect(row[0]).to.deep.equal({
                attributes: {
                  scope: 'row',
                },
                html: 'Transfers in',
              })
            })

            it('returns the first capacity for Monday', function () {
              expect(row[1].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the second capacity for Tuesday', function () {
              expect(row[2].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: -1,
                }
              )
            })

            it('returns the third capacity for Wednesday', function () {
              expect(row[3].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 0,
                }
              )
            })

            it('returns the fourth capacity for Thursday', function () {
              expect(row[4].html).to.include('population::no_transfers')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the fifth capacity for Friday', function () {
              expect(row[5].html).to.include('population::no_transfers')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })
          })

          context('third data row (transfersOut)', function () {
            beforeEach(function () {
              row = table.rows[2]
            })

            it('returns data row with all the cells', function () {
              expect(row.length).to.equal(6)
            })

            it('assigns data-cell-types for cells', function () {
              expect(row[0].attributes['data-cell-type']).to.be.undefined

              expect(row[1].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[2].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[3].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[4].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[5].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
            })

            it('returns Transfers out heading on first cell', function () {
              expect(row[0]).to.deep.equal({
                attributes: {
                  scope: 'row',
                },
                html: 'Transfers out',
              })
            })

            it('returns the first capacity for Monday', function () {
              expect(row[1].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the second capacity for Tuesday', function () {
              expect(row[2].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: -1,
                }
              )
            })

            it('returns the third capacity for Wednesday', function () {
              expect(row[3].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 0,
                }
              )
            })

            it('returns the fourth capacity for Thursday', function () {
              expect(row[4].html).to.include('population::no_transfers')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the fifth capacity for Friday', function () {
              expect(row[5].html).to.include('population::no_transfers')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })
          })
        })

        context('second table', function () {
          beforeEach(function () {
            table = output[1]
          })

          it('returns one head row with all the cells', function () {
            expect(table.head.length).to.equal(6)
          })

          it('returns three data rows ', function () {
            expect(table.rows.length).to.equal(3)
          })

          context('first data row (freeSpaces)', function () {
            beforeEach(function () {
              row = table.rows[0]
            })

            it('returns data row with all the cells', function () {
              expect(row.length).to.equal(6)
            })

            it('assigns data-cell-types for cells', function () {
              expect(row[0].attributes['data-cell-type']).to.be.undefined

              expect(row[1].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[2].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[3].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[4].attributes['data-cell-type']).to.equal('freeSpaces')
              expect(row[5].attributes['data-cell-type']).to.equal('freeSpaces')
            })

            it('returns Free spaces heading on first cell', function () {
              expect(row[0]).to.deep.equal({
                attributes: {
                  scope: 'row',
                },
                html: 'Free spaces',
              })
            })

            it('returns the first capacity for Monday', function () {
              expect(row[1].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the second capacity for Tuesday', function () {
              expect(row[2].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: -1,
                }
              )
            })

            it('returns the third capacity for Wednesday', function () {
              expect(row[3].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 0,
                }
              )
            })

            it('returns the fourth capacity for Thursday', function () {
              expect(row[4].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the fifth capacity for Friday', function () {
              expect(row[5].html).to.include('population::spaces_with_count')
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })
          })

          context('second data row (transfersIn)', function () {
            beforeEach(function () {
              row = table.rows[1]
            })

            it('returns data row with all the cells', function () {
              expect(row.length).to.equal(6)
            })

            it('assigns data-cell-types for cells', function () {
              expect(row[0].attributes['data-cell-type']).to.be.undefined

              expect(row[1].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[2].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[3].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[4].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
              expect(row[5].attributes['data-cell-type']).to.equal(
                'transfersIn'
              )
            })

            it('returns Transfers in heading on first cell', function () {
              expect(row[0]).to.deep.equal({
                attributes: {
                  scope: 'row',
                },
                html: 'Transfers in',
              })
            })

            it('returns the first capacity for Monday', function () {
              expect(row[1].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the second capacity for Tuesday', function () {
              expect(row[2].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: -1,
                }
              )
            })

            it('returns the third capacity for Wednesday', function () {
              expect(row[3].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 0,
                }
              )
            })

            it('returns the fourth capacity for Thursday', function () {
              expect(row[4].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the fifth capacity for Friday', function () {
              expect(row[5].html).to.include(
                'population::transfers_in_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })
          })

          context('third data row (transfersOut)', function () {
            beforeEach(function () {
              row = table.rows[2]
            })

            it('returns data row with all the cells', function () {
              expect(row.length).to.equal(6)
            })

            it('assigns data-cell-types for cells', function () {
              expect(row[0].attributes['data-cell-type']).to.be.undefined

              expect(row[1].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[2].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[3].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[4].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
              expect(row[5].attributes['data-cell-type']).to.equal(
                'transfersOut'
              )
            })

            it('returns Transfers out heading on first cell', function () {
              expect(row[0]).to.deep.equal({
                attributes: {
                  scope: 'row',
                },
                html: 'Transfers out',
              })
            })

            it('returns the first capacity for Monday', function () {
              expect(row[1].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the second capacity for Tuesday', function () {
              expect(row[2].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: -1,
                }
              )
            })

            it('returns the third capacity for Wednesday', function () {
              expect(row[3].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 0,
                }
              )
            })

            it('returns the fourth capacity for Thursday', function () {
              expect(row[4].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })

            it('returns the fifth capacity for Friday', function () {
              expect(row[5].html).to.include(
                'population::transfers_out_with_count'
              )
              expect(i18n.t).to.have.been.calledWith(
                'population::spaces_with_count',
                {
                  count: 2,
                }
              )
            })
          })
        })
      })

      context('with missing population data', function () {
        beforeEach(function () {
          const missingGroupedData = cloneDeep(mockGroupedLocations)
          const missingLocationData = missingGroupedData['Category Sigma']

          delete missingLocationData[0].meta.populations[1].id
          delete missingLocationData[0].meta.populations[2].free_spaces
          delete missingLocationData[0].meta.populations[3].id
          delete missingLocationData[0].meta.populations[3].free_spaces
          missingLocationData[0].meta.populations[4] = undefined
          delete missingLocationData[0].meta.populations[5]

          output = locationsToPopulationAndTransfersTables({
            query: {
              sortBy: 'date',
              status: 'approved',
            },
          })(missingGroupedData)
        })

        it('returns one head row with all the cells', function () {
          expect(output[0].head.length).to.equal(6)
        })

        it('returns one data row ', function () {
          expect(output[0].rows.length).to.equal(3)
        })

        it('returns one data row with all the cells', function () {
          expect(output[0].rows[0].length).to.equal(6)
        })

        it('returns the first capacity for Monday', function () {
          expect(output[0].rows[0][1].html).to.include(
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
          expect(output[0].rows[0][2].html).to.include(
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
          expect(output[0].rows[0][3].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })

        it('returns the fourth capacity for Thursday', function () {
          expect(output[0].rows[0][4].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })

        it('returns the fifth capacity for Friday', function () {
          expect(output[0].rows[0][5].html).to.include('population::add_space')
          expect(i18n.t).to.have.been.calledWith('population::add_space')
        })
      })

      context('with query', function () {
        beforeEach(function () {
          output = locationsToPopulationAndTransfersTables({
            query: {
              sortBy: 'date',
              status: 'approved',
            },
          })(mockGroupedLocations)
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
