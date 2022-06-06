const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')
const componentService = require('../services/component')

const presenter = require('./allocations-to-table-component')
const tablePresenters = require('./table')

const mockAllocations = [
  {
    id: '8567f1a5-2201-4bc2-b655-f6526401303a',
    date: '2020-05-03',
    created_at: '2020-04-20T10:44:36+01:00',
    updated_at: '2020-04-20T10:44:36+01:00',
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
    totalSlots: 3,
    filledSlots: 3,
    unfilledSlots: 0,
  },
  {
    id: '05140394-c517-45d9-8c24-9b4913972d87',
    date: '2020-04-27',
    created_at: '2020-04-20T10:44:36+01:00',
    updated_at: '2020-04-20T10:44:36+01:00',
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
    totalSlots: 3,
    filledSlots: 0,
    unfilledSlots: 3,
  },
  {
    id: 'c213ebd7-fd77-4b27-aa0c-5545204f3521',
    date: '2020-05-03',
    created_at: '2020-04-20T10:44:37+01:00',
    updated_at: '2020-04-20T10:44:37+01:00',
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
    totalSlots: 3,
    filledSlots: 1,
    unfilledSlots: 2,
  },
  {
    id: 'd213ebd7-fd77-4b27-aa0c-5545204f3521',
    date: '2020-05-03',
    created_at: '2020-04-20T10:44:37+01:00',
    updated_at: '2020-04-20T10:44:37+01:00',
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
    totalSlots: 5,
    filledSlots: 3,
    unfilledSlots: 2,
  },
]

