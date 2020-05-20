const mockAllocations = [
  {
    id: '8567f1a5-2201-4bc2-b655-f6526401303a',
    type: 'allocations',
    moves_count: 3,
    date: '2020-05-03',
    complete_in_full: true,
    other_criteria: null,
    created_at: '2020-04-20T10:44:36+01:00',
    updated_at: '2020-04-20T10:44:36+01:00',
    from_location: {
      id: '9380cb63-f588-4fef-99d0-322c7838f265',
      type: 'locations',
      key: 'hhi',
      title: 'HOLME HOUSE (HMP)',
    },
    to_location: {
      id: '5640c8b0-508a-4dfc-bde6-ade4a648d340',
      type: 'locations',
      key: 'hmp_ashfield',
      title: 'HMP Ashfield',
    },
  },
  {
    id: '05140394-c517-45d9-8c24-9b4913972d87',
    type: 'allocations',
    moves_count: 6,
    date: '2020-04-27',
    complete_in_full: false,
    other_criteria: null,
    created_at: '2020-04-20T10:44:36+01:00',
    updated_at: '2020-04-20T10:44:36+01:00',
    from_location: {
      id: '21512459-1505-4950-aec3-7bdbad291e33',
      type: 'locations',
      key: 'hmp_yoi_downview',
      title: 'HMP/YOI Downview',
    },
    to_location: {
      id: '3613fe8f-2e3b-490a-9cc9-a066981d05f0',
      type: 'locations',
      key: 'hmirc_the_verne',
      title: 'HMIRC The Verne',
    },
  },
  {
    id: 'c213ebd7-fd77-4b27-aa0c-5545204f3521',
    type: 'allocations',
    moves_count: 6,
    date: '2020-05-03',
    complete_in_full: true,
    other_criteria: null,
    created_at: '2020-04-20T10:44:37+01:00',
    updated_at: '2020-04-20T10:44:37+01:00',
    from_location: {
      id: 'b9e8bc2b-9224-4a8f-b1e7-19b2973c30fa',
      type: 'locations',
      key: 'hmp_yoi_thorn_cross',
      title: 'HMP/YOI Thorn Cross',
    },
    to_location: {
      id: '8f5347f8-6463-4eea-8ec5-9d00c02e0acd',
      type: 'locations',
      key: 'hmp_yoi_parc',
      title: 'HMP/YOI Parc',
    },
  },
]
const presenter = require('./allocations-to-table')
const tablePresenters = require('./table')

describe('#allocationsToTable', function() {
  let output
  beforeEach(function() {
    sinon.stub(tablePresenters, 'objectToTableHead').callsFake(arg => {
      return { text: arg.head }
    })
    output = presenter([])
  })
  it('returns an object with allocationsHeads', function() {
    expect(output.head).to.exist
    expect(output.head).to.be.an('array')
  })
  it('returns an object with allocations', function() {
    expect(output.rows).to.exist
    expect(output.rows).to.be.an('array')
  })
  describe('its behaviour', function() {
    let output
    beforeEach(function() {
      output = presenter(mockAllocations)
    })
    it('returns the total moves count on the first cell', function() {
      expect(output.rows[0][0]).to.deep.equal({
        html:
          '<a href="/allocation/8567f1a5-2201-4bc2-b655-f6526401303a">3 people</a>',
        attributes: {
          scope: 'row',
        },
      })
    })
    it('returns the created date on the second cell', function() {
      expect(output.rows[0][1]).to.deep.equal({
        text: '20 Apr 2020',
      })
    })
    it('returns location_from on the third cell', function() {
      expect(output.rows[0][2]).to.deep.equal({
        text: 'HOLME HOUSE (HMP)',
      })
    })
    it('returns location_to on the fourth cell', function() {
      expect(output.rows[0][3]).to.deep.equal({
        text: 'HMP Ashfield',
      })
    })
    it('returns move date on the fifth cell', function() {
      expect(output.rows[0][4]).to.deep.equal({
        text: '3 May 2020',
      })
    })
    it('returns one head row with all the cells', function() {
      expect(output.head).to.deep.equal([
        {
          text: {
            text: 'collections::labels.move_size',
            attributes: {
              width: '120',
            },
          },
        },
        {
          text: {
            text: 'collections::labels.requested',
            attributes: {
              width: '160',
            },
          },
        },
        {
          text: {
            text: 'collections::labels.move_from',
          },
        },
        {
          text: {
            text: 'collections::labels.move_to',
          },
        },
        {
          text: {
            text: 'date',
            attributes: {
              width: '120',
            },
          },
        },
      ])
    })
  })
})
