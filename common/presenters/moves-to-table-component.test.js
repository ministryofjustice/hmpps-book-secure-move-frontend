const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const presenter = require('./moves-to-table-component')
const tablePresenters = require('./table')

const mockMoves = [
  {
    id: '8567f1a5-2201-4bc2-b655-f6526401303a',
    date: '2020-05-03',
    reference: 'ABC',
    status: 'booked',
    from_location: {
      id: '9380cb63-f588-4fef-99d0-322c7838f265',
      key: 'hhi',
      title: 'HOLME HOUSE (HMP)',
    },
    to_location: {
      id: '5640c8b0-508a-4dfc-bde6-ade4a648d340',
      key: 'hmp_ashfield',
      title: 'HMP Ashfield',
    },
  },
  {
    id: '05140394-c517-45d9-8c24-9b4913972d87',
    date: '2020-04-27',
    reference: 'DEF',
    status: 'proposed',
    from_location: {
      id: '21512459-1505-4950-aec3-7bdbad291e33',
      key: 'hmp_yoi_downview',
      title: 'HMP/YOI Downview',
    },
    to_location: {
      id: '3613fe8f-2e3b-490a-9cc9-a066981d05f0',
      key: 'hmirc_the_verne',
      title: 'HMIRC The Verne',
    },
  },
  {
    id: 'c213ebd7-fd77-4b27-aa0c-5545204f3521',
    date: '2020-05-03',
    reference: 'GHI',
    status: 'requested',
    from_location: {
      id: 'b9e8bc2b-9224-4a8f-b1e7-19b2973c30fa',
      key: 'hmp_yoi_thorn_cross',
      title: 'HMP/YOI Thorn Cross',
    },
    to_location: {
      id: '8f5347f8-6463-4eea-8ec5-9d00c02e0acd',
      key: 'hmp_yoi_parc',
      title: 'HMP/YOI Parc',
    },
  },
  {
    id: 'd213ebd7-fd77-4b27-aa0c-5545204f3521',
    date: '2020-05-03',
    reference: 'JKL',
    status: 'cancelled',
    from_location: {
      id: 'b9e8bc2b-9224-4a8f-b1e7-19b2973c30fa',
      key: 'hmp_yoi_thorn_cross',
      title: 'HMP/YOI Thorn Cross',
    },
    to_location: {
      id: '8f5347f8-6463-4eea-8ec5-9d00c02e0acd',
      key: 'hmp_yoi_parc',
      title: 'HMP/YOI Parc',
    },
  },
]

describe('#movesToTableComponent', function () {
  let output

  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
    sinon.stub(componentService, 'getComponent').returnsArg(0)
    sinon.stub(filters, 'formatDate').returnsArg(0)
    sinon
      .stub(tablePresenters, 'objectToTableHead')
      .returns(sinon.stub().callsFake(arg => arg.head))
    output = presenter()([])
  })

  it('returns an object with moves heads', function () {
    expect(output.head).to.exist
    expect(output.head).to.be.an('array')
  })

  it('returns an object with moves', function () {
    expect(output.rows).to.exist
    expect(output.rows).to.be.an('array')
  })

  describe('its behaviour', function () {
    let output

    context('with no options', function () {
      beforeEach(function () {
        output = presenter()(mockMoves)
      })

      it('returns the table head correctly ordered', function () {
        expect(output.head).to.deep.equal([
          {
            html: 'collections::labels.reference',
            isSortable: true,
            sortKey: 'reference',
            attributes: {
              width: '120',
            },
          },
          {
            html: 'collections::labels.from_location',
            isSortable: true,
            sortKey: 'from_location',
          },
          {
            html: 'collections::labels.to_location',
            isSortable: true,
            sortKey: 'to_location',
          },
          {
            html: 'collections::labels.move_date',
            isSortable: true,
            sortKey: 'date',
            attributes: {
              width: '145',
            },
          },
          {
            html: 'collections::labels.move_status',
            isSortable: true,
            sortKey: 'status',
            attributes: {
              width: '135',
            },
          },
        ])
      })

      describe('rows', function () {
        it('should return the correct number', function () {
          expect(output.rows).to.have.length(4)
        })

        it('should return correct number of columns', function () {
          expect(Object.keys(output.rows[0])).to.have.length(5)
          expect(Object.keys(output.rows[1])).to.have.length(5)
          expect(Object.keys(output.rows[2])).to.have.length(5)
        })

        describe('filled allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[0]).to.deep.equal([
              {
                html: `<a href="/move/${mockMoves[0].id}">ABC</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                text: mockMoves[0].from_location.title,
              },
              {
                text: mockMoves[0].to_location.title,
              },
              {
                text: mockMoves[0].date,
              },
              {
                html: 'mojBadge',
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(0)
            ).to.be.calledWithExactly('mojBadge', {
              text: 'collections::labels.move_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(0)).to.be.calledWithExactly(
              'collections::labels.move_status',
              { context: 'booked' }
            )
          })
        })

        describe('Cancelled allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[3]).to.deep.equal([
              {
                html: `<a href="/move/${mockMoves[3].id}">JKL</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                text: mockMoves[3].from_location.title,
              },
              {
                text: mockMoves[3].to_location.title,
              },
              {
                text: mockMoves[3].date,
              },
              {
                html: 'mojBadge',
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(3)
            ).to.be.calledWithExactly('mojBadge', {
              text: 'collections::labels.move_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(3)).to.be.calledWithExactly(
              'collections::labels.move_status',
              {
                context: 'cancelled',
              }
            )
          })
        })
      })
    })

    context('with query', function () {
      beforeEach(function () {
        output = presenter({
          query: {
            sortBy: 'date',
            status: 'booked',
          },
        })(mockMoves)
      })

      it('passes the query to objectToTableHead', function () {
        expect(
          tablePresenters.objectToTableHead
        ).to.have.been.calledWithExactly({
          sortBy: 'date',
          status: 'booked',
        })
      })
    })
  })
})