describe('#allocationsToTableComponent', function () {
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

  it('returns an object with allocations heads', function () {
    expect(output.head).to.exist
    expect(output.head).to.be.an('array')
  })

  it('returns an object with allocations', function () {
    expect(output.rows).to.exist
    expect(output.rows).to.be.an('array')
  })

  describe('its behaviour', function () {
    let output

    context('with no options', function () {
      beforeEach(function () {
        output = presenter()(mockAllocations)
      })

      it('returns the table head correctly ordered', function () {
        expect(output.head).to.deep.equal([
          {
            html: 'collections::labels.move_size',
            isSortable: true,
            sortKey: 'moves_count',
            attributes: {
              width: '120',
            },
          },
          {
            text: 'collections::labels.progress',
            attributes: {
              width: '150',
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
            html: 'fields::date_custom.label',
            isSortable: true,
            sortKey: 'date',
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
                html: `<a href="/allocation/${mockAllocations[0].id}">3 person</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                html: 'govukTag',
              },
              {
                text: mockAllocations[0].from_location.title,
              },
              {
                text: mockAllocations[0].to_location.title,
              },
              {
                text: mockAllocations[0].date,
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(0)
            ).to.be.calledWithExactly('govukTag', {
              classes: 'govuk-tag--green',
              text: 'collections::labels.progress_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(1)).to.be.calledWithExactly(
              'collections::labels.progress_status',
              {
                context: 'complete',
                count: 3,
              }
            )
          })
        })

        describe('unstarted allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[1]).to.deep.equal([
              {
                html: `<a href="/allocation/${mockAllocations[1].id}">3 person</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                html: 'govukTag',
              },
              {
                text: mockAllocations[1].from_location.title,
              },
              {
                text: mockAllocations[1].to_location.title,
              },
              {
                text: mockAllocations[1].date,
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(1)
            ).to.be.calledWithExactly('govukTag', {
              classes: 'govuk-tag--red',
              text: 'collections::labels.progress_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(3)).to.be.calledWithExactly(
              'collections::labels.progress_status',
              {
                context: '',
                count: 0,
              }
            )
          })
        })

        describe('unfilled allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[2]).to.deep.equal([
              {
                html: `<a href="/allocation/${mockAllocations[2].id}">3 person</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                html: 'govukTag',
              },
              {
                text: mockAllocations[2].from_location.title,
              },
              {
                text: mockAllocations[2].to_location.title,
              },
              {
                text: mockAllocations[2].date,
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(2)
            ).to.be.calledWithExactly('govukTag', {
              classes: 'govuk-tag--yellow',
              text: 'collections::labels.progress_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(5)).to.be.calledWithExactly(
              'collections::labels.progress_status',
              {
                context: 'by_added',
                count: 1,
              }
            )
          })
        })

        describe('Cancelled allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[3]).to.deep.equal([
              {
                html: `<a href="/allocation/${mockAllocations[3].id}">5 person</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                html: 'govukTag',
              },
              {
                text: mockAllocations[3].from_location.title,
              },
              {
                text: mockAllocations[3].to_location.title,
              },
              {
                text: mockAllocations[3].date,
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(3)
            ).to.be.calledWithExactly('govukTag', {
              classes: 'govuk-tag--red',
              text: 'collections::labels.progress_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(7)).to.be.calledWithExactly(
              'collections::labels.progress_status',
              {
                context: 'cancelled',
              }
            )
          })
        })
      })
    })

    context('with show from location option false', function () {
      beforeEach(function () {
        output = presenter({
          showFromLocation: false,
        })(mockAllocations)
      })

      it('returns the table head correctly ordered', function () {
        expect(output.head).to.deep.equal([
          {
            html: 'collections::labels.move_size',
            isSortable: true,
            sortKey: 'moves_count',
            attributes: {
              width: '120',
            },
          },
          {
            text: 'collections::labels.progress',
            attributes: {
              width: '150',
            },
          },
          {
            html: 'collections::labels.to_location',
            isSortable: true,
            sortKey: 'to_location',
          },
          {
            html: 'fields::date_custom.label',
            isSortable: true,
            sortKey: 'date',
            attributes: {
              width: '135',
            },
          },
        ])
      })

      it('should return correct number of columns for rows', function () {
        expect(Object.keys(output.rows[0])).to.have.length(4)
        expect(Object.keys(output.rows[1])).to.have.length(4)
        expect(Object.keys(output.rows[2])).to.have.length(4)
      })
    })

    context('with show remaining option', function () {
      beforeEach(function () {
        output = presenter({
          showRemaining: true,
        })(mockAllocations)
      })

      describe('rows', function () {
        it('should return the correct number', function () {
          expect(output.rows).to.have.length(4)
        })

        describe('filled allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[0]).to.deep.equal([
              {
                html: `<a href="/allocation/${mockAllocations[0].id}">3 person</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                html: 'govukTag',
              },
              {
                text: mockAllocations[0].from_location.title,
              },
              {
                text: mockAllocations[0].to_location.title,
              },
              {
                text: mockAllocations[0].date,
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(0)
            ).to.be.calledWithExactly('govukTag', {
              classes: 'govuk-tag--green',
              text: 'collections::labels.progress_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(1)).to.be.calledWithExactly(
              'collections::labels.progress_status',
              {
                context: 'complete',
                count: 0,
              }
            )
          })
        })

        describe('unstarted allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[1]).to.deep.equal([
              {
                html: `<a href="/allocation/${mockAllocations[1].id}">3 person</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                html: 'govukTag',
              },
              {
                text: mockAllocations[1].from_location.title,
              },
              {
                text: mockAllocations[1].to_location.title,
              },
              {
                text: mockAllocations[1].date,
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(1)
            ).to.be.calledWithExactly('govukTag', {
              classes: 'govuk-tag--red',
              text: 'collections::labels.progress_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(3)).to.be.calledWithExactly(
              'collections::labels.progress_status',
              {
                context: 'new',
                count: 3,
              }
            )
          })
        })

        describe('unfilled allocation', function () {
          it('should return allocation correctly', function () {
            expect(output.rows[2]).to.deep.equal([
              {
                html: `<a href="/allocation/${mockAllocations[2].id}">3 person</a>`,
                attributes: {
                  scope: 'row',
                },
              },
              {
                html: 'govukTag',
              },
              {
                text: mockAllocations[2].from_location.title,
              },
              {
                text: mockAllocations[2].to_location.title,
              },
              {
                text: mockAllocations[2].date,
              },
            ])
          })

          it('should call tag component correctly', function () {
            expect(
              componentService.getComponent.getCall(2)
            ).to.be.calledWithExactly('govukTag', {
              classes: 'govuk-tag--yellow',
              text: 'collections::labels.progress_status',
            })
          })

          it('should call i18n with correct data', function () {
            expect(i18n.t.getCall(5)).to.be.calledWithExactly(
              'collections::labels.progress_status',
              {
                context: 'by_remaining',
                count: 2,
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
            status: 'approved',
          },
        })(mockAllocations)
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

    context('with isSortable set to false', function () {
      beforeEach(function () {
        output = presenter({
          isSortable: false,
        })(mockAllocations)
      })
      it('should return allocations without sorting flag', function () {
        expect(output.head).to.deep.equal([
          {
            attributes: {
              width: '120',
            },
            html: 'collections::labels.move_size',
            isSortable: false,
            sortKey: 'moves_count',
          },
          {
            attributes: {
              width: '150',
            },
            text: 'collections::labels.progress',
          },
          {
            html: 'collections::labels.from_location',
            isSortable: false,
            sortKey: 'from_location',
          },
          {
            html: 'collections::labels.to_location',
            isSortable: false,
            sortKey: 'to_location',
          },
          {
            attributes: {
              width: '135',
            },
            html: 'fields::date_custom.label',
            isSortable: false,
            sortKey: 'date',
          },
        ])
      })
    })
  })
})
